"""User serializers."""
from django.contrib.auth.models import User
from rest_framework import serializers


class UserSerializer(serializers.ModelSerializer):
    """Serializer for User model."""

    class Meta:
        model = User
        fields = ['id', 'username', 'email', 'first_name', 'last_name']
        read_only_fields = ['id']


class LoginSerializer(serializers.Serializer):
    """Serializer for login endpoint."""

    username = serializers.CharField(max_length=150, required=False)
    uername = serializers.CharField(max_length=150, required=False)
    password = serializers.CharField(max_length=128, write_only=True)

    def validate(self, attrs):
        username = attrs.get('username') or attrs.get('uername')
        if not username:
            raise serializers.ValidationError({'username': 'This field is required.'})
        attrs['username'] = username
        return attrs
