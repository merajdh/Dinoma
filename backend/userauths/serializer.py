from rest_framework import serializers
from rest_framework_simplejwt.serializers import TokenObtainPairSerializer
from django.contrib.auth.password_validation import validate_password

from userauths.models import User, Profile
from rest_framework.throttling import UserRateThrottle


class MyTokenSerializer(TokenObtainPairSerializer):
    @classmethod
    def get_token(cls, user):
        token = super().get_token(user)
        token['full_name'] = user.full_name
        token['phone'] = user.phone
        token['email'] = user.email
        return token


class RegisterSerializer(serializers.ModelSerializer):
    password = serializers.CharField(write_only=True, validators=[validate_password])
    password_repeat = serializers.CharField(write_only=True)

    class Meta:
        model = User
        fields = ['full_name', 'email', 'phone', 'password', 'password_repeat']
        extra_kwargs = {
            "phone": {"validators": []},  
            "email": {"validators": []},  
        }

    def validate(self, attrs):
        if attrs['password'] != attrs['password_repeat']:
            raise serializers.ValidationError({
                "password": "رمزعبور شما با هم هماهنگ نیستند"
            })

        email = attrs.get("email")
        phone = attrs.get("phone")

        if User.objects.filter(email=email, is_active=True).exists():
            raise serializers.ValidationError({
                "email": "این ایمیل قبلاً فعال شده است"
            })

        if phone and User.objects.filter(phone=phone, is_active=True).exists():
            raise serializers.ValidationError({
                "phone": "این شماره تلفن قبلاً فعال شده است"
            })

        return attrs

    def create(self, validated_data):
        validated_data.pop("password_repeat")
        email = validated_data["email"]
        phone = validated_data.get("phone")

        user = User.objects.filter(email=email, is_active=False).first()

        if user:
            user.set_password(validated_data["password"])
            user.full_name = validated_data.get("full_name")
            user.phone = phone
            user.save()
            return user

        return User.objects.create_user(
            username=email.split("@")[0],
            email=email,
            phone=phone,
            full_name=validated_data.get("full_name"),
            password=validated_data["password"],
            is_active=False
        )

class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ['id', 'email', 'full_name', 'phone']


class ProfileSerializer(serializers.ModelSerializer):
    user = UserSerializer(read_only=True)

    class Meta:
        model = Profile
        fields = "__all__"

class PasswordChangeSerializer(serializers.Serializer):
    otp = serializers.CharField(write_only=True, required=True)
    uidb64 = serializers.CharField(write_only=True, required=True)
    reset_token = serializers.CharField(write_only=True, required=True)
    password = serializers.CharField(
        write_only=True,
        required=True,
        validators=[validate_password],
        
        
    )

    def validate_password(self, value):
        user = self.context.get('user')  
        if user and user.check_password(value):
            raise serializers.ValidationError("شما نمیتوانید رمز عبور خود را به رمز فعلی خود تغییر دهید.")
        validate_password(value)
        return value
    

class PasswordResetThrottle(UserRateThrottle):
    rate = '1/m'  