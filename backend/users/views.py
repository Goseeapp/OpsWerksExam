"""User views for authentication."""
from django.conf import settings
from django.contrib.auth import authenticate
from rest_framework import status
from rest_framework.permissions import AllowAny
from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework_simplejwt.tokens import RefreshToken

from .serializers import LoginSerializer, UserSerializer


class LoginView(APIView):
    """Login endpoint that returns JWT tokens."""

    permission_classes = [AllowAny]

    def post(self, request):
        serializer = LoginSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)

        username = serializer.validated_data['username']
        password = serializer.validated_data['password']

        user = authenticate(username=username, password=password)

        if user is None:
            return Response(
                {'error': 'Invalid credentials'},
                status=status.HTTP_401_UNAUTHORIZED
            )

        refresh = RefreshToken.for_user(user)
        access_token = str(refresh.access_token)

        response = Response({
            'access': access_token,
            'refresh': str(refresh),
            'user': UserSerializer(user).data
        })

        cookie_secure = not settings.DEBUG
        response.set_cookie(
            'access_token',
            access_token,
            httponly=True,
            samesite='Lax',
            secure=cookie_secure
        )
        response.set_cookie(
            'refresh_token',
            str(refresh),
            httponly=True,
            samesite='Lax',
            secure=cookie_secure
        )

        return response


class UserMeView(APIView):
    """Get current user information."""

    def get(self, request):
        return Response(UserSerializer(request.user).data)
