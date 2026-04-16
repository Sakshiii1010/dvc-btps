from flask import Blueprint, request, jsonify, current_app
from flask_jwt_extended import jwt_required, get_jwt_identity

quarters_bp = Blueprint("quarters", __name__)

@quarters_bp.route("/", methods=["GET"])
@jwt_required()
def get_quarters():
    db = current_app.db
    quarters = list(db.quarters.find({}, {"_id": 0}))
    return jsonify(quarters), 200

@quarters_bp.route("/layout", methods=["GET"])
@jwt_required()
def get_layout():
    db = current_app.db
    quarters = list(db.quarters.find({}, {"_id": 0}))
    return jsonify(quarters), 200

@quarters_bp.route("/seed", methods=["POST"])
def seed_quarters():
    """One-time seed endpoint to populate quarters"""
    db = current_app.db
    if db.quarters.count_documents({}) > 0:
        return jsonify({"message": "Already seeded"}), 200

    quarters = []
    types = [
        {"type": "Type-A", "category": "Family", "block": "A", "count": 20},
        {"type": "Type-B", "category": "Family", "block": "B", "count": 24},
        {"type": "Type-C", "category": "Family", "block": "C", "count": 20},
        {"type": "Type-D", "category": "Bachelor", "block": "D", "count": 16},
    ]
    import random
    for t in types:
        for i in range(1, t["count"] + 1):
            qno = f"{t['block']}-{str(i).zfill(3)}"
            quarters.append({
                "quarter_number": qno,
                "type": t["type"],
                "category": t["category"],
                "block": t["block"],
                "floor": ((i - 1) // 4) + 1,
                "status": random.choice(["vacant", "vacant", "occupied"]),
                "occupied_by": None,
                "occupied_since": None,
                "eligibility": "Officer" if t["type"] in ["Type-A"] else "Staff"
            })

    db.quarters.insert_many(quarters)
    return jsonify({"message": f"Seeded {len(quarters)} quarters"}), 201
