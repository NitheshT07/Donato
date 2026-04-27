import os
from datetime import datetime

# Logistic Buffer / Security Log File
LOG_FILE = os.path.join(os.path.dirname(os.path.dirname(__file__)), "logs", "email_notifications.log")

def send_otp_email(to_email: str, otp: str, food_type: str, recipient_role: str):
    """
    Simulates sending an OTP email by logging to a file.
    In production, this would use smtplib.
    """
    log_dir = os.path.dirname(LOG_FILE)
    if not os.path.exists(log_dir):
        os.makedirs(log_dir)
        
    timestamp = datetime.utcnow().strftime("%Y-%m-%d %H:%M:%S")
    log_entry = (
        f"[{timestamp}] EMAIL TO: {to_email} ({recipient_role})\n"
        f"SUBJECT: Security Code for {food_type} Donation\n"
        f"BODY: Your 6-digit collection code is: {otp}\n"
        f"Please provide this code to the donor during physical collection for verification.\n"
        f"{'-'*50}\n"
    )
    
    with open(LOG_FILE, "a") as f:
        f.write(log_entry)
        
    print(f"Mock email logged for {to_email} with OTP {otp}")
