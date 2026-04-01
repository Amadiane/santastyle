from rest_framework import viewsets, status
from rest_framework.permissions import AllowAny, IsAuthenticated
from .models import User
from .serializers import UserSerializer, LoginSerializer
from rest_framework_simplejwt.views import TokenObtainPairView
from rest_framework.response import Response


class UserViewSet(viewsets.ModelViewSet):

    queryset = User.objects.all()
    serializer_class = UserSerializer
    permission_classes = [IsAuthenticated]

    def create(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)

        if not serializer.is_valid():
            print(serializer.errors)  # 👈 IMPORTANT
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

        self.perform_create(serializer)
        return Response(serializer.data)

# LOGIN JWT
class LoginView(TokenObtainPairView):
    serializer_class = LoginSerializer
    permission_classes = [AllowAny]  


# Categorie View
from rest_framework import generics, permissions
from .models import Categorie
from .serializers import CategorieSerializers

class CategorieListCreateView(generics.ListCreateAPIView):
    queryset = Categorie.objects.all()
    serializer_class = CategorieSerializers
    permission_classes = [permissions.IsAuthenticated]

class CategorieRetrieveUpdateDestroyView(generics.RetrieveUpdateDestroyAPIView):
    queryset = Categorie.objects.all()
    serializer_class = CategorieSerializers
    permission_classes = [permissions.IsAuthenticated]




from .models import Produit
from .serializers import ProduitSerializer

class ProduitListCreateView(generics.ListCreateAPIView):
    queryset = Produit.objects.all()
    serializer_class = ProduitSerializer
    permission_class = [permissions.IsAuthenticated]


class ProduitRetrieveUpdateDestroyView(generics.RetrieveUpdateDestroyAPIView):
    queryset =  Produit.objects.all()
    serializer_class = ProduitSerializer
    permission_class = [permissions.IsAuthenticated]


from rest_framework import viewsets
from .models import Stock
from .serializers import StockSerializer


class StockViewSet(viewsets.ModelViewSet):

    queryset = Stock.objects.all()
    serializer_class = StockSerializer
    permission_class = [permissions.IsAuthenticated]