/* ============================
   script.js — Carrito funcional
   ============================ */

/* UTILIDADES */
const qs = s => document.querySelector(s);
const qsa = s => Array.from(document.querySelectorAll(s));
const formatPrice = n => Number(n).toFixed(2);

/* TOAST */
function toast(msg){
  const t = document.createElement('div');
  t.className = 'site-toast show';
  t.textContent = msg;
  document.body.appendChild(t);
  setTimeout(()=> t.classList.remove('show'), 2200);
  setTimeout(()=> t.remove(), 2700);
}

/* CARRITO */
const CART_KEY = 'electroshop_cart_v1';
let cart = JSON.parse(localStorage.getItem(CART_KEY) || '[]');

function saveCart() {
  localStorage.setItem(CART_KEY, JSON.stringify(cart));
  updateCartUI();
}

function addToCart(item) {
  cart.push(item);
  saveCart();
  toast(`🛒 ${item.nombre} añadido al carrito`);
}

function removeFromCart(index){
  cart.splice(index,1);
  saveCart();
  toast('❌ Producto eliminado del carrito');
}

function updateCartUI(){
  const cartCountEl = qs('#cartCount');
  if(cartCountEl) cartCountEl.textContent = cart.length;

  const list = qs('#cartItems');
  const totalEl = qs('#cartTotal');
  if(list && totalEl){
    list.innerHTML = '';
    let total = 0;
    cart.forEach((it,i)=>{
      total += Number(it.precio)||0;
      const li = document.createElement('li');
      li.className = 'cart-item';
      li.innerHTML = `
        <img src="${it.img}" alt="${it.nombre}">
        <span class="name">${it.nombre}</span>
        <span class="price">$${formatPrice(it.precio)}</span>
        <button class="btn small" data-remove="${i}">❌</button>`;
      list.appendChild(li);
    });
    totalEl.textContent = formatPrice(total);
    if(cart.length===0){
      list.innerHTML = '<li style="text-align:center; padding:20px;">Tu carrito está vacío.</li>';
    }
  }
}

/* PANEL CARRITO */
const cartPanel = qs('#cartPanel');
qs('#openCartBtn')?.addEventListener('click', ()=>cartPanel?.classList.toggle('activo'));
qs('#closeCartBtn')?.addEventListener('click', ()=>cartPanel?.classList.remove('activo'));

qs('#cartPanel')?.addEventListener('click', e=>{
  const btn = e.target.closest('[data-remove]');
  if(btn) removeFromCart(Number(btn.dataset.remove));
});

qs('#checkoutBtn')?.addEventListener('click', ()=>{
  if(cart.length===0) return alert('Tu carrito está vacío.');
  alert('✅ Gracias por tu compra (simulación)');
  cart = [];
  saveCart();
  cartPanel?.classList.remove('activo');
});

/* BOTONES "AÑADIR AL CARRITO" */
qsa('.add-to-cart').forEach(btn=>{
  btn.addEventListener('click', e=>{
    const p = e.target.closest('.producto');
    if(!p) return;
    const nombre = btn.dataset.name || p.querySelector('h3')?.textContent || 'Producto';
    const precio = parseFloat(btn.dataset.price) || parseFloat(p.querySelector('.price')?.textContent?.replace('$','')) || 0;
    const img = p.querySelector('img')?.src || '';
    addToCart({nombre, precio, img});
  });
});

/* INICIALIZAR */
updateCartUI();
