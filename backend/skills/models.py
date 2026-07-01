

# Create your models here.
from django.db import models
from django.conf import settings

User = settings.AUTH_USER_MODEL

class Skill(models.Model):
    name = models.CharField(max_length=100, unique=True)
    category = models.CharField(max_length=50, blank=True)

    def __str__(self):
        return self.name


class UserSkill(models.Model):
    OFFER = 'offer'
    WANT = 'want'

    TYPE_CHOICES = [
        (OFFER, 'Offer'),
        (WANT, 'Want'),
    ]

    EXPERIENCE_CHOICES = [
        ('beginner', 'Beginner'),
        ('intermediate', 'Intermediate'),
        ('expert', 'Expert'),
    ]

    AVAILABILITY_CHOICES = [
        ('weekdays', 'Weekdays'),
        ('weekends', 'Weekends'),
        ('flexible', 'Flexible'),
    ]

    user = models.ForeignKey(User, on_delete=models.CASCADE)
    skill = models.ForeignKey(Skill, on_delete=models.CASCADE)
    type = models.CharField(max_length=10, choices=TYPE_CHOICES)
    experience_level = models.CharField(max_length=20, choices=EXPERIENCE_CHOICES, default='beginner', blank=True)
    availability = models.CharField(max_length=20, choices=AVAILABILITY_CHOICES, default='flexible', blank=True)
    description = models.TextField(blank=True)

    class Meta:
        unique_together = ('user', 'skill', 'type')
