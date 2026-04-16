# from rest_framework import viewsets, status
# from rest_framework.permissions import AllowAny, IsAuthenticated
# from .permissions import IsVendeur, IsAdmin, IsAdminOrReadOnly
# from .models import User
# from .serializers import UserSerializer, LoginSerializer
# from rest_framework_simplejwt.views import TokenObtainPairView
# from rest_framework.response import Response


# class UserViewSet(viewsets.ModelViewSet):

#     queryset = User.objects.all()
#     serializer_class = UserSerializer
#     permission_classes = [IsAuthenticated]

#     def create(self, request, *args, **kwargs):
#         serializer = self.get_serializer(data=request.data)

#         if not serializer.is_valid():
#             print(serializer.errors)  # 👈 IMPORTANT
#             return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

#         self.perform_create(serializer)
#         return Response(serializer.data)

# # LOGIN JWT
# class LoginView(TokenObtainPairView):
#     serializer_class = LoginSerializer
#     permission_classes = [AllowAny]  


# # Categorie View
# from rest_framework import generics, permissions
# from .models import Categorie
# from .serializers import CategorieSerializers

# # class CategorieListCreateView(generics.ListCreateAPIView):
# #     queryset = Categorie.objects.all()
# #     serializer_class = CategorieSerializers
# #     permission_classes = [permissions.IsAuthenticated]

# # class CategorieRetrieveUpdateDestroyView(generics.RetrieveUpdateDestroyAPIView):
# #     queryset = Categorie.objects.all()
# #     serializer_class = CategorieSerializers
# #     permission_classes = [permissions.IsAuthenticated]




# from .models import Produit
# from .serializers import ProduitSerializer

# # class ProduitListCreateView(generics.ListCreateAPIView):
# #     queryset = Produit.objects.all()
# #     serializer_class = ProduitSerializer
# #     permission_class = [permissions.IsAuthenticated]


# # class ProduitRetrieveUpdateDestroyView(generics.RetrieveUpdateDestroyAPIView):
# #     queryset =  Produit.objects.all()
# #     serializer_class = ProduitSerializer
# #     permission_class = [permissions.IsAuthenticated]


# # Catégories — lecture publique
# class CategorieListCreateView(generics.ListCreateAPIView):
#     queryset = Categorie.objects.all()
#     serializer_class = CategorieSerializers

#     def get_permissions(self):
#         if self.request.method == "GET":
#             return [permissions.AllowAny()]  # ✅ lecture publique
#         return [permissions.IsAuthenticated()]  # écriture protégée

# class CategorieRetrieveUpdateDestroyView(generics.RetrieveUpdateDestroyAPIView):
#     queryset = Categorie.objects.all()
#     serializer_class = CategorieSerializers

#     def get_permissions(self):
#         if self.request.method == "GET":
#             return [permissions.AllowAny()]
#         return [permissions.IsAuthenticated()]


# from rest_framework import viewsets, permissions
# from .models import Produit
# from .serializers import ProduitSerializer
# from .mixins import ActivityLogMixin
# from .permissions import IsAdminOrReadOnly
 
 
# class ProduitViewSet(ActivityLogMixin, viewsets.ModelViewSet):
#     """
#     GET    /api/produits/        → public (AllowAny)
#     GET    /api/produits/{pk}/   → public (AllowAny)
#     POST   /api/produits/        → authentifié + IsAdminOrReadOnly
#     PUT    /api/produits/{pk}/   → authentifié + IsAdminOrReadOnly
#     PATCH  /api/produits/{pk}/   → authentifié + IsAdminOrReadOnly
#     DELETE /api/produits/{pk}/   → authentifié + IsAdminOrReadOnly
#     """
#     queryset         = Produit.objects.all()
#     serializer_class = ProduitSerializer
#     log_model_name   = "Produit"
 
#     def get_permissions(self):
#         # ✅ Lecture publique, écriture protégée
#         if self.request.method in permissions.SAFE_METHODS:  # GET, HEAD, OPTIONS
#             return [permissions.AllowAny()]
#         return [permissions.IsAuthenticated(), IsAdminOrReadOnly()]
 
# # # Produits — lecture publique
# # class ProduitListCreateView(generics.ListCreateAPIView):
# #     queryset = Produit.objects.all()
# #     serializer_class = ProduitSerializer

# #     def get_permissions(self):
# #         if self.request.method == "GET":
# #             return [permissions.AllowAny()]
# #         return [permissions.IsAuthenticated()]

