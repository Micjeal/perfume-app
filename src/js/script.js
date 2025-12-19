// Global functionality for LUXE SCENTS app

document.addEventListener('DOMContentLoaded', function() {
    // Theme toggle functionality
    initThemeToggle();

    // Bottom navigation
    initBottomNav();

    // Cart functionality
    initCart();

    // Shop page functionality
    if (document.querySelector('.shop-page')) {
        initShopPage();
    }

    // Product detail page
    if (document.querySelector('.product-detail-page')) {
        initProductDetail();
    }

    // Quiz page
    if (document.querySelector('.quiz-page')) {
        initQuiz();
    }

    // Cart page
    if (document.querySelector('.cart-page')) {
        initCartPage();
    }

    // Profile page
    if (document.querySelector('.profile-page')) {
        initProfile();
    }

    // Wishlist page
    if (document.querySelector('.wishlist-page')) {
        initWishlist();
    }

    // Compare page
    if (document.querySelector('.compare-page')) {
        initCompare();
    }

    // Reviews page
    if (document.querySelector('.reviews-page')) {
        initReviews();
    }

    // Newsletter form
    initNewsletter();

    // Menu toggle for home
    initMenuToggle();
});

// Theme toggle
function initThemeToggle() {
    // Add theme toggle button to header
    const header = document.querySelector('header');
    if (header) {
        const themeBtn = document.createElement('button');
        themeBtn.className = 'flex size-10 items-center justify-center rounded-full hover:bg-stone-100 dark:hover:bg-stone-800 transition-colors';
        themeBtn.innerHTML = '<span class="material-symbols-outlined text-2xl">dark_mode</span>';
        themeBtn.addEventListener('click', toggleTheme);

        // Find the container div
        const container = header.querySelector('div') || header;
        const title = container.querySelector('h1, h2');
        if (title) {
            container.insertBefore(themeBtn, title);
        } else {
            // Fallback: append to container
            container.appendChild(themeBtn);
        }
    }

    // Load saved theme
    const savedTheme = localStorage.getItem('theme') || 'light';
    document.documentElement.classList.toggle('dark', savedTheme === 'dark');
}

function toggleTheme() {
    const isDark = document.documentElement.classList.toggle('dark');
    localStorage.setItem('theme', isDark ? 'dark' : 'light');
}

// Bottom navigation
function initBottomNav() {
    const nav = document.querySelector('.fixed.bottom-6.inset-x-4 nav') || document.querySelector('.fixed.bottom-0 nav');
    if (!nav) return;

    const links = nav.querySelectorAll('a, button');
    links.forEach((link, index) => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            switch(index) {
                case 0: window.location.href = '../01-home/index.html'; break;
                case 1: window.location.href = '../02-shop/index.html'; break;
                case 2: window.location.href = '../07-profile/index.html'; break;
                case 3: window.location.href = '../10-reviews/index.html'; break;
            }
        });
    });
}

// Cart functionality
function initCart() {
    updateCartCount();

    // Add to cart buttons
    document.querySelectorAll('.add-to-cart').forEach(btn => {
        btn.addEventListener('click', (e) => {
            e.preventDefault();
            const product = getProductData(btn);
            addToCart(product);
            updateCartCount();
            showToast('Added to cart!');
        });
    });

    // Cart button links
    document.querySelectorAll('[href*="cart"]').forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            window.location.href = '../06-cart/index.html';
        });
    });
}

function getProductData(btn) {
    const card = btn.closest('.group, .flex.flex-col');
    const name = card.querySelector('h3, h4')?.textContent || 'Product';
    const price = card.querySelector('.font-bold')?.textContent || '$0';
    const img = card.querySelector('img')?.src || '';
    return { id: Date.now(), name, price, img, quantity: 1 };
}

