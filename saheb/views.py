from django.shortcuts import render, get_object_or_404
from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt
from .models import Post, Comment, ContactMessage, Order
import json

def index(request):
    # 1. Fetch all real posts from the database (newest first)
    db_posts = Post.objects.all().order_by('-created_at')
    # 2. Pass them to the template
    return render(request, 'index.html', {'db_posts': db_posts})

# We use csrf_exempt just to make testing easy for now.
@csrf_exempt 
def upload_post(request):
    if request.method == 'POST':
        # Grab the data sent from your JavaScript
        caption = request.POST.get('caption', '')
        media_file = request.FILES.get('media')

        if media_file:
            # Save it directly to the database!
            new_post = Post.objects.create(caption=caption, media=media_file)
            return JsonResponse({'status': 'success', 'message': 'Saved perfectly!'})
        else:
            return JsonResponse({'status': 'error', 'message': 'Media is required.'}, status=400)
            
    return JsonResponse({'status': 'error', 'message': 'Invalid request.'}, status=400)

@csrf_exempt
def delete_post(request, post_id):
    if request.method == 'POST':
        post = get_object_or_404(Post, id=post_id)
        post.delete()
        return JsonResponse({'status': 'success'})
    return JsonResponse({'status': 'error'}, status=400)

# likes and comments 
def toggle_like(request, post_id):
    post = get_object_or_404(Post, id=post_id)
    
    # Session mein ek dictionary banayenge likes track karne ke liye
    liked_posts = request.session.get('liked_posts', {})
    str_post_id = str(post_id) # Session keys string hoti hain

    # Agar pehle se like kiya hai -> Toh Unlike karo (Remove)
    if str_post_id in liked_posts:
        if post.likes_count > 0:
            post.likes_count -= 1
        del liked_posts[str_post_id] # Session se nikal do
        liked = False
    
    # Agar like NAHI kiya hai -> Toh Like karo (Add)
    else:
        post.likes_count += 1
        liked_posts[str_post_id] = True # Session mein save kar lo
        liked = True

    post.save()
    request.session['liked_posts'] = liked_posts # Session update karo

    # Frontend ko naya count aur status bhej do
    return JsonResponse({
        'likes': post.likes_count, 
        'liked': liked
    })

def add_comment(request, post_id):
    if request.method == 'POST':
        text = request.POST.get('comment_text')
        post = Post.objects.get(id=post_id)
        Comment.objects.create(post=post, text=text)
        return JsonResponse({'status': 'success'})
    
# data saving from FORM
@csrf_exempt 
def save_order(request):
    if request.method == 'POST':
        try:
            # JS se aaya hua JSON data load karo
            data = json.loads(request.body)
            name = data.get('name')
            phone = data.get('phone')

            if name and phone:
                # Database mein save karo
                new_order = Order.objects.create(
                    customer_name=name,
                    customer_phone=phone
                )
                return JsonResponse({'status': 'success', 'message': 'Order saved!'})
            else:
                return JsonResponse({'status': 'error', 'message': 'Missing data'}, status=400)
        except Exception as e:
            return JsonResponse({'status': 'error', 'message': str(e)}, status=500)
    
    return JsonResponse({'status': 'error', 'message': 'Invalid request'}, status=405)

def submit_contact(request):
    if request.method == 'POST':
        try:
            data = json.loads(request.body)
            name = data.get('name')
            phone = data.get('phone')
            message = data.get('message')

            if name and phone and message:
                ContactMessage.objects.create(
                    name=name,
                    phone=phone,
                    message=message
                )
                return JsonResponse({'status': 'success', 'message': 'Message sent successfully!'})
            else:
                return JsonResponse({'status': 'error', 'message': 'All fields are required'}, status=400)
        except Exception as e:
            return JsonResponse({'status': 'error', 'message': str(e)}, status=500)
            
    return JsonResponse({'status': 'error', 'message': 'Invalid request'}, status=405)