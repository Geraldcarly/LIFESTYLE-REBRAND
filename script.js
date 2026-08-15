// ==================== DATA ====================
const products = [
  { id: 1, name: "Essential Tee - Black", category: "T-Shirts", price: 40000, image: "frontblacktshirt.html.JPEG", sizes: ["XS","S","M","L","XL","XXL"], colors: ["#111111","#FFFFFF","#8B4513"], rating: 4.8, tag: "bestseller", isNew: true },
  { id: 2, name: "Essential Tee - White", category: "T-Shirts", price: 40000, image: "frontwhitetshirt2.html.png", sizes: ["XS","S","M","L","XL","XXL"], colors: ["#FFFFFF","#111111"], rating: 4.9, tag: "bestseller", isNew: true },
  { id: 3, name: "Essential Tee - Brown", category: "T-Shirts", price: 40000, image: "frontbrowntshirt.html.JPEG", sizes: ["XS","S","M","L","XL","XXL"], colors: ["#8B4513","#111111"], rating: 4.7, tag: "new", isNew: true },
  { id: 4, name: "Signature Tee - Pink", category: "T-Shirts", price: 40000, image: "pinktshirt.html.jpeg", sizes: ["S","M","L","XL"], colors: ["#FFC0CB","#111111"], rating: 4.9, tag: "new", isNew: true },
  { id: 5, name: "Crop Tee - Black", category: "Crop Tees", price: 30000, image: "crop2.html.jpeg", sizes: ["XS","S","M","L"], colors: ["#111111","#FFFFFF"], rating: 4.6, tag: "new", isNew: true },
  { id: 6, name: "Jersey - Blue", category: "Jerseys", price: 35000, image: "bluejersey.html.jpeg", sizes: ["S","M","L","XL","XXL"], colors: ["#0000FF","#111111"], rating: 4.9, tag: "bestseller", isNew: false },
  { id: 7, name: "Classic Tote - Grey", category: "Tote Bags", price: 40000, image: "https://images.unsplash.com/photo-1544816155-12df9643f363?w=600", sizes: ["One Size"], colors: ["#808080","#F5F5DC"], rating: 4.9, tag: "bestseller", isNew: false }
];

let cart = JSON.parse(localStorage.getItem('lifestyle_cart') || '[]');

// ==================== UTILS ====================
const formatPrice = (p) => 'TSH ' + p.toLocaleString('en-US');
const showToast = (msg) => { 
  const t = document.getElementById('toast'); 
  t.textContent = msg; 
  t.classList.add('show'); 
  setTimeout(() => t.classList.remove('show'), 2500); 
};
const saveCart = () => localStorage.setItem('lifestyle_cart', JSON.stringify(cart));

// ==================== SEO ROUTING ====================
function navigateTo(page) {
  document.querySelectorAll('.page').forEach(p => p.classList.remove('active'));
  const target = document.getElementById('page-' + page);
  if (target) target.classList.add('active');
  history.pushState({ page: page }, '', '/' + page);
  const titles = { home: 'Home', shop: 'Shop', about: 'About Us', community: 'Community', contact: 'Contact', cart: 'Cart' };
  document.title = `Lifestyle — ${titles[page] || 'Premium Fashion Brand'}`;
  window.scrollTo(0, 0);
  if (page === 'shop') renderShopProducts();
  if (page === 'cart') renderCart();
  document.getElementById('navLinks').classList.remove('mobile-open');
}

window.addEventListener('popstate', (event) => {
  if (event.state && event.state.page) navigateTo(event.state.page);
  else navigateTo('home');
});

window.addEventListener('DOMContentLoaded', () => {
  const path = window.location.pathname.replace('/', '');
  if (path && document.getElementById('page-' + path)) navigateTo(path);
});

// ==================== PRODUCTS ====================
function createProductCard(p) {
  return `
    <article class="product-card" role="listitem">
      <div class="product-img-wrap">
        <img src="${p.image}" class="product-img" alt="Lifestyle ${p.name}" loading="lazy">
        ${p.isNew ? '<div class="product-badge">New</div>' : ''}
        ${p.tag === 'bestseller' ? '<div class="product-badge" style="background: var(--accent); color: var(--bg);">Best Seller</div>' : ''}
      </div>
      <div class="product-info">
        <div class="product-category">${p.category}</div>
        <h3 class="product-name">${p.name}</h3>
        <div class="product-price">
          <span class="price">${formatPrice(p.price)}</span>
          <button class="add-cart-btn" onclick="quickAddToCart(${p.id})" aria-label="Add ${p.name} to cart">Add</button>
        </div>
      </div>
    </article>
  `;
}

function renderShopProducts() {
  document.getElementById('shopProducts').innerHTML = products.map(createProductCard).join('');
}

// ==================== CART ====================
function quickAddToCart(id) {
  const p = products.find(x => x.id === id);
  const existing = cart.find(c => c.id === id);
  if (existing) existing.qty++;
  else cart.push({ id, name: p.name, price: p.price, image: p.image, size: 'M', qty: 1 });
  saveCart(); updateBadges(); showToast('Added to cart!');
}

