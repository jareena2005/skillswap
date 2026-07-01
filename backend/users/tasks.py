import logging

from celery import shared_task
from django.conf import settings
from django.core.mail import EmailMultiAlternatives, send_mail

from .models import User

logger = logging.getLogger(__name__)


@shared_task
def send_welcome_email(user_id):
    try:
        user = User.objects.get(id=user_id)
    except User.DoesNotExist:
        return None

    subject = "Welcome to SkillSwap"
    message = f"Hi {user.username}, welcome to SkillSwap!"
    try:
        send_mail(subject, message, settings.DEFAULT_FROM_EMAIL, [user.email], fail_silently=False)
    except Exception:
        logger.exception("Failed to deliver welcome email to %s", user.email)
        return None

    logger.info("Welcome email delivered to %s", user.email)
    return f"Welcome email sent to {user.email}"


@shared_task
def send_swap_request_notification(receiver_id, requester_username, skill_offered, skill_requested):
    try:
        receiver = User.objects.get(id=receiver_id)
    except User.DoesNotExist:
        logger.warning("Swap request notification skipped because receiver %s does not exist", receiver_id)
        return None

    receiver_name = receiver.first_name or receiver.username
    requester_name = requester_username or "A user"

    subject = "New Skill Swap Request"
    text_content = (
        f"Hi {receiver_name},\n\n"
        f"{requester_name} has requested a skill swap with you.\n"
        f"Skill Offered: {skill_offered}\n"
        f"Skill Wanted: {skill_requested}\n\n"
        "Please log in to SkillSwap to review the request."
    )
    html_content = f"""
    <html>
      <body style="font-family: Arial, sans-serif; color: #333333; line-height: 1.5;">
        <div style="max-width: 600px; margin: 0 auto; padding: 24px; border: 1px solid #e5e7eb; border-radius: 8px;">
          <h2 style="margin: 0 0 12px; color: #2563eb;">New Skill Swap Request</h2>
          <p style="margin: 0 0 12px;">Hi {receiver_name},</p>
          <p style="margin: 0 0 12px;">{requester_name} has requested a skill swap with you.</p>
          <ul style="margin: 0 0 12px 20px; padding: 0;">
            <li><strong>Skill Offered:</strong> {skill_offered}</li>
            <li><strong>Skill Wanted:</strong> {skill_requested}</li>
          </ul>
          <p style="margin: 0;">Please log in to SkillSwap to review the request.</p>
        </div>
      </body>
    </html>
    """

    try:
        email = EmailMultiAlternatives(
            subject,
            text_content,
            settings.DEFAULT_FROM_EMAIL,
            [receiver.email],
        )
        email.attach_alternative(html_content, "text/html")
        email.send()
    except Exception:
        logger.exception("Failed to deliver swap request notification to %s", receiver.email)
        return None

    logger.info("Swap request notification delivered to %s", receiver.email)
    return f"Swap request notification sent to {receiver.email}"


@shared_task
def send_password_reset_email(user_id, reset_link):
    try:
        user = User.objects.get(id=user_id)
    except User.DoesNotExist:
        return None

    subject = "Password Reset Request"
    message = f"Hi {user.username}, use this link to reset your password: {reset_link}"
    try:
        send_mail(subject, message, settings.DEFAULT_FROM_EMAIL, [user.email], fail_silently=False)
    except Exception:
        logger.exception("Failed to deliver password reset email to %s", user.email)
        return None

    logger.info("Password reset email delivered to %s", user.email)
    return f"Password reset email sent to {user.email}"


@shared_task
def send_skill_match_notification(user_id, skill_name):
    try:
        user = User.objects.get(id=user_id)
    except User.DoesNotExist:
        return None

    subject = "New Skill Match Found"
    message = f"Hi {user.username}, a new skill match for {skill_name} was found."
    try:
        send_mail(subject, message, settings.DEFAULT_FROM_EMAIL, [user.email], fail_silently=False)
    except Exception:
        logger.exception("Failed to deliver skill match email to %s", user.email)
        return None

    logger.info("Skill match email delivered to %s", user.email)
    return f"Skill match notification sent to {user.email}"
