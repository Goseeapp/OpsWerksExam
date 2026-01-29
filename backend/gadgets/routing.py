"""WebSocket routing for gadgets app."""
from django.urls import path

from .consumers import GadgetConsumer

websocket_urlpatterns = [
    path('ws/gadgets/', GadgetConsumer.as_asgi()),
]
