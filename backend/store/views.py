from django.shortcuts import get_object_or_404, redirect, render
from store.models import Product , Audience , ClothingType  ,Cart , CartOrder , CartOrderItem
from store.serializer import ProductSerializer , AudienceSerializer , ClothingTypeSerializer ,CartSerializer , CartOrderItemSerializer , CartOrderSerializer
from rest_framework import generics
from django.db import transaction

from rest_framework.permissions import AllowAny , IsAuthenticated
from userauths.models import User
from django.db.models import Q
from decimal import Decimal
from rest_framework.response import Response
from rest_framework import status
class AudienceListAPIView(generics.ListAPIView):
    queryset = Audience.objects.all()
    serializer_class = AudienceSerializer
    permission_classes = [AllowAny]


class ClothingTypeListAPIView(generics.ListAPIView):
    queryset = ClothingType.objects.all()
    serializer_class = ClothingTypeSerializer
    permission_classes = [AllowAny]

class ProductByClothingTypeAPIView(generics.ListAPIView):
    serializer_class = ProductSerializer
    def get_queryset(self):
        type_id = self.kwargs["type_id"]
        return Product.objects.filter(clothing_type_id=type_id)
class FeaturedProductListView(generics.ListAPIView):
    serializer_class = ProductSerializer
    queryset = Product.objects.filter(status="published", special_offer=True).order_by('-id')[:1]
    permission_classes = (AllowAny,)
class ProductListAPIView(generics.ListAPIView):
    queryset = Product.objects.all()
    serializer_class = ProductSerializer
    permission_classes = [AllowAny]


class ProductDetailListAPIView(generics.RetrieveAPIView):
    serializer_class = ProductSerializer
    permission_classes = [AllowAny]
    def get_object(self):
        slug = self.kwargs['slug']
        return Product.objects.get(slug = slug)



class CartAPIView(generics.ListCreateAPIView):
    queryset = Cart.objects.all()
    serializer_class = CartSerializer
    permission_classes = [AllowAny,]
    def create(self , request  , *args , **kwargs):
        payload = request.data

        product_id = payload['product_id']
        user_id = payload['user_id']
        qty = payload['qty']
        price = payload['price']
        shipping_amount = payload['shipping_amount']
        city = payload['city']
        cart_id = payload['cart_id']
        size = payload['size']
        color = payload['color']

        product = Product.objects.get(id = product_id)
        if user_id != "undefined":
            user = User.objects.filter(id=user_id).first()
        else: 
            user = None

        
        cart = Cart.objects.filter(cart_id=cart_id, product=product).first()
        if cart : 
            cart.product = product 
            cart.user = user
            cart.qty = qty
            cart.price = price
            cart.sub_total = Decimal(price) * int(qty)
            cart.shipping_amount = shipping_amount
            cart.color = color
            cart.size = size
            cart.city = city
            cart.cart_id = cart_id

            cart.total = Decimal(cart.sub_total) + Decimal(cart.shipping_amount)
            cart.save()
            return Response({'message' : "سبد خرید با موفقیت بروزرسانی شد"} , status=status.HTTP_200_OK)
        else:
            cart = Cart()
            cart.product = product 
            cart.user = user
            cart.qty = qty
            cart.price = price
            cart.sub_total = Decimal(price) * int(qty)
            cart.shipping_amount = Decimal(shipping_amount) 
            cart.color = color
            cart.size = size
            cart.city = city
            cart.cart_id = cart_id

            cart.total = Decimal(cart.sub_total) + Decimal(cart.shipping_amount)
            cart.save()
            return Response({'message' : "سبد خرید با موفقیت اضافه شد"} , status=status.HTTP_201_CREATED)
        

class CartListView(generics.ListAPIView):
    serializer_class = CartSerializer
    permission_classes = (AllowAny,)

    def get_queryset(self):
        cart_id = self.kwargs['cart_id']
        user_id = self.kwargs.get('user_id')  

        
        if user_id is not None:
            user = User.objects.get(id=user_id)
            queryset = Cart.objects.filter(Q(user=user, cart_id=cart_id) | Q(user=user))
        else:
            queryset = Cart.objects.filter(cart_id=cart_id)
        
        return queryset
class CartTotalView(generics.ListAPIView):
    serializer_class = CartSerializer
    permission_classes = (AllowAny,)

    def get_queryset(self):
        cart_id = self.kwargs['cart_id']
        user_id = self.kwargs.get('user_id') 
        
        if user_id is not None:
            user = User.objects.get(id=user_id)
            queryset = Cart.objects.filter(cart_id=cart_id, user=user)
        else:
            queryset = Cart.objects.filter(cart_id=cart_id)
        
        return queryset
class CartDetailView(generics.RetrieveAPIView):
    serializer_class = CartSerializer
    lookup_field = 'cart_id'

    permission_classes = (AllowAny,)


    def get_queryset(self):
        cart_id = self.kwargs['cart_id']
        user_id = self.kwargs.get('user_id')  

        if user_id is not None:
            
            user = User.objects.get(id=user_id)
            queryset = Cart.objects.filter(cart_id=cart_id, user=user)
        else:
            queryset = Cart.objects.filter(cart_id=cart_id)

        return queryset

    def get(self, request, *args, **kwargs):
        queryset = self.get_queryset()

        total_shipping = 0
        total_sub_total = 0
        total_total = 0

        for cart_item in queryset:
            total_shipping += float(self.calculate_shipping(cart_item))
            total_sub_total += float(self.calculate_sub_total(cart_item))
            total_total += float(self.calculate_total(cart_item))

        data = {
            'shipping': total_shipping,
            'sub_total': total_sub_total,
            'total': total_total,
        }

        return Response(data)
    
    def calculate_shipping(self, cart_item):
        return cart_item.shipping_amount


    def calculate_sub_total(self, cart_item):
        return cart_item.sub_total

    def calculate_total(self, cart_item):
        return cart_item.total
    


