// Products data
const products = [
  {
    id: 1,
    name: "Smartphone",
    category: "electronics",
    price: 12000,
    image: "https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?auto=format&fit=crop&w=600&q=80"
  },
  {
    id: 2,
    name: "Wireless Headphones",
    category: "electronics",
    price: 2500,
    image: "https://images.unsplash.com/photo-1612178991471-1c3041a0a650?auto=format&fit=crop&w=600&q=80"
  },
  {
    id: 3,
    name: "Cotton T-Shirt",
    category: "clothing",
    price: 600,
    image: "https://images.unsplash.com/photo-1585386959984-a41552254c1a?auto=format&fit=crop&w=600&q=80"
  },
  {
    id: 4,
    name: "Designer Jeans",
    category: "clothing",
    price: 1200,
    image: "https://images.unsplash.com/photo-1583001508264-bd5fc1a8321b?auto=format&fit=crop&w=600&q=80"
  },
  {
    id: 5,
    name: "Smart Watch",
    category: "electronics",
    price: 8000,
    image: "https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&w=600&q=80"
  },
  {
    id: 6,
    name: "Casual Jacket",
    category: "clothing",
    price: 1800,
    image: "https://images.unsplash.com/photo-1551028719-00167b16eac5?auto=format&fit=crop&w=600&q=80"
  },
  {
    id: 7,
    name: "Coffee Maker",
    category: "home",
    price: 3500,
    image: "https://images.unsplash.com/photo-1506619216599-9d16d0903dfd?auto=format&fit=crop&w=600&q=80"
  },
  {
    id: 8,
    name: "Bluetooth Speaker",
    category: "electronics",
    price: 3200,
    image: "https://images.unsplash.com/photo-1546435770-a3e426bf472b?auto=format&fit=crop&w=600&q=80"
  }
];

let cart = [];
let isLoggedIn = false;

// DOM Elements
const cartButton = document.getElementById('cartButton');
const cartCount = document.getElementById('cartCount');
const cartModal = document.getElementById('cartModal');
const overlay = document.getElementById('overlay');
const notification = document.getElementById('notification');
const loginSection = document.getElementById('loginSection');
const productsSection = document.getElementById('productsSection');
const productsGrid = document.getElementById('productsGrid');
const loginBtn = document.getElementById('loginBtn');
const categoryFilter = document.getElementById('categoryFilter');
const sortFilter = document.getElementById('sortFilter');
const closeCart = document.getElementById('closeCart');
const checkoutBtn = document.getElementById('checkoutBtn');
const cartItems = document.getElementById('cartItems');
const totalPrice = document.getElementById('totalPrice');

// Initialize
document.addEventListener('DOMContentLoaded', () => {
  cartButton.addEventListener('click', toggleCart);
  loginBtn.addEventListener('click', login);
  closeCart.addEventListener('click', toggleCart);
  checkoutBtn.addEventListener('click', checkout);
  categoryFilter.addEventListener('change', filterProducts);
  sortFilter.addEventListener('change', filterProducts);
  overlay.addEventListener('click', toggleCart);
  
  renderProducts();
});

// Login function
function login() {
  const username = document.getElementById('username').value;
  const password = document.getElementById('password').value;
  
  if (username === 'user' && password === '1234') {
    isLoggedIn = true;
    loginSection.style.display = 'none';
    productsSection.style.display = 'block';
    showNotification('Login successful! Happy shopping!');
  } else {
    showNotification('Invalid credentials! Hint: user / 1234', 'error');
  }
}

