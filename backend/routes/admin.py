from flask import Blueprint, request, jsonify, current_app
from flask_jwt_extended import jwt_required, get_jwt_identity
from datetime import datetime

admin_bp = Blueprint("admin", __name__)

def require_admin():
    identity = get_jwt_identity()
    if not identity or not identity.startswith("admin:"):
        return False
    return True

@admin_bp.route("/applications", methods=["GET"])
@jwt_required()
def get_all_applications():
    if not require_admin():
        return jsonify({"error": "Unauthorized"}), 403
    db = current_app.db
    status_filter = request.args.get("status")
    query = {}
    if status_filter and status_filter != "all":
        query["status"] = status_filter
    apps = list(db.applications.find(query, {"_id": 0}).sort("submitted_at", -1))
    return jsonify(apps), 200


@admin_bp.route("/application/<employee_id>/action", methods=["POST"])
@jwt_required()
def take_action(employee_id):
    if not require_admin():
        return jsonify({"error": "Unauthorized"}), 403
    db = current_app.db
    data = request.get_json()
    action = data.get("action")  # "approved" or "rejected"
    quarter_number = data.get("quarter_number", "")
    remarks = data.get("remarks", "")

    if action not in ["approved", "rejected"]:
        return jsonify({"error": "Invalid action"}), 400

    update = {
        "status": action,
        "admin_remarks": remarks,
        "action_date": datetime.utcnow().isoformat()
    }
    if action == "approved" and quarter_number:
        update["allotted_quarter"] = quarter_number
        # Mark quarter as occupied
        db.quarters.update_one(
            {"quarter_number": quarter_number},
            {"$set": {"status": "occupied", "occupied_by": employee_id, "occupied_since": datetime.utcnow().isoformat()}}
        )

    db.applications.update_one(
        {"employee_id": employee_id, "status": "pending"},
        {"$set": update}
    )
    return jsonify({"message": f"Application {action}"}), 200


@admin_bp.route("/stats", methods=["GET"])
@jwt_required()
def get_stats():
    if not require_admin():
        return jsonify({"error": "Unauthorized"}), 403
    db = current_app.db
    total_apps = db.applications.count_documents({"status": {"$ne": "draft"}})
    pending = db.applications.count_documents({"status": "pending"})
    approved = db.applications.count_documents({"status": "approved"})
    rejected = db.applications.count_documents({"status": "rejected"})
    total_quarters = db.quarters.count_documents({})
    vacant = db.quarters.count_documents({"status": "vacant"})
    occupied = db.quarters.count_documents({"status": "occupied"})
    return jsonify({
        "applications": {"total": total_apps, "pending": pending, "approved": approved, "rejected": rejected},
        "quarters": {"total": total_quarters, "vacant": vacant, "occupied": occupied}
    }), 200
