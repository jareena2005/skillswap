from django.db import models
from django.conf import settings

User = settings.AUTH_USER_MODEL

class SwapRequest(models.Model):
    PENDING = 'pending'
    ACCEPTED = 'accepted'
    REJECTED = 'rejected'

    STATUS_CHOICES = [
        (PENDING, 'Pending'),
        (ACCEPTED, 'Accepted'),
        (REJECTED, 'Rejected'),
    ]

    requester = models.ForeignKey(
        User,
        related_name='sent_swaps',
        on_delete=models.CASCADE
    )
    receiver = models.ForeignKey(
        User,
        related_name='received_swaps',
        on_delete=models.CASCADE
    )

    # 🔥 Use Skill FK (GOOD choice 👍)
    skill_offered = models.ForeignKey(
        'skills.Skill',
        on_delete=models.CASCADE,
        related_name='offered_swaps'
    )
    skill_requested = models.ForeignKey(
        'skills.Skill',
        on_delete=models.CASCADE,
        related_name='requested_swaps'
    )

    status = models.CharField(
        max_length=10,
        choices=STATUS_CHOICES,
        default=PENDING
    )

    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        unique_together = (
            'requester',
            'receiver',
            'skill_offered',
            'skill_requested'
        )

    def __str__(self):
        return f"{self.requester} offers {self.skill_offered} for {self.skill_requested}"

class SwapSession(models.Model):
    PENDING = 'pending'
    SCHEDULED = 'scheduled'
    REJECTED = 'rejected'
    COMPLETED = 'completed'

    STATUS_CHOICES = [
        (PENDING, 'Pending'),
        (SCHEDULED, 'Scheduled'),
        (REJECTED, 'Rejected'),
        (COMPLETED, 'Completed'),
    ]

    swap_request = models.ForeignKey(
        SwapRequest,
        on_delete=models.CASCADE,
        related_name='sessions'
    )
    proposer = models.ForeignKey(
        User,
        related_name='proposed_sessions',
        on_delete=models.CASCADE
    )
    receiver = models.ForeignKey(
        User,
        related_name='received_sessions',
        on_delete=models.CASCADE
    )

    date = models.DateField()
    time = models.TimeField()
    duration = models.IntegerField(help_text="Duration in minutes")
    
    status = models.CharField(
        max_length=15,
        choices=STATUS_CHOICES,
        default=PENDING
    )
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"Session for {self.swap_request} on {self.date} at {self.time}"

class SessionRating(models.Model):
    session = models.ForeignKey(
        SwapSession,
        on_delete=models.CASCADE,
        related_name="ratings"
    )
    reviewer = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        related_name="given_ratings",
        on_delete=models.CASCADE
    )
    reviewee = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        related_name="received_ratings",
        on_delete=models.CASCADE
    )

    rating = models.IntegerField()
    review = models.TextField(blank=True)

    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        unique_together = ("session", "reviewer")

    def __str__(self):
        return f"{self.reviewer} rated {self.reviewee} ({self.rating})"