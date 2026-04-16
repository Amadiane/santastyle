from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import (UserViewSet, LoginView, CategorieListCreateView, CategorieRetrieveUpdateDestroyView,
StockViewSet, VenteViewSet, tracker_action, stats_boutique, ActivityLogViewSet,
ProduitViewSet)


router = DefaultRouter()
router.register("users", UserViewSet, basename="users")
router.register("stocks", StockViewSet)
router.register(r'ventes', VenteViewSet)
router.register(r"activity", ActivityLogViewSet, basename="activity")
router.register(r"produits", ProduitViewSet, basename="produit")

urlpatterns = [
    path("", include(router.urls)),
    path("login/", LoginView.as_view(), name="token_obtain_pair"),
    path('categories/', CategorieListCreateView.as_view(), name='categorie-list-create'),
    path('categories/<int:pk>/', CategorieRetrieveUpdateDestroyView.as_view(), name='categorie-detail'),
    # path('produits/', ProduitListCreateView.as_view(), name='produit-list-create'),
    # path('produits/<int:pk>/',ProduitRetrieveUpdateDestroyView.as_view(), name='produit-detail'),
    path("track/",       tracker_action, name="tracker_action"),
    path("track/stats/", stats_boutique, name="stats_boutique"),

]