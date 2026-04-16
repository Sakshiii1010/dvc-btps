from flask import Blueprint, request, jsonify, current_app
from flask_jwt_extended import jwt_required, get_jwt_identity

employee_bp = Blueprint("employee", __name__)

@employee_bp.route("/profile", methods=["GET"])
@jwt_required()
def get_profile():
    db = current_app.db
    identity = get_jwt_identity()
    user = db.users.find_one({"employee_id": identity}, {"password": 0, "_id": 0})
    if not user:
        return jsonify({"error": "Not found"}), 404
    return jsonify(user), 200

@employee_bp.route("/profile", methods=["PUT"])
@jwt_required()
def update_profile():
    db = current_app.db
    identity = get_jwt_identity()
    data = request.get_json()
    allowed = ["mobile", "marital_status", "current_station_joining"]
    update_data = {k: v for k, v in data.items() if k in allowed}
    db.users.update_one({"employee_id": identity}, {"$set": update_data})
    return jsonify({"message": "Profile updated"}), 200