// Render products
function renderProducts() {
  productsGrid.innerHTML = '';
  
  const category = categoryFilter.value;
  const sort = sortFilter.value;
  
  let filteredProducts = [...products];
  
  // Filter by category
  if (category !== 'all') {
    filteredProducts = filteredProducts.filter(p => p.category === category);
  }
  
  // Sort products
  if (sort === 'price-asc') {
    filteredProducts.sort((a, b) => a.price - b.price);
  } else if (sort === 'price-desc') {
    filteredProducts.sort((a, b) => b.price - a.price);
  }
  
  // Render products
  filteredProducts.forEach(product => {
    const productCard = document.createElement('div');
    productCard.className = 'product-card';
    productCard.innerHTML = `
      <div class="product-badge">${product.category.charAt(0).toUpperCase() + product.category.slice(1)}</div>
      <img src="${product.image}" alt="${product.name}" class="product-image">
      <div class="product-info">
        <div class="product-category">${product.category}</div>
        <h3 class="product-name">${product.name}</h3>
        <div class="product-price">₹${product.price.toLocaleString()}</div>
        <button class="add-to-cart" data-id="${product.id}">
          <i class="fas fa-cart-plus"></i> Add to Cart
        </button>
      </div>
    `;
    productsGrid.appendChild(productCard);
  });
  
  // Add event listeners to the "Add to Cart" buttons
  document.querySelectorAll('.add-to-cart').forEach(button => {
    button.addEventListener('click', function() {
      const productId = parseInt(this.getAttribute('data-id'));
      addToCart(productId);
    });
  });
}

// Filter products
function filterProducts() {
  renderProducts();
}

// Add to cart
function addToCart(id) {
  if (!isLoggedIn) {
    showNotification('Please login to add items to cart!', 'error');
    return;
  }
  
  const product = products.find(p => p.id === id);
  cart.push(product);
  updateCartCount();
  renderCartItems();
  showNotification(`${product.name} added to cart!`);
  
  // Close cart if it's open and more than 5 items
  if (cart.length > 5 && cartModal.classList.contains('active')) {
    toggleCart();
  }
}

// Remove from cart
function removeFromCart(index) {
  const removedItem = cart[index];
  cart.splice(index, 1);
  updateCartCount();
  renderCartItems();
  showNotification(`${removedItem.name} removed from cart`, 'warning');
}

// Update cart count
function updateCartCount() {
  cartCount.textContent = cart.length;
}

// Render cart items
function renderCartItems() {
  cartItems.innerHTML = '';
  
  if (cart.length === 0) {
    cartItems.innerHTML = '<p style="text-align: center; padding: 30px;">Your cart is empty</p>';
    totalPrice.textContent = '0';
    return;
  }
  
  let total = 0;
  
  cart.forEach((item, index) => {
    total += item.price;
    
    const cartItem = document.createElement('div');
    cartItem.className = 'cart-item';
    cartItem.innerHTML = `
      <img src="${item.image}" alt="${item.name}" class="cart-item-image">
      <div class="cart-item-details">
        <div class="cart-item-name">${item.name}</div>
        <div class="cart-item-price">₹${item.price.toLocaleString()}</div>
      </div>
      <button class="remove-item" data-index="${index}">
        <i class="fas fa-trash"></i>
      </button>
    `;
    cartItems.appendChild(cartItem);
  });
  
  totalPrice.textContent = total.toLocaleString();
  
  // Add event listeners to remove buttons
  document.querySelectorAll('.remove-item').forEach(button => {
    button.addEventListener('click', function() {
      const index = parseInt(this.getAttribute('data-index'));
      removeFromCart(index);
    });
  });
}

// Toggle cart visibility
function toggleCart() {
  cartModal.classList.toggle('active');
  overlay.classList.toggle('active');
  
  // Prevent body scroll when cart is open
  document.body.style.overflow = cartModal.classList.contains('active') ? 'hidden' : 'auto';
  
  // Render cart items when cart is opened
  if (cartModal.classList.contains('active')) {
    renderCartItems();
  }
}

// Checkout function
function checkout() {
  if (cart.length === 0) {
    showNotification('Your cart is empty!', 'error');
    return;
  }
  
  const total = cart.reduce((sum, item) => sum + item.price, 0);
  showNotification(`Order placed successfully! Total: ₹${total.toLocaleString()}`, 'success');
  
  // Clear cart
  cart = [];
  updateCartCount();
  renderCartItems();
  
  // Close cart
  toggleCart();
}

// Show notification
function showNotification(message, type = 'success') {
  notification.textContent = message;
  notification.className = 'notification';
  
  // Set notification color based on type
  if (type === 'error') {
    notification.style.backgroundColor = 'var(--danger)';
  } else if (type === 'warning') {
    notification.style.backgroundColor = '#ffc107';
  } else {
    notification.style.backgroundColor = 'var(--success)';
  }
  
  notification.classList.add('show');
  
  // Hide after 3 seconds
  setTimeout(() => {
    notification.classList.remove('show');
  }, 3000);
}