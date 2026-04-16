# mixins.py

from .models import ActivityLog


class ActivityLogMixin:
    """
    Mixin universel — fonctionne sur ModelViewSet ET GenericAPIView.
    Enregistre automatiquement create / update / destroy dans ActivityLog.
    """

    log_model_name = None  # surcharger dans chaque ViewSet

    def _model_label(self):
        if self.log_model_name:
            return self.log_model_name
        try:
            qs = self.get_queryset()
            return qs.model.__name__ if qs is not None else "Inconnu"
        except Exception:
            return "Inconnu"

    def _get_user(self):
        """Retourne l'utilisateur connecté ou None."""
        request = getattr(self, "request", None)
        if request and hasattr(request, "user") and request.user.is_authenticated:
            return request.user
        return None

    def _log(self, action, obj, description=""):
        """Crée une entrée ActivityLog."""
        label = self._model_label()
        pk    = getattr(obj, "pk", None)

        # Description automatique si non fournie
        if not description:
            user = self._get_user()
            nom  = self._get_obj_name(obj)
            who  = f" par {user.username}" if user else ""
            description = f"{action.capitalize()} {label} — {nom}{who}"

        ActivityLog.objects.create(
            user        = self._get_user(),
            action      = action,
            model_name  = label,
            object_id   = pk,
            description = description,
        )

    def _get_obj_name(self, obj):
        """Essaie de retourner un nom lisible de l'objet."""
        for attr in ("nom", "name", "titre", "title", "__str__"):
            if attr == "__str__":
                return str(obj)
            val = getattr(obj, attr, None)
            if val:
                return str(val)
        return f"#{getattr(obj, 'pk', '?')}"

    # ── ViewSet hooks ─────────────────────────────────────────
    def perform_create(self, serializer):
        obj = serializer.save()
        self._log("create", obj)

    def perform_update(self, serializer):
        obj = serializer.save()
        self._log("update", obj)

    def perform_destroy(self, instance):
        # Log avant suppression pour garder les infos
        self._log(
            "delete",
            instance,
            f"Suppression {self._model_label()} — {self._get_obj_name(instance)}"
            + (f" par {self._get_user().username}" if self._get_user() else ""),
        )
        instance.delete()

    # ── GenericAPIView hooks (pour ListCreateAPIView etc.) ────
    def perform_create_generic(self, serializer):
        """Appeler dans perform_create() des GenericAPIView."""
        obj = serializer.save()
        self._log("create", obj)

    def perform_update_generic(self, serializer):
        """Appeler dans perform_update() des GenericAPIView."""
        obj = serializer.save()
        self._log("update", obj)

    def perform_destroy_generic(self, instance):
        """Appeler dans perform_destroy() des RetrieveUpdateDestroyAPIView."""
        self._log(
            "delete",
            instance,
            f"Suppression {self._model_label()} — {self._get_obj_name(instance)}"
            + (f" par {self._get_user().username}" if self._get_user() else ""),
        )
        instance.delete()