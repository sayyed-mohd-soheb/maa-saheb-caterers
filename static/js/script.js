/* ==========================================================================
   1. SECURITY & UTILITIES (Django CSRF & Modals)
   ========================================================================== */
function getCookie(name) {
    let cookieValue = null;
    if (document.cookie && document.cookie !== '') {
        const cookies = document.cookie.split(';');
        for (let i = 0; i < cookies.length; i++) {
            const cookie = cookies[i].trim();
            if (cookie.substring(0, name.length + 1) === (name + '=')) {
                cookieValue = decodeURIComponent(cookie.substring(name.length + 1));
                break;
            }
        }
    }
    return cookieValue;
}

function showSection(id, btn) {
    document.querySelectorAll('.section').forEach(s => s.classList.remove('active'));
    document.querySelectorAll('.nav-item').forEach(b => b.classList.remove('active'));
    document.getElementById(id).classList.add('active');
    btn.classList.add('active');
    document.getElementById('fabBtn').style.display = id === 'home' ? 'flex' : 'none';
    window.scrollTo({ top: 0, behavior: 'smooth' });
}

function close_(id) { document.getElementById(id).classList.remove('open'); }
function bgClose(e, id, cb) { if (e.target === document.getElementById(id)) { close_(id); if (cb) cb(); } }
function qrBgClose(e) { bgClose(e, 'qrOverlay', null); }

/* ==========================================================================
   2. DATA & STATE VARIABLES
   ========================================================================== */
const menuData = [
    { cat: '🍚 SECTION I {Per packets Orders}', items: [
        { name: 'Veg Pulav', desc: 'Basmati rice cooked with fresh vegetables and mild spices', price: '₹40/Packet', img: '/static/images/veg2.jpg' },
        { name: 'veg Pulav + Water', desc: 'Basmati rice cooked with fresh vegetables and mild spices', price: '₹50/Packet', img: 'static/images/veg1.jpg' },
        { name: 'Chicken Pulav', desc: 'Tender chicken pieces cooked with fragrant basmati rice and mild spices', price: '₹60/Packet', img: 'static/images/chic2.jpg' },
        { name: 'Chicken Pulav + Water', desc: 'Tender chicken pieces cooked with fragrant basmati rice and mild spices', price: '₹70/Packet', img: 'static/images/chic1.jpg' },
    ]},
    { cat: '🍗 SECTION II {BULK ORDERS}   - (Kindly order  one day before)  ', items: [
        { name: 'Meal Box  {50 Boxes} ', desc: 'Complete Meal', price: '₹5000', img: 'static/images/meal.jpg' },
        { name: 'Channa {10KG}', desc: 'Spicy Chickpeas', price: '₹3000', img: 'static/images/channa.jpg' },
        { name: 'Juice  {100 Glasses}', desc: 'Fresh Refreshment', price: '₹2500', img: 'static/images/juice.jpg' },
        { name: 'Halwa  {10KG}', desc: 'Sweet Delight', price: '₹3500', img: 'static/images/halwa.jpg' },
    ]},        
    { cat: '🥗 SECTION III {BULK ORDERS}  -  (Kindly order  one day before)  ', items: [
        { name: 'Veg Pulav {6KG} ', desc: 'Basmati rice cooked with fresh vegetables and mild spices', price: '₹3700', img: 'static/images/VEG6kg.jpg' },
        { name: 'Mutton Pulav {6KG}', desc: 'Slow-cooked tender mutton with aromatic basmati rice and traditional spices', price: '₹8100', img: 'static/images/MUTTON6kg.jpg' },
        { name: 'Chicken Pulav {6KG}', desc: 'Tender chicken pieces cooked with fragrant basmati rice and mild spices', price: '₹4500', img: 'static/images/CHICKEN6kg.jpg' },
        { name: 'Beef Pulav {6KG}', desc: 'Tender beef chunks slow-cooked with fragrant basmati rice and rich spices.', price: '₹5500', img: 'static/images/BEEF6kg.jpg' },
    ]}
];

let shareCaption = '', shareImg = '';
let currentOrder = {};

/* ==========================================================================
   3. SOCIAL FEED LOGIC (Posts, Delete, Likes)
   ========================================================================== */
