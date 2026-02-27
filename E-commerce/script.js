// Product Database with high-quality placeholder images
const products = [
    { id: 1, name: "Mechanical RGB Keyboard", price: 4500, category: "Gaming", img: "https://images.unsplash.com/photo-1595225476474-87563907a212?w=500&auto=format&fit=crop&q=60" },
    { id: 2, name: "Wireless Pro Mouse", price: 2500, category: "Workspace", img: "https://shop.zebronics.com/cdn/shop/files/Zeb-K5002MW-pic1_b20858ce-1b0c-4973-b3c6-2a824d76bf4c.jpg?v=1729670202&width=2000" },
    { id: 3, name: "Studio Headset 7.1", price: 5000, category: "Audio", img: "https://images.unsplash.com/photo-1618366712010-f4ae9c647dcb?w=500&auto=format&fit=crop&q=60" },
    { id: 4, name: "UltraWide Curved Monitor", price: 28000, category: "Gaming", img: "https://images.unsplash.com/photo-1525547719571-a2d4ac8945e2?w=500&auto=format&fit=crop&q=60" },
    { id: 5, name: "Noise Cancelling Earbuds", price: 3500, category: "Audio", img: "https://images.unsplash.com/photo-1590658268037-6bf12165a8df?w=500&auto=format&fit=crop&q=60" },
    { id: 6, name: "Ergonomic Desk Chair", price: 12000, category: "Workspace", img: "https://images.unsplash.com/photo-1505843490538-5133c6c7d0e1?w=500&auto=format&fit=crop&q=60" }
];

let cart = [];
let currentCategory = 'All';

// 1. Render Products
function renderProducts(items) {
    const grid = document.getElementById('productsGrid');
    
    if (items.length === 0) {
        grid.innerHTML = `<h3 style="grid-column: 1/-1; text-align: center; color: var(--text-muted); margin-top: 50px;">No products found.</h3>`;
        return;
    }

    grid.innerHTML = items.map(p => `
        <div class="product-card">
            <div class="image-container">
                <img src="${p.img}" alt="${p.name}" class="product-img">
            </div>
            <div class="product-cat">${p.category}</div>
            <h3 class="product-title">${p.name}</h3>
            <div class="price-row">
                <span class="price">₹${p.price.toLocaleString()}</span>
                <button class="add-btn" onclick="addToCart(${p.id})">
                    <i class="fas fa-shopping-cart"></i> Add
                </button>
            </div>
        </div>
    `).join('');
}

// Initial Load
renderProducts(products);

// 2. Category Filter Logic
function filterCategory(category) {
    currentCategory = category;
    document.getElementById('categoryTitle').innerText = category === 'All' ? 'All Products' : category;
    
    // Update active class on sidebar
    const listItems = document.getElementById('categoryList').querySelectorAll('li');
    listItems.forEach(li => li.classList.remove('active'));
    event.target.classList.add('active');

    const filtered = category === 'All' ? products : products.filter(p => p.category === category);
    document.getElementById('sortSelect').value = 'default'; // Reset sort when changing category
    renderProducts(filtered);
}

// 3. Search Logic
document.getElementById('searchInput').addEventListener('input', (e) => {
    const term = e.target.value.toLowerCase();
    const filtered = products.filter(p => p.name.toLowerCase().includes(term));
    renderProducts(filtered);
});

// 4. Sort Logic
function sortProducts() {
    const sortVal = document.getElementById('sortSelect').value;
    let items = currentCategory === 'All' ? [...products] : products.filter(p => p.category === currentCategory);
    
    if (sortVal === 'lowToHigh') items.sort((a, b) => a.price - b.price);
    if (sortVal === 'highToLow') items.sort((a, b) => b.price - a.price);
    
    renderProducts(items);
}

// 5. Cart Management (Add, Update Quantity, Remove)
function addToCart(id) {
    const product = products.find(p => p.id === id);
    const existingItem = cart.find(item => item.id === id);

    if (existingItem) {
        existingItem.quantity += 1;
    } else {
        cart.push({ ...product, quantity: 1 });
    }
    
    updateCartUI();
    showToast();
}

