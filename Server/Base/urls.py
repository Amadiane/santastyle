from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import (UserViewSet, LoginView, CategorieListCreateView, CategorieRetrieveUpdateDestroyView,
ProduitListCreateView, ProduitRetrieveUpdateDestroyView, StockViewSet)

router = DefaultRouter()
router.register("users", UserViewSet, basename="users")
router.register("stocks", StockViewSet)

urlpatterns = [
    path("", include(router.urls)),
    path("login/", LoginView.as_view(), name="token_obtain_pair"),
    path('categories/', CategorieListCreateView.as_view(), name='categorie-list-create'),
    path('categories/<int:pk>/', CategorieRetrieveUpdateDestroyView.as_view(), name='categorie-detail'),
    path('produits/', ProduitListCreateView.as_view(), name='produit-list-create'),
    path('produits/<int:pk>/',ProduitRetrieveUpdateDestroyView.as_view(), name='produit-detail'),

]