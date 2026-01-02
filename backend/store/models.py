from django.db import models
from userauths.models import User, Profile
from django.utils.text import slugify

from django.dispatch import receiver    
from django.db.models.signals import post_save
from shortuuid.django_fields import ShortUUIDField
# Create your models here.



class Audience(models.Model):
    title = models.CharField(max_length=100)
    image = models.FileField(upload_to="audience" , default="audience.jpg" , null=True , blank=True)
    active =models.BooleanField(default=True)
    slug = models.SlugField(unique=True , allow_unicode=True)

    def __str__(self):
        return self.title
    class Meta:
        verbose_name_plural = "audience"
        ordering = ["title"]


class ClothingType(models.Model):
    title = models.CharField(max_length=100)
    image = models.FileField(upload_to="clothing_type" , default="clothing_type.jpg" , null=True , blank=True)
    active =models.BooleanField(default=True)
    slug = models.SlugField(unique=True , allow_unicode=True)

    def __str__(self):
        return self.title
    class Meta:
        verbose_name_plural = "clothing_type"
        ordering = ["title"]


class Product (models.Model):

    STATUS =(
        ('draft' , "Draft"),
        ('disabled' , "Disabled"),
        ('in_review' , "In Review"),
        ('published' , "Published"),
    )

    title = models.CharField(max_length=100)
    image = models.FileField(upload_to="product" , default="product.jpg" , null=True , blank=True)
    description = models.TextField(null=True , blank=True)
    audience = models.ForeignKey(Audience , on_delete=models.SET_NULL , null=True ,blank=True )
    clothing_type = models.ForeignKey(ClothingType , on_delete=models.SET_NULL , null=True ,blank=True )
    price = models.DecimalField(max_digits=15,decimal_places=0 ,default=0)
    old_price = models.DecimalField(max_digits=15,decimal_places=0 ,default=0)
    shipping_amount = models.DecimalField(max_digits=15,decimal_places=0 ,default=0)
    stock_qty = models.PositiveIntegerField(default=1)
    in_stock = models.BooleanField(default=True)
    status = models.CharField(max_length=100  , choices=STATUS , default="published" )
    featured = models.BooleanField(default=False)
    view = models.PositiveIntegerField(default=0)
    rating = models.PositiveSmallIntegerField(default=0)
    pid = ShortUUIDField(
        unique=True,
        length=10,
        max_length=12,
        alphabet="abcdefgh"
    )

    slug = models.SlugField(unique=True , allow_unicode=True)
    date = models.DateField(auto_now_add=True)
    def save(self, *args , **kwargs):
        if not self.slug:
            self.slug = slugify(self.name)

        self.rating = self.product_rating()

        super(Product , self).save(*args ,**kwargs)


 
    def __str__(self):
        return self.title
    
    def product_rating(self):
        product_rating = Review.objects.filter(product=self).aggregate(avg_rating =models.Avg("rating"))
        return product_rating['avg_rating']
    
    def rating_count(self):
        rating_count = Review.objects.filter(product=self).count()
        return rating_count

    def gallery(self):
        gallery = Gallery.objects.filter(product=self)
        return gallery

    def specification(self):
        return Specification.objects.filter(product=self)

    def color(self):
        return Color.objects.filter(product=self)
    
    def size(self):
        return Size.objects.filter(product=self)

class Gallery (models.Model):
    product = models.ForeignKey(Product , on_delete=models.CASCADE)
    image = models.FileField()
    active = models.BooleanField(default=True)
    date = models.DateField(auto_now_add=True)
    gid = ShortUUIDField(
        unique=True,
        length=10,
        max_length=12,
        alphabet="abcdefgh"
    )
    def __str__(self):
        return self.product.title
    
    class Meta:
        verbose_name_plural = 'Product Images'



class Specification(models.Model):
    product = models.ForeignKey(Product , on_delete=models.CASCADE )
    title = models.CharField(max_length=1000)
    content = models.CharField(max_length=1000)

    def __str__(self):
        return self.title

class Size(models.Model):
    product = models.ForeignKey(Product , on_delete=models.CASCADE )
    name = models.CharField(max_length=100)

    def __str__(self):
        return self.name
    

class Color(models.Model):
    product = models.ForeignKey(Product , on_delete=models.CASCADE )
    name = models.CharField(max_length=100)
    color_code = models.CharField(max_length=100)

    def __str__(self):
        return self.name

class Cart(models.Model):
    product = models.ForeignKey(Product , on_delete=models.CASCADE)
    user = models.ForeignKey(User , on_delete=models.CASCADE)
    qty = models.PositiveIntegerField(default=0)
    price = models.DecimalField(max_digits=15,decimal_places=0 ,default=0)
    total = models.DecimalField(max_digits=15,decimal_places=0 ,default=0)
    city = models.CharField(max_length=100 ,null=True , blank=True)
    Size = models.CharField(max_length=100 ,null=True , blank=True)
    color = models.CharField(max_length=100 ,null=True , blank=True)
    cart_id = models.CharField(max_length=1000 ,null=True , blank=True)
    date = models.DateField(auto_now_add=True)
    def __str__(self):
        return f"{self.cart_id} - {self.product.title}"
    

