from django.contrib import admin
from .models import Post, Comment , Order ,ContactMessage 

# In dono ko register karne se ye Admin Panel mein dikhne lagenge
admin.site.register(Post)
admin.site.register(Comment)



@admin.register(Order)
class OrderAdmin(admin.ModelAdmin):
    # Admin table mein kaunse columns dikhne chahiye
    list_display = ('customer_name', 'customer_phone', 'created_at')
    # Name ya Phone se search karne ka option
    search_fields = ('customer_name', 'customer_phone')
    


@admin.register(ContactMessage)
class ContactMessageAdmin(admin.ModelAdmin):
    list_display = ('name', 'phone', 'created_at')
    search_fields = ('name', 'phone')