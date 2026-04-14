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



# class Produit(models.Model):

#     nom = models.CharField(max_length=100)
#     description = models.TextField(blank=True, null=True)
#     prix = models.DecimalField(max_digits=10, decimal_places=2)
#     categorie = models.ForeignKey(
#         Categorie,
#         on_delete=models.SET_NULL,
#         null=True,
#         related_name="produits"
#     )
#     image = CloudinaryField('Image', folder='produits', blank=True, null=True)
#     est_nouveau = models.BooleanField(default=False)
#     date_creation = models.DateTimeField(auto_now_add=True)

#     def __str__(self):
#         return self.nom
class Produit(models.Model):

    GENRE_CHOICES = [
        ("homme",  "Homme"),
        ("femme",  "Femme"),
        ("enfant", "Enfant"),
        ("mixte",  "Mixte"),  # accessoires, etc.
    ]

    nom           = models.CharField(max_length=100)
    description   = models.TextField(blank=True, null=True)
    prix          = models.DecimalField(max_digits=10, decimal_places=2)
    categorie     = models.ForeignKey(Categorie, on_delete=models.SET_NULL, null=True, related_name="produits")
    image         = CloudinaryField('Image', folder='produits', blank=True, null=True)
    est_nouveau   = models.BooleanField(default=False)
    genre         = models.CharField(max_length=10, choices=GENRE_CHOICES, default="mixte")  # ✅
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



class Vente(models.Model):

    produit = models.ForeignKey(Produit, on_delete=models.CASCADE)
    taille = models.CharField(max_length=10)
    couleur = models.CharField(max_length=20)

    quantite = models.IntegerField()

    prix_total = models.DecimalField(max_digits=10, decimal_places=2)

    date_vente = models.DateTimeField(auto_now_add=True)

    vendeur = models.ForeignKey(User, on_delete=models.SET_NULL, null=True)




# boutique/tracking.py
from django.db import models
from django.utils import timezone

class VisiteBoutique(models.Model):
    """Track chaque visite/action sur le site public"""
    
    TYPE_CHOICES = [
        ("visite_boutique",   "Visite boutique"),
        ("visite_produit",    "Visite produit"),
        ("clic_whatsapp",     "Clic WhatsApp"),
        ("clic_commander",    "Clic Commander"),
        ("filtre_genre",      "Filtre genre"),
        ("filtre_categorie",  "Filtre catégorie"),
        ("recherche",         "Recherche"),
        ("visite_contact",    "Visite contact"),
        ("visite_equipe",     "Visite équipe"),
        ("visite_missions",   "Visite missions"),
    ]

    type_action  = models.CharField(max_length=50, choices=TYPE_CHOICES)
    produit_id   = models.IntegerField(null=True, blank=True)
    produit_nom  = models.CharField(max_length=200, blank=True)
    genre        = models.CharField(max_length=20, blank=True)
    categorie    = models.CharField(max_length=100, blank=True)
    recherche    = models.CharField(max_length=200, blank=True)
    ip           = models.GenericIPAddressField(null=True, blank=True)
    user_agent   = models.TextField(blank=True)
    created_at   = models.DateTimeField(default=timezone.now)

    class Meta:
        ordering = ["-created_at"]

    def __str__(self):
        return f"{self.type_action} — {self.created_at.strftime('%d/%m %H:%M')}"