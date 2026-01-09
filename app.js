// Elements
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

let products = [];
let filteredProducts = [];
let cart = [];

// Helpers
const formatCurrency = (num) => Number(num).toFixed(2);

function showToast(icon, title, text = "") {
  Swal.fire({
    icon,
    title,
    text,
    timer: 1400,
    showConfirmButton: false,
    toast: true,
    position: "top-end",
  });
}

function buildCard(product) {
  const col = document.createElement("div");
  col.className = "col-12 col-sm-6 col-md-4 col-lg-3 mb-4";

  // Fallback for missing fields
  const title = product.title || "Untitled product";
  const image = product.image || "https://via.placeholder.com/300x300?text=No+Image";
  const price = product.price || 0;
  const rating = product.rating?.rate ?? 0;
  const count = product.rating?.count ?? 0;

  col.innerHTML = `
    <div class="card h-100">
      <img src="${image}" class="card-img-top" alt="${title}">
      <div class="card-body d-flex flex-column">
        <h6 class="card-subtitle text-muted mb-1">${product.category || ""}</h6>
        <h5 class="card-title">${title}</h5>
        <div class="d-flex align-items-center mb-2">
          <span class="rating me-2"><i class="fa-solid fa-star"></i> ${rating}</span>
          <small class="text-muted">(${count})</small>
        </div>
        <p class="price-tag mb-3">$${formatCurrency(price)}</p>
        <div class="mt-auto d-grid gap-2">
          <button class="btn btn-primary btn-icon add-to-cart">
            <i class="fa-solid fa-cart-plus"></i> Add to cart
          </button>
          <button class="btn btn-outline-secondary btn-icon view-details">
            <i class="fa-solid fa-circle-info"></i> Details
          </button>
        </div>
      </div>
    </div>
  `;

  // Event: Add to cart
  col.querySelector(".add-to-cart").addEventListener("click", () => addToCart(product));

  // Event: View details
  col.querySelector(".view-details").addEventListener("click", () => {
    Swal.fire({
      title: title,
      html: `
        <img src="${image}" alt="${title}" style="max-width:100%;height:220px;object-fit:contain;margin-bottom:10px;">
        <p class="text-start">${product.description || "No description available."}</p>
        <p class="text-start"><strong>Category:</strong> ${product.category}</p>
        <p class="text-start"><strong>Price:</strong> $${formatCurrency(price)}</p>
      `,
      showConfirmButton: true,
      confirmButtonText: "Close",
      width: 600,
    });
  });

  return col;
}

// Load products from Fake Store API
async function loadProducts(category = "all") {
  try {
    productList.innerHTML = `
      <div class="d-flex justify-content-center py-5 w-100">
        <div class="spinner-border text-primary me-2" role="status"></div>
        <span class="align-self-center">Loading products...</span>
      </div>
    `;

    let url = "https://fakestoreapi.com/products";
    if (category !== "all") {
      url = `https://fakestoreapi.com/products/category/${encodeURIComponent(category)}`;
    }

    const res = await axios.get(url);
    products = res.data || [];
    filteredProducts = [...products];

    renderProducts(filteredProducts);
  } catch (err) {
    productList.innerHTML = "";
    Swal.fire("Error", "Failed to load products. Please try again.", "error");
  }
}

// Render product cards
function renderProducts(list) {
  productList.innerHTML = "";
  if (!list.length) {
    productList.innerHTML = `
      <div class="text-center text-muted py-5 w-100">
        <i class="fa-regular fa-face-frown-open fa-2x mb-2"></i>
        <p>No products match your filters.</p>
      </div>
    `;
    return;
  }

  const fragment = document.createDocumentFragment();
  list.forEach(p => fragment.appendChild(buildCard(p)));
  productList.appendChild(fragment);
}

// Cart operations
function addToCart(product) {
  const existing = cart.find(item => item.id === product.id);
  if (existing) {
    existing.quantity += 1;
  } else {
    cart.push({ id: product.id, title: product.title, price: product.price, image: product.image, quantity: 1 });
  }
  updateCart();
  showToast("success", "Added", `${product.title} added to cart.`);
}

