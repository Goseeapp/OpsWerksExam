"""Gadget models."""
from django.contrib.auth.models import User
from django.db import models


class Gadget(models.Model):
    """Model representing a gadget owned by a user."""

    name = models.CharField(max_length=255)
    description = models.TextField(blank=True)
    owner = models.ForeignKey(
        User,
        on_delete=models.CASCADE,
        related_name='gadgets'
    )
    created = models.DateTimeField(auto_now_add=True)
    last_modified = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ['-created']

    def __str__(self):
        return self.name
