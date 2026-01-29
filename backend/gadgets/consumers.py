"""WebSocket consumers for real-time gadget updates."""
import json
from http.cookies import SimpleCookie

from channels.generic.websocket import AsyncWebsocketConsumer
from rest_framework_simplejwt.tokens import AccessToken


class GadgetConsumer(AsyncWebsocketConsumer):
    """WebSocket consumer for gadget updates."""

    async def connect(self):
        """Handle WebSocket connection."""
        # Get token from query string or HttpOnly cookie
        query_string = self.scope.get('query_string', b'').decode()
        params = dict(param.split('=') for param in query_string.split('&') if '=' in param)
        token = params.get('token', '')

        if not token:
            headers = dict(self.scope.get('headers', []))
            cookie_header = headers.get(b'cookie', b'').decode()
            cookie = SimpleCookie()
            cookie.load(cookie_header)
            if 'access_token' in cookie:
                token = cookie['access_token'].value

        try:
            # Validate JWT token
            access_token = AccessToken(token)
            self.user_id = access_token['user_id']

            # Join user-specific group
            self.room_group_name = f'gadgets_{self.user_id}'
            await self.channel_layer.group_add(
                self.room_group_name,
                self.channel_name
            )
            await self.accept()
        except Exception:
            await self.close()

    async def disconnect(self, close_code):
        """Handle WebSocket disconnection."""
        if hasattr(self, 'room_group_name'):
            await self.channel_layer.group_discard(
                self.room_group_name,
                self.channel_name
            )

    async def receive(self, text_data):
        """Handle incoming WebSocket messages."""
        # Client can send ping messages to keep connection alive
        data = json.loads(text_data)
        if data.get('type') == 'ping':
            await self.send(text_data=json.dumps({'type': 'pong'}))

    async def gadget_message(self, event):
        """Handle gadget update messages from channel layer."""
        # Send message to WebSocket
        message = {
            'action': event['action'],
            'gadget_id': event.get('gadget_id'),
        }

        if 'gadget' in event:
            message['gadget'] = event['gadget']

        if 'ids' in event:
            message['ids'] = event['ids']

        await self.send(text_data=json.dumps(message))
