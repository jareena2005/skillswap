from django.db import models
from django.contrib.auth.models import AbstractUser

class User(AbstractUser):
    bio = models.TextField(blank=True)
    profile_photo = models.FileField(upload_to='profile_photos/', blank=True, null=True)
    location = models.CharField(max_length=100, blank=True)
    availability = models.CharField(
        max_length=20,
        choices=[
            ('weekdays', 'Weekdays'),
            ('weekends', 'Weekends'),
            ('flexible', 'Flexible')
        ],
        default='flexible',
        blank=True
    )


# Create your models here.