function updateCart() {
  cartItems.innerHTML = "";
  let total = 0;

  cart.forEach(item => {
    const li = document.createElement("li");
    li.className = "list-group-item d-flex align-items-center justify-content-between";
    li.innerHTML = `
      <div class="d-flex align-items-center">
        <img src="${item.image}" alt="${item.title}" width="42" height="42" style="object-fit:contain" class="me-2">
        <div>
          <div class="fw-semibold">${item.title}</div>
          <small class="text-muted">$${formatCurrency(item.price)} each</small>
        </div>
      </div>
      <div class="d-flex align-items-center gap-2">
        <button class="qty-btn" title="Decrease"><i class="fa-solid fa-minus"></i></button>
        <span class="px-2">${item.quantity}</span>
        <button class="qty-btn" title="Increase"><i class="fa-solid fa-plus"></i></button>
        <span class="fw-semibold">$${formatCurrency(item.price * item.quantity)}</span>
        <button class="btn btn-sm btn-outline-danger" title="Remove"><i class="fa-solid fa-trash"></i></button>
      </div>
    `;

    const [decBtn, , incBtn, , removeBtn] = li.querySelectorAll("button");
    decBtn.addEventListener("click", () => changeQuantity(item.id, -1));
    incBtn.addEventListener("click", () => changeQuantity(item.id, 1));
    removeBtn.addEventListener("click", () => removeItem(item.id));

    cartItems.appendChild(li);
    total += item.price * item.quantity;
  });

  cartCount.textContent = cart.reduce((sum, it) => sum + it.quantity, 0);
  cartTotal.textContent = formatCurrency(total);
}

function changeQuantity(id, delta) {
  const item = cart.find(i => i.id === id);
  if (!item) return;
  item.quantity += delta;
  if (item.quantity <= 0) {
    cart = cart.filter(i => i.id !== id);
  }
  updateCart();
}

function removeItem(id) {
  cart = cart.filter(i => i.id !== id);
  updateCart();
  showToast("info", "Removed", "Item removed from cart.");
}

// Events: cart modal
cartBtn.addEventListener("click", () => {
  const modal = new bootstrap.Modal(document.getElementById("cartModal"));
  modal.show();
});

clearCartBtn.addEventListener("click", () => {
  if (!cart.length) return;
  Swal.fire({
    icon: "warning",
    title: "Clear cart?",
    text: "This will remove all items.",
    showCancelButton: true,
    confirmButtonText: "Yes, clear",
  }).then(res => {
    if (res.isConfirmed) {
      cart = [];
      updateCart();
      showToast("success", "Cleared", "Your cart is now empty.");
    }
  });
});

checkoutBtn.addEventListener("click", () => {
  if (!cart.length) {
    showToast("info", "Cart empty", "Add items before checkout.");
    return;
  }
  Swal.fire({
    icon: "success",
    title: "Order placed",
    html: `
      <p>Thanks for your purchase!</p>
      <p><strong>Items:</strong> ${cart.reduce((s, i) => s + i.quantity, 0)}</p>
      <p><strong>Total:</strong> $${cartTotal.textContent}</p>
    `,
    confirmButtonText: "Close",
  });
  cart = [];
  updateCart();
});

// Search and filters
searchForm.addEventListener("submit", (e) => {
  e.preventDefault();
  applyFilters();
});

applyFiltersBtn.addEventListener("click", applyFilters);
resetFiltersBtn.addEventListener("click", () => {
  searchInput.value = "";
  categorySelect.value = "all";
  minPriceInput.value = "";
  maxPriceInput.value = "";
  filteredProducts = [...products];
  renderProducts(filteredProducts);
});

function applyFilters() {
  const q = searchInput.value.trim().toLowerCase();
  const minP = Number(minPriceInput.value) || 0;
  const maxP = Number(maxPriceInput.value) || Infinity;
  const cat = categorySelect.value;

  filteredProducts = products.filter(p => {
    const matchesText =
      !q ||
      p.title.toLowerCase().includes(q) ||
      (p.description && p.description.toLowerCase().includes(q)) ||
      (p.category && p.category.toLowerCase().includes(q));
    const matchesCat = cat === "all" || (p.category && p.category === cat);
    const matchesPrice = p.price >= minP && p.price <= maxP;
    return matchesText && matchesCat && matchesPrice;
  });

  renderProducts(filteredProducts);
}

// Init
loadProducts("all");