# # class ProduitRetrieveUpdateDestroyView(generics.RetrieveUpdateDestroyAPIView):
# #     queryset = Produit.objects.all()
# #     serializer_class = ProduitSerializer

# #     def get_permissions(self):
# #         if self.request.method == "GET":
# #             return [permissions.AllowAny()]
# #         return [permissions.IsAuthenticated()]


# # from .models import Produit
# # from .serializers import ProduitSerializer
 
# # class ProduitViewSet(ActivityLogMixin, viewsets.ModelViewSet):
# #     queryset           = Produit.objects.all()
# #     serializer_class   = ProduitSerializer
# #     permission_classes = [IsAuthenticated, IsAdminOrReadOnly]
# #     log_model_name     = "Produit"


# from rest_framework import viewsets
# from .models import Stock
# from .serializers import StockSerializer


# class StockViewSet(viewsets.ModelViewSet):
#     queryset = Stock.objects.all()
#     serializer_class = StockSerializer

#     def get_permissions(self):
#         if self.request.method == "GET":
#             return [permissions.AllowAny()]  # ✅ lecture publique
#         return [permissions.IsAuthenticated()]



# from rest_framework import viewsets
# from .models import Vente
# from .serializers import VenteSerializer
# from .models import ActivityLog


# from .models import Vente
# from .serializers import VenteSerializer
 
# class VenteViewSet(ActivityLogMixin, viewsets.ModelViewSet):
#     queryset         = Vente.objects.all()
#     serializer_class = VenteSerializer
#     log_model_name   = "Vente"

#     def get_permissions(self):
#         # GET → connecté suffit (admin ou vendeur)
#         if self.request.method in permissions.SAFE_METHODS:
#             return [permissions.IsAuthenticated()]
#         # POST/DELETE → vendeur ou admin requis
#         return [permissions.IsAuthenticated(), IsVendeur()]

#     def perform_create(self, serializer):
#         vente = serializer.save(vendeur=self.request.user)
#         self._log("vente", vente,
#                   f"Vente de {vente.produit.nom} par {self.request.user.username}")





# # boutique/views_tracking.py
# from django.http import JsonResponse
# from django.views.decorators.csrf import csrf_exempt
# from django.views.decorators.http import require_http_methods
# from django.db.models import Count
# from django.db.models.functions import TruncDate
# from django.utils import timezone
# from datetime import timedelta
# import json
# from rest_framework.decorators import api_view, permission_classes
# from rest_framework.permissions import IsAuthenticated, AllowAny
# from .models import VisiteBoutique


# # ── Endpoint public — enregistrer une action ──────────────────────
# @csrf_exempt
# @api_view(["POST"])
# @permission_classes([AllowAny])
# def tracker_action(request):
#     try:
#         data = request.data
#         ip = request.META.get("HTTP_X_FORWARDED_FOR", "").split(",")[0].strip() \
#              or request.META.get("REMOTE_ADDR", "")

#         VisiteBoutique.objects.create(
#             type_action  = data.get("type_action", "visite_boutique"),
#             produit_id   = data.get("produit_id"),
#             produit_nom  = data.get("produit_nom", ""),
#             genre        = data.get("genre", ""),
#             categorie    = data.get("categorie", ""),
#             recherche    = data.get("recherche", ""),
#             ip           = ip[:45] if ip else None,
#             user_agent   = request.META.get("HTTP_USER_AGENT", "")[:500],
#         )
#         return JsonResponse({"ok": True})
#     except Exception as e:
#         return JsonResponse({"error": str(e)}, status=400)


# # ── Endpoint admin — statistiques complètes ───────────────────────
# @api_view(["GET"])
# @permission_classes([IsAuthenticated])
# def stats_boutique(request):
#     jours = int(request.GET.get("jours", 30))
#     depuis = timezone.now() - timedelta(days=jours)
#     qs = VisiteBoutique.objects.filter(created_at__gte=depuis)

#     # Totaux
#     totaux = {}
#     for t in VisiteBoutique.TYPE_CHOICES:
#         totaux[t[0]] = qs.filter(type_action=t[0]).count()

#     # Clics WhatsApp par produit
#     wa_produits = (
#         qs.filter(type_action="clic_whatsapp", produit_nom__gt="")
#         .values("produit_nom")
#         .annotate(total=Count("id"))
#         .order_by("-total")[:10]
#     )

