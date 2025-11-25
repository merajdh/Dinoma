from django.db import models
from django.contrib.auth.models import AbstractUser
from shortuuid.django_fields import ShortUUIDField
from django.db.models.signals import post_save


class User(AbstractUser):
    username = models.CharField(
        unique=True,
        max_length=100
    )
    email = models.EmailField(
        verbose_name="آدرس ایمیل",
        unique=True
    )
    full_name = models.CharField(max_length=100, null=True, blank=True)
    phone = models.CharField(
        verbose_name="شماره تلفن",
        max_length=11,
        unique=True
    )

    # Authentication settings
    USERNAME_FIELD = "email"
    REQUIRED_FIELDS = ["username"]

    def __str__(self):
        return str(self.email)

    def save(self, *args, **kwargs):
        # Auto generate username from email
        email_username, mobile = self.email.split("@")

        if not self.full_name:
            self.full_name = email_username

        if not self.username:
            self.username = email_username

        super().save(*args, **kwargs)


class Profile(models.Model):
    user = models.OneToOneField(User, on_delete=models.CASCADE)
    image = models.FileField(upload_to="image", default="default/default-user.jpg", null=True, blank=True)

    full_name = models.CharField(max_length=100, null=True, blank=True)
    about = models.TextField(max_length=100, null=True, blank=True)
    gender = models.CharField(max_length=100, null=True, blank=True)
    city = models.CharField(max_length=100, null=True, blank=True)
    address = models.CharField(max_length=100, null=True, blank=True)
    date = models.DateTimeField(auto_now_add=True)

    pid = ShortUUIDField(
        unique=True,
        length=10,
        max_length=12,
        alphabet="abcdefgh"
    )

    def __str__(self):
        return str(self.full_name) if self.full_name else str(self.user.full_name)

    def save(self, *args, **kwargs):
        if not self.full_name:
            self.full_name = self.user.full_name

        super().save(*args, **kwargs)



# Signals
def create_user_profile(sender, instance, created, **kwargs):
    if created:
        Profile.objects.create(user=instance)


def save_user_profile(sender, instance, **kwargs):
    instance.profile.save()


post_save.connect(create_user_profile, sender=User)
post_save.connect(save_user_profile, sender=User)