function addToCart(product) {
    let cart = [];
    try {
        const stored = localStorage.getItem('cart');
        cart = stored ? JSON.parse(stored) : [];
        if (!Array.isArray(cart)) cart = [];
    } catch (e) {
        cart = [];
    }
    const existing = cart.find(item => item.name === product.name);
    if (existing) {
        existing.quantity += 1;
    } else {
        cart.push(product);
    }
    localStorage.setItem('cart', JSON.stringify(cart));
}

function updateCartCount() {
    let cart = [];
    try {
        const stored = localStorage.getItem('cart');
        cart = stored ? JSON.parse(stored) : [];
        if (!Array.isArray(cart)) cart = [];
    } catch (e) {
        cart = [];
    }
    const count = cart.reduce((sum, item) => sum + (item.quantity || 1), 0);
    document.querySelectorAll('.cart-count').forEach(el => {
        el.textContent = count;
        el.style.display = count > 0 ? 'block' : 'none';
    });
}

function showToast(message) {
    const toast = document.createElement('div');
    toast.className = 'fixed top-20 left-1/2 transform -translate-x-1/2 bg-primary text-black px-4 py-2 rounded-full font-bold z-50';
    toast.textContent = message;
    document.body.appendChild(toast);
    setTimeout(() => toast.remove(), 2000);
}

// Shop page
function initShopPage() {
    // Search functionality
    const searchInput = document.querySelector('input[placeholder*="Search"]');
    if (searchInput) {
        searchInput.addEventListener('input', filterProducts);
    }

    // Filter chips
    document.querySelectorAll('.filter-chip').forEach(chip => {
        chip.addEventListener('click', () => {
            document.querySelectorAll('.filter-chip').forEach(c => c.classList.remove('active'));
            chip.classList.add('active');
            filterProducts();
        });
    });

    // Sort button
    const sortBtn = document.querySelector('button:has(.swap_vert)');
    if (sortBtn) {
        sortBtn.addEventListener('click', () => {
            // Simple sort by price
            const products = Array.from(document.querySelectorAll('.product-card'));
            products.sort((a, b) => {
                const priceA = parseFloat(a.querySelector('.font-bold')?.textContent.replace('$', '') || 0);
                const priceB = parseFloat(b.querySelector('.font-bold')?.textContent.replace('$', '') || 0);
                return priceA - priceB;
            });
            const container = document.querySelector('.grid.grid-cols-2');
            container.innerHTML = '';
            products.forEach(p => container.appendChild(p));
        });
    }
}

function filterProducts() {
    const searchTerm = document.querySelector('input[placeholder*="Search"]')?.value.toLowerCase() || '';
    const activeFilter = document.querySelector('.filter-chip.active')?.textContent.toLowerCase() || 'all';

    document.querySelectorAll('.product-card').forEach(card => {
        const name = card.querySelector('h3')?.textContent.toLowerCase() || '';
        const category = card.dataset.category || 'all';
        const matchesSearch = name.includes(searchTerm);
        const matchesFilter = activeFilter === 'all' || category === activeFilter;
        card.style.display = matchesSearch && matchesFilter ? 'block' : 'none';
    });
}

// Product detail
function initProductDetail() {
    // Add to cart
    const addBtn = document.querySelector('.add-to-bag, .add-to-cart');
    if (addBtn) {
        addBtn.addEventListener('click', () => {
            const product = {
                id: Date.now(),
                name: document.querySelector('h1')?.textContent || 'Product',
                price: document.querySelector('.text-2xl.font-bold')?.textContent || '$0',
                img: document.querySelector('img')?.src || '',
                quantity: 1
            };
            addToCart(product);
            updateCartCount();
            showToast('Added to cart!');
        });
    }

    // Volume selection
    document.querySelectorAll('.volume-btn').forEach(btn => {
        btn.addEventListener('click', () => {
            document.querySelectorAll('.volume-btn').forEach(b => b.classList.remove('selected'));
            btn.classList.add('selected');
        });
    });

    // Image switching
    const mainImage = document.querySelector('.main-image');
    const thumbnails = document.querySelectorAll('.thumbnail-btn');
    thumbnails.forEach((thumb, index) => {
        thumb.addEventListener('click', () => {
            // Update main image
            const imgSrc = thumb.querySelector('img').src;
            if (mainImage) {
                mainImage.style.backgroundImage = `url(${imgSrc})`;
            }
            // Update active thumbnail
            thumbnails.forEach(t => t.classList.remove('active'));
            thumb.classList.add('active');
        });
    });
}

