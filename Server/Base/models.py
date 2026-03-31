from django.contrib.auth.models import AbstractUser
from django.db import models

class User(AbstractUser):

    ROLE_CHOICES = (
        ("admin", "Admin"),
        ("vendeur", "Vendeur"),
    )
   
    

    role = models.CharField(max_length=20, choices=ROLE_CHOICES)

class Categorie(models.Model):
    nom = models.CharField(max_length=100)

    def __str__(self):
        return self.nom