class CartOrder(models.Model):

    buyer = models.ForeignKey(User,on_delete=models.SET_NULL , null=True  )
    shipping_amount = models.DecimalField(max_digits=15,decimal_places=0 ,default=0)
    total =  models.DecimalField(max_digits=15,decimal_places=0 ,default=0)


    PAYMENT_STATUS =(
        ('paid' , "Paid"),
        ('pending' , "Pending"),
        ('processing' , "Processing"),
        ('cancelled' , "Cancelled"),
    )

    ORDER_STATUS =(
        ('pending' , "Pending"),
        ('fulfilled' , "Processing"),
        ('cancelled' , "Cancelled"),
    )
    # STATUS
    payment_status = models.CharField(choices=PAYMENT_STATUS , default="paid" , max_length=100)
    order_status = models.CharField(choices=ORDER_STATUS , default="pending" , max_length=100)

    # COUPONS

    initial_total =  models.DecimalField(max_digits=15,decimal_places=0 ,default=0)
    saved =  models.DecimalField(max_digits=15,decimal_places=0 ,default=0)

    #Personal Data
    full_name = models.CharField(max_length=100 , null=True , blank=True)
    email = models.CharField(max_length=100 , null=True , blank=True)
    mobile = models.CharField(max_length=100 , null=True , blank=True)
    address = models.CharField(max_length=100 , null=True , blank=True)
    city = models.CharField(max_length=100 , null=True , blank=True)
    state = models.CharField(max_length=100 , null=True , blank=True)
    postal_code = models.CharField(max_length=100 , null=True , blank=True)
    oid = ShortUUIDField(unique=True,length=10,max_length=12,alphabet="abcdefgh")    
    date = models.DateField(auto_now_add=True)

    def __str__(self):
        return self.oid
    

class CartOrderItem(models.Model):
    order = models.ForeignKey(CartOrder , on_delete=models.CASCADE)
    product = models.ForeignKey(Product , on_delete=models.CASCADE)

    qty = models.PositiveIntegerField(default=0)
    price =  models.DecimalField(max_digits=15,decimal_places=0 ,default=0)
    shipping_amount =  models.DecimalField(max_digits=15,decimal_places=0 ,default=0)
    total =  models.DecimalField(max_digits=15,decimal_places=0 ,default=0)
    city = models.CharField(max_length=100 ,null=True , blank=True)
    Size = models.CharField(max_length=100 ,null=True , blank=True)
    color = models.CharField(max_length=100 ,null=True , blank=True)

    # COUPONS
    initial_total =  models.DecimalField(max_digits=15,decimal_places=0 ,default=0)
    saved =  models.DecimalField(max_digits=15,decimal_places=0 ,default=0)
    oid = ShortUUIDField(unique=True,length=10,max_length=12,alphabet="abcdefgh")    
    date = models.DateField(auto_now_add=True)

    def __str__(self):
        return self.oid
    

# Frequently Asked Question
class ProductFaq(models.Model):
    user = models.ForeignKey(User , on_delete=models.SET_NULL , null=True , blank=True)
    product = models.ForeignKey(Product , on_delete=models.CASCADE)
    email = models.EmailField(null=True ,blank=True)
    question = models.CharField(max_length=1000)
    answer = models.TextField(null=True , blank=True)
    active = models.BooleanField(default=False)
    date = models.DateTimeField(auto_now_add=True)
    
    class Meta:
        verbose_name_plural = "Product Faqs"
        ordering = ["-date"]
        
    def __str__(self):
        return self.question
    

class Review(models.Model):
    RATING =(
        (1,"1 star"),
        (2,"2 star"),
        (3,"3 star"),
        (4,"4 star"),
        (5,"5 star"),
    )

    user = models.ForeignKey(User , on_delete=models.SET_NULL , null=True , blank=True)
    product = models.ForeignKey(Product , on_delete=models.CASCADE)

    reply = models.TextField(null=True , blank=True)
    rating = models.IntegerField(default=None , choices=RATING)
    active = models.BooleanField(default=False)
    date = models.DateTimeField(auto_now_add=True)
    class Meta:
        verbose_name_plural = "Product Reviews"
        
    def __str__(self):
        return self.product.title
    
    def profile(self):
        return Profile.objects.get(user = self.user)

@receiver(post_save ,sender=Review)
def update_product_rating(sender , instance , created , **kwargs):
    if instance.product:
        instance.product.save()

class Wishlist(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE, null=True, blank=True)
    product = models.ForeignKey(Product, on_delete=models.CASCADE, related_name="wishlist")
    date = models.DateTimeField(auto_now_add=True)
    
    class Meta:
        verbose_name_plural = "Wishlist"
    
    def __str__(self):
        if self.product.title:
            return self.product.title
        else:
            return "Wishlist"
        

class Notification(models.Model):
    user = models.ForeignKey(User, on_delete=models.SET_NULL, null=True, blank=True)
    order = models.ForeignKey(CartOrder, on_delete=models.SET_NULL, null=True, blank=True)
    order_item = models.ForeignKey(CartOrderItem, on_delete=models.SET_NULL, null=True, blank=True)
    seen = models.BooleanField(default=False)
    date = models.DateTimeField(auto_now_add=True)
    
    class Meta:
        verbose_name_plural = "Notification"
    
    def __str__(self):
        if self.order:
            return self.order.oid
        else:
            return f"Notification - {self.id}"


class Coupon(models.Model):
    used_by = models.ManyToManyField(User, blank=True)
    code = models.CharField(max_length=1000)
    discount = models.IntegerField(default=1)
    date = models.DateTimeField(auto_now_add=True)
    active = models.BooleanField(default=True)

    cid = ShortUUIDField(length=10, max_length=25, alphabet="abcdefghijklmnopqrstuvxyz")
    
    # def save(self, *args, **kwargs):
    #     new_discount = int(self.discount) / 100
    #     self.get_percent = new_discount
    #     super(Coupon, self).save(*args, **kwargs) 
    
    def __str__(self):
        return self.code
    
