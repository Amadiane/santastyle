from rest_framework.permissions import BasePermission
 
class IsAdmin(BasePermission):
    """Accès total — réservé au rôle admin."""
    def has_permission(self, request, view):
        return bool(request.user and request.user.is_authenticated
                    and getattr(request.user, "role", None) == "admin")
 
class IsVendeur(BasePermission):
    """Accès aux vendeurs ET aux admins."""
    def has_permission(self, request, view):
        return bool(request.user and request.user.is_authenticated
                    and getattr(request.user, "role", None) in ("admin", "vendeur"))
 
class IsAdminOrReadOnly(BasePermission):
    """Lecture pour tous les authentifiés, écriture admin seulement."""
    def has_permission(self, request, view):
        if not request.user or not request.user.is_authenticated:
            return False
        if request.method in ("GET", "HEAD", "OPTIONS"):
            return True
        return getattr(request.user, "role", None) == "admin"