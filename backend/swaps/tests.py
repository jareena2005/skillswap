from unittest.mock import patch

from django.core import mail
from django.test import TestCase, override_settings
from django.contrib.auth import get_user_model
from rest_framework.test import APIRequestFactory, force_authenticate

from skills.models import Skill, UserSkill
from swaps.models import SwapRequest
from swaps.views import CreateSwapRequestView

User = get_user_model()


class CreateSwapRequestEmailTests(TestCase):
    @override_settings(
        EMAIL_BACKEND="django.core.mail.backends.locmem.EmailBackend",
        CELERY_TASK_ALWAYS_EAGER=True,
    )
    def test_swap_request_sends_email_to_matched_user(self):
        requester = User.objects.create_user(username="john", first_name="John", email="requester@example.com", password="testpass123")
        receiver = User.objects.create_user(username="alex", first_name="Alex", email="receiver@example.com", password="testpass123")

        skill_offered = Skill.objects.create(name="Python")
        skill_requested = Skill.objects.create(name="React")

        UserSkill.objects.create(user=receiver, skill=skill_requested, type="offer")
        UserSkill.objects.create(user=receiver, skill=skill_offered, type="want")

        factory = APIRequestFactory()
        request = factory.post(
            "/swaps/create/",
            {
                "receiver": receiver.id,
                "skill_requested": skill_requested.name,
                "skill_offered": skill_offered.name,
            },
            format="json",
        )
        force_authenticate(request, user=requester)

        response = CreateSwapRequestView.as_view()(request)

        self.assertEqual(response.status_code, 200)
        self.assertEqual(len(mail.outbox), 1)
        self.assertIn(receiver.email, mail.outbox[0].to)
        self.assertEqual(mail.outbox[0].subject, "New Skill Swap Request")

        body = mail.outbox[0].body
        self.assertIn("Hi Alex,", body)
        self.assertIn("John has requested a skill swap with you.", body)
        self.assertIn("Skill Offered: Python", body)
        self.assertIn("Skill Wanted: React", body)
        self.assertIn("Please log in to SkillSwap to review the request.", body)
        self.assertNotRegex(body, r"https?://")
        self.assertTrue(mail.outbox[0].alternatives)
        self.assertTrue(any("text/html" in alt[1] for alt in mail.outbox[0].alternatives))

    @override_settings(
        EMAIL_BACKEND="django.core.mail.backends.locmem.EmailBackend",
        CELERY_TASK_ALWAYS_EAGER=True,
    )
    def test_swap_request_is_created_when_email_delivery_fails(self):
        requester = User.objects.create_user(username="jane", first_name="Jane", email="requester2@example.com", password="testpass123")
        receiver = User.objects.create_user(username="mike", first_name="Mike", email="receiver2@example.com", password="testpass123")

        skill_offered = Skill.objects.create(name="Java")
        skill_requested = Skill.objects.create(name="Node")

        UserSkill.objects.create(user=receiver, skill=skill_requested, type="offer")
        UserSkill.objects.create(user=receiver, skill=skill_offered, type="want")

        factory = APIRequestFactory()
        request = factory.post(
            "/swaps/create/",
            {
                "receiver": receiver.id,
                "skill_requested": skill_requested.name,
                "skill_offered": skill_offered.name,
            },
            format="json",
        )
        force_authenticate(request, user=requester)

        with patch("users.tasks.EmailMultiAlternatives.send", side_effect=Exception("mail failed")):
            response = CreateSwapRequestView.as_view()(request)

        self.assertEqual(response.status_code, 200)
        self.assertTrue(
            SwapRequest.objects.filter(
                requester=requester,
                receiver=receiver,
                status="pending",
            ).exists()
        )
        self.assertEqual(len(mail.outbox), 0)
