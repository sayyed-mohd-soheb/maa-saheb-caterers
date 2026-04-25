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
            ? `<video src="${p.url}" loop playsinline class="feed-video" id="video_${p.id}" style="width: 100%; max-height: 550px; object-fit: contain; display: block; margin: 0 auto; background: #ffffff; cursor: pointer;"></video>`
            : `<img src="${p.url}" alt="food" loading="lazy" style="width: 100%; max-height: 550px; object-fit: contain; display: block; margin: 0 auto;"/>`;

        return `
        <div class="post-card" style="animation-delay:${idx * .07}s; position: relative; overflow: hidden;">
            
            <div class="post-header">
                <div class="post-avatar">
                    <img src="/static/images/logo.jpg" alt="Logo" style="width: 100%; height: 100%; object-fit: contain;">
                </div>
                <div class="post-meta">
                    <div class="uname">Maa-Saheb Caterers</div>
                    <div class="utime">${p.time}</div>
                </div>
            </div>
            
            <div class="post-media" ondblclick="toggleLike('${p.id}')" style="width: 100%; height: auto; max-height: 550px; overflow: hidden; background: transparent; display: flex; justify-content: center; align-items: center; position: relative; z-index: 1;">
                ${mediaHTML}
                <div class="heart-burst" id="hb${p.id}">❤️</div>
            </div>

            <div class="post-actions" style="display: flex; gap: 15px; align-items: center; justify-content: flex-start; padding: 10px 14px; position: relative; z-index: 9999; background: var(--white); pointer-events: auto;">
                
                <button type="button" class="action-btn${p.liked ? ' liked' : ''}" id="lb${p.id}" onclick="toggleLike('${p.id}')" style="cursor: pointer; background: transparent; border: none; display: flex; align-items: center; gap: 5px;">
                    <svg viewBox="0 0 24 24" width="24" height="24" fill="${p.liked ? 'currentColor' : 'none'}" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                        <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/>
                    </svg>
                    <span id="lc${p.id}" style="font-size: 1rem;">${p.likes}</span>
                </button>

                <button type="button" class="action-btn" onclick="openComments('${p.id}')" style="cursor: pointer; background: transparent; border: none; display: flex; align-items: center; gap: 5px;">
                    <svg viewBox="0 0 24 24" width="24" height="24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                        <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/>
                    </svg>
                    <span style="font-size: 1rem;">${p.comments}</span>
                </button>

                <button type="button" class="action-btn" onclick="openShare('${p.id}')" style="cursor: pointer; background: transparent; border: none; display: flex; align-items: center; gap: 6px;">
                    <svg viewBox="0 0 24 24" width="24" height="24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                        <line x1="22" y1="2" x2="11" y2="13"/><polygon points="22 2 15 22 11 13 2 9 22 2"/>
                    </svg>
                    <span style="font-weight: 600; font-size: 0.95rem;">Share</span>
                </button>

            </div>

            <div class="post-caption" style="padding: 0 14px 10px; position: relative; z-index: 9999; background: var(--white);">
                <span class="uname2" style="font-weight: bold;">Maa-Saheb Caterers</span>
                <span class="captext">${p.caption}</span>
            </div>
        </div>`;
    }).join('');
}
// deleteeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeee
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

// // --- NAYA INSTANT LIKE FUNCTION ---
// function toggleLike(id) {
//     // 1. Post dhoondo
//     const p = posts.find(x => x.id === id);
//     if (!p) return;

//     // 2. ⚡ INSTANT UI UPDATE (Bina backend ka wait kiye)
//     p.liked = !p.liked; // True ko false, false ko true karo
//     p.likes = p.liked ? p.likes + 1 : p.likes - 1; // Count badhao/ghatao

//     // UI elements ko turant update karo
//     document.getElementById(`lc${id}`).innerText = p.likes;
//     const btn = document.getElementById(`lb${id}`);
//     const svg = btn.querySelector('svg');

//     if (p.liked) {
//         btn.classList.add('liked');
//         svg.setAttribute('fill', 'currentColor');
        
//         // Double tap wala bada dil (Heart Burst) bhi instant dikhao!
//         const heartBurst = document.getElementById(`hb${id}`);
//         if (heartBurst) {
//             heartBurst.classList.add('pop');
//             setTimeout(() => heartBurst.classList.remove('pop'), 600);
//         }
//     } else {
//         btn.classList.remove('liked');
//         svg.setAttribute('fill', 'none');
//     }

