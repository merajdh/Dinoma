from django.shortcuts import render
from rest_framework_simplejwt.views import TokenObtainPairView
from rest_framework import generics
from rest_framework.permissions import IsAuthenticated , AllowAny


from userauths.models import User, Profile
from userauths.serializer import MyTokenSerializer,RegisterSerializer
class MyTokenObtainView(TokenObtainPairView):
    serializer_class  = MyTokenSerializer

class RegisterView(generics.CreateAPIView):
    queryset = User.objects.all()
    permission_classes = (AllowAny,)
    serializer_class = RegisterSerializer