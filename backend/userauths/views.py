from django.shortcuts import render
from rest_framework_simplejwt.views import TokenObtainPairView
from rest_framework import generics
from rest_framework.permissions import IsAuthenticated , AllowAny
from rest_framework_simplejwt.tokens import RefreshToken
from rest_framework.response import Response
from rest_framework import status 
from rest_framework import serializers 

from django.shortcuts import get_object_or_404
from django.utils.encoding import force_str
from urllib.parse import urlencode

import random 
import shortuuid

from django.utils.http import urlsafe_base64_decode
from django.utils.http import urlsafe_base64_encode
from django.utils.encoding import force_bytes
from django.core.mail import EmailMultiAlternatives
from django.contrib.auth.tokens import PasswordResetTokenGenerator
from django.template.loader import render_to_string
from django.conf import settings



from userauths.models import User, Profile
from userauths.serializer import MyTokenSerializer,RegisterSerializer , UserSerializer , PasswordChangeSerializer , PasswordResetThrottle
class MyTokenObtainView(TokenObtainPairView):
    serializer_class  = MyTokenSerializer

class RegisterView(generics.GenericAPIView):
    serializer_class = RegisterSerializer
    permission_classes = [AllowAny]

    def post(self, request, *args, **kwargs):
        email = request.data.get("email")

        # Check for existing users
        user = User.objects.filter(email=email).first()

        if user:
            if user.is_active:
                # Active user exists → cannot register
                return Response({"error": "این ایمیل قبلا ثبت شده است"}, status=400)
            else:
                # Inactive user exists → overwrite password + other fields
                user.set_password(request.data["password"])
                user.full_name = request.data.get("full_name", user.full_name)
                user.phone = request.data.get("phone", user.phone)
                user.save(update_fields=['password', 'full_name', 'phone'])
        else:
            # No user → create new
            serializer = self.get_serializer(data=request.data)
            serializer.is_valid(raise_exception=True)
            user = serializer.save(is_active=False)

        # Send OTP
        send_otp(user)

        return Response({"message": "کد تایید برای شما ارسال شد", "email": user.email}, status=201)
def generate_numeric_otp(length=6):
    return ''.join(str(random.randint(0, 9)) for _ in range(length))

def send_otp(user):
    user.otp = generate_numeric_otp()
    user.save(update_fields=["otp"])

    uidb64 = urlsafe_base64_encode(force_bytes(user.pk))
    token = PasswordResetTokenGenerator().make_token(user)

    params = {
        "otp": user.otp,
        "uidb64": uidb64,
        "reset_token": token,
    }

    link = f"https://merajdh.pythonanywhere.com/verify-otp?{urlencode(params)}"

    context = {
        "username": user.username,
        "otp": user.otp,
        "link": link,
    }

    subject = "تایید حساب کاربری"
    text_body = render_to_string("email/otp_email.txt", context)

         
    html_content = render_to_string("email/otp_email.html", context)

            

    msg = EmailMultiAlternatives(
        subject=subject,
        from_email=settings.EMAIL_HOST_USER,
        to=[user.email],
        body=text_body,
    )
    msg.attach_alternative(html_content, "text/html")
    msg.send()

class VerifyOTPView(generics.CreateAPIView):
    permission_classes = (AllowAny,)

    def post(self, request):
        email = request.data.get("email")
        otp = request.data.get("otp")

        try:
            user = User.objects.get(email=email, otp=otp)
        except User.DoesNotExist:
            return Response({"message": "Invalid OTP"}, status=400)

        user.is_active = True
        user.otp = None
        user.save()

        return Response({"message": "Account verified successfully"}, status=200)
    
    
class PasswordEmailVerify(generics.RetrieveAPIView):
    permission_classes = (AllowAny,)
    serializer_class = UserSerializer
    throttle_classes = [PasswordResetThrottle]

    
    def get_object(self):
        email = self.kwargs['email']
        user = User.objects.get(email=email)
        
        if user:
            user.otp = generate_numeric_otp()
            
             # Generate a token and include it in the reset link sent via email
            refresh = RefreshToken.for_user(user)
            reset_token = str(refresh.access_token)

            # Store the reset_token in the user model for later verification
            uidb64 = urlsafe_base64_encode(force_bytes(user.pk))
            reset_token = PasswordResetTokenGenerator().make_token(user)          
            user.save()
            params = {
                "otp": user.otp,
                "uidb64": uidb64,
                "reset_token": reset_token
            }

            link = f"https://merajdh.pythonanywhere.com/create-new-password?{urlencode(params)}"       
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
    serializer_class = PasswordChangeSerializer

    def create(self, request, *args, **kwargs):
        payload = request.data
        otp = payload.get("otp")
        token = payload.get("reset_token")
        uidb64 = payload.get("uidb64")

        try:
            uid = force_str(urlsafe_base64_decode(uidb64))
            user = User.objects.get(pk=uid, otp=otp)
        except (User.DoesNotExist, TypeError, ValueError):
            return Response({"message": "Invalid OTP or UID"}, status=400)

        # Now user exists, pass to serializer
        serializer = self.get_serializer(data=request.data, context={'user': user})
        serializer.is_valid(raise_exception=True)

        password = serializer.validated_data["password"]

        if not PasswordResetTokenGenerator().check_token(user, token):
            return Response({"message": "Invalid or expired token"}, status=400)

        user.set_password(password)
        user.otp = ""
        user.save()

        return Response({"message": "Password changed successfully"}, status=200)