//     // 3. 🌐 CHUP-CHAAP BACKGROUND MEIN SERVER KO BATA DO
//     fetch(`/like-post/${id}/`)
//     .then(res => res.json())
//     .then(data => {
//         // Agar backend bolta hai number alag hai, toh sync kar lo (Backup ke liye)
//         p.likes = data.likes;
//         document.getElementById(`lc${id}`).innerText = data.likes;
//     })
//     .catch(err => console.error("Network slow hai, par UI instant update ho gaya!", err));
// }
/**
 * Toggles the like status of a post instantly.
 */
function toggleLike(id) {
    // 🛡️ FIX: Changed === to == to match String ID with Number ID
    const p = posts.find(x => x.id == id);
    if (!p) return; // Silent exit prevented!

    p.liked = !p.liked;
    p.likes = p.liked ? p.likes + 1 : p.likes - 1;

    document.getElementById(`lc${id}`).innerText = p.likes;
    const btn = document.getElementById(`lb${id}`);
    const svg = btn.querySelector('svg');

    if (p.liked) {
        btn.classList.add('liked');
        svg.setAttribute('fill', 'currentColor');
        
        const heartBurst = document.getElementById(`hb${id}`);
        if (heartBurst) {
            heartBurst.classList.add('pop');
            setTimeout(() => heartBurst.classList.remove('pop'), 600);
        }
    } else {
        btn.classList.remove('liked');
        svg.setAttribute('fill', 'none');
    }

    // Background sync with database
    fetch(`/like-post/${id}/`)
    .then(res => res.json())
    .then(data => {
        p.likes = data.likes;
        document.getElementById(`lc${id}`).innerText = data.likes;
    })
    .catch(err => console.error("Sync error:", err));
}
/* ==========================================================================
   4. COMMENTS LOGIC
   ========================================================================== */
// function openComments(postId) {
//     const idField = document.getElementById('currentPostId');
//     if (idField) idField.value = postId;

//     const post = posts.find(p => p.id === postId);
//     const listDiv = document.getElementById('commentsList');
    
//     if (post && post.comments_list && post.comments_list.length > 0) {
//         listDiv.innerHTML = post.comments_list.map(c => `
//             <div style="margin-bottom: 12px; border-bottom: 1px solid #f0f0f0; padding-bottom: 8px; text-align: left;">
//                 <span style="font-weight: 700; font-size: 0.85rem; color: #C1121F;">Guest</span>
//                 <span style="font-size: 0.7rem; color: #8A6A52; margin-left: 5px;">${c.time}</span>
//                 <p style="font-size: 0.85rem; margin-top: 3px; color: #1A0A00;">${c.text}</p>
//             </div>
//         `).join('');
//     } else {
//         listDiv.innerHTML = '<p style="color:var(--muted); text-align:center;">No comments yet. Be the first! 🍛</p>';
//     }

//     const overlay = document.getElementById('commentOverlay');
//     if (overlay) overlay.classList.add('open');

//     setTimeout(() => {
//         const input = document.getElementById('modalCommentInput');
//         if (input) input.focus();
//     }, 300);
// }

/**
 * Opens the comments modal for a specific post.
 */