// Quiz
function initQuiz() {
    let currentQuestion = 0;
    const questions = [
        { text: 'What vibe are you going for?', options: ['Fresh', 'Romantic', 'Bold', 'Relaxed'] },
        { text: 'What\'s your preferred scent family?', options: ['Floral', 'Woody', 'Citrus', 'Oriental'] },
        { text: 'How long do you want the scent to last?', options: ['4-6 hours', '6-8 hours', '8-12 hours', 'All day'] }
    ];

    document.querySelectorAll('.quiz-option').forEach((option, index) => {
        option.addEventListener('click', () => {
            // Mark selected
            document.querySelectorAll('.quiz-option').forEach(o => o.classList.remove('selected'));
            option.classList.add('selected');

            // Next question after delay
            setTimeout(() => {
                currentQuestion++;
                if (currentQuestion < questions.length) {
                    updateQuizQuestion(currentQuestion);
                } else {
                    showQuizResult();
                }
            }, 500);
        });
    });

    function updateQuizQuestion(qIndex) {
        const question = questions[qIndex];
        document.querySelector('.quiz-question').textContent = question.text;
        document.querySelectorAll('.quiz-option').forEach((opt, i) => {
            opt.querySelector('p').textContent = question.options[i];
        });
        document.querySelector('.progress-bar').style.width = `${(qIndex + 1) / questions.length * 100}%`;
        document.querySelector('.question-number').textContent = `Question ${qIndex + 1} of ${questions.length}`;
    }

    function showQuizResult() {
        // Simple result
        alert('Based on your answers, we recommend: Midnight Rose!');
        window.location.href = '../03-product-detail/index.html';
    }
}

// Cart page
function initCartPage() {
    loadCartItems();

    // Clear cart
    const clearBtn = document.querySelector('button:has(.delete_outline)');
    if (clearBtn) {
        clearBtn.addEventListener('click', () => {
            localStorage.removeItem('cart');
            loadCartItems();
            updateCartCount();
        });
    }

    // Checkout
    const checkoutBtn = document.querySelector('button:has(.arrow_forward)');
    if (checkoutBtn) {
        checkoutBtn.addEventListener('click', () => {
            window.location.href = '../05-checkout/index.html';
        });
    }
}

function loadCartItems() {
    let cart = [];
    try {
        const stored = localStorage.getItem('cart');
        cart = stored ? JSON.parse(stored) : [];
        if (!Array.isArray(cart)) cart = [];
    } catch (e) {
        cart = [];
    }
    const container = document.querySelector('.cart-items');
    if (!container) return;

    container.innerHTML = '';
    let total = 0;

    cart.forEach(item => {
        const itemTotal = parseFloat(item.price.replace('$', '')) * (item.quantity || 1);
        total += itemTotal;

        const itemEl = document.createElement('div');
        itemEl.className = 'bg-surface-light dark:bg-surface-dark rounded-2xl p-4 border border-neutral-200 dark:border-neutral-700 flex gap-4 group';
        itemEl.innerHTML = `
            <img src="${item.img}" alt="${item.name}" class="w-24 h-24 shrink-0 rounded-xl overflow-hidden bg-neutral-100 dark:bg-neutral-800">
            <div class="flex-1 flex flex-col justify-between">
                <div>
                    <h3 class="text-base font-bold text-neutral-900 dark:text-white leading-tight mt-0.5">${item.name}</h3>
                    <p class="text-sm text-neutral-500 dark:text-neutral-400 mt-1">Quantity: ${item.quantity}</p>
                </div>
                <div class="flex items-center justify-between mt-2">
                    <span class="text-base font-bold text-neutral-900 dark:text-white">${item.price}</span>
                    <button class="remove-item text-red-500 hover:text-red-700" data-id="${item.id}">Remove</button>
                </div>
            </div>
        `;
        container.appendChild(itemEl);
    });

    // Update total
    document.querySelector('.cart-total').textContent = `$${total.toFixed(2)}`;

    // Remove item listeners
    document.querySelectorAll('.remove-item').forEach(btn => {
        btn.addEventListener('click', () => {
            const id = btn.dataset.id;
            let cart = [];
            try {
                const stored = localStorage.getItem('cart');
                cart = stored ? JSON.parse(stored) : [];
                if (!Array.isArray(cart)) cart = [];
            } catch (e) {
                cart = [];
            }
            const updatedCart = cart.filter(item => item.id != id);
            localStorage.setItem('cart', JSON.stringify(updatedCart));
            loadCartItems();
            updateCartCount();
        });
    });
}

