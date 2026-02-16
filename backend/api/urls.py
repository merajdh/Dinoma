from django.urls import path
from userauths import views as userauths_views
from store import views as store_views 


from rest_framework_simplejwt.views import TokenRefreshView
urlpatterns = [
    path('user/token/' , userauths_views.MyTokenObtainView.as_view() , name="token_obtain_pair"),
    path('user/token/refresh/' , TokenRefreshView.as_view(), name="refresh_token"),
    path('user/register/' , userauths_views.RegisterView.as_view() , name="register"),
    path('user/password-reset/<email>/' , userauths_views.PasswordEmailVerify.as_view(), name="password_reset"),
    path('user/password-change/' , userauths_views.PasswordChangeView.as_view() , name="password_change"),
    path("user/verify-otp/", userauths_views.VerifyOTPView.as_view(), name="verify-otp"),

    #store endpoint 
    path("audience/" , store_views.AudienceListAPIView.as_view()),
    path("clothing-type/" , store_views.ClothingTypeListAPIView.as_view() ),
    path("clothing-type/<int:type_id>/products/",store_views.ProductByClothingTypeAPIView.as_view(),),
    path("featured-products/" , store_views.FeaturedProductListView.as_view() ),
    path("product/" , store_views.ProductListAPIView.as_view() ),
    path("product/<slug>" , store_views.ProductDetailListAPIView.as_view() ),
    path("cart-view/" , store_views.CartAPIView.as_view() ),
    path("cart-list/<str:cart_id>/<int:user_id>/" , store_views.CartListView.as_view()  ),
    path("cart-list/<str:cart_id>/" , store_views.CartListView.as_view()  ),
    path('cart-detail/<str:cart_id>/', store_views.CartDetailView.as_view(), name='cart-detail'),
    path('cart-detail/<str:cart_id>/<int:user_id>/', store_views.CartDetailView.as_view(), name='cart-detail'),
    path('cart-delete/<str:cart_id>/<int:item_id>/', store_views.CartItemDeleteView.as_view(), name='cart-delete'),
    path('create-order/', store_views.CreateOrderView.as_view(), name='cart-delete'),
    path('cart-delete/<str:cart_id>/<int:item_id>/<int:user_id>/', store_views.CartItemDeleteView.as_view(), name='cart-delete'),
    path('create-order/', store_views.CreateOrderView.as_view(), name='cart-delete'),
    path('checkout/<order_oid>/', store_views.CheckoutView.as_view(), name='checkout'),
]

