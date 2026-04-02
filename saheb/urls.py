from django.urls import path
from .views import  index  , upload_post , delete_post ,toggle_like ,add_comment ,save_order , submit_contact
from .views import create_razorpay_order , verify_payment
urlpatterns = [
   
    path ("" ,index , name='index') ,
    path('upload-post/', upload_post, name='upload_post'),
    path('delete-post/<int:post_id>/', delete_post, name='delete_post'),
    path('like-post/<int:post_id>/', toggle_like, name='toggle_like'),
    path('add-comment/<int:post_id>/', add_comment, name='add_comment'),
    path('save-order/', save_order, name='save_order'),
    path('submit-contact/', submit_contact, name='submit_contact'),
    path('create-razorpay-order/', create_razorpay_order, name='create_razorpay_order'),
    path('verify-payment/', verify_payment, name='verify_payment'),
]
