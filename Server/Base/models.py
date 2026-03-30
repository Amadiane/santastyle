from django.db import models
from django.contrib.auth.models import AbstractUser

class User(AbstractUser):
    
    ROLE_CHOICES = (
        ("admin", "Admin"),
        ("vendeur", "Vendeur"),
        ("manager", "Manager"),
    )

    role = models.CharField(max_length=20, choices=ROLE_CHOICES)