function removeFromCart(idx) { cart.splice(idx, 1); saveCart(); updateBadges(); renderCart(); }
function updateCartQty(idx, d) { cart[idx].qty += d; if (cart[idx].qty < 1) cart.splice(idx, 1); saveCart(); updateBadges(); renderCart(); }

function renderCart() {
  const layout = document.getElementById('cartLayout');
  if (cart.length === 0) {
    layout.innerHTML = `<div style="grid-column: 1 / -1; text-align: center; padding: 60px;"><h3>Your cart is empty</h3><button class="btn btn-primary" onclick="navigateTo('shop')" style="margin-top: 20px;">Shop Now</button></div>`;
    return;
  }
  const subtotal = cart.reduce((s, c) => s + c.price * c.qty, 0);
  const shipping = subtotal > 100000 ? 0 : 5000;
  const total = subtotal + shipping;
  layout.innerHTML = `
    <div class="cart-items">
      ${cart.map((c, i) => `
        <div class="cart-item">
          <div class="cart-item-img"><img src="${c.image}" alt="${c.name}"></div>
          <div><h4 style="margin-bottom: 4px;">${c.name}</h4><p style="color: var(--text-muted); font-size: 0.85rem;">Size: ${c.size}</p>
            <div style="display: flex; gap: 8px; margin-top: 8px;">
              <button class="btn btn-secondary btn-small" onclick="updateCartQty(${i}, -1)">-</button>
              <span style="padding: 8px;">${c.qty}</span>
              <button class="btn btn-secondary btn-small" onclick="updateCartQty(${i}, 1)">+</button>
            </div>
          </div>
          <div style="text-align: right;"><div style="font-weight: 700;">${formatPrice(c.price * c.qty)}</div><button style="background: none; border: none; color: var(--danger); cursor: pointer; font-size: 0.8rem; text-decoration: underline; margin-top: 8px;" onclick="removeFromCart(${i})">Remove</button></div>
        </div>
      `).join('')}
    </div>
    <div class="cart-summary">
      <h3 style="margin-bottom: 20px;">Order Summary</h3>
      <div class="summary-row"><span>Subtotal</span><span>${formatPrice(subtotal)}</span></div>
      <div class="summary-row"><span>Shipping</span><span>${shipping === 0 ? 'FREE' : formatPrice(shipping)}</span></div>
      <div class="summary-row total"><span>Total</span><span>${formatPrice(total)}</span></div>
      <button class="btn btn-primary btn-full" onclick="showToast('Checkout coming soon!')" style="margin-top: 20px;">Proceed to Checkout</button>
    </div>
  `;
}

function updateBadges() { document.getElementById('cartBadge').textContent = cart.reduce((s, c) => s + c.qty, 0); }

// ==================== 3D HERO ====================
function init3D() {
  const canvas = document.getElementById('hero-canvas');
  if (!canvas) return;
  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
  const renderer = new THREE.WebGLRenderer({ canvas, alpha: true, antialias: true });
  renderer.setSize(window.innerWidth, window.innerHeight);
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

  const torus = new THREE.Mesh(new THREE.TorusKnotGeometry(1.2, 0.35, 128, 32), new THREE.MeshBasicMaterial({ color: 0xffffff, wireframe: true, transparent: true, opacity: 0.15 }));
  scene.add(torus);
  
  for (let i = 0; i < 8; i++) {
    const mesh = new THREE.Mesh(new THREE.IcosahedronGeometry(0.3 + Math.random() * 0.4, 0), new THREE.MeshBasicMaterial({ color: 0xBDBDBD, wireframe: true, transparent: true, opacity: 0.1 }));
    const angle = (i / 8) * Math.PI * 2;
    const radius = 3 + Math.random() * 2;
    mesh.position.set(Math.cos(angle) * radius, (Math.random() - 0.5) * 3, Math.sin(angle) * radius);
    scene.add(mesh);
    mesh.userData = { angle, radius, speed: 0.002 + Math.random() * 0.003 };
  }

  camera.position.z = 6;
  let mouseX = 0, mouseY = 0;
  document.addEventListener('mousemove', (e) => { mouseX = (e.clientX / window.innerWidth - 0.5) * 2; mouseY = (e.clientY / window.innerHeight - 0.5) * 2; });

  function animate() {
    requestAnimationFrame(animate);
    torus.rotation.x += 0.003; torus.rotation.y += 0.003;
    scene.children.forEach(c => {
      if (c.userData.speed) {
        c.userData.angle += c.userData.speed;
        c.position.x = Math.cos(c.userData.angle) * c.userData.radius;
        c.position.z = Math.sin(c.userData.angle) * c.userData.radius;
        c.rotation.x += 0.01; c.rotation.y += 0.01;
      }
    });
    camera.position.x += (mouseX * 0.5 - camera.position.x) * 0.02;
    camera.position.y += (-mouseY * 0.5 - camera.position.y) * 0.02;
    camera.lookAt(scene.position);
    renderer.render(scene, camera);
  }
  animate();
  window.addEventListener('resize', () => { camera.aspect = window.innerWidth / window.innerHeight; camera.updateProjectionMatrix(); renderer.setSize(window.innerWidth, window.innerHeight); });
}

// ==================== INIT ====================
window.addEventListener('load', () => {
  setTimeout(() => document.getElementById('loader').classList.add('hidden'), 800);
  updateBadges();
  init3D();
});