#     # Produits les plus visités
#     top_produits = (
#         qs.filter(type_action="visite_produit")
#         .values("produit_nom", "produit_id")
#         .annotate(total=Count("id"))
#         .order_by("-total")[:10]
#     )

#     # Répartition genre
#     genres = (
#         qs.filter(type_action="filtre_genre", genre__gt="")
#         .values("genre")
#         .annotate(total=Count("id"))
#         .order_by("-total")
#     )

#     # Recherches populaires
#     recherches = (
#         qs.filter(type_action="recherche", recherche__gt="")
#         .values("recherche")
#         .annotate(total=Count("id"))
#         .order_by("-total")[:10]
#     )

#     # Activité par jour
#     activite_jour = (
#         qs.annotate(jour=TruncDate("created_at"))
#         .values("jour")
#         .annotate(total=Count("id"))
#         .order_by("jour")
#     )

#     # Heures de pointe (0-23h)
#     from django.db.models.functions import ExtractHour
#     heures = (
#         qs.annotate(heure=ExtractHour("created_at"))
#         .values("heure")
#         .annotate(total=Count("id"))
#         .order_by("heure")
#     )

#     # Visiteurs uniques (par IP)
#     uniques = qs.exclude(ip=None).values("ip").distinct().count()

#     # Actions récentes (dernières 20)
#     recentes = list(
#         qs.order_by("-created_at")[:20]
#         .values("type_action", "produit_nom", "genre", "recherche", "created_at")
#     )
#     for r in recentes:
#         r["created_at"] = r["created_at"].strftime("%d/%m %H:%M")

#     return JsonResponse({
#         "totaux":        totaux,
#         "wa_produits":   list(wa_produits),
#         "top_produits":  list(top_produits),
#         "genres":        list(genres),
#         "recherches":    list(recherches),
#         "activite_jour": [{"jour": str(a["jour"]), "total": a["total"]} for a in activite_jour],
#         "heures":        list(heures),
#         "uniques":       uniques,
#         "recentes":      recentes,
#         "periode_jours": jours,
#     })




# from rest_framework import viewsets, filters
# from rest_framework.permissions import IsAuthenticated
# from rest_framework.response import Response
# from rest_framework.decorators import action
# from .models import ActivityLog
# from .serializers import ActivityLogSerializer
# from .permissions import IsAdmin, IsVendeur
# from .mixins import ActivityLogMixin
 
 
# # ── Historique des activités ────────────────────────────────
# class ActivityLogViewSet(viewsets.ReadOnlyModelViewSet):
#     """
#     GET /api/activity/          → admin : tous les logs
#                                   vendeur : uniquement ses propres logs
#     GET /api/activity/?user=2   → admin seulement — filtrer par user
#     GET /api/activity/?action=create
#     GET /api/activity/?model=Produit
#     """
#     serializer_class   = ActivityLogSerializer
#     permission_classes = [IsAuthenticated]
#     filter_backends    = [filters.SearchFilter, filters.OrderingFilter]
#     search_fields      = ["description", "model_name", "user__username"]
#     ordering_fields    = ["created_at"]
 
#     def get_queryset(self):
#         user = self.request.user
#         qs   = ActivityLog.objects.select_related("user")
 
#         # Vendeur → uniquement ses propres actions
#         if getattr(user, "role", None) != "admin":
#             qs = qs.filter(user=user)
 
#         # Filtres URL
#         user_id = self.request.query_params.get("user")
#         if user_id and getattr(user, "role", None) == "admin":
#             qs = qs.filter(user_id=user_id)
 
#         action  = self.request.query_params.get("action")
#         if action:
#             qs = qs.filter(action=action)
 
#         model   = self.request.query_params.get("model")
#         if model:
#             qs = qs.filter(model_name__icontains=model)
 
#         return qs



# views.py

from rest_framework import viewsets, generics, permissions, filters, status
from rest_framework.permissions import AllowAny, IsAuthenticated
from rest_framework.response import Response
from rest_framework_simplejwt.views import TokenObtainPairView

from .permissions import IsVendeur, IsAdmin, IsAdminOrReadOnly
from .mixins import ActivityLogMixin
from .models import (
    User, Categorie, Produit, Stock, Vente, ActivityLog, VisiteBoutique
)
from .serializers import (
    UserSerializer, LoginSerializer,
    CategorieSerializers, ProduitSerializer,
    StockSerializer, VenteSerializer, ActivityLogSerializer,
)