// Profile
function initProfile() {
    // Dark mode toggle
    const darkToggle = document.querySelector('input[type="checkbox"]');
    if (darkToggle) {
        darkToggle.addEventListener('change', toggleTheme);
        darkToggle.checked = document.documentElement.classList.contains('dark');
    }
}

// Wishlist
function initWishlist() {
    // Add to cart from wishlist
    document.querySelectorAll('.add-to-cart').forEach(btn => {
        btn.addEventListener('click', (e) => {
            e.preventDefault();
            const product = getProductData(btn);
            addToCart(product);
            updateCartCount();
            showToast('Added to cart!');
        });
    });

    // Clear all
    const clearBtn = document.querySelector('button:has(.Clear All)');
    if (clearBtn) {
        clearBtn.addEventListener('click', () => {
            // Clear wishlist (assuming stored similarly)
            localStorage.removeItem('wishlist');
            document.querySelectorAll('.wishlist-item').forEach(item => item.remove());
        });
    }
}

// Compare
function initCompare() {
    // Remove from compare
    document.querySelectorAll('.remove-compare').forEach(btn => {
        btn.addEventListener('click', () => {
            btn.closest('.compare-item').remove();
        });
    });
}

// Reviews
function initReviews() {
    // Filter reviews
    document.querySelectorAll('.review-filter').forEach(filter => {
        filter.addEventListener('click', () => {
            document.querySelectorAll('.review-filter').forEach(f => f.classList.remove('active'));
            filter.classList.add('active');
            // Filter logic here
        });
    });
}

// Newsletter
function initNewsletter() {
    const form = document.querySelector('form:has(input[type="email"])');
    if (form) {
        form.addEventListener('submit', (e) => {
            e.preventDefault();
            showToast('Subscribed successfully!');
            form.reset();
        });
    }
}

// Menu toggle
function initMenuToggle() {
    const openBtn = document.getElementById('open-menu');
    const closeBtn = document.getElementById('close-menu');
    const menu = document.getElementById('side-menu');
    const menuContent = menu?.querySelector('div');

    if (openBtn && menu) {
        openBtn.addEventListener('click', () => {
            menu.classList.remove('invisible', 'opacity-0');
            menu.classList.add('opacity-100', 'visible');
            menuContent?.classList.remove('-translate-x-full');
        });
    }

    if (closeBtn && menu) {
        closeBtn.addEventListener('click', () => {
            menu.classList.add('opacity-0');
            menuContent?.classList.add('-translate-x-full');
            setTimeout(() => {
                menu.classList.add('invisible');
                menu.classList.remove('visible');
            }, 300);
        });
    }

    // Close on overlay click
    if (menu) {
        menu.addEventListener('click', (e) => {
            if (e.target === menu) {
                closeBtn?.click();
            }
        });
    }
}