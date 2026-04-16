"""
Run this ONCE to initialize admin and sample data in MongoDB.
Usage: python seed_db.py
"""
from pymongo import MongoClient
import bcrypt
from datetime import datetime

MONGO_URI = "mongodb://localhost:27017/dvc_btps"
client = MongoClient(MONGO_URI)
db = client.dvc_btps

# Create Admin
if not db.admins.find_one({"username": "admin"}):
    hashed = bcrypt.hashpw("Admin@1234".encode(), bcrypt.gensalt())
    db.admins.insert_one({
        "username": "admin",
        "password": hashed,
        "name": "DVC BTPS Admin",
        "role": "admin",
        "created_at": datetime.utcnow().isoformat()
    })
    print("Admin created: username=admin, password=Admin@1234")
else:
    print("Admin already exists")

# Create Sample Employee
if not db.users.find_one({"employee_id": "EMP001"}):
    hashed = bcrypt.hashpw("Employee@1234".encode(), bcrypt.gensalt())
    db.users.insert_one({
        "employee_id": "EMP001",
        "name": "Rajesh Kumar Sharma",
        "email": "rajesh.sharma@dvcbtps.in",
        "password": hashed,
        "designation": "Junior Engineer",
        "department": "Operations",
        "pay_scale": "Pay Level 7",
        "grade_pay": "4600",
        "dvc_joining_date": "2015-06-01",
        "current_station_joining": "2020-03-15",
        "marital_status": "Married",
        "mobile": "9876543210",
        "role": "employee",
        "created_at": datetime.utcnow().isoformat()
    })
    print("Sample employee created: EMP001 / Employee@1234")

# Seed Quarters
if db.quarters.count_documents({}) == 0:
    import random
    quarters = []
    types = [
        {"type": "Type-A", "category": "Family", "block": "A", "count": 20, "eligibility": "Officer"},
        {"type": "Type-B", "category": "Family", "block": "B", "count": 24, "eligibility": "Staff"},
        {"type": "Type-C", "category": "Family", "block": "C", "count": 20, "eligibility": "Staff"},
        {"type": "Type-D", "category": "Bachelor", "block": "D", "count": 16, "eligibility": "All"},
    ]
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
                "eligibility": t["eligibility"]
            })
    db.quarters.insert_many(quarters)
    print(f"Seeded {len(quarters)} quarters")

print("\n=== Seed Complete ===")
print("Admin Login → username: admin | password: Admin@1234")
print("Employee Login → employee_id: EMP001 | password: Employee@1234")
