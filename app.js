// Choco.olicious26 Main Application Engine

class ChocoApp {
  constructor() {
    this.cart = JSON.parse(localStorage.getItem('choco_cart')) || [];
    this.activities = JSON.parse(localStorage.getItem('choco_activities')) || INITIAL_ACTIVITIES;
    this.products = JSON.parse(localStorage.getItem('choco_products')) || INITIAL_PRODUCTS;
    this.reviews = JSON.parse(localStorage.getItem('choco_reviews')) || INITIAL_REVIEWS;
    this.isAdminUnlocked = sessionStorage.getItem('choco_admin_unlocked') === 'true';

    // Load dynamic config overrides if saved
    const savedConfig = JSON.parse(localStorage.getItem('choco_config_override'));
    if (savedConfig) {
      Object.assign(CHOCO_CONFIG, savedConfig);
    }

    this.uploadedImageBase64 = null;
    this.init();
  }

  init() {
    // Initial renders
    this.applyBrandConfig();
    this.loadGoogleSettings();
    this.renderActivities('all');
    this.renderProducts('all');
    this.renderReviews();
    this.updateCartCount();

    // Event listeners
    this.bindEvents();
  }

  applyBrandConfig() {
    document.querySelectorAll('.brand-name').forEach(el => el.innerText = CHOCO_CONFIG.brandName);
    document.querySelectorAll('.brand-tag').forEach(el => el.innerText = CHOCO_CONFIG.tagline);
  }

  loadGoogleSettings() {
    const savedGoogleUrl = localStorage.getItem('choco_google_review_url') || 'https://maps.app.goo.gl/YuAXhBZ1VK6Ss52B8';
    const linkEl = document.getElementById('google-review-link');
    if (linkEl) linkEl.href = savedGoogleUrl;

    const savedWidgetCode = localStorage.getItem('choco_widget_code');
    const container = document.getElementById('google-widget-container');
    if (savedWidgetCode && container) {
      container.innerHTML = savedWidgetCode;
      container.style.display = 'block';
      
      // Execute any script tags inside the widget code
      const scripts = container.querySelectorAll('script');
      scripts.forEach(oldScript => {
        const newScript = document.createElement('script');
        Array.from(oldScript.attributes).forEach(attr => newScript.setAttribute(attr.name, attr.value));
        newScript.appendChild(document.createTextNode(oldScript.innerHTML));
        oldScript.parentNode.replaceChild(newScript, oldScript);
      });
    }
  }

  bindEvents() {
    // Cart Drawer Triggers
    document.getElementById('cart-open-btn').addEventListener('click', () => this.openCart());
    document.getElementById('cart-close-btn').addEventListener('click', () => this.closeCart());

    // Admin Modal Triggers
    document.getElementById('admin-trigger-btn').addEventListener('click', () => this.openAdminModal());
    document.getElementById('admin-close-btn').addEventListener('click', () => this.closeAdminModal());
    document.getElementById('admin-login-btn').addEventListener('click', () => this.handleAdminLogin());
    document.getElementById('add-activity-btn').addEventListener('click', () => this.openAdminModal());
    document.getElementById('activity-post-form').addEventListener('submit', (e) => this.handlePostActivity(e));
    
    // File Input change for photo gallery picker
    const fileInput = document.getElementById('post-file-input');
    if (fileInput) {
      fileInput.addEventListener('change', (e) => this.handleFileSelect(e));
    }

    // Profile Settings Form
    const profileForm = document.getElementById('profile-edit-form');
    if (profileForm) {
      profileForm.addEventListener('submit', (e) => this.handleSaveProfile(e));
    }

    // Activity Filter Buttons
    document.querySelectorAll('[data-filter]').forEach(btn => {
      btn.addEventListener('click', (e) => {
        document.querySelectorAll('[data-filter]').forEach(b => b.classList.remove('active'));
        e.target.classList.add('active');
        this.renderActivities(e.target.dataset.filter);
      });
    });

    // Category Filter Buttons
    document.querySelectorAll('[data-cat]').forEach(btn => {
      btn.addEventListener('click', (e) => {
        document.querySelectorAll('[data-cat]').forEach(b => b.classList.remove('active'));
        e.target.classList.add('active');
        this.renderProducts(e.target.dataset.cat);
      });
    });

    // Checkout Modal Triggers
    document.getElementById('checkout-wa-btn').addEventListener('click', () => this.handleQuickWACheckout());
    document.getElementById('checkout-web-btn').addEventListener('click', () => this.openCheckoutModal());
    document.getElementById('checkout-close-btn').addEventListener('click', () => this.closeCheckoutModal());
    
    document.getElementById('confirm-wa-submit').addEventListener('click', () => this.processWhatsAppOrder());
    document.getElementById('checkout-form').addEventListener('submit', (e) => this.processWebOrder(e));
  }

  handleFileSelect(e) {
    const file = e.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      this.uploadedImageBase64 = event.target.result;
      this.uploadedFileType = file.type.startsWith('video/') ? 'video' : 'image';
      
      const previewBox = document.getElementById('image-preview-box');
      const previewImg = document.getElementById('preview-img-tag');
      const previewVid = document.getElementById('preview-video-tag');
      
      if (this.uploadedFileType === 'video') {
        if (previewImg) previewImg.style.display = 'none';
        if (previewVid) {
          previewVid.src = this.uploadedImageBase64;
          previewVid.style.display = 'inline-block';
        }
      } else {
        if (previewVid) previewVid.style.display = 'none';
        if (previewImg) {
          previewImg.src = this.uploadedImageBase64;
          previewImg.style.display = 'inline-block';
        }
      }
      if (previewBox) previewBox.style.display = 'block';
    };
    reader.readAsDataURL(file);
  }

  switchAdminTab(tab) {
    document.getElementById('tab-post-btn').classList.toggle('active', tab === 'post');
    const videoBtn = document.getElementById('tab-video-btn');
    if (videoBtn) videoBtn.classList.toggle('active', tab === 'video');
    const manageBtn = document.getElementById('tab-manage-btn');
    if (manageBtn) manageBtn.classList.toggle('active', tab === 'manage');
    const reviewsBtn = document.getElementById('tab-reviews-btn');
    if (reviewsBtn) reviewsBtn.classList.toggle('active', tab === 'reviews');
    document.getElementById('tab-profile-btn').classList.toggle('active', tab === 'profile');

    document.getElementById('admin-tab-post').style.display = tab === 'post' ? 'block' : 'none';
    const videoTab = document.getElementById('admin-tab-video');
    if (videoTab) videoTab.style.display = tab === 'video' ? 'block' : 'none';
    const manageTab = document.getElementById('admin-tab-manage');
    if (manageTab) manageTab.style.display = tab === 'manage' ? 'block' : 'none';
    const reviewsTab = document.getElementById('admin-tab-reviews');
    if (reviewsTab) reviewsTab.style.display = tab === 'reviews' ? 'block' : 'none';
    document.getElementById('admin-tab-profile').style.display = tab === 'profile' ? 'block' : 'none';

    if (tab === 'manage') {
      this.renderAdminManagePosts();
    } else if (tab === 'reviews') {
      this.renderAdminManageReviews();
      const savedGoogleUrl = localStorage.getItem('choco_google_review_url');
      if (savedGoogleUrl) document.getElementById('setting-google-review-url').value = savedGoogleUrl;
      const savedWidgetCode = localStorage.getItem('choco_widget_code');
      if (savedWidgetCode) document.getElementById('setting-widget-code').value = savedWidgetCode;
    } else if (tab === 'profile') {
      document.getElementById('setting-brand-name').value = CHOCO_CONFIG.brandName;
      document.getElementById('setting-whatsapp').value = CHOCO_CONFIG.whatsappNumber;
      document.getElementById('setting-instagram').value = CHOCO_CONFIG.instagramHandle;
      document.getElementById('setting-tagline').value = CHOCO_CONFIG.tagline;
      document.getElementById('setting-pin').value = CHOCO_CONFIG.adminPin;
    }
  }

  handleVideoSelect(e) {
    const file = e.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      this.uploadedVideoBase64 = event.target.result;
      const previewBox = document.getElementById('video-preview-box');
      const previewVid = document.getElementById('preview-video-tag-2');
      if (previewVid) {
        previewVid.src = this.uploadedVideoBase64;
      }
      if (previewBox) previewBox.style.display = 'block';
    };
    reader.readAsDataURL(file);
  }

  handlePostVideo(e) {
    e.preventDefault();
    const title = document.getElementById('video-title').value.trim();
    const tag = document.getElementById('video-tag').value;
    const urlInput = document.getElementById('video-url-input').value.trim();
    const desc = document.getElementById('video-desc').value.trim();

    const finalVideo = this.uploadedVideoBase64 || urlInput;
    if (!finalVideo) {
      alert("Please select a video file or paste a video link!");
      return;
    }

    const newActivity = {
      id: `act-${Date.now()}`,
      date: 'Today',
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      title: title,
      description: desc,
      image: finalVideo,
      tag: tag,
      likes: 1,
      isVideo: true
    };

    this.activities.unshift(newActivity);
    localStorage.setItem('choco_activities', JSON.stringify(this.activities));

    this.renderActivities('all');
    this.closeAdminModal();
    this.showToast("🎥 Video update published successfully!");

    // Reset Form
    document.getElementById('video-post-form').reset();
    this.uploadedVideoBase64 = null;
    const previewBox = document.getElementById('video-preview-box');
    if (previewBox) previewBox.style.display = 'none';
  }

  saveGoogleReviewUrl() {
    const val = document.getElementById('setting-google-review-url').value.trim();
    localStorage.setItem('choco_google_review_url', val);
    const linkEl = document.getElementById('google-review-link');
    if (linkEl) linkEl.href = val || '#';
    this.showToast("🔗 Google Review link saved!");
  }

  saveWidgetCode() {
    const val = document.getElementById('setting-widget-code').value.trim();
    localStorage.setItem('choco_widget_code', val);
    this.loadGoogleSettings();
    this.showToast("🌐 Live Reviews Widget updated!");
  }

  handleManualReview(e) {
    e.preventDefault();
    const name = document.getElementById('rev-cust-name').value.trim();
    const loc = document.getElementById('rev-cust-loc').value.trim();
    const stars = parseInt(document.getElementById('rev-cust-stars').value);
    const comment = document.getElementById('rev-cust-comment').value.trim();

    const newRev = {
      id: `rev-${Date.now()}`,
      name: name,
      location: loc,
      stars: stars,
      comment: comment,
      date: 'Just Now',
      verified: true
    };

    this.reviews.unshift(newRev);
    localStorage.setItem('choco_reviews', JSON.stringify(this.reviews));
    
    this.renderReviews();
    this.renderAdminManageReviews();
    document.getElementById('add-review-form').reset();
    this.showToast("⭐ Review added successfully!");
  }

  deleteReview(revId) {
    if (!confirm("Are you sure you want to delete this review from your website?")) return;

    this.reviews = this.reviews.filter(r => r.id !== revId);
    localStorage.setItem('choco_reviews', JSON.stringify(this.reviews));

    this.renderReviews();
    this.renderAdminManageReviews();
    this.showToast("🗑️ Review deleted!");
  }

  renderAdminManageReviews() {
    const listEl = document.getElementById('admin-manage-reviews-list');
    if (!listEl) return;

    if (this.reviews.length === 0) {
      listEl.innerHTML = `<p style="color: var(--text-muted); text-align: center; padding: 10px;">No manual reviews to manage.</p>`;
      return;
    }

    listEl.innerHTML = this.reviews.map(r => `
      <div style="background: var(--bg-card); padding: 8px 12px; border-radius: var(--radius-sm); border: 1px solid rgba(255,255,255,0.05); display: flex; align-items: center; justify-content: space-between; gap: 8px;">
        <div style="flex-grow: 1; font-size: 0.85rem;">
          <div style="font-weight: 600; color: #fff;">${r.name} (${r.location}) - ${'★'.repeat(r.stars)}</div>
          <div style="color: var(--text-muted); max-width: 320px; overflow: hidden; text-overflow: ellipsis; white-space: nowrap;">${r.comment}</div>
        </div>
        <button class="btn btn-outline-gold btn-sm" style="color: #E53935; border-color: #E53935; padding: 4px 8px; font-size: 0.75rem;" onclick="app.deleteReview('${r.id}')">
          Delete
        </button>
      </div>
    `).join('');
  }

  renderAdminManagePosts() {
    const listEl = document.getElementById('admin-manage-posts-list');
    if (!listEl) return;

    if (this.activities.length === 0) {
      listEl.innerHTML = `<p style="color: var(--text-muted); text-align: center; padding: 20px;">No active posts available to delete.</p>`;
      return;
    }

    listEl.innerHTML = this.activities.map(act => {
      const thumbHtml = act.isVideo
        ? `<video src="${act.image}" style="width: 50px; height: 50px; object-fit: cover; border-radius: 6px;" muted></video>`
        : `<img src="${act.image}" style="width: 50px; height: 50px; object-fit: cover; border-radius: 6px;">`;

      return `
        <div style="background: var(--bg-card); padding: 12px 16px; border-radius: var(--radius-sm); border: 1px solid rgba(212, 175, 55, 0.2); display: flex; align-items: center; justify-content: space-between; gap: 12px;">
          ${thumbHtml}
          <div style="flex-grow: 1;">
            <div style="font-weight: 600; font-size: 0.95rem; color: #fff;">${act.title} ${act.isVideo ? '🎥' : '📸'}</div>
            <div style="font-size: 0.75rem; color: var(--text-muted);">${act.date} • ${act.time} | ${act.tag}</div>
          </div>
          <button class="btn btn-outline-gold btn-sm" style="color: #E53935; border-color: #E53935; padding: 6px 12px;" onclick="app.deleteActivity('${act.id}')">
            <i class="fa-solid fa-trash-can"></i> Delete Post
          </button>
        </div>
      `;
    }).join('');
  }

  deleteActivity(actId) {
    if (!confirm("Are you sure you want to delete this activity post from the website?")) return;

    this.activities = this.activities.filter(a => a.id !== actId);
    localStorage.setItem('choco_activities', JSON.stringify(this.activities));

    this.renderActivities('all');
    this.renderAdminManagePosts();
    this.showToast("🗑️ Post deleted successfully!");
  }

  handleSaveProfile(e) {
    e.preventDefault();
    CHOCO_CONFIG.brandName = document.getElementById('setting-brand-name').value.trim();
    CHOCO_CONFIG.whatsappNumber = document.getElementById('setting-whatsapp').value.trim();
    CHOCO_CONFIG.instagramHandle = document.getElementById('setting-instagram').value.trim();
    CHOCO_CONFIG.tagline = document.getElementById('setting-tagline').value.trim();
    CHOCO_CONFIG.adminPin = document.getElementById('setting-pin').value.trim();

    localStorage.setItem('choco_config_override', JSON.stringify({
      brandName: CHOCO_CONFIG.brandName,
      whatsappNumber: CHOCO_CONFIG.whatsappNumber,
      instagramHandle: CHOCO_CONFIG.instagramHandle,
      tagline: CHOCO_CONFIG.tagline,
      adminPin: CHOCO_CONFIG.adminPin
    }));

    this.applyBrandConfig();
    this.showToast("⚙️ Business Profile Details Saved!");
    this.closeAdminModal();
  }

  // --- RENDERING FUNCTIONS ---

  renderActivities(filter = 'all') {
    const container = document.getElementById('activities-container');
    let filtered = this.activities;

    if (filter === 'video') {
      filtered = this.activities.filter(a => a.isVideo);
    } else if (filter !== 'all') {
      filtered = this.activities.filter(a => a.date.toLowerCase() === filter.toLowerCase());
    }

    if (filtered.length === 0) {
      container.innerHTML = `
        <div style="grid-column: 1/-1; text-align: center; padding: 40px; color: var(--text-muted);">
          <i class="fa-solid fa-camera-retro" style="font-size: 2rem; margin-bottom: 12px; color: var(--primary-gold);"></i>
          <p>No activity updates for "${filter}". Check back soon or click "+ Post Today's Activity"!</p>
        </div>
      `;
      return;
    }

    container.innerHTML = filtered.map(act => {
      const mediaHtml = act.isVideo 
        ? `<video src="${act.image}" controls loop muted playsinline style="width: 100%; height: 100%; object-fit: cover; display: block;"></video>`
        : `<img src="${act.image}" alt="${act.title}" loading="lazy">`;

      return `
        <div class="activity-card">
          <div class="activity-img-wrapper">
            ${mediaHtml}
            <span class="activity-time-tag"><i class="fa-regular fa-clock"></i> ${act.date} • ${act.time}</span>
          </div>
          <div class="activity-content">
            <div class="badge badge-gold" style="margin-bottom: 8px;">${act.tag || 'Daily Update'}</div>
            <h3 class="activity-title">${act.title}</h3>
            <p class="activity-desc">${act.description}</p>
            <div class="activity-footer">
              <button class="like-btn" onclick="app.toggleLike('${act.id}', this)">
                <i class="fa-solid fa-heart"></i> <span class="like-count">${act.likes || 12}</span> Likes
              </button>
              <a href="https://wa.me/${CHOCO_CONFIG.whatsappNumber}?text=Hi!%20I%20saw%20your%20daily%20activity%20'${encodeURIComponent(act.title)}'%20and%20want%20to%20order." target="_blank" class="btn btn-whatsapp btn-sm" style="font-size: 0.75rem; padding: 4px 10px;">
                <i class="fa-brands fa-whatsapp"></i> Inquire
              </a>
            </div>
          </div>
        </div>
      `;
    }).join('');
  }

  renderProducts(category = 'all') {
    const container = document.getElementById('products-container');
    let filtered = this.products;

    if (category !== 'all') {
      filtered = this.products.filter(p => p.category === category);
    }

    container.innerHTML = filtered.map(p => `
      <div class="product-card">
        <div class="product-thumb">
          <img src="${p.image}" alt="${p.name}">
          ${p.badge ? `<span class="badge badge-gold product-badge-tag">${p.badge}</span>` : ''}
          ${p.eggless ? `<span class="eggless-badge"><i class="fa-solid fa-leaf"></i> 100% Eggless</span>` : ''}
        </div>
        <div class="product-info">
          <div class="product-rating">
            <i class="fa-solid fa-star"></i> <strong>${p.rating}</strong>
            <span class="rating-count">(${p.reviewsCount})</span>
          </div>
          <h3 class="product-title">${p.name}</h3>
          <p class="product-desc">${p.description}</p>
          
          <div class="product-price-row">
            <div class="price-box">
              <span class="current-price">₹${p.price}</span>
              ${p.originalPrice ? `<span class="original-price">₹${p.originalPrice}</span>` : ''}
            </div>
          </div>

          <div class="product-actions">
            <button class="btn btn-outline-gold btn-sm" onclick="app.quickWAOrder('${p.id}')">
              <i class="fa-brands fa-whatsapp"></i> Order WA
            </button>
            <button class="btn btn-gold btn-sm" onclick="app.addToCart('${p.id}')">
              <i class="fa-solid fa-cart-plus"></i> Add Cart
            </button>
          </div>
        </div>
      </div>
    `).join('');
  }

  renderReviews() {
    const container = document.getElementById('reviews-container');
    container.innerHTML = this.reviews.map(r => `
      <div class="review-card">
        <div class="review-header">
          <div>
            <div class="reviewer-name">${r.name}</div>
            <div class="reviewer-loc"><i class="fa-solid fa-location-dot" style="color:var(--primary-gold);"></i> ${r.location}</div>
          </div>
          <div style="color: #FFC107; font-size: 0.9rem;">
            ${'★'.repeat(r.stars)}
          </div>
        </div>
        <p class="review-comment">"${r.comment}"</p>
      </div>
    `).join('');
  }

  // --- CART MANAGEMENT ---

  addToCart(productId) {
    const product = this.products.find(p => p.id === productId);
    if (!product) return;

    const existing = this.cart.find(item => item.id === productId);
    if (existing) {
      existing.quantity += 1;
    } else {
      this.cart.push({ ...product, quantity: 1 });
    }

    this.saveCart();
    this.openCart();
    this.showToast(`✨ Added "${product.name}" to cart!`);
  }

  updateQuantity(productId, delta) {
    const item = this.cart.find(i => i.id === productId);
    if (!item) return;

    item.quantity += delta;
    if (item.quantity <= 0) {
      this.cart = this.cart.filter(i => i.id !== productId);
    }
    this.saveCart();
    this.renderCart();
  }

  saveCart() {
    localStorage.setItem('choco_cart', JSON.stringify(this.cart));
    this.updateCartCount();
  }

  updateCartCount() {
    const totalCount = this.cart.reduce((sum, item) => sum + item.quantity, 0);
    document.getElementById('cart-count').innerText = totalCount;
  }

  openCart() {
    this.renderCart();
    document.getElementById('cart-drawer').classList.add('open');
  }

  closeCart() {
    document.getElementById('cart-drawer').classList.remove('open');
  }

  renderCart() {
    const container = document.getElementById('cart-items-list');
    const totalPriceEl = document.getElementById('cart-total-price');

    if (this.cart.length === 0) {
      container.innerHTML = `
        <div style="text-align: center; padding: 60px 0; color: var(--text-muted);">
          <i class="fa-solid fa-cookie-bite" style="font-size: 3rem; color: var(--primary-gold); margin-bottom: 16px;"></i>
          <p style="font-size: 1.1rem; color: #fff;">Your cart is empty!</p>
          <p style="font-size: 0.85rem;">Explore our chocolates menu and add your favorite treats.</p>
        </div>
      `;
      totalPriceEl.innerText = '₹0';
      return;
    }

    let total = 0;
    container.innerHTML = this.cart.map(item => {
      const itemTotal = item.price * item.quantity;
      total += itemTotal;

      return `
        <div class="cart-item">
          <img src="${item.image}" alt="${item.name}">
          <div class="cart-item-info">
            <h4 style="font-size: 0.95rem; font-weight: 600;">${item.name}</h4>
            <div style="color: var(--primary-gold); font-weight: 700; margin: 4px 0;">₹${item.price} x ${item.quantity} = ₹${itemTotal}</div>
            <div style="display: flex; align-items: center; gap: 10px; margin-top: 6px;">
              <button class="btn btn-outline-gold btn-sm" style="padding: 2px 8px;" onclick="app.updateQuantity('${item.id}', -1)">-</button>
              <span style="font-weight: 600;">${item.quantity}</span>
              <button class="btn btn-outline-gold btn-sm" style="padding: 2px 8px;" onclick="app.updateQuantity('${item.id}', 1)">+</button>
            </div>
          </div>
        </div>
      `;
    }).join('');

    totalPriceEl.innerText = `₹${total}`;
  }

  calculateTotal() {
    return this.cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  }

  // --- ORDER HANDLING & WHATSAPP GENERATION ---

  quickWAOrder(productId) {
    const product = this.products.find(p => p.id === productId);
    if (!product) return;

    const message = `Hi *Choco.olicious26*! 🍫\nI want to order:\n• *${product.name}* (Price: ₹${product.price})\n\nPlease let me know availability and payment details. Thank you!`;
    const url = `https://wa.me/${CHOCO_CONFIG.whatsappNumber}?text=${encodeURIComponent(message)}`;
    window.open(url, '_blank');
  }

  handleQuickWACheckout() {
    if (this.cart.length === 0) {
      alert("Your cart is empty! Please add some chocolates first.");
      return;
    }
    this.openCheckoutModal();
  }

  openCheckoutModal() {
    if (this.cart.length === 0) {
      alert("Please add items to cart first!");
      return;
    }
    document.getElementById('modal-checkout-total').innerText = `₹${this.calculateTotal()}`;
    document.getElementById('checkout-modal').classList.add('open');
  }

  closeCheckoutModal() {
    document.getElementById('checkout-modal').classList.remove('open');
  }

  processWhatsAppOrder() {
    const name = document.getElementById('cust-name').value.trim();
    const phone = document.getElementById('cust-phone').value.trim();
    const address = document.getElementById('cust-address').value.trim();
    const note = document.getElementById('cust-note').value.trim();

    if (!name || !phone || !address) {
      alert("Please fill in your Name, Phone Number, and Address!");
      return;
    }

    let itemsListText = this.cart.map(item => `• ${item.name} (${item.quantity}x) - ₹${item.price * item.quantity}`).join('\n');
    let total = this.calculateTotal();

    let message = `🍫 *NEW ORDER - Choco.olicious26*\n`;
    message += `----------------------------------------\n`;
    message += `${itemsListText}\n`;
    message += `----------------------------------------\n`;
    message += `💰 *Total Amount:* ₹${total}\n\n`;
    message += `👤 *Customer Name:* ${name}\n`;
    message += `📞 *Phone:* ${phone}\n`;
    message += `📍 *Delivery Address:* ${address}\n`;
    if (note) {
      message += `📝 *Custom Note:* ${note}\n`;
    }
    message += `----------------------------------------\n`;
    message += `Please confirm my order. Thank you! ✨`;

    const url = `https://wa.me/${CHOCO_CONFIG.whatsappNumber}?text=${encodeURIComponent(message)}`;
    window.open(url, '_blank');

    this.closeCheckoutModal();
    this.cart = [];
    this.saveCart();
    this.closeCart();
  }

  processWebOrder(e) {
    e.preventDefault();
    const name = document.getElementById('cust-name').value.trim();
    
    alert(`🎉 Thank you ${name}! Your order has been placed successfully on Choco.olicious26!\nOur team will contact you on WhatsApp (+91 97548 81990) for dispatch details.`);
    
    this.closeCheckoutModal();
    this.cart = [];
    this.saveCart();
    this.closeCart();
  }

  // --- ADMIN & DAILY ACTIVITY UPLOAD ---

  openAdminModal() {
    const modal = document.getElementById('admin-modal');
    modal.classList.add('open');

    if (this.isAdminUnlocked) {
      document.getElementById('admin-login-view').style.display = 'none';
      document.getElementById('admin-dashboard-view').style.display = 'block';
    } else {
      document.getElementById('admin-login-view').style.display = 'block';
      document.getElementById('admin-dashboard-view').style.display = 'none';
    }
  }

  closeAdminModal() {
    document.getElementById('admin-modal').classList.remove('open');
  }

  handleAdminLogin() {
    const pin = document.getElementById('admin-pin-input').value;
    if (pin === CHOCO_CONFIG.adminPin) {
      this.isAdminUnlocked = true;
      sessionStorage.setItem('choco_admin_unlocked', 'true');
      document.getElementById('admin-login-view').style.display = 'none';
      document.getElementById('admin-dashboard-view').style.display = 'block';
    } else {
      alert("Incorrect Owner Security PIN! Default PIN is 2026.");
    }
  }

  handlePostActivity(e) {
    e.preventDefault();
    const title = document.getElementById('post-title').value.trim();
    const tag = document.getElementById('post-tag').value;
    const urlInput = document.getElementById('post-image-url').value.trim();
    const desc = document.getElementById('post-desc').value.trim();

    const isVid = this.uploadedFileType === 'video' || 
                  urlInput.toLowerCase().endsWith('.mp4') || 
                  urlInput.toLowerCase().includes('/video') || 
                  urlInput.toLowerCase().includes('.webm');

    const finalImage = this.uploadedImageBase64 || urlInput || "https://images.unsplash.com/photo-1548907040-4baa42d10919?auto=format&fit=crop&q=80&w=600";

    const newActivity = {
      id: `act-${Date.now()}`,
      date: 'Today',
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      title: title,
      description: desc,
      image: finalImage,
      tag: tag,
      likes: 1,
      isVideo: isVid
    };

    this.activities.unshift(newActivity);
    localStorage.setItem('choco_activities', JSON.stringify(this.activities));

    this.renderActivities('all');
    this.closeAdminModal();
    this.showToast("✨ Today's update published successfully to website!");
    
    // Reset form & state
    document.getElementById('activity-post-form').reset();
    this.uploadedImageBase64 = null;
    this.uploadedFileType = null;
    
    const previewImg = document.getElementById('preview-img-tag');
    if (previewImg) previewImg.style.display = 'none';
    const previewVid = document.getElementById('preview-video-tag');
    if (previewVid) previewVid.style.display = 'none';
    const previewBox = document.getElementById('image-preview-box');
    if (previewBox) previewBox.style.display = 'none';
  }

  toggleLike(actId, btnEl) {
    const act = this.activities.find(a => a.id === actId);
    if (!act) return;

    act.likes = (act.likes || 0) + 1;
    localStorage.setItem('choco_activities', JSON.stringify(this.activities));
    
    const countEl = btnEl.querySelector('.like-count');
    if (countEl) countEl.innerText = act.likes;
    btnEl.classList.add('liked');
  }

  showToast(msg) {
    // Simple inline toast
    const toast = document.createElement('div');
    toast.style.cssText = `
      position: fixed; bottom: 30px; left: 50%; transform: translateX(-50%);
      background: var(--gold-gradient); color: #120806; font-weight: 700;
      padding: 12px 24px; border-radius: 99px; box-shadow: 0 10px 30px rgba(0,0,0,0.8);
      z-index: 2000; font-size: 0.95rem;
    `;
    toast.innerText = msg;
    document.body.appendChild(toast);
    setTimeout(() => toast.remove(), 2500);
  }
}

// Initialize App on DOM Load
let app;
document.addEventListener('DOMContentLoaded', () => {
  app = new ChocoApp();
});