class CartItemDeleteView(generics.DestroyAPIView):
    serializer_class = CartSerializer
    lookup_field = 'cart_id'  

    def get_object(self):
        cart_id = self.kwargs['cart_id']
        item_id = self.kwargs['item_id']
        user_id = self.kwargs.get('user_id')

        if user_id is not None:
            user = get_object_or_404(User, id=user_id)
            cart = get_object_or_404(Cart, cart_id=cart_id, id=item_id, user=user)
        else:
            cart = get_object_or_404(Cart, cart_id=cart_id, id=item_id)

        return cart
    



class CreateOrderView(generics.CreateAPIView):
    serializer_class = CartOrderSerializer
    queryset = CartOrder.objects.all()
    permission_classes = (AllowAny,)

    def create(self, request, *args, **kwargs):
        payload = request.data

        full_name = payload['full_name']
        email = payload['email']
        mobile = payload['mobile']
        address = payload['address']
        city = payload['city']
        state = payload['state']
        cart_id = payload['cart_id']
        user_id = payload['user_id']


        if user_id != 0:
            user = User.objects.filter(id=user_id).first()
        else:
            user = None

        cart_items = Cart.objects.filter(cart_id=cart_id)

        total_shipping = Decimal(0)
        total_sub_total = Decimal(0)
        total_initial_total = Decimal(0)
        total_total = Decimal(0)

        with transaction.atomic():

            order = CartOrder.objects.create(
                # sub_total=total_sub_total,
                # shipping_amount=total_shipping,
                # tax_fee=total_tax,
                # service_fee=total_service_fee,
                buyer=user,
                payment_status="Fulfilled",
                full_name=full_name,
                email=email,
                mobile=mobile,
                address=address,
                city=city,
                state=state,
            )

            for c in cart_items:
                CartOrderItem.objects.create(
                    order=order,
                    product=c.product,
                    qty=c.qty,
                    color=c.color,
                    size=c.size,
                    price=c.price,
                    sub_total=c.sub_total,
                    shipping_amount=c.shipping_amount,
                    total=c.total,
                    initial_total=c.total,
                )

                total_shipping += Decimal(c.shipping_amount)
                total_sub_total += Decimal(c.sub_total)
                total_initial_total += Decimal(c.total)
                total_total += Decimal(c.total)


                

            order.sub_total=total_sub_total
            order.shipping_amount=total_shipping
            order.total=total_total

            
            order.save()

        return Response( {"message": "Order Created Successfully", 'order_oid':order.oid}, status=status.HTTP_201_CREATED)




class CheckoutView(generics.RetrieveAPIView):
    serializer_class = CartOrderSerializer
    lookup_field = 'order_oid'  

    def get_object(self):
        order_oid = self.kwargs['order_oid']
        cart = get_object_or_404(CartOrder, oid=order_oid)
        return cart
    


class CreateOrderView(generics.CreateAPIView):
    serializer_class = CartOrderSerializer
    queryset = CartOrder.objects.all()
    permission_classes = (AllowAny,)

    def create(self, request, *args, **kwargs):
        payload = request.data

        full_name = payload['full_name']
        email = payload['email']
        mobile = payload['mobile']
        address = payload['address']
        city = payload['city']
        state = payload['state']
        cart_id = payload['cart_id']
        user_id = payload['user_id']

        print("user_id ===============", user_id)

        if user_id != 0:
            user = User.objects.filter(id=user_id).first()
        else:
            user = None

        cart_items = Cart.objects.filter(cart_id=cart_id)

        total_shipping = Decimal(0.0)
        total_sub_total = Decimal(0.0)
        total_initial_total = Decimal(0.0)
        total_total = Decimal(0.0)

        with transaction.atomic():

            order = CartOrder.objects.create(
                buyer=user,
                payment_status="processing",
                full_name=full_name,
                email=email,
                mobile=mobile,
                address=address,
                city=city,
                state=state,
            )

            for c in cart_items:
                CartOrderItem.objects.create(
                    order=order,
                    product=c.product,
                    qty=c.qty,
                    color=c.color,
                    size=c.size,
                    price=c.price,
                    sub_total=c.sub_total,
                    shipping_amount=c.shipping_amount,
                    total=c.total,
                    initial_total=c.total,
                )

                total_shipping += Decimal(c.shipping_amount)
                total_sub_total += Decimal(c.sub_total)
                total_initial_total += Decimal(c.total)
                total_total += Decimal(c.total)


                

            order.sub_total=total_sub_total
            order.shipping_amount=total_shipping
            order.initial_total=total_initial_total
            order.total=total_total

            
            order.save()

        return Response( {"message": "Order Created Successfully", 'order_oid':order.oid}, status=status.HTTP_201_CREATED)

