from flask import Blueprint, request, jsonify, current_app
from flask_jwt_extended import create_access_token, jwt_required, get_jwt_identity
import bcrypt
from datetime import datetime
import os

auth_bp = Blueprint("auth", __name__)


# ── helpers ──────────────────────────────────────────────────────────────────

def _send_login_sms(user: dict):
    """Fire-and-forget SMS on employee login. Never crashes the login flow."""
    try:
        mobile = user.get("mobile", "")
        if mobile:
            from utils.sms import sms_login_initiated
            sms_login_initiated(mobile, user.get("name", "Employee"))
    except Exception as e:
        print(f"[SMS] Login SMS error (non-fatal): {e}")


# ── routes ───────────────────────────────────────────────────────────────────

@auth_bp.route("/register", methods=["POST"])
def register():
    db = current_app.db
    data = request.get_json()
    required = [
        "employee_id", "name", "email", "password",
        "designation", "department", "pay_scale", "grade_pay", "dvc_joining_date"
    ]
    for field in required:
        if not data.get(field):
            return jsonify({"error": f"{field} is required"}), 400

    if db.users.find_one({"employee_id": data["employee_id"]}):
        return jsonify({"error": "Employee ID already registered"}), 409
    if db.users.find_one({"email": data["email"]}):
        return jsonify({"error": "Email already registered"}), 409

    hashed = bcrypt.hashpw(data["password"].encode(), bcrypt.gensalt())
    user = {
        "employee_id": data["employee_id"],
        "name": data["name"],
        "email": data["email"],
        "password": hashed,
        "designation": data["designation"],
        "department": data["department"],
        "pay_scale": data["pay_scale"],
        "grade_pay": data["grade_pay"],
        "dvc_joining_date": data["dvc_joining_date"],
        "current_station_joining": data.get("current_station_joining", ""),
        "marital_status": data.get("marital_status", "Unmarried"),
        "mobile": data.get("mobile", ""),
        "role": "employee",
        "created_at": datetime.utcnow().isoformat()
    }
    db.users.insert_one(user)
    return jsonify({"message": "Registration successful"}), 201


@auth_bp.route("/login", methods=["POST"])
def login():
    db = current_app.db
    data = request.get_json()
    employee_id = data.get("employee_id")
    password    = data.get("password")

    user = db.users.find_one({"employee_id": employee_id})
    if not user or not bcrypt.checkpw(password.encode(), user["password"]):
        return jsonify({"error": "Invalid credentials"}), 401

    # ── Send SMS notification on login ──
    _send_login_sms(user)

    token = create_access_token(identity=str(user["employee_id"]))
    return jsonify({
        "token": token,
        "role": user["role"],
        "name": user["name"],
        "employee_id": user["employee_id"]
    }), 200


@auth_bp.route("/admin/login", methods=["POST"])
def admin_login():
    db = current_app.db
    data = request.get_json()
    username = data.get("username")
    password = data.get("password")

    admin = db.admins.find_one({"username": username})
    if not admin or not bcrypt.checkpw(password.encode(), admin["password"]):
        return jsonify({"error": "Invalid admin credentials"}), 401

    token = create_access_token(identity=f"admin:{admin['username']}")
    return jsonify({
        "token": token,
        "role": "admin",
        "name": admin["username"]
    }), 200


@auth_bp.route("/me", methods=["GET"])
@jwt_required()
def me():
    db = current_app.db
    identity = get_jwt_identity()
    if identity.startswith("admin:"):
        uname = identity.split("admin:")[1]
        admin = db.admins.find_one({"username": uname}, {"password": 0, "_id": 0})
        return jsonify({"role": "admin", **admin}), 200
    user = db.users.find_one({"employee_id": identity}, {"password": 0, "_id": 0})
    if not user:
        return jsonify({"error": "User not found"}), 404
    return jsonify(user), 200
