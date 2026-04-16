from rest_framework import serializers
from .models import User, Categorie

class UserSerializer(serializers.ModelSerializer):

    class Meta:
        model = User
        fields = "__all__"
        extra_kwargs = {
            "password": {"write_only": True}
        }

    def create (self, validated_data):
        user = User.objects.create_user(**validated_data)
        return user


from django.contrib.auth import authenticate
from rest_framework_simplejwt.views import TokenObtainPairView
from rest_framework_simplejwt.serializers import TokenObtainPairSerializer


# class LoginSerializer(TokenObtainPairSerializer):

#     @classmethod
#     def get_token(cls, user):
#         token = super().get_token(user)

#         token["username"] = user.username
#         token["role"] = user.role

#         return token

# serializers.py — remplacer uniquement LoginSerializer

from rest_framework_simplejwt.serializers import TokenObtainPairSerializer


class LoginSerializer(TokenObtainPairSerializer):
    """
    Surcharge du serializer JWT pour inclure les infos utilisateur
    dans la réponse : id, username, role, first_name, last_name.
    """

    def validate(self, attrs):
        data = super().validate(attrs)

        # ✅ Champs ajoutés à la réponse du login
        data["id"]         = self.user.id
        data["username"]   = self.user.username
        data["role"]       = getattr(self.user, "role", "vendeur")
        data["first_name"] = self.user.first_name or ""
        data["last_name"]  = self.user.last_name  or ""

        return data





class CategorieSerializers(serializers.ModelSerializer):

    class Meta:
        model = Categorie
        fields = ['id', 'nom']




from rest_framework import serializers
from .models import Produit

from cloudinary.utils import cloudinary_url

class ProduitSerializer(serializers.ModelSerializer):
    image_url = serializers.SerializerMethodField()

    class Meta:
        model = Produit
        fields = '__all__'

    def get_image_url(self, obj):
        if obj.image:
            url, _ = cloudinary_url(str(obj.image))
            return url
        return None


from .models import Stock

class StockSerializer(serializers.ModelSerializer):

    produit_nom=serializers.CharField(source="produit.nom", read_only=True)
    class Meta:
        model = Stock
        fields = ["id", "produit","produit_nom", "taille", "couleur", "quantite"]


from rest_framework import serializers
from .models import Vente

from .models import Vente, Stock

class VenteSerializer(serializers.ModelSerializer):
    produit_nom = serializers.CharField(source="produit.nom", read_only=True)
    vendeur_nom = serializers.SerializerMethodField()

    class Meta:
        model = Vente
        fields = "__all__"
        extra_kwargs = {
            "prix_total": {"read_only": True},
            "date_vente": {"read_only": True},
        }

    def get_vendeur_nom(self, obj):
        if obj.vendeur:
            return f"{obj.vendeur.first_name} {obj.vendeur.last_name}".strip() or obj.vendeur.username
        return "—"

    def create(self, validated_data):
        produit = validated_data["produit"]
        quantite = validated_data["quantite"]
        taille = validated_data["taille"]
        couleur = validated_data["couleur"]

        # Décrémente le stock
        try:
            stock = Stock.objects.get(
                produit=produit,
                taille=taille,
                couleur=couleur
            )
            if stock.quantite < quantite:
                raise serializers.ValidationError("Stock insuffisant")
            stock.quantite -= quantite
            stock.save()
        except Stock.DoesNotExist:
            raise serializers.ValidationError("Stock introuvable pour ce produit/taille/couleur")

        validated_data["prix_total"] = produit.prix * quantite
        return super().create(validated_data)


from rest_framework import serializers
from .models import ActivityLog

class ActivityLogSerializer(serializers.ModelSerializer):
    user_username = serializers.SerializerMethodField()
    user_role     = serializers.SerializerMethodField()
 
    class Meta:
        model  = ActivityLog
        fields = [
            "id", "user", "user_username", "user_role",
            "action", "model_name", "object_id",
            "description", "created_at",
        ]
 
    def get_user_username(self, obj):
        return obj.user.username if obj.user else "Inconnu"
 
    def get_user_role(self, obj):
        return getattr(obj.user, "role", "—") if obj.user else "—"
 