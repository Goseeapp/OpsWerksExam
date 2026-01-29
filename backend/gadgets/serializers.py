"""Gadget serializers."""
from rest_framework import serializers

from .models import Gadget


class GadgetSerializer(serializers.ModelSerializer):
    """Serializer for Gadget model."""

    class Meta:
        model = Gadget
        fields = ['id', 'name', 'description', 'created', 'last_modified']
        read_only_fields = ['id', 'created', 'last_modified']
