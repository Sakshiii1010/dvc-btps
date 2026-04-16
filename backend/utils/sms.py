"""
SMS Utility — DVC BTPS Quarter Allotment System
Uses Twilio to send SMS notifications.

Setup:
1. Create free account at https://www.twilio.com/try-twilio
2. Get your Account SID, Auth Token, and a Twilio phone number
3. Add these to backend/.env file
"""

import os
from dotenv import load_dotenv

load_dotenv()

TWILIO_ACCOUNT_SID = os.getenv("TWILIO_ACCOUNT_SID", "")
TWILIO_AUTH_TOKEN  = os.getenv("TWILIO_AUTH_TOKEN", "")
TWILIO_FROM_NUMBER = os.getenv("TWILIO_FROM_NUMBER", "")   # e.g. +1XXXXXXXXXX


def send_sms(to_number: str, message: str) -> dict:
    """
    Send an SMS via Twilio.

    Args:
        to_number: Recipient's mobile number.
                   If it's a 10-digit Indian number, we prefix +91.
                   If it already starts with +, we use it as-is.
        message:   The SMS text to send.

    Returns:
        {"success": True, "sid": "..."} on success
        {"success": False, "error": "..."} on failure
    """

    # --- Validate config ---
    if not all([TWILIO_ACCOUNT_SID, TWILIO_AUTH_TOKEN, TWILIO_FROM_NUMBER]):
        print("[SMS] ⚠ Twilio credentials not configured in .env — SMS skipped.")
        print(f"[SMS] Would have sent to {to_number}: {message}")
        return {"success": False, "error": "Twilio not configured"}

    # --- Normalise phone number ---
    number = str(to_number).strip().replace(" ", "").replace("-", "")
    if not number.startswith("+"):
        # Assume Indian number
        number = "+91" + number.lstrip("0")

    # --- Send via Twilio REST API ---
    try:
        from twilio.rest import Client
        client = Client(TWILIO_ACCOUNT_SID, TWILIO_AUTH_TOKEN)
        msg = client.messages.create(
            body=message,
            from_=TWILIO_FROM_NUMBER,
            to=number
        )
        print(f"[SMS] ✅ Sent to {number} | SID: {msg.sid}")
        return {"success": True, "sid": msg.sid}

    except ImportError:
        print("[SMS] ⚠ twilio package not installed. Run: pip install twilio")
        return {"success": False, "error": "twilio package not installed"}

    except Exception as e:
        print(f"[SMS] ❌ Failed to send SMS to {number}: {e}")
        return {"success": False, "error": str(e)}


# ── Predefined messages ──────────────────────────────────────────────────────

def sms_login_initiated(to_number: str, employee_name: str) -> dict:
    """Sent when a new employee logs in for the first time (or every login)."""
    msg = (
        f"Dear {employee_name}, Quarter Allotment Procedure for DVC-BTPS is initiated. "
        f"Login to the portal to apply for accommodation. - DVC BTPS Housing Committee"
    )
    return send_sms(to_number, msg)


def sms_form_submitted(to_number: str, employee_name: str) -> dict:
    """Sent when employee successfully submits the allotment application form."""
    msg = (
        f"Dear {employee_name}, your Quarter Allotment application for DVC-BTPS has been "
        f"successfully submitted. Your application is now under review. "
        f"Track status at the portal. - DVC BTPS Housing Committee"
    )
    return send_sms(to_number, msg)
