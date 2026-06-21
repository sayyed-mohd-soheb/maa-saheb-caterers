from cloudinary_storage.storage import MediaCloudinaryStorage
import cloudinary.utils
import os

class AutoMediaCloudinaryStorage(MediaCloudinaryStorage):
    # 1. Upload karte waqt Cloudinary ko bolo dono (Photo/Video) accept kare
    RESOURCE_TYPE = 'auto'

    # 2. Database mein save karne se pehle Extension wapas jodo
    def _save(self, name, content):
        # Cloudinary par upload hone do aur uska Public ID aane do
        public_id = super()._save(name, content)
        
        # Original upload kiye gaye naam se extension nikalo (jaise .mp4 ya .jpg)
        _, ext = os.path.splitext(name)
        
        # Public ID ke aage extension jod kar Django Database mein save karo
        return f"{public_id}{ext}"

    # 3. Browser ke liye Sahi URL generate karo
    def url(self, name):
        # Ab DB mein hamesha .mp4 ya .jpg hoga, toh yeh check makkhan chalega
        if name.lower().endswith(('.mp4', '.mov', '.avi', '.webm', '.mkv', '.flv')):
            res_type = 'video'
        else:
            res_type = 'image'
            
        return cloudinary.utils.cloudinary_url(name, resource_type=res_type, secure=True)[0]