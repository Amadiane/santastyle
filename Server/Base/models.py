from django.contrib.auth.models import AbstractUser
from django.db import models
from cloudinary.models import CloudinaryField

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



class Produit(models.Model):

    nom = models.CharField(max_length=100)
    description = models.TextField(blank=True, null=True)
    prix = models.DecimalField(max_digits=10, decimal_places=2)
    categorie = models.ForeignKey(
        Categorie,
        on_delete=models.SET_NULL,
        null=True,
        related_name="produits"
    )
    image = CloudinaryField('Image', folder='produits', blank=True, null=True)
    date_creation = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return self.nom



class Stock (models.Model):
    produit = models.ForeignKey(
        Produit,
        on_delete=models.CASCADE,
        related_name="stocks"
    )
    taille = models.CharField(max_length=10)
    couleur = models.CharField(max_length=30)
    quantite = models.IntegerField(default=0)

    class Meta:
        unique_together = ('produit', 'taille', 'couleur')

    def __str__(self):
        return f"{self.produit.nom} - {self.taille}"