function buildFeed() {
    const container = document.getElementById('feedContainer');
    if (!container) return;

    container.innerHTML = posts.map((p, idx) => {
        const mediaHTML = p.isVideo 
            ? `<video src="${p.url}" loop class="feed-video" id="video_${p.id}" style="width: 100%; max-height: 550px; object-fit: contain; display: block; margin: 0 auto;"></video>`
            : `<img src="${p.url}" alt="food" loading="lazy" style="width: 100%; max-height: 550px; object-fit: contain; display: block; margin: 0 auto;"/>`;

        return `
        <div class="post-card" style="animation-delay:${idx * .07}s">
            <div class="post-header">
                <div class="post-avatar">🍛</div>
                <div class="post-meta">
                    <div class="uname">Maa-Saheb Caterers</div>
                    <div class="utime">${p.time}</div>
                </div>
                <button class="post-more" onclick="deletePost(${p.id})">🗑️</button>
            </div>

            <div class="post-media" ondblclick="dtLike(${p.id})" style="width: 100%; height: auto; background: transparent; display: flex; justify-content: center; align-items: center;">
                ${mediaHTML}
                <div class="heart-burst" id="hb${p.id}">❤️</div>
            </div>

            <div class="post-actions" style="display: flex; gap: 15px; align-items: center; justify-content: flex-start; width: max-content; padding: 10px 0;">
                <button class="action-btn${p.liked ? ' liked' : ''}" id="lb${p.id}" onclick="toggleLike(${p.id})" style="display: flex; align-items: center; gap: 5px;">
                    <svg viewBox="0 0 24 24" width="22" height="22" fill="${p.liked ? 'currentColor' : 'none'}" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                        <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/>
                    </svg>
                    <span id="lc${p.id}">${p.likes}</span>
                </button>

                <button class="action-btn" onclick="openComments(${p.id})" style="display: flex; align-items: center; gap: 5px;">
                    <svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                        <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/>
                    </svg>
                    <span>${p.comments}</span>
                </button>

                <button class="action-btn share-btn" onclick="openShare('${encodeURIComponent(p.caption)}','${p.url}')" style="display: flex; align-items: center; gap: 6px;">
                    <svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                        <line x1="22" y1="2" x2="11" y2="13"/><polygon points="22 2 15 22 11 13 2 9 22 2"/>
                    </svg>
                    <span style="font-weight: 600; font-size: 0.9rem;">Share</span>
                </button>
            </div>

            <div class="post-caption">
                <span class="uname2">Maa-Saheb Caterers</span>
                <span class="captext">${p.caption}</span>
            </div>
        </div>`;
    }).join('');
}

async function deletePost(postId) {
    if (!confirm("Are you sure you want to delete this post?")) return;
    try {
        const response = await fetch(`/delete-post/${postId}/`, {
            method: 'POST',
            headers: { 'X-CSRFToken': getCookie('csrftoken') }
        });
        if (response.ok) {
            posts = posts.filter(p => p.id !== postId);
            buildFeed(); 
        }
    } catch (err) { console.error("Delete failed", err); }
}

// script.js mein purane toggleLike ko isse replace karein  , done 

function toggleLike(id) {
    fetch(`/like-post/${id}/`)
    .then(res => res.json())
    .then(data => {
        // 1. Like count update karo
        document.getElementById(`lc${id}`).innerText = data.likes;
        
        // 2. Button aur SVG pakdo
        const btn = document.getElementById(`lb${id}`);
        const svg = btn.querySelector('svg');
        
        // 3. Agar backend ne 'liked: true' bheja hai toh Laal (Red) kardo
        if (data.liked) {
            btn.classList.add('liked');
            svg.setAttribute('fill', 'currentColor'); // Pura red
        } 
        // 4. Agar 'liked: false' bheja hai toh Khali (Outline) kardo
        else {
            btn.classList.remove('liked');
            svg.setAttribute('fill', 'none'); // Sirf outline
        }
        
        // Array mein bhi state update kar do taaki double click chalte rahe
        const p = posts.find(x => x.id === id);
        if (p) {
            p.liked = data.liked;
            p.likes = data.likes;
        }
    });
}
/* ==========================================================================
   4. COMMENTS LOGIC
   ========================================================================== */
