from django.shortcuts import render
from rest_framework_simplejwt.views import TokenObtainPairView
from rest_framework import generics
from rest_framework.permissions import IsAuthenticated , AllowAny
from rest_framework_simplejwt.tokens import RefreshToken
from rest_framework.response import Response
from rest_framework import status 

from django.shortcuts import get_object_or_404

import random 
import shortuuid

from django.utils.http import urlsafe_base64_decode
from django.utils.http import urlsafe_base64_encode
from django.utils.encoding import force_bytes
from django.core.mail import EmailMultiAlternatives
from django.template.loader import render_to_string
from django.conf import settings



from userauths.models import User, Profile
from userauths.serializer import MyTokenSerializer,RegisterSerializer , UserSerializer
class MyTokenObtainView(TokenObtainPairView):
    serializer_class  = MyTokenSerializer

class RegisterView(generics.CreateAPIView):
    queryset = User.objects.all()
    permission_classes = (AllowAny,)
    serializer_class = RegisterSerializer


def generate_numeric_otp(length=7):
    return ''.join(str(random.randint(0, 9)) for _ in range(length))
class PasswordEmailVerify(generics.RetrieveAPIView):
    permission_classes = (AllowAny,)
    serializer_class = UserSerializer
    
    def get_object(self):
        email = self.kwargs['email']
        user = User.objects.get(email=email)
        
        if user:
            user.otp = generate_numeric_otp()
            uidb64 = urlsafe_base64_encode(force_bytes(user.pk))
            
             # Generate a token and include it in the reset link sent via email
            refresh = RefreshToken.for_user(user)
            reset_token = str(refresh.access_token)

            # Store the reset_token in the user model for later verification
            user.reset_token = reset_token
            user.save()

            link = f"http://localhost:5173/create-new-password?otp={user.otp}&uidb64={uidb64}&reset_token={reset_token}"            
            merge_data = {
                'link': link, 
                'username': user.username, 
            }
            subject = f"بازیابی رمز عبور"
        
            text_body = render_to_string("email/password_reset.txt", merge_data)
            html_body = render_to_string("email/password_reset.html", merge_data)
         
            html_content = render_to_string("email/password_reset.html", {"user": user , 'link' : link})

            
            msg = EmailMultiAlternatives(
                subject=subject, from_email=settings.EMAIL_HOST_USER,
                to=[user.email], body=text_body
            )
            msg.attach_alternative(html_content, "text/html")
            msg.send()
            print(email)


        return user
    

class PasswordChangeView(generics.CreateAPIView):
    permission_classes = (AllowAny,)
    serializer_class = UserSerializer
    
    def create(self, request, *args, **kwargs):
        payload = request.data
        otp = payload.get('otp')
        uidb64 = payload.get('uidb64')
        reset_token = payload.get('reset_token')
        password = payload.get('password')
        uid = urlsafe_base64_decode(uidb64).decode()

        try:
            user = User.objects.get(id=uid, otp=otp)
        except (User.DoesNotExist, TypeError, ValueError):
            return Response({"message": "Invalid OTP or UID"}, status=status.HTTP_400_BAD_REQUEST)

        if user.reset_token != reset_token:
            return Response({"message": "Invalid reset token"}, status=status.HTTP_400_BAD_REQUEST)

        user.set_password(password)
        user.otp = ""
        user.reset_token = ""
        user.save()

        return Response({"message": "Password Changed Successfully"}, status=status.HTTP_200_OK)
