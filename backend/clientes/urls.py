from rest_framework.routers import DefaultRouter

from .views import ClienteViewSet

router = DefaultRouter(trailing_slash=False)
router.register(r"clientes", ClienteViewSet, basename="cliente")

urlpatterns = router.urls
