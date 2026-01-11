from fastapi_mail import FastMail, MessageSchema, ConnectionConfig, MessageType
from pydantic import EmailStr, BaseModel
from typing import List
import os
from dotenv import load_dotenv

load_dotenv()

class EmailSchema(BaseModel):
    email: List[EmailStr]

conf = ConnectionConfig(
    MAIL_USERNAME=os.getenv("MAIL_USERNAME", ""),
    MAIL_PASSWORD=os.getenv("MAIL_PASSWORD", ""),
    MAIL_FROM=os.getenv("MAIL_FROM", "noreply@topoforge.com"),
    MAIL_PORT=int(os.getenv("MAIL_PORT", 587)),
    MAIL_SERVER=os.getenv("MAIL_SERVER", "smtp.gmail.com"),
    MAIL_STARTTLS=True,
    MAIL_SSL_TLS=False,
    USE_CREDENTIALS=True,
    VALIDATE_CERTS=True
)

async def send_verification_email(email: EmailStr, token: str):
    """
    Send verification email to user
    """
    # In a real app, this URL would point to the frontend verify page
    verify_url = f"http://localhost:8080/verify-email?token={token}"
    
    html = f"""
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2 style="color: #0ea5e9;">Welcome to TopoForge!</h2>
        <p>Please verify your email address by clicking the button below:</p>
        <a href="{verify_url}" style="background-color: #0ea5e9; color: white; padding: 10px 20px; text-decoration: none; border-radius: 5px; display: inline-block; margin: 20px 0;">Verify Email</a>
        <p>Or copy this link: {verify_url}</p>
        <p>If you didn't register for TopoForge, please ignore this email.</p>
    </div>
    """

    message = MessageSchema(
        subject="Verify your TopoForge Account",
        recipients=[email],
        body=html,
        subtype=MessageType.html
    )

    fm = FastMail(conf)
    try:
        # Check if SMTP credentials are set, otherwise log to console (Dev Mode)
        if not conf.USERNAME or not conf.PASSWORD:
            print(f"\n[DEV MODE] Email Verification Skipped (No Credentials)")
            print(f"To: {email}")
            print(f"Link: {verify_url}\n")
            return True

        await fm.send_message(message)
        return True
    except Exception as e:
        print(f"Error sending email: {e}")
        # Return True in dev to allow registration to proceed even if email fails
        return True
