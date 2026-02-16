from django.db import models
from userauths.models import User, Profile,user_directory_path
from django.utils.text import slugify
from django.utils.html import mark_safe
from django.utils import timezone
from django.dispatch import receiver    
from django.db.models.signals import post_save
from shortuuid.django_fields import ShortUUIDField

import shortuuid
# Create your models here.


STATUS_CHOICE = (
    ("processing", "Processing"),
    ("shipped", "Shipped"),
    ("delivered", "Delivered"),
)


STATUS = (
    ("draft", "Draft"),
    ("disabled", "Disabled"),
    ("rejected", "Rejected"),
    ("in_review", "In Review"),
    ("published", "Published"),
)


PAYMENT_STATUS = (
    ("paid", "Paid"),
    ("pending", "Pending"),
    ("processing", "Processing"),
    ("cancelled", "Cancelled"),
    ("initiated", 'Initiated'),
    ("failed", 'failed'),
    ("refunding", 'refunding'),
    ("refunded", 'refunded'),
    ("unpaid", 'unpaid'),
    ("expired", 'expired'),
)


ORDER_STATUS = (
    ("Pending", "Pending"),
    ("Fulfilled", "Fulfilled"),
    ("Partially Fulfilled", "Partially Fulfilled"),
    ("Cancelled", "Cancelled"),
    
)


DELIVERY_STATUS = (
    ("On Hold", "On Hold"),
    ("Shipping Processing", "Shipping Processing"),
    ("Shipped", "Shipped"),
    ("Arrived", "Arrived"),
    ("Delivered", "Delivered"),
    ("Returning", 'Returning'),
    ("Returned", 'Returned'),
)


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
    orders = models.PositiveIntegerField(default=0, null=True, blank=True)
    saved = models.PositiveIntegerField(default=0, null=True, blank=True)
    special_offer = models.BooleanField(default=False)
    featured = models.BooleanField(default=False)
    views = models.PositiveIntegerField(default=0)
    rating = models.IntegerField(default=0, blank=True , null=True)
    pid = ShortUUIDField(
        unique=True,
        length=10,
        max_length=12,
        alphabet="abcdefgh"
    )
    sku = ShortUUIDField(
        unique=True,
        length=5,
        max_length=50,
        alphabet="1234567890",
        prefix="SKU",
    )
    slug = models.SlugField(unique=True ,null=True , blank=True, allow_unicode=True)
    date = models.DateTimeField(default=timezone.now)

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
        


    class Meta:
        ordering = ['-id']
        verbose_name_plural = "Products"
    def product_image(self):
        return mark_safe('<img src="%s" width="50" height="50" style="object-fit:cover; border-radius: 6px;" />' % (self.image.url))

    def __str__(self):
        return self.title
    
    def category_count(self):
        return Product.objects.filter(category__in=self.category).count()

    def get_percentage(self):
        new_price = ((self.old_price - self.price) / self.old_price) * 100
        return round(new_price, 0)
    

    def order_count(self):
        order_count = CartOrderItem.objects.filter(product=self, order__payment_status="paid").count()
        return order_count

    def frequently_bought_together(self):
        frequently_bought_together_products = Product.objects.filter(order_item__order__in=CartOrder.objects.filter(orderitem__product=self)).exclude(id=self.id).annotate(count=models.Count('id')).order_by('-id')[:3]
        return frequently_bought_together_products
    
    def save(self, *args, **kwargs):
        if self.slug == "" or self.slug is None:
            uuid_key = shortuuid.uuid()
            uniqueid = uuid_key[:4]
            self.slug = slugify(self.title) + "-" + str(uniqueid.lower())
        
        if self.stock_qty is not None:
            if self.stock_qty == 0:
                self.in_stock = False
                
            if self.stock_qty > 0:
                self.in_stock = True
        else:
            self.stock_qty = 0
            self.in_stock = False
        
        super(Product, self).save(*args, **kwargs)

        try:
            avg = Review.objects.filter(product=self).aggregate(avg_rating=models.Avg("rating"))['avg_rating']
            avg = avg or 0
        except Exception:
            avg = 0

        if self.rating != avg:
            Product.objects.filter(pk=self.pk).update(rating=avg)
            self.rating = avg



class Gallery (models.Model):
    product = models.ForeignKey(Product , on_delete=models.CASCADE)
    image = models.FileField(upload_to=user_directory_path, default="/gallery.jpg")      
    active = models.BooleanField(default=True)
    date = models.DateField(auto_now_add=True)
    gid = models.CharField(max_length=20, unique=True, editable=False)

    def save(self, *args, **kwargs):
        if not self.gid:
            last = Gallery.objects.order_by('-id').first()
            last_id = last.id + 1 if last else 1
            self.gid = f"G-{last_id:04d}"
        super().save(*args, **kwargs)
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
    color_text = models.CharField(max_length=100 , null=True , blank=True ,default="#ffffff")

    def __str__(self):
        return self.name