function openComments(postId) {
    const idField = document.getElementById('currentPostId');
    if (idField) idField.value = postId;

    const post = posts.find(p => p.id === postId);
    const listDiv = document.getElementById('commentsList');
    
    if (post && post.comments_list && post.comments_list.length > 0) {
        listDiv.innerHTML = post.comments_list.map(c => `
            <div style="margin-bottom: 12px; border-bottom: 1px solid #f0f0f0; padding-bottom: 8px; text-align: left;">
                <span style="font-weight: 700; font-size: 0.85rem; color: #C1121F;">Guest</span>
                <span style="font-size: 0.7rem; color: #8A6A52; margin-left: 5px;">${c.time}</span>
                <p style="font-size: 0.85rem; margin-top: 3px; color: #1A0A00;">${c.text}</p>
            </div>
        `).join('');
    } else {
        listDiv.innerHTML = '<p style="color:var(--muted); text-align:center;">No comments yet. Be the first! 🍛</p>';
    }

    const overlay = document.getElementById('commentOverlay');
    if (overlay) overlay.classList.add('open');

    setTimeout(() => {
        const input = document.getElementById('modalCommentInput');
        if (input) input.focus();
    }, 300);
}

function submitModalComment() {
    const postId = document.getElementById('currentPostId').value;
    const textInput = document.getElementById('modalCommentInput');
    const text = textInput.value.trim();
    if(!text) return;

    let formData = new FormData();
    formData.append('comment_text', text);
    const csrftoken = getCookie('csrftoken'); 

    fetch(`/add-comment/${postId}/`, {
        method: 'POST',
        body: formData,
        headers: { 'X-CSRFToken': csrftoken }
    })
    .then(res => res.json())
    .then(data => {
        if(data.status === 'success') {
            textInput.value = ''; 
            const postIdx = posts.findIndex(p => p.id === parseInt(postId));
            if (postIdx > -1) {
                posts[postIdx].comments_list.unshift({ text: text, time: "Just now" });
                posts[postIdx].comments += 1; 
            }
            buildFeed(); 
            close_('commentOverlay'); 
        } else {
            alert("Error: " + data.message);
        }
    });
}

/* ==========================================================================
   5. UPLOAD POST LOGIC
   ========================================================================== */
function openPostSheet(){ document.getElementById('postOverlay').classList.add('open'); }
function closePostSheet(){ close_('postOverlay'); resetPost(); }
function resetPost(){
    document.getElementById('captionInput').value='';
    removePreview();
}

function previewFile(input){
    const f=input.files[0]; if(!f)return;
    const url=URL.createObjectURL(f);
    const isVid=f.type.startsWith('video/');
    document.getElementById('uploadZone').style.display='none';
    document.getElementById('previewWrap').style.display='block';
    const img=document.getElementById('previewImg');
    const vid=document.getElementById('previewVid');
    if(isVid){vid.src=url;vid.style.display='block';img.style.display='none';}
    else{img.src=url;img.style.display='block';vid.style.display='none';}
}

function removePreview(){
    document.getElementById('fileInput').value='';
    document.getElementById('previewWrap').style.display='none';
    document.getElementById('previewImg').src='';
    document.getElementById('previewVid').src='';
    document.getElementById('uploadZone').style.display='block';
}

function submitPost() {
    const cap = document.getElementById('captionInput').value.trim();
    const fileInput = document.getElementById('fileInput'); 
    const file = fileInput.files[0];

    if (!cap && !file) {
        alert('Please add media or a caption!');
        return;
    }

    const formData = new FormData();
    formData.append('caption', cap);
    if (file) formData.append('media', file);

    fetch('/upload-post/', { method: 'POST', body: formData })
    .then(response => response.json())
    .then(data => {
        if (data.status === 'success') {
            alert('Post saved to database successfully! 🥳');
            closePostSheet();
            window.location.reload(); 
        } else alert('Error: ' + data.message);
    })
    .catch(error => { console.error('Error:', error); alert('Something went wrong!'); });
}

/* ==========================================================================
   6. MENU, ORDERING & HYBRID PAYMENT LOGIC
   ========================================================================== */
function buildMenu(){
    const b=document.getElementById('menuBody');
    menuData.forEach(c=>{
        b.innerHTML+=`<div class="cat-label">${c.cat}</div>`;
        c.items.forEach(item=>{
            b.innerHTML+=`
                <div class="menu-card">
                    <img src="${item.img}" alt="${item.name}" loading="lazy"/>
                    <div class="mci">
                        <h3>${item.name}</h3><p>${item.desc}</p>
                        <span class="price">${item.price}</span>
                    </div>
                    <div class="mcr">
                        <button class="order-btn" onclick="openQR('${item.name}','${item.price}')">Order<br>Now</button>
                    </div>
                </div>`;
        });
    });
}

