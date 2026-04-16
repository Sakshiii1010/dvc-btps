from flask import Flask
from flask_cors import CORS
from flask_jwt_extended import JWTManager
from pymongo import MongoClient
from dotenv import load_dotenv
import os

load_dotenv()

app = Flask(__name__)

# ── CORS: allow localhost:3000 (React dev) with all methods & headers ─────────
CORS(
    app,
    origins=["http://localhost:3000", "https://dvc-btps-frontend.onrender.com"],
    supports_credentials=True,
    allow_headers=["Content-Type", "Authorization"],
    methods=["GET", "POST", "PUT", "DELETE", "OPTIONS"],
)

# ✅ ADD THIS BELOW CORS
@app.after_request
def after_request(response):
    response.headers.add("Access-Control-Allow-Origin", "*")
    response.headers.add("Access-Control-Allow-Headers", "Content-Type,Authorization")
    response.headers.add("Access-Control-Allow-Methods", "GET,POST,PUT,DELETE,OPTIONS")
    return response

# ── JWT ───────────────────────────────────────────────────────────────────────
app.config["JWT_SECRET_KEY"]          = os.getenv("JWT_SECRET_KEY", "dvc-btps-super-secret-key-2024")
app.config["JWT_ACCESS_TOKEN_EXPIRES"] = False

# Increase max upload size to 10 MB (for base64 images stored in JSON)
app.config["MAX_CONTENT_LENGTH"] = 10 * 1024 * 1024

jwt = JWTManager(app)

# ── MongoDB ───────────────────────────────────────────────────────────────────
MONGO_URI = os.getenv("MONGO_URI", "mongodb://localhost:27017/dvc_btps")
client    = MongoClient(MONGO_URI)
db        = client.dvc_btps
app.db    = db

# ── Blueprints ────────────────────────────────────────────────────────────────
from routes.auth        import auth_bp
from routes.employee    import employee_bp
from routes.application import application_bp
from routes.admin       import admin_bp
from routes.quarters    import quarters_bp

app.register_blueprint(auth_bp,         url_prefix="/api/auth")
app.register_blueprint(employee_bp,     url_prefix="/api/employee")
app.register_blueprint(application_bp,  url_prefix="/api/application")
app.register_blueprint(admin_bp,        url_prefix="/api/admin")
app.register_blueprint(quarters_bp,     url_prefix="/api/quarters")

@app.route("/seed-admin")
def seed_admin():
    from pymongo import MongoClient
    import bcrypt
    import os

    client = MongoClient(os.getenv("MONGO_URI"))
    db = client["dvc_btps"]

    users = db["users"]

    # Check if admin already exists
    if users.find_one({"username": "admin"}):
        return "Admin already exists!"

    hashed_pw = bcrypt.hashpw("Admin@1234".encode("utf-8"), bcrypt.gensalt())

    users.insert_one({
        "username": "admin",
        "password": hashed_pw,
        "role": "admin"
    })

    return "Admin created successfully!"

@app.route("/api/health")
def health():
    return {"status": "DVC BTPS Server Running", "version": "1.0.0"}

if __name__ == "__main__":
    app.run(host="0.0.0.0", port=int(os.environ.get("PORT", 5000)))