class Cart(models.Model):
    product = models.ForeignKey(Product , on_delete=models.CASCADE)
    user = models.ForeignKey(User , on_delete=models.SET_NULL , null=True , blank=True)
    qty = models.PositiveIntegerField(default=0)
    price = models.DecimalField(max_digits=15,decimal_places=0 ,default=0)
    sub_total = models.DecimalField(max_digits=15,decimal_places=0 ,default=0)
    shipping_amount = models.DecimalField(decimal_places=2, max_digits=12, default=0.00, null=True, blank=True)
    total = models.DecimalField(max_digits=15,decimal_places=0 ,default=0)
    city = models.CharField(max_length=100 ,null=True , blank=True)
    size = models.CharField(max_length=100 ,null=True , blank=True)
    color = models.CharField(max_length=100 ,null=True , blank=True)
    cart_id = models.CharField(max_length=1000 ,null=True , blank=True)
    date = models.DateField(auto_now_add=True)
    def __str__(self):
        return f"{self.cart_id} - {self.product.title}"


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
    rating = models.IntegerField(default=None , choices=RATING , null=True , blank=True)
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
        

class CartOrder(models.Model):
    buyer = models.ForeignKey(User, on_delete=models.SET_NULL, null=True, related_name="buyer", blank=True)
    sub_total = models.DecimalField(default=0.00, max_digits=12, decimal_places=2)
    shipping_amount = models.DecimalField(default=0.00, max_digits=12, decimal_places=2)
    total = models.DecimalField(default=0.00, max_digits=12, decimal_places=2)
    payment_status = models.CharField(max_length=100, choices=PAYMENT_STATUS, default="initiated")
    order_status = models.CharField(max_length=100, choices=ORDER_STATUS, default="pending")
    
    
    # Discounts
    initial_total = models.DecimalField(default=0, max_digits=12, decimal_places=2, help_text="The original total before discounts")
    saved = models.DecimalField(max_digits=12, decimal_places=2, default=0, null=True, blank=True, help_text="Amount saved by customer")
    
    # Personal Informations
    full_name = models.CharField(max_length=1000)
    email = models.CharField(max_length=1000)
    mobile = models.CharField(max_length=1000)
    
     # Shipping Address
    address = models.CharField(max_length=1000, null=True, blank=True)
    city = models.CharField(max_length=1000, null=True, blank=True)
    state = models.CharField(max_length=1000, null=True, blank=True)
    
    # stripe_session_id = models.CharField(max_length=200,null=True, blank=True)
    oid = ShortUUIDField(length=10, max_length=25, alphabet="abcdefghijklmnopqrstuvxyz")
    date = models.DateTimeField(default=timezone.now)
    
    class Meta:
        ordering = ["-date"]
        verbose_name_plural = "Cart Order"

    def __str__(self):
        return self.oid

    def get_order_items(self):
        return CartOrderItem.objects.filter(order=self)
    

class CartOrderItem(models.Model):
    order = models.ForeignKey(CartOrder, on_delete=models.CASCADE, related_name="order_item")
    product = models.ForeignKey(Product, on_delete=models.CASCADE, related_name="order_item")
    qty = models.IntegerField(default=0)
    color = models.CharField(max_length=100, null=True, blank=True)
    size = models.CharField(max_length=100, null=True, blank=True)
    price = models.DecimalField(max_digits=12, decimal_places=0, default=0)
    sub_total = models.DecimalField(max_digits=12, decimal_places=0, default=0, help_text="Total of Product price * Product Qty")
    shipping_amount = models.DecimalField(max_digits=12, decimal_places=0, default=0, help_text="Estimated Shipping Fee = shipping_fee * total")
    total = models.DecimalField(max_digits=12, decimal_places=0, default=0, help_text="Grand Total of all amount listed above")
    expected_delivery_date_from = models.DateField(auto_now_add=False, null=True, blank=True)
    expected_delivery_date_to = models.DateField(auto_now_add=False, null=True, blank=True)


    initial_total = models.DecimalField(max_digits=12, decimal_places=0, default=0, help_text="Grand Total of all amount listed above before discount")
    saved = models.DecimalField(max_digits=12, decimal_places=0, default=0, null=True, blank=True, help_text="Amount saved by customer")
    
    # Order stages
    order_placed = models.BooleanField(default=False)
    processing_order = models.BooleanField(default=False)
    quality_check = models.BooleanField(default=False)
    product_shipped = models.BooleanField(default=False)
    product_arrived = models.BooleanField(default=False)
    product_delivered = models.BooleanField(default=False)


    oid = ShortUUIDField(length=10, max_length=25, alphabet="abcdefghijklmnopqrstuvxyz")
    date = models.DateTimeField(default=timezone.now)
    
    class Meta:
        verbose_name_plural = "Cart Order Item"
        ordering = ["-date"]
        
    def order_img(self):
        return mark_safe('<img src="%s" width="50" height="50" style="object-fit:cover; border-radius: 6px;" />' % (self.product.image.url))
   
    def order_id(self):
        return f"Order ID #{self.order.oid}"
    
    def __str__(self):
        return self.oid