function updateQuantity(id, change) {
    const item = cart.find(p => p.id === id);
    if (item) {
        item.quantity += change;
        if (item.quantity <= 0) {
            cart = cart.filter(p => p.id !== id);
        }
        updateCartUI();
    }
}

// ===== 🚀 UPDATED CART UI WITH GST LOGIC 🚀 =====
function updateCartUI() {
    const cartItemsDiv = document.getElementById('cartItems');
    const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
    
    // Naya Calculation Logic
    const subtotal = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    const gstAmount = subtotal * 0.18; // 18% GST Calculate ho raha hai
    const finalTotal = subtotal + gstAmount; // Final Bill

    // Update Badge & Amount Displays
    document.getElementById('cartBadge').innerText = totalItems;
    
    // Agar id nahi mila to error se bachne ke liye check
    if(document.getElementById('cartSubtotal')) {
        document.getElementById('cartSubtotal').innerText = `₹${subtotal.toLocaleString()}`;
    }
    if(document.getElementById('cartGst')) {
        document.getElementById('cartGst').innerText = `₹${Math.round(gstAmount).toLocaleString()}`;
    }
    if(document.getElementById('cartTotalFinal')) {
        document.getElementById('cartTotalFinal').innerText = `₹${Math.round(finalTotal).toLocaleString()}`;
    }

    // Render Cart Items
    if (cart.length === 0) {
        cartItemsDiv.innerHTML = `
            <div style="text-align:center; color: var(--text-muted); margin-top: 50px;">
                <i class="fas fa-shopping-cart" style="font-size: 50px; margin-bottom: 20px; opacity: 0.5;"></i>
                <p>Your cart is currently empty.</p>
            </div>`;
        return;
    }

    cartItemsDiv.innerHTML = cart.map(item => `
        <div class="cart-item">
            <img src="${item.img}" alt="${item.name}">
            <div class="item-details">
                <h4>${item.name}</h4>
                <div class="item-price">₹${(item.price * item.quantity).toLocaleString()}</div>
                <div class="qty-controls">
                    <button class="qty-btn" onclick="updateQuantity(${item.id}, -1)"><i class="fas fa-minus"></i></button>
                    <span>${item.quantity}</span>
                    <button class="qty-btn" onclick="updateQuantity(${item.id}, 1)"><i class="fas fa-plus"></i></button>
                </div>
            </div>
        </div>
    `).join('');
}

// 6. Drawer UI (Open & Close)
const cartDrawer = document.getElementById('cartDrawer');
const cartOverlay = document.getElementById('cartOverlay');

document.getElementById('cartIcon').onclick = () => {
    cartDrawer.classList.add('active');
    cartOverlay.classList.add('active');
};

const closeCart = () => {
    cartDrawer.classList.remove('active');
    cartOverlay.classList.remove('active');
};

document.getElementById('closeCart').onclick = closeCart;
cartOverlay.onclick = closeCart;

// 7. Theme Toggle (Dark Mode / Light Mode)
const themeBtn = document.getElementById('themeToggle');
const body = document.getElementById('body');

themeBtn.onclick = () => {
    if (body.classList.contains('dark-mode')) {
        body.classList.replace('dark-mode', 'light-mode');
        themeBtn.innerHTML = '<i class="fas fa-moon"></i>';
    } else {
        body.classList.replace('light-mode', 'dark-mode');
        themeBtn.innerHTML = '<i class="fas fa-sun"></i>';
    }
};

// 8. Toast Notification
function showToast() {
    const toast = document.getElementById('toast');
    toast.classList.add('show');
    // Hide toast after 3 seconds
    setTimeout(() => { toast.classList.remove('show'); }, 3000);
}

// 9. Checkout Simulation
function checkout() {
    if (cart.length === 0) return alert('Please add items to your cart first!');
    
    // Naya alert message jisme GST aur Final amount included hai
    const subtotal = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    const finalBill = Math.round(subtotal + (subtotal * 0.18));
    
    alert(`Processing your order for ₹${finalBill.toLocaleString()} (including GST)... \n\nSuccess! 🎉 Thank you for shopping with FQ Store.`);
    cart = [];
    updateCartUI();
    closeCart();
}

// Initialize Cart UI on load
updateCartUI();