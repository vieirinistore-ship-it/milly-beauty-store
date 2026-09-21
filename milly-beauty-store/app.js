let cart = [];
const WHATSAPP_NUMBER = "5527998780023";

function renderProducts(products) {
  const container = document.getElementById("products");
  container.innerHTML = "";
  
  products.forEach((product, idx) => {
    const card = document.createElement("div");
    card.className = "product-card";
    card.innerHTML = `
      <div class="product-image">
        <img src="${product.image || 'img/placeholder.jpg'}" alt="${product.name}" loading="lazy">
      </div>
      <div class="product-info">
        <h3>${product.name}</h3>
        <p class="category">${product.category}</p>
        <div class="product-footer">
          <span class="price">R$ ${(product.price / 100).toLocaleString('pt-BR', {minimumFractionDigits: 2})}</span>
          <button class="add-btn" onclick="addToCart(${idx})">+</button>
        </div>
      </div>
    `;
    container.appendChild(card);
  });
  
  document.getElementById("resultCount").textContent = products.length;
}

function addToCart(idx) {
  const product = PRODUCTS[idx];
  const existing = cart.find(p => p.name === product.name);
  
  if (existing) {
    existing.quantity++;
  } else {
    cart.push({...product, quantity: 1});
  }
  
  updateCart();
  showToast("Produto adicionado!");
}

function removeFromCart(idx) {
  cart.splice(idx, 1);
  updateCart();
}

function updateCart() {
  document.getElementById("cartCount").textContent = cart.length;
  
  const cartItems = document.getElementById("cartItems");
  cartItems.innerHTML = "";
  
  let total = 0;
  cart.forEach((item, idx) => {
    const itemTotal = item.price * item.quantity;
    total += itemTotal;
    
    const row = document.createElement("div");
    row.className = "cart-item";
    row.innerHTML = `
      <div class="cart-item-image">
        <img src="${item.image || 'img/placeholder.jpg'}" alt="${item.name}">
      </div>
      <div class="cart-item-info">
        <strong>${item.name}</strong>
        <small>${item.category}</small>
      </div>
      <div class="cart-item-qty">
        <button onclick="changeQty(${idx}, -1)">−</button>
        <span>${item.quantity}</span>
        <button onclick="changeQty(${idx}, 1)">+</button>
      </div>
      <div class="cart-item-price">
        R$ ${(itemTotal / 100).toLocaleString('pt-BR', {minimumFractionDigits: 2})}
      </div>
      <button class="remove-btn" onclick="removeFromCart(${idx})">✕</button>
    `;
    cartItems.appendChild(row);
  });
  
  document.getElementById("cartTotal").textContent = `R$ ${(total / 100).toLocaleString('pt-BR', {minimumFractionDigits: 2})}`;
}

function changeQty(idx, delta) {
  cart[idx].quantity += delta;
  if (cart[idx].quantity <= 0) removeFromCart(idx);
  else updateCart();
}

function openCart() {
  document.getElementById("drawer").setAttribute("aria-hidden", "false");
  document.getElementById("drawerBackdrop").removeAttribute("hidden");
}

function closeCart() {
  document.getElementById("drawer").setAttribute("aria-hidden", "true");
  document.getElementById("drawerBackdrop").setAttribute("hidden", "");
}

document.getElementById("closeCart").addEventListener("click", closeCart);
document.getElementById("drawerBackdrop").addEventListener("click", closeCart);

document.getElementById("search").addEventListener("input", (e) => {
  const query = e.target.value.toLowerCase();
  const filtered = PRODUCTS.filter(p => 
    p.name.toLowerCase().includes(query) || 
    p.category.toLowerCase().includes(query)
  );
  renderProducts(filtered);
});

document.getElementById("copySelection").addEventListener("click", () => {
  const name = document.getElementById("fullName").value || "Cliente";
  const phone = document.getElementById("phone").value || "Não informado";
  
  let message = `📦 *NOVO PEDIDO* - Milly Beauty\n\n`;
  message += `👤 *Cliente:* ${name}\n`;
  message += `📱 *WhatsApp:* ${phone}\n`;
  message += `📧 *Email:* ${document.getElementById("email").value || "Não informado"}\n`;
  message += `📍 *Endereço:* ${document.getElementById("address").value || "Não informado"}\n\n`;
  message += `*PRODUTOS SELECIONADOS:*\n`;
  
  cart.forEach(item => {
    message += `• ${item.name} (${item.quantity}x) - R$ ${(item.price * item.quantity / 100).toLocaleString('pt-BR', {minimumFractionDigits: 2})}\n`;
  });
  
  const total = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
  message += `\n💰 *Total:* R$ ${(total / 100).toLocaleString('pt-BR', {minimumFractionDigits: 2})}`;
  
  const whatsappUrl = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(message)}`;
  window.open(whatsappUrl, "_blank");
});

document.getElementById("clearCart").addEventListener("click", () => {
  if (confirm("Limpar toda a seleção?")) {
    cart = [];
    updateCart();
  }
});

// Inicializar
renderProducts(PRODUCTS);
