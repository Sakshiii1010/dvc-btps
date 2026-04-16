from flask import Blueprint, request, jsonify, current_app
from flask_jwt_extended import jwt_required, get_jwt_identity
from datetime import datetime
import base64

application_bp = Blueprint("application", __name__)


# ── helpers ───────────────────────────────────────────────────────────────────

def _send_submit_sms(db, employee_id: str):
    """Fire-and-forget SMS to employee after successful form submission."""
    try:
        user   = db.users.find_one({"employee_id": employee_id})
        mobile = (user or {}).get("mobile", "")
        if mobile:
            from utils.sms import sms_form_submitted
            sms_form_submitted(mobile, (user or {}).get("name", "Employee"))
    except Exception as e:
        print(f"[SMS] Submit SMS error (non-fatal): {e}")


# ── routes ────────────────────────────────────────────────────────────────────

@application_bp.route("/save", methods=["POST"])
@jwt_required()
def save_draft():
    db       = current_app.db
    identity = get_jwt_identity()
    data     = request.get_json()
    data["employee_id"] = identity
    data["status"]      = "draft"
    data["updated_at"]  = datetime.utcnow().isoformat()

    existing = db.applications.find_one({"employee_id": identity, "status": "draft"})
    if existing:
        db.applications.update_one(
            {"employee_id": identity, "status": "draft"},
            {"$set": data}
        )
    else:
        data["created_at"] = datetime.utcnow().isoformat()
        db.applications.insert_one(data)
    return jsonify({"message": "Draft saved"}), 200


@application_bp.route("/submit", methods=["POST"])
@jwt_required()
def submit():
    db       = current_app.db
    identity = get_jwt_identity()
    data     = request.get_json()

    required = [
        "name", "designation", "department", "pay_scale", "grade_pay",
        "basic_pay", "dvc_joining_date", "current_station_joining",
        "entry_to_slab_date", "service_continuous", "marital_status"
    ]
    for field in required:
        if not data.get(field):
            return jsonify({"error": f"Field '{field}' is required"}), 400

    # Prevent duplicate active applications
    existing_active = db.applications.find_one({
        "employee_id": identity,
        "status": {"$in": ["pending", "approved"]}
    })
    if existing_active:
        return jsonify({"error": "You already have an active application"}), 409

    data["employee_id"] = identity
    data["status"]       = "pending"
    data["submitted_at"] = datetime.utcnow().isoformat()
    data["updated_at"]   = datetime.utcnow().isoformat()

    # Remove old draft
    db.applications.delete_many({"employee_id": identity, "status": "draft"})
    result = db.applications.insert_one(data)

    # ── Send SMS on successful submission ──
    _send_submit_sms(db, identity)

    return jsonify({"message": "Application submitted successfully", "id": str(result.inserted_id)}), 201


@application_bp.route("/my", methods=["GET"])
@jwt_required()
def my_applications():
    db       = current_app.db
    identity = get_jwt_identity()
    apps     = list(
        db.applications.find({"employee_id": identity}, {"_id": 0})
        .sort("submitted_at", -1)
    )
    return jsonify(apps), 200


@application_bp.route("/draft", methods=["GET"])
@jwt_required()
def get_draft():
    db       = current_app.db
    identity = get_jwt_identity()
    draft    = db.applications.find_one(
        {"employee_id": identity, "status": "draft"}, {"_id": 0}
    )
    return jsonify(draft or {}), 200


# ── File upload endpoint ──────────────────────────────────────────────────────
# Accepts multipart/form-data.
# Frontend must NOT manually set Content-Type — let the browser set it with boundary.
# field_name: 'sc_st_certificate' | 'signature'
# Returns { field_name, data_uri, filename, mime }

ALLOWED_EXTENSIONS = {"png", "jpg", "jpeg", "gif", "pdf"}
MAX_FILE_BYTES      = 5 * 1024 * 1024   # 5 MB


def _allowed(filename: str) -> bool:
    return "." in filename and filename.rsplit(".", 1)[1].lower() in ALLOWED_EXTENSIONS


@application_bp.route("/upload", methods=["POST", "OPTIONS"])
@jwt_required()
def upload_file():
    """
    POST /api/application/upload
    Multipart form data — do NOT set Content-Type manually on the client.
      field_name : 'sc_st_certificate' or 'signature'
      file       : the actual binary file
    """
    # Handle preflight
    if request.method == "OPTIONS":
        return jsonify({}), 200

    if "file" not in request.files:
        return jsonify({"error": "No file field in request. Make sure the field name is 'file'."}), 400

    field_name = request.form.get("field_name", "file")
    f          = request.files["file"]

    if not f or f.filename == "":
        return jsonify({"error": "Empty filename — no file was selected."}), 400

    if not _allowed(f.filename):
        return jsonify({"error": "File type not allowed. Use PNG, JPG, or PDF."}), 400

    raw = f.read()
    if len(raw) > MAX_FILE_BYTES:
        return jsonify({"error": "File too large. Maximum size is 5 MB."}), 400

    if len(raw) == 0:
        return jsonify({"error": "Uploaded file is empty."}), 400

    ext      = f.filename.rsplit(".", 1)[1].lower()
    mime_map = {
        "jpg": "image/jpeg", "jpeg": "image/jpeg",
        "png": "image/png",  "gif": "image/gif",
        "pdf": "application/pdf"
    }
    mime     = mime_map.get(ext, "application/octet-stream")
    b64      = base64.b64encode(raw).decode("utf-8")
    data_uri = f"data:{mime};base64,{b64}"

    return jsonify({
        "field_name": field_name,
        "data_uri":   data_uri,
        "filename":   f.filename,
        "mime":       mime
    }), 200