# ════════════════════════════════════════════════════════════
#  USERS
# ════════════════════════════════════════════════════════════

class UserViewSet(viewsets.ModelViewSet):
    queryset           = User.objects.all()
    serializer_class   = UserSerializer
    permission_classes = [IsAuthenticated]

    def create(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        if not serializer.is_valid():
            print(serializer.errors)
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
        self.perform_create(serializer)
        return Response(serializer.data)


class LoginView(TokenObtainPairView):
    serializer_class   = LoginSerializer
    permission_classes = [AllowAny]


# ════════════════════════════════════════════════════════════
#  CATÉGORIES — ✅ mixin ajouté sur les deux views
# ════════════════════════════════════════════════════════════

class CategorieListCreateView(ActivityLogMixin, generics.ListCreateAPIView):
    queryset           = Categorie.objects.all()
    serializer_class   = CategorieSerializers
    log_model_name     = "Categorie"

    def get_permissions(self):
        if self.request.method == "GET":
            return [permissions.AllowAny()]
        return [permissions.IsAuthenticated()]

    # ✅ Branche le log via le hook générique
    def perform_create(self, serializer):
        self.perform_create_generic(serializer)


class CategorieRetrieveUpdateDestroyView(ActivityLogMixin, generics.RetrieveUpdateDestroyAPIView):
    queryset           = Categorie.objects.all()
    serializer_class   = CategorieSerializers
    log_model_name     = "Categorie"

    def get_permissions(self):
        if self.request.method == "GET":
            return [permissions.AllowAny()]
        return [permissions.IsAuthenticated()]

    def perform_update(self, serializer):
        self.perform_update_generic(serializer)

    def perform_destroy(self, instance):
        self.perform_destroy_generic(instance)


# ════════════════════════════════════════════════════════════
#  PRODUITS — ViewSet avec mixin (inchangé)
# ════════════════════════════════════════════════════════════

class ProduitViewSet(ActivityLogMixin, viewsets.ModelViewSet):
    queryset           = Produit.objects.all()
    serializer_class   = ProduitSerializer
    log_model_name     = "Produit"

    def get_permissions(self):
        if self.request.method in permissions.SAFE_METHODS:
            return [permissions.AllowAny()]
        return [permissions.IsAuthenticated(), IsAdminOrReadOnly()]


# ════════════════════════════════════════════════════════════
#  STOCKS — ✅ mixin ajouté
# ════════════════════════════════════════════════════════════

class StockViewSet(ActivityLogMixin, viewsets.ModelViewSet):
    queryset           = Stock.objects.all()
    serializer_class   = StockSerializer
    log_model_name     = "Stock"

    def get_permissions(self):
        if self.request.method in permissions.SAFE_METHODS:
            return [permissions.AllowAny()]
        return [permissions.IsAuthenticated()]


# ════════════════════════════════════════════════════════════
#  VENTES — mixin déjà présent, perform_create personnalisé
# ════════════════════════════════════════════════════════════

class VenteViewSet(ActivityLogMixin, viewsets.ModelViewSet):
    queryset           = Vente.objects.all()
    serializer_class   = VenteSerializer
    log_model_name     = "Vente"

    def get_permissions(self):
        if self.request.method in permissions.SAFE_METHODS:
            return [permissions.IsAuthenticated()]
        return [permissions.IsAuthenticated(), IsVendeur()]

    def perform_create(self, serializer):
        vente = serializer.save(vendeur=self.request.user)
        self._log(
            "vente", vente,
            f"Vente de {vente.produit.nom} (x{vente.quantite}) par {self.request.user.username}",
        )


# ════════════════════════════════════════════════════════════
#  ACTIVITÉ — lecture seule, filtrée par rôle
# ════════════════════════════════════════════════════════════

# Dans views.py — remplacer uniquement ActivityLogViewSet par ceci

from rest_framework import viewsets, filters
from rest_framework.permissions import IsAuthenticated
from .models import ActivityLog
from .serializers import ActivityLogSerializer


class ActivityLogViewSet(viewsets.ReadOnlyModelViewSet):
    """
    Historique GLOBAL — tous les utilisateurs authentifiés voient tout.
    Filtres disponibles :
      ?action=create|update|delete|vente
      ?model=Produit|Stock|Categorie|Vente
      ?user=<id>   (filtre optionnel, admin seulement)
    """
    serializer_class   = ActivityLogSerializer
    permission_classes = [IsAuthenticated]
    filter_backends    = [filters.SearchFilter, filters.OrderingFilter]
    search_fields      = ["description", "model_name", "user__username"]
    ordering_fields    = ["created_at"]
    ordering           = ["-created_at"]  # plus récent en premier

    def get_queryset(self):
        user = self.request.user
        # ✅ GLOBAL — tout le monde voit tous les logs
        qs = ActivityLog.objects.select_related("user")

        # Filtre optionnel par user (admin seulement)
        user_id = self.request.query_params.get("user")
        if user_id and getattr(user, "role", None) == "admin":
            qs = qs.filter(user_id=user_id)

        # Filtre par action
        action = self.request.query_params.get("action")
        if action:
            qs = qs.filter(action=action)

        # Filtre par modèle
        model = self.request.query_params.get("model")
        if model:
            qs = qs.filter(model_name__icontains=model)

        return qs


# ════════════════════════════════════════════════════════════
#  TRACKING BOUTIQUE (public)
# ════════════════════════════════════════════════════════════

from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt
from django.db.models import Count
from django.db.models.functions import TruncDate, ExtractHour
from django.utils import timezone
from datetime import timedelta
from rest_framework.decorators import api_view, permission_classes as pc


@csrf_exempt
@api_view(["POST"])
@pc([AllowAny])
def tracker_action(request):
    try:
        data = request.data
        ip   = (
            request.META.get("HTTP_X_FORWARDED_FOR", "").split(",")[0].strip()
            or request.META.get("REMOTE_ADDR", "")
        )
        VisiteBoutique.objects.create(
            type_action = data.get("type_action", "visite_boutique"),
            produit_id  = data.get("produit_id"),
            produit_nom = data.get("produit_nom", ""),
            genre       = data.get("genre", ""),
            categorie   = data.get("categorie", ""),
            recherche   = data.get("recherche", ""),
            ip          = ip[:45] if ip else None,
            user_agent  = request.META.get("HTTP_USER_AGENT", "")[:500],
        )
        return JsonResponse({"ok": True})
    except Exception as e:
        return JsonResponse({"error": str(e)}, status=400)


@api_view(["GET"])
@pc([IsAuthenticated])
def stats_boutique(request):
    jours  = int(request.GET.get("jours", 30))
    depuis = timezone.now() - timedelta(days=jours)
    qs     = VisiteBoutique.objects.filter(created_at__gte=depuis)

    totaux = {t[0]: qs.filter(type_action=t[0]).count() for t in VisiteBoutique.TYPE_CHOICES}

    wa_produits = (
        qs.filter(type_action="clic_whatsapp", produit_nom__gt="")
        .values("produit_nom").annotate(total=Count("id")).order_by("-total")[:10]
    )
    top_produits = (
        qs.filter(type_action="visite_produit")
        .values("produit_nom", "produit_id").annotate(total=Count("id")).order_by("-total")[:10]
    )
    genres = (
        qs.filter(type_action="filtre_genre", genre__gt="")
        .values("genre").annotate(total=Count("id")).order_by("-total")
    )
    recherches = (
        qs.filter(type_action="recherche", recherche__gt="")
        .values("recherche").annotate(total=Count("id")).order_by("-total")[:10]
    )
    activite_jour = (
        qs.annotate(jour=TruncDate("created_at"))
        .values("jour").annotate(total=Count("id")).order_by("jour")
    )
    heures = (
        qs.annotate(heure=ExtractHour("created_at"))
        .values("heure").annotate(total=Count("id")).order_by("heure")
    )
    uniques  = qs.exclude(ip=None).values("ip").distinct().count()
    recentes = list(
        qs.order_by("-created_at")[:20]
        .values("type_action", "produit_nom", "genre", "recherche", "created_at")
    )
    for r in recentes:
        r["created_at"] = r["created_at"].strftime("%d/%m %H:%M")

    return JsonResponse({
        "totaux":        totaux,
        "wa_produits":   list(wa_produits),
        "top_produits":  list(top_produits),
        "genres":        list(genres),
        "recherches":    list(recherches),
        "activite_jour": [{"jour": str(a["jour"]), "total": a["total"]} for a in activite_jour],
        "heures":        list(heures),
        "uniques":       uniques,
        "recentes":      recentes,
        "periode_jours": jours,
    })