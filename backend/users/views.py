from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.permissions import AllowAny, IsAuthenticated  # ✅ import IsAuthenticated
from rest_framework import status
from rest_framework_simplejwt.tokens import RefreshToken
from rest_framework.parsers import MultiPartParser, FormParser
from .serializers import RegisterSerializer, UserProfileSerializer
from .models import User
from .tasks import send_welcome_email
from google.oauth2 import id_token
from google.auth.transport import requests
from django.conf import settings

# ---------------------------
# Registration View
# ---------------------------
class RegisterView(APIView):
    permission_classes = [AllowAny]

    def post(self, request):
        serializer = RegisterSerializer(data=request.data)
        if serializer.is_valid():
            user = serializer.save()
            send_welcome_email.delay(user.id)

            # Generate JWT tokens
            refresh = RefreshToken.for_user(user)
            access_token = str(refresh.access_token)
            refresh_token = str(refresh)

            return Response({
                'message': 'User created successfully',
                'user': {
                    'id': user.id,
                    'username': user.username,
                    'email': user.email,
                },
                'tokens': {
                    'access': access_token,
                    'refresh': refresh_token
                }
            }, status=status.HTTP_201_CREATED)

        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

# ---------------------------
# User List View
# ---------------------------
class UserListView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        # Exclude current logged-in user
        users = User.objects.exclude(id=request.user.id)
        serializer = RegisterSerializer(users, many=True)
        return Response(serializer.data)

# ---------------------------
# Google Login View
# ---------------------------
class GoogleLoginView(APIView):
    permission_classes = [AllowAny]

    def post(self, request):
        token = request.data.get('token')
        if not token:
            return Response({'error': 'Token is required'}, status=status.HTTP_400_BAD_REQUEST)

        try:
            # Specify the CLIENT_ID of the app that accesses the backend:
            # (In a real app, this should be in settings.py)
            CLIENT_ID = "426740165458-kcl9a6o6cohdj0v6jid75ei8042eag2o.apps.googleusercontent.com"
            idinfo = id_token.verify_oauth2_token(token, requests.Request(), CLIENT_ID)

            # ID token is valid. Get the user's Google Account ID from the decoded token.
            email = idinfo['email']
            name = idinfo.get('name', '')
            
            # Get or create user
            user, created = User.objects.get_or_create(email=email, defaults={
                'username': email.split('@')[0], # Fallback username
            })

            # Always update name from Google
            if name:
                parts = name.split(' ')
                user.first_name = parts[0]
                user.last_name = ' '.join(parts[1:]) if len(parts) > 1 else ''
                user.save()

            # Generate JWT tokens
            refresh = RefreshToken.for_user(user)
            
            return Response({
                'access': str(refresh.access_token),
                'refresh': str(refresh),
                'user': {
                    'id': user.id,
                    'email': user.email,
                    'username': user.username,
                    'first_name': user.first_name,
                    'last_name': user.last_name,
                }
            }, status=status.HTTP_200_OK)

        except ValueError as e:
            # Invalid token
            return Response({'error': f'Invalid token: {str(e)}'}, status=status.HTTP_400_BAD_REQUEST)


# ---------------------------
# User Profile View
# ---------------------------
class UserProfileView(APIView):
    permission_classes = [IsAuthenticated]
    parser_classes = [MultiPartParser, FormParser]

    def get(self, request):
        serializer = UserProfileSerializer(request.user, context={'request': request})
        return Response(serializer.data)

    def put(self, request):
        serializer = UserProfileSerializer(request.user, data=request.data, partial=True, context={'request': request})
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

