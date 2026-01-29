"""Gadget views."""
from asgiref.sync import async_to_sync
from channels.layers import get_channel_layer
from rest_framework import status, viewsets
from rest_framework.decorators import action
from rest_framework.response import Response

from .models import Gadget
from .serializers import GadgetSerializer


class GadgetViewSet(viewsets.ModelViewSet):
    """ViewSet for Gadget CRUD operations."""

    serializer_class = GadgetSerializer

    def get_queryset(self):
        """Return gadgets owned by the authenticated user."""
        return Gadget.objects.filter(owner=self.request.user)

    def perform_create(self, serializer):
        """Set the owner to the authenticated user on create."""
        gadget = serializer.save(owner=self.request.user)
        self._broadcast_change('created', gadget)

    def perform_update(self, serializer):
        """Broadcast update event."""
        gadget = serializer.save()
        self._broadcast_change('updated', gadget)

    def perform_destroy(self, instance):
        """Broadcast delete event before destroying."""
        gadget_id = instance.id
        owner_id = instance.owner_id
        instance.delete()
        self._broadcast_change('deleted', None, gadget_id=gadget_id, owner_id=owner_id)

    @action(detail=False, methods=['post'])
    def bulk_delete(self, request):
        """Delete multiple gadgets at once."""
        ids = request.data.get('ids', [])
        if not ids:
            return Response(
                {'error': 'No IDs provided'},
                status=status.HTTP_400_BAD_REQUEST
            )

        gadgets = self.get_queryset().filter(id__in=ids)
        deleted_ids = list(gadgets.values_list('id', flat=True))
        gadgets.delete()

        # Broadcast bulk delete event
        channel_layer = get_channel_layer()
        async_to_sync(channel_layer.group_send)(
            f'gadgets_{request.user.id}',
            {
                'type': 'gadget_message',
                'action': 'bulk_deleted',
                'ids': deleted_ids,
            }
        )

        return Response({'deleted': deleted_ids})

    def _broadcast_change(self, action_type, gadget, gadget_id=None, owner_id=None):
        """Broadcast gadget changes via WebSocket."""
        channel_layer = get_channel_layer()

        if gadget:
            owner_id = gadget.owner_id
            gadget_id = gadget.id

        message = {
            'type': 'gadget_message',
            'action': action_type,
            'gadget_id': gadget_id,
        }

        if gadget and action_type != 'deleted':
            message['gadget'] = GadgetSerializer(gadget).data

        async_to_sync(channel_layer.group_send)(
            f'gadgets_{owner_id}',
            message
        )