function openQR(name, price) {
    currentOrder = { name, price };
    document.getElementById('orderItemName').textContent = name;
    document.getElementById('orderItemPrice').textContent = price;
    document.getElementById('finalAmount').textContent = price; 
    
    document.getElementById('orderOverlay').classList.add('open');
}

function backToForm() {
    document.getElementById('qrSection').style.display = 'none';
    document.getElementById('formSection').style.display = 'block';
}

// script.js mein purane handlePaymentClick ko isse replace karein
async function handlePaymentClick() {
    const name = document.getElementById('custName').value.trim();
    const phone = document.getElementById('custPhone').value.trim();
    const priceText = document.getElementById('finalAmount').textContent;
    // Extract numbers only (e.g. from "₹40/Packet" it will extract "40")
    const amount = parseInt(priceText.replace(/[^0-9]/g, ''));

    if (!name || !phone) {
        alert("Please enter your Name and WhatsApp Number. 🙏");
        return;
    }

    try {
        const csrftoken = document.querySelector('[name=csrfmiddlewaretoken]').value;
        
        // 1. Order save karne ke liye
        await fetch('/save-order/', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json', 'X-CSRFToken': csrftoken },
            body: JSON.stringify({ name: name, phone: phone }) 
        });

        // 2. Razorpay Order Create karne ke liye backend ko call
        const rzpRes = await fetch('/create-razorpay-order/', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json', 'X-CSRFToken': csrftoken },
            body: JSON.stringify({ name: name, amount: amount })
        });
        const rzpData = await rzpRes.json();

        if (rzpData.status === "success") {
            // 3. Razorpay ka Popup open karo
            var options = {
                "key": rzpData.key,
                "amount": rzpData.amount,
                "currency": "INR",
                "name": "Maa-Saheb Caterers",
                "description": document.getElementById('orderItemName').textContent,
                "order_id": rzpData.order_id,
                "handler": async function (response) {
                    
                    // 4. SUCCESS: Jab customer pay kar de, to backend se verify karo
                    const verifyRes = await fetch('/verify-payment/', {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json', 'X-CSRFToken': csrftoken },
                        body: JSON.stringify(response)
                    });
                    const verifyData = await verifyRes.json();
                    
                    if (verifyData.status === "success") {
                        // 5. SUCCESS HONE PAR UI CHANGE KARO
                        document.getElementById('formSection').style.display = 'none';
                        document.getElementById('qrSection').style.display = 'block';
                        
                        document.querySelector('.modal-title').innerText = "Payment Successful! 🎉";
                        document.querySelector('.qr-instruction').innerHTML = "Thank you for the payment.<br>Please click below to confirm your order on WhatsApp.";
                        
                        const qrBox = document.querySelector('.qr-box');
                        if(qrBox) qrBox.style.display = 'none'; // QR Image hide kardo
                        
                        document.getElementById('qrAmountDisplay').textContent = amount;
                    } else {
                        alert("Payment verification failed! Please contact support.");
                    }
                },
                "theme": { "color": "#C1121F" } // Maa-saheb theme color (Red)
            };
            
            var rzp1 = new Razorpay(options);

            // NAYA CODE: Agar payment fail ho jaye ya user cancel kar de
            rzp1.on('payment.failed', function (response){
                alert("Payment Failed! ❌ Reason: " + response.error.description);
            });

            rzp1.open();
            
        } else {
            alert("Error initiating payment");
        }

    } catch (error) {
        console.error("Error:", error);
        alert("Something went wrong!");
    }

    // NOTE: Yahan niche jo 'isMobile' aur 'upiUrl' wala lamba code tha, 
    // wo maine delete kar diya hai kyunki ab Razorpay sab khud handle karega!
}
function redirectToWhatsApp() {
    const name = document.getElementById('custName').value;
    const phone = document.getElementById('custPhone').value;
    const itemName = document.getElementById('orderItemName').textContent;
    const amount = document.getElementById('qrAmountDisplay').textContent;

    const msg = `Hello Maa-Saheb Caterers!\n\n*New Order Details* \n--------------------------\n*Name:* ${name}\n*Phone:* ${phone}\n*Item:* ${itemName}\n*Total Amount:* ₹${amount}\n--------------------------\n_I have done my payment._`;
    const waNumber = "919833759589"; 
    window.open(`https://wa.me/${waNumber}?text=${encodeURIComponent(msg)}`, '_blank');
}

