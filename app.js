const productList = document.getElementById("product-list");
const cartCount = document.getElementById("cart-count");
const cartItems = document.getElementById("cart-items");
const cartTotal = document.getElementById("cart-total");
const cartBtn = document.getElementById("cart-btn");
const checkoutBtn = document.getElementById("checkout-btn");
const clearCartBtn = document.getElementById("clear-cart");
let cart = [];

const products = [
  { id: 1, title: "Service Shoes", price: 4500, image: "https://via.placeholder.com/200x150?text=Service+Shoes" },
  { id: 2, title: "Bata Sneakers", price: 3200, image: "https://via.placeholder.com/200x150?text=Bata+Sneakers" },
  { id: 3, title: "Stylo Heels", price: 5500, image: "https://via.placeholder.com/200x150?text=Stylo+Heels" },
  { id: 4, title: "Borjan Loafers", price: 6000, image: "https://via.placeholder.com/200x150?text=Borjan+Loafers" }
];

function renderProducts() {
  productList.innerHTML = "";
  products.forEach(product => {
    const col = document.createElement("div");
    col.className = "col-12 col-sm-6 col-md-4 col-lg-3 mb-4";
    col.innerHTML = `
      <div class="card h-100">
        <img src="${product.image}" class="card-img-top" alt="${product.title}">
        <div class="card-body d-flex flex-column">
          <h5 class="card-title">${product.title}</h5>
          <p class="price-tag mb-3">PKR ${product.price}</p>
          <div class="mt-auto d-grid gap-2">
            <button class="btn btn-primary add-to-cart"><i class="fa-solid fa-cart-plus me-1"></i>Add to cart</button>
          </div>
        </div>
      </div>
    `;
    col.querySelector(".add-to-cart").addEventListener("click", () => addToCart(product));
    productList.appendChild(col);
  });
}

function addToCart(product) {
  const existing = cart.find(item => item.id === product.id);
  if (existing) {
    existing.quantity += 1;
  } else {
    cart.push({ ...product, quantity: 1 });
  }
  updateCart();
  Swal.fire({ icon: "success", title: "Added", text: `${product.title} added to cart.`, timer: 1200, showConfirmButton: false });
}

function updateCart() {
  cartItems.innerHTML = "";
  let total = 0;
  cart.forEach(item => {
    const li = document.createElement("li");
    li.className = "list-group-item d-flex justify-content-between align-items-center";
    li.innerHTML = `
      ${item.title} x${item.quantity}
      <span>PKR ${(item.price * item.quantity).toFixed(2)}</span>
    `;
    cartItems.appendChild(li);
    total += item.price * item.quantity;
  });
  cartCount.textContent = cart.reduce((sum, item) => sum + item.quantity, 0);
  cartTotal.textContent = total.toFixed(2);
}

cartBtn.addEventListener("click", () => {
  const modal = new bootstrap.Modal(document.getElementById("cartModal"));
  modal.show();
});

clearCartBtn.addEventListener("click", () => {
  cart = [];
  updateCart();
  Swal.fire({ icon: "info", title: "Cleared", text: "Cart is now empty.", timer: 1200, showConfirmButton: false });
});

checkoutBtn.addEventListener("click", () => {
  if (!cart.length) {
    Swal.fire({ icon: "info", title: "Cart empty", text: "Add items before checkout.", timer: 1200, showConfirmButton: false });
    return;
  }
  Swal.fire({ icon: "success", title: "Order placed", text: `Total: PKR ${cartTotal.textContent}`, confirmButtonText: "Close" });
  cart = [];
  updateCart();
});

renderProducts();
