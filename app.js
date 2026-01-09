const productList = document.getElementById("product-list");
const cartCount = document.getElementById("cart-count");
const cartItems = document.getElementById("cart-items");
const cartTotal = document.getElementById("cart-total");
const cartBtn = document.getElementById("cart-btn");
const checkoutBtn = document.getElementById("checkout-btn");
const clearCartBtn = document.getElementById("clear-cart");
const searchForm = document.getElementById("search-form");
const searchInput = document.getElementById("search-input");
const categorySelect = document.getElementById("category-select");
const minPriceInput = document.getElementById("min-price");
const maxPriceInput = document.getElementById("max-price");
const applyFiltersBtn = document.getElementById("apply-filters");
const resetFiltersBtn = document.getElementById("reset-filters");

let products = [
  { id: 1, title: "Service Shoes", category: "shoes", price: 4500, image: "https://via.placeholder.com/200x150?text=Service+Shoes", description: "Durable leather shoes popular in Pakistan.", rating: { rate: 4.2, count: 120 } },
  { id: 2, title: "Bata Sneakers", category: "shoes", price: 3200, image: "https://via.placeholder.com/200x150?text=Bata+Sneakers", description: "Comfortable sneakers for everyday wear.", rating: { rate: 4.5, count: 200 } },
  { id: 3, title: "Stylo Heels", category: "shoes", price: 5500, image: "https://via.placeholder.com/200x150?text=Stylo+Heels", description: "Elegant heels for formal occasions.", rating: { rate: 4.0, count: 90 } },
  { id: 4, title: "Khaadi Kurta", category: "clothing", price: 2500, image: "https://via.placeholder.com/200x150?text=Khaadi+Kurta", description: "Traditional kurta with modern design.", rating: { rate: 4.6, count: 300 } },
  { id: 5, title: "Borjan Loafers", category: "shoes", price: 6000, image: "https://via.placeholder.com/200x150?text=Borjan+Loafers", description: "Stylish loafers for men.", rating: { rate: 4.3, count: 150 } },
  { id: 6, title: "J.", category: "clothing", price: 3500, image: "https://via.placeholder.com/200x150?text=J.+Kur}

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
