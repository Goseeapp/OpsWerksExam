"""Gadget URL configuration."""
from django.urls import include, path
from rest_framework.routers import DefaultRouter

from .views import GadgetViewSet

router = DefaultRouter()
router.register(r'gadgets', GadgetViewSet, basename='gadget')

urlpatterns = [
    path('', include(router.urls)),
]