function openComments(postId) {
    const idField = document.getElementById('currentPostId');
    if (idField) idField.value = postId;

    // 🛡️ FIX: Changed === to == 
    const post = posts.find(p => p.id == postId);
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
            const postIdx = posts.findIndex(p => p.id == parseInt(postId));
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


// postttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttt
/**
 * Handles the post submission process including media upload and UI feedback.
 */
function submitPost() {
    const postBtn = document.querySelector('.btn-post');
    const captionInput = document.getElementById('captionInput');
    const fileInput = document.getElementById('fileInput'); 
    const file = fileInput.files[0];
    const caption = captionInput.value.trim();

    // Validation: Ensure either a caption or a file is provided
    if (!caption && !file) {
        alert('Please add media or a caption! 🍛');
        return;
    }

    // 1. UI Feedback: Disable button and show loading state
    postBtn.innerHTML = `Posting... <span class="loader-dots"></span>`;
    postBtn.disabled = true;
    postBtn.style.opacity = "0.6";
    postBtn.style.cursor = "not-allowed";

    // Prepare multipart form data for the backend
    const formData = new FormData();
    formData.append('caption', caption);
    if (file) formData.append('media', file);

    // 2. Execute background upload via Fetch API
    fetch('/upload-post/', { 
        method: 'POST', 
        body: formData,
        headers: { 
            'X-CSRFToken': getCookie('csrftoken') 
        }
    })
    .then(response => {
        if (!response.ok) throw new Error('Network response was not ok');
        return response.json();
    })
    .then(data => {
        if (data.status === 'success') {
            // Visual confirmation of success
            postBtn.innerHTML = "Success! ✅";
            postBtn.style.background = "#25D366"; // Success Green
            
            // Brief delay to allow the user to see the success state before reload
            setTimeout(() => {
                window.location.reload(); 
            }, 600);
        } else {
            // Handle server-side errors
            alert('Error: ' + data.message);
            resetPostButton(postBtn);
        }
    })
    .catch(error => { 
        // Handle network or unexpected errors
        console.error('Submission Error:', error); 
        alert('Upload failed. Please check your connection and try again.'); 
        resetPostButton(postBtn);
    });
}

/**
 * Reverts the post button to its original state if an error occurs.
 * @param {HTMLElement} btn - The post button element.
 */
function resetPostButton(btn) {
    btn.innerHTML = "Post Now ✨";
    btn.disabled = false;
    btn.style.opacity = "1";
    btn.style.cursor = "pointer";
    btn.style.background = "linear-gradient(135deg, var(--orange), var(--red))";
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
// NAYA FAST PAYMENT FLOW (No Razorpay, Direct QR)
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
        // 1. Button ko thoda update karo taaki user ko lage process ho raha hai
        const payBtn = document.querySelector('.pay-btn');
        payBtn.innerText = "Processing...";
        payBtn.disabled = true;

        const csrftoken = document.querySelector('[name=csrfmiddlewaretoken]').value;
        
        // 2. Order direct Database mein save karo
        const response = await fetch('/save-order/', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json', 'X-CSRFToken': csrftoken },
            body: JSON.stringify({ name: name, phone: phone }) 
        });

        const result = await response.json();

        if (result.status === 'success') {
            // 3. SUCCESS HONE PAR DIRECT QR SECTION DIKHAO
            document.getElementById('formSection').style.display = 'none';
            document.getElementById('qrSection').style.display = 'block';
            
            // Amount QR screen par set karo
            document.getElementById('qrAmountDisplay').textContent = amount;
        } else {
            alert("Error: " + result.message);
        }

        // Button wapas normal kardo (agar user back aata hai)
        payBtn.innerText = "Pay Now";
        payBtn.disabled = false;

    } catch (error) {
        console.error("Error:", error);
        alert("Something went wrong!");
        
        const payBtn = document.querySelector('.pay-btn');
        payBtn.innerText = "Pay Now";
        payBtn.disabled = false;
    }
}
// whatssssssssssaaaaaaappppppppppppp
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
function openShare(id) {
    // ID se array mein post dhoondo
    const p = posts.find(x => x.id == id);
    if (!p) return;
    
    // Ab caption aur image safely set honge
    shareCaption = p.caption; 
    shareImg = p.url;
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
    // 1. Sahi ID se button ko pakdo
    const submitBtn = document.getElementById('contactSubmitBtn');
    
    // Inputs se data uthao
    const nameInput = document.getElementById('contactName');
    const phoneInput = document.getElementById('contactPhone');
    const messageInput = document.getElementById('contactMessage');

    const name = nameInput.value.trim();
    const phone = phoneInput.value.trim();
    const message = messageInput.value.trim();

    // 2. Validation check
    if (!name || !phone || !message) {
        alert("Please fill all the details. 🙏");
        return;
    }

    // --- LOADING START ---
    if (submitBtn) {
        submitBtn.innerHTML = "Sending Message... ⏳"; // innerHTML use kiya hai
        submitBtn.disabled = true;
        submitBtn.style.opacity = "0.7";
    }

    try {
        const csrftoken = document.querySelector('[name=csrfmiddlewaretoken]').value;

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
            
            nameInput.value = '';
            phoneInput.value = '';
            messageInput.value = '';
            
            close_('contactOverlay');
        } else {
            alert("Error: " + result.message);
        }
    } catch (error) {
        console.error("Error sending message:", error);
        alert("Something went wrong. Please check your connection.");
    } finally {
        // --- LOADING STOP (Button wapas normal) ---
        if (submitBtn) {
            submitBtn.innerHTML = "Send Message 📨"; // Purana look wapas
            submitBtn.disabled = false;
            submitBtn.style.opacity = "1";
        }
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

// copy number logc
// UPI Number Copy Karne Ka Function
function copyUPI() {
    // Number uthao
    const upiNumber = document.getElementById("upiNumber").innerText;
    
    // Mobile/Laptop ke clipboard (memory) mein save karo
    navigator.clipboard.writeText(upiNumber).then(() => {
        const copyBtn = document.getElementById("copyBtn");
        
        // Button ka style change karo taaki user ko pata chale copy ho gaya
        copyBtn.innerText = "Copied! ✅";
        copyBtn.style.background = "#25D366"; // WhatsApp jaisa Green color
        
        // 2 second baad wapas normal kar do
        setTimeout(() => {
            copyBtn.innerText = "Copy";
            copyBtn.style.background = "#C1121F"; // Wapas Red
        }, 2000);
    });
}