/* ==========================================================================
   7. SHARE & CONTACT US LOGIC
   ========================================================================== */
function openShare(cap, img) {
    shareCaption = decodeURIComponent(cap); shareImg = img;
    document.getElementById('shareOverlay').classList.add('open');
}

function shareVia(p) {
    const txt = `Check out Maa-Saheb Caterers! \n\n${shareCaption}\n\nOrder now: ${location.href}`;
    const et = encodeURIComponent(txt), eu = encodeURIComponent(location.href);
    const map = {
        whatsapp: `https://wa.me/?text=${et}`,
        facebook: `https://www.facebook.com/sharer/sharer.php?u=${eu}`,
        twitter: `https://twitter.com/intent/tweet?text=${et}`,
        sms: `sms:?body=${et}`,
        email: `mailto:?subject=${encodeURIComponent('Maa-Saheb Caterers')}&body=${et}`,
    };
    if (p === 'more' && navigator.share) {
        navigator.share({ title: 'Maa-Saheb Caterers', text: txt, url: location.href }).then(() => close_('shareOverlay')).catch(() => {});
        return;
    }
    if (p === 'copy') {
        navigator.clipboard.writeText(location.href).then(() => { alert('Link copied! 🔗'); close_('shareOverlay'); });
        return;
    }
    if (p === 'instagram') {
        navigator.clipboard.writeText(location.href).catch(() => {});
        alert('Link copied! Open Instagram and paste it to share. 📸');
        close_('shareOverlay'); return;
    }
    if (map[p]) { window.open(map[p], '_blank'); close_('shareOverlay'); }
}

function openContactSheet(){ document.getElementById('contactOverlay').classList.add('open'); }

// Note: Aap isko apni nayi handleContactSubmit (Django fetch wali) se replace kar sakte ho
/* ── CONTACT US BACKEND CONNECTION ── */
async function submitContact() {
    // 1. Inputs se data uthao (Same IDs as your HTML)
    const name = document.getElementById('contactName').value.trim();
    const phone = document.getElementById('contactPhone').value.trim();
    const message = document.getElementById('contactMessage').value.trim();

    // 2. Validation check
    if (!name || !phone || !message) {
        alert("Please fill all the details. 🙏");
        return;
    }

    try {
        // 3. CSRF Token uthao (Jo aapne HTML mein sabse upar dala hai)
        const csrftoken = document.querySelector('[name=csrfmiddlewaretoken]').value;

        // 4. Fetch call to Django View
        const response = await fetch('/submit-contact/', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'X-CSRFToken': csrftoken, 
            },
            body: JSON.stringify({ name: name, phone: phone, message: message })
        });
        
        const result = await response.json();
        
        if (result.status === 'success') {
            alert("Thank you! Your message has been sent to Maa-Saheb Caterers. ✅");
            
            // 5. Form clear kardo
            document.getElementById('contactName').value = '';
            document.getElementById('contactPhone').value = '';
            document.getElementById('contactMessage').value = '';
            
            // 6. Modal band kardo (Hamara purana helper function)
            close_('contactOverlay');
        } else {
            alert("Error: " + result.message);
        }
    } catch (error) {
        console.error("Error sending message:", error);
        alert("Something went wrong. Please check your connection.");
    }
}
/* ==========================================================================
   8. EVENT LISTENERS & OBSERVERS
   ========================================================================== */
document.addEventListener('DOMContentLoaded', function() {
    buildFeed(); 
    buildMenu();

    setTimeout(() => {
        document.querySelectorAll('.feed-video').forEach(video => {
            videoObserver.observe(video);
        });
    }, 500);
});

const videoObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (!entry.isIntersecting) {
            entry.target.pause();
        }
    });
}, { threshold: 0.5 });

document.addEventListener('click', function(e) {
    if (e.target && e.target.classList.contains('feed-video')) {
        const clickedVideo = e.target; 
        if (clickedVideo.paused) {
            document.querySelectorAll('.feed-video').forEach(v => {
                if (v !== clickedVideo) v.pause();
            });
            clickedVideo.play(); 
        } else {
            clickedVideo.pause(); 
        }
    }
});