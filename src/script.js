import 'bootstrap/dist/css/bootstrap.min.css';

// ============================================
// متجر هيما ستور - ملف الجافاسكريبت
// ============================================

// بيانات المنتجات - عدّل هنا صورك ومعلوماتك
const products = [
    { 
        id: 1, 
        name: "قميص كلاسيكي أنيق", 
        category: "men", 
        price: 149, 
        oldPrice: 199, 
        image: "https://images.unsplash.com/photo-1596755094514-f87e34085b2c?w=400&q=80", 
        badge: "sale", 
        rating: 4.8, 
        reviews: 124 
    },
    { 
        id: 2, 
        name: "فستان صيفي فاخر", 
        category: "women", 
        price: 299, 
        oldPrice: 399, 
        image: "https://images.unsplash.com/photo-1595777457583-95e059d581b8?w=400&q=80", 
        badge: "new", 
        rating: 4.9, 
        reviews: 89 
    },
    { 
        id: 3, 
        name: "بدلة رياضية أطفال", 
        category: "kids", 
        price: 129, 
        oldPrice: 179, 
        image: "https://images.unsplash.com/photo-1519238263530-99bdd11df2f0?w=400&q=80", 
        badge: "sale", 
        rating: 4.7, 
        reviews: 56 
    },
    { 
        id: 4, 
        name: "جاكيت جلد فاخر", 
        category: "men", 
        price: 459, 
        oldPrice: 599, 
        image: "https://images.unsplash.com/photo-1551028719-00167b16eac5?w=400&q=80", 
        badge: "sale", 
        rating: 4.9, 
        reviews: 203 
    },
    { 
        id: 5, 
        name: "بلوزة حريرية أنيقة", 
        category: "women", 
        price: 189, 
        oldPrice: 249, 
        image: "https://images.unsplash.com/photo-1564257631407-4deb1f99d992?w=400&q=80", 
        badge: "new", 
        rating: 4.6, 
        reviews: 78 
    },
    { 
        id: 6, 
        name: "تيشيرت أطفال مطبوع", 
        category: "kids", 
        price: 79, 
        oldPrice: 99, 
        image: "https://images.unsplash.com/photo-1503919545889-aef636e10ad4?w=400&q=80", 
        badge: "new", 
        rating: 4.8, 
        reviews: 112 
    },
    { 
        id: 7, 
        name: "بنطلون جينز كلاسيكي", 
        category: "men", 
        price: 199, 
        oldPrice: 259, 
        image: "https://images.unsplash.com/photo-1542272604-787c3835535d?w=400&q=80", 
        badge: "", 
        rating: 4.7, 
        reviews: 156 
    },
    { 
        id: 8, 
        name: "تنورة قصيرة أنيقة", 
        category: "women", 
        price: 159, 
        oldPrice: 199, 
        image: "https://images.unsplash.com/photo-1583496661160-fb5886a0aaaa?w=400&q=80", 
        badge: "sale", 
        rating: 4.5, 
        reviews: 67 
    }
];

// بيانات الماركات - عدّل هنا
const brands = [
    { name: "Nike", icon: "fa-running", count: "+120 منتج" },
    { name: "Adidas", icon: "fa-futbol", count: "+95 منتج" },
    { name: "Zara", icon: "fa-tshirt", count: "+200 منتج" },
    { name: "H&M", icon: "fa-shopping-bag", count: "+150 منتج" },
    { name: "Puma", icon: "fa-paw", count: "+80 منتج" },
    { name: "Gucci", icon: "fa-gem", count: "+45 منتج" }
];

// متغيرات عامة
let cart = [];
let currentSlide = 0;
let currentProduct = null;
let currentQty = 1;

// ============================================
// دوال التهيئة
// ============================================

function init() {
    renderProducts();
    renderBrands();
    startSlider();
    setupEventListeners();
}

function setupEventListeners() {
    // اختيار المقاس
    document.querySelectorAll('.size-option').forEach(opt => {
        opt.addEventListener('click', function() {
            this.parentElement.querySelectorAll('.size-option').forEach(o => o.classList.remove('active'));
            this.classList.add('active');
        });
    });

    // اختيار اللون
    document.querySelectorAll('.color-option').forEach(opt => {
        opt.addEventListener('click', function() {
            this.parentElement.querySelectorAll('.color-option').forEach(o => o.classList.remove('active'));
            this.classList.add('active');
        });
    });

    // تأثير الهيدر عند التمرير
    window.addEventListener('scroll', () => {
        const header = document.getElementById('header');
        if (window.scrollY > 50) {
            header.classList.add('scrolled');
        } else {
            header.classList.remove('scrolled');
        }
    });

    // البحث بالضغط على Enter
    document.getElementById('searchInput').addEventListener('keypress', (e) => {
        if (e.key === 'Enter') performSearch();
    });

    const contactForm = document.getElementById('contactForm');
    if (contactForm) {
        contactForm.addEventListener('submit', handleContactSubmit);
    }

    const newsletterForm = document.getElementById('newsletterForm');
    if (newsletterForm) {
        newsletterForm.addEventListener('submit', handleNewsletterSubmit);
    }
}

// ============================================
// دوال مساعدة للأرقام
// ============================================

function safeNumber(value, defaultValue) {
    const num = Number(value);
    return isNaN(num) ? defaultValue : num;
}

function formatPrice(price) {
    const num = safeNumber(price, 0);
    return num.toFixed(0);
}

// ============================================
// دوال المنتجات
// ============================================

function renderProducts() {
    const featured = products.slice(0, 4);
    const bestsellers = products.slice(4, 8);

    document.getElementById('featuredProducts').innerHTML = featured.map(p => createProductCard(p)).join('');
    document.getElementById('bestsellerProducts').innerHTML = bestsellers.map(p => createProductCard(p)).join('');
}

function createProductCard(p) {
    const badgeClass = p.badge === 'sale' ? 'sale' : p.badge === 'new' ? 'new' : '';
    const badgeText = p.badge === 'sale' ? 'خصم' : p.badge === 'new' ? 'جديد' : '';
    const price = safeNumber(p.price, 0);
    const oldPrice = safeNumber(p.oldPrice, 0);

    return `
        <div class="product-card" onclick="showProductDetail(${p.id})">
            ${badgeText ? `<span class="product-badge ${badgeClass}">${badgeText}</span>` : ''}
            <div class="product-img-wrap">
                <img src="${p.image}" alt="${p.name}" onerror="this.src='hm_3.jpg'">
                <div class="product-actions" onclick="event.stopPropagation()">
                    <button class="product-action-btn" onclick="addToCart(${p.id}, 1)"><i class="fas fa-shopping-bag"></i></button>
                    <button class="product-action-btn"><i class="far fa-heart"></i></button>
                    <button class="product-action-btn" onclick="showProductDetail(${p.id})"><i class="fas fa-eye"></i></button>
                </div>
            </div>
            <div class="product-info">
                <div class="product-category">${p.category === 'men' ? 'رجالي' : p.category === 'women' ? 'نسائي' : 'أطفال'}</div>
                <h3 class="product-name">${p.name}</h3>
                <div class="product-price-row">
                    <span class="product-price">${formatPrice(price)} ر.س</span>
                    ${oldPrice > price ? `<span class="product-old-price">${formatPrice(oldPrice)} ر.س</span>` : ''}
                </div>
                <div class="product-rating">
                    <span class="stars">${getStars(p.rating)}</span>
                    <span>(${p.reviews})</span>
                </div>
            </div>
        </div>
    `;
}

function getStars(rating) {
    let stars = '';
    const numRating = safeNumber(rating, 0);
    for (let i = 1; i <= 5; i++) {
        if (i <= numRating) stars += '<i class="fas fa-star"></i>';
        else if (i - 0.5 <= numRating) stars += '<i class="fas fa-star-half-alt"></i>';
        else stars += '<i class="far fa-star"></i>';
    }
    return stars;
}

// ============================================
// دوال الماركات
// ============================================

function renderBrands() {
    document.getElementById('brandsGrid').innerHTML = brands.map(b => `
        <div class="brand-card">
            <div class="brand-logo"><i class="fas ${b.icon}"></i></div>
            <div class="brand-name">${b.name}</div>
            <div class="brand-count">${b.count}</div>
        </div>
    `).join('');
}

// ============================================
// دوال التنقل بين الصفحات
// ============================================

function showPage(page) {
    // إخفاء كل الصفحات
    document.getElementById('homePage').style.display = 'none';
    document.getElementById('productDetailPage').classList.remove('active');
    document.getElementById('cartPage').classList.remove('active');
    document.getElementById('searchPage').classList.remove('active');
    document.getElementById('contactPage').classList.remove('active');

    // إظهار الصفحة المطلوبة
    if (page === 'home') {
        document.getElementById('homePage').style.display = 'block';
        window.scrollTo(0, 0);
    } else if (page === 'product') {
        document.getElementById('productDetailPage').classList.add('active');
        window.scrollTo(0, 0);
    } else if (page === 'cart') {
        document.getElementById('cartPage').classList.add('active');
        renderCart();
        window.scrollTo(0, 0);
    } else if (page === 'search') {
        document.getElementById('searchPage').classList.add('active');
        performSearch();
        window.scrollTo(0, 0);
    } else if (page === 'contact') {
        document.getElementById('contactPage').classList.add('active');
        window.scrollTo(0, 0);
    }
}

function scrollToSection(id) {
    document.getElementById(id).scrollIntoView({ behavior: 'smooth' });
}

// ============================================
// دوال تفاصيل المنتج
// ============================================

function showProductDetail(id) {
    const product = products.find(p => p.id === id);
    if (!product) return;

    currentProduct = product;
    currentQty = 1;

    const price = safeNumber(product.price, 0);
    const oldPrice = safeNumber(product.oldPrice, 0);

    const detailMainImage = document.getElementById('detailMainImage');
    detailMainImage.src = product.image;
    detailMainImage.onerror = function() { this.src = 'hm_3.jpg'; };
    document.getElementById('detailName').textContent = product.name;
    document.getElementById('detailCategoryLabel').textContent = product.category === 'men' ? 'رجالي' : product.category === 'women' ? 'نسائي' : 'أطفال';
    document.getElementById('detailCategoryLink').textContent = product.category === 'men' ? 'رجالي' : product.category === 'women' ? 'نسائي' : 'أطفال';
    document.getElementById('detailBreadcrumb').textContent = product.name;
    document.getElementById('detailPrice').textContent = formatPrice(price) + ' ر.س';

    const oldPriceEl = document.getElementById('detailOldPrice');
    if (oldPrice > 0 && oldPrice > price) {
        oldPriceEl.textContent = formatPrice(oldPrice) + ' ر.س';
        oldPriceEl.style.display = 'inline';
    } else {
        oldPriceEl.style.display = 'none';
    }

    document.getElementById('qtyInput').value = '1';

    // معرض الصور المصغرة
    const thumbs = [product.image, product.image, product.image, product.image];
    document.getElementById('detailThumbs').innerHTML = thumbs.map((img, i) => `
        <div class="gallery-thumb ${i === 0 ? 'active' : ''}" onclick="changeGalleryImage('${img}', this)">
            <img src="${img}" alt="">
        </div>
    `).join('');

    showPage('product');
}

function changeGalleryImage(src, el) {
    document.getElementById('detailMainImage').src = src;
    document.querySelectorAll('.gallery-thumb').forEach(t => t.classList.remove('active'));
    el.classList.add('active');
}

function changeQty(delta) {
    currentQty = Math.max(1, currentQty + delta);
    document.getElementById('qtyInput').value = currentQty;
}

function addToCartFromDetail() {
    if (currentProduct) {
        addToCart(currentProduct.id, currentQty);
    }
}

// ============================================
// دوال عربة التسوق - تم إصلاح مشكلة NaN
// ============================================

function addToCart(id, qty) {
    const product = products.find(p => p.id === id);
    if (!product) return;

    // التأكد من أن الكمية رقم صحيح
    const safeQty = Math.max(1, safeNumber(qty, 1));

    const existing = cart.find(item => item.id === id);
    if (existing) {
        existing.qty = safeNumber(existing.qty, 0) + safeQty;
    } else {
        // إنشاء نسخة آمنة من المنتج مع التأكد من أن السعر رقم
        cart.push({ 
            id: product.id,
            name: product.name,
            category: product.category,
            price: safeNumber(product.price, 0),
            oldPrice: safeNumber(product.oldPrice, 0),
            image: product.image,
            qty: safeQty 
        });
    }

    updateCartBadge();
    showToast('تمت إضافة المنتج إلى العربة!');
}

function updateCartBadge() {
    const total = cart.reduce((sum, item) => sum + safeNumber(item.qty, 0), 0);
    document.getElementById('cartBadge').textContent = total;
}

function renderCart() {
    const container = document.getElementById('cartItems');
    const summary = document.getElementById('cartSummary');

    if (cart.length === 0) {
        container.innerHTML = `
            <div class="empty-cart">
                <i class="fas fa-shopping-bag"></i>
                <h3>عربة التسوق فارغة</h3>
                <p>ابدأ التسوق واكتشف منتجاتنا المميزة</p>
                <button class="btn-primary" onclick="showPage('home')" style="max-width: 250px; margin: 0 auto;">
                    <i class="fas fa-arrow-left"></i> مواصلة التسوق
                </button>
            </div>
        `;
        summary.style.display = 'none';
        return;
    }

    summary.style.display = 'block';

    container.innerHTML = cart.map((item, index) => {
        const price = safeNumber(item.price, 0);
        const qty = safeNumber(item.qty, 1);
        const totalItemPrice = price * qty;

        return `
            <div class="cart-item">
                <div class="cart-item-img">
                    <img src="${item.image}" alt="${item.name}">
                </div>
                <div class="cart-item-info">
                    <h4>${item.name}</h4>
                    <p>${item.category === 'men' ? 'رجالي' : item.category === 'women' ? 'نسائي' : 'أطفال'} | مقاس M</p>
                    <div class="cart-item-qty" style="margin-top: 10px;">
                        <button onclick="updateCartQty(${index}, -1)">-</button>
                        <span>${qty}</span>
                        <button onclick="updateCartQty(${index}, 1)">+</button>
                    </div>
                </div>
                <div style="text-align: center;">
                    <div class="cart-item-price">${formatPrice(totalItemPrice)} ر.س</div>
                    <button class="remove-btn" onclick="removeFromCart(${index})" style="margin-top: 10px;">
                        <i class="fas fa-trash-alt"></i>
                    </button>
                </div>
            </div>
        `;
    }).join('');

    // حساب المجاميع مع التأكد من صحة الأرقام
    let subtotal = 0;
    let discount = 0;

    cart.forEach(item => {
        const price = safeNumber(item.price, 0);
        const oldPrice = safeNumber(item.oldPrice, 0);
        const qty = safeNumber(item.qty, 1);

        subtotal += price * qty;

        if (oldPrice > price) {
            discount += (oldPrice - price) * qty;
        }
    });

    const originalTotal = subtotal + discount;
    const total = subtotal;

    document.getElementById('subtotal').textContent = formatPrice(originalTotal) + ' ر.س';
    document.getElementById('discount').textContent = formatPrice(discount) + ' ر.س';
    document.getElementById('total').textContent = formatPrice(total) + ' ر.س';
}

function updateCartQty(index, delta) {
    const item = cart[index];
    if (!item) return;

    const currentQty = safeNumber(item.qty, 1);
    const newQty = Math.max(1, currentQty + delta);

    item.qty = newQty;
    updateCartBadge();
    renderCart();
}

function removeFromCart(index) {
    if (index >= 0 && index < cart.length) {
        cart.splice(index, 1);
    }
    updateCartBadge();
    renderCart();
    showToast('تمت إزالة المنتج من العربة');
}

// ============================================
// دوال البحث
// ============================================

function performSearch() {
    const query = document.getElementById('searchInput').value.toLowerCase();
    const results = products.filter(p => 
        p.name.toLowerCase().includes(query) || 
        p.category.includes(query)
    );

    document.getElementById('searchCount').textContent = results.length;
    document.getElementById('searchResults').innerHTML = results.map(p => createProductCard(p)).join('');

    if (!document.getElementById('searchPage').classList.contains('active')) {
        showPage('search');
    }
}

function filterCategory(cat) {
    const results = products.filter(p => p.category === cat);
    document.getElementById('searchCount').textContent = results.length;
    document.getElementById('searchResults').innerHTML = results.map(p => createProductCard(p)).join('');
    showPage('search');
}

function filterSearch(type, event) {
    document.querySelectorAll('.filter-chip').forEach(c => c.classList.remove('active'));
    if (event && event.target) {
        event.target.classList.add('active');
    }

    let results = products;
    if (type !== 'all') {
        if (type === 'sale') {
            results = products.filter(p => p.badge === 'sale');
        } else {
            results = products.filter(p => p.category === type);
        }
    }

    document.getElementById('searchCount').textContent = results.length;
    document.getElementById('searchResults').innerHTML = results.map(p => createProductCard(p)).join('');
}

// ============================================
// دوال عارض الشرائح
// ============================================

function goToSlide(index) {
    const slides = document.querySelectorAll('.hero-slide');
    const thumbs = document.querySelectorAll('.hero-thumb');

    slides.forEach((s, i) => s.classList.toggle('active', i === index));
    thumbs.forEach((t, i) => t.classList.toggle('active', i === index));

    currentSlide = index;
}

function startSlider() {
    setInterval(() => {
        currentSlide = (currentSlide + 1) % 3;
        goToSlide(currentSlide);
    }, 9000);
}

// ============================================
// دوال مساعدة
// ============================================

function showToast(message) {
    const toast = document.getElementById('toast');
    document.getElementById('toastMessage').textContent = message;
    toast.classList.add('show');
    setTimeout(() => toast.classList.remove('show'), 3000);
}

function toggleMobileMenu() {
    const nav = document.getElementById('navBar');
    nav.style.display = nav.style.display === 'block' ? 'none' : 'block';
}

function handleContactSubmit(event) {
    event.preventDefault();
    const form = event.target;
    if (!form.checkValidity()) {
        form.reportValidity();
        return;
    }
    showToast('تم إرسال رسالتك بنجاح!');
    form.reset();
}

function handleNewsletterSubmit(event) {
    event.preventDefault();
    const form = event.target;
    if (!form.checkValidity()) {
        form.reportValidity();
        return;
    }
    showToast('تم الاشتراك بنجاح في النشرة!');
    form.reset();
}

// ============================================
// تشغيل عند تحميل الصفحة
// ============================================
document.addEventListener('DOMContentLoaded', init);