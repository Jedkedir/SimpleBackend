import { getCartPageData } from "../services/CartPageService.js";

export async function initCartPage() {
  showLoading();

  const pageData = await getCartPageData();

  if (pageData.success) {
    renderCart(pageData.data.CartItemData);
    renderOrderHistory(pageData.data.OrderHistoryData);
  } else {
    showError(pageData.error);
  }

  hideLoading();
  setupEventListeners();
}

function renderCart(cartItems) {
  const container = document.getElementById("cart-items"); //TODO
  if (!container) return;

  if (cartItems.length === 0) {
    container.innerHTML = "<p>Your cart is empty</p>";
    return;
  }

  container.innerHTML = cartItems
    .map(
      (item) => `
    <div class="cart-item">
      <img src="${item.image_url || "/images/placeholder.jpg"}" alt="${
        item.name
      }">
      <div class="item-details">
        <h4>${item.name}</h4>
        <p>$${item.price}</p>
        <div class="quantity-controls">
          <button class="decrease-quantity" data-id="${item.id}">-</button>
          <span>${item.quantity}</span>
          <button class="increase-quantity" data-id="${item.id}">+</button>
        </div>
      </div>
      <button class="remove-item" data-id="${item.id}">Remove</button>
    </div>
  `
    )
    .join("");

  updateCartTotal(cartItems);
}

function renderOrderHistory(orderHistory) {
  const container = document.getElementById("order-history");
  if (!container) return;

  container.innerHTML = orderHistory
    .map(
      (order) => `
    <div class="order-history-item">
      <p>Order #${order.id} - $${order.total} - ${order.status}</p>
    </div>
  `
    )
    .join("");
}

function updateCartTotal(cartItems) {
  const total = cartItems.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  );
  const totalElement = document.getElementById("cart-total");
  if (totalElement) {
    totalElement.textContent = `Total: $${total.toFixed(2)}`;
  }
}

function setupEventListeners() {
  document.addEventListener("click", (e) => {
    if (e.target.classList.contains("remove-item")) {
      const itemId = e.target.dataset.id;
      removeCartItem(itemId);
    }

    if (e.target.classList.contains("increase-quantity")) {
      const itemId = e.target.dataset.id;
      updateQuantity(itemId, 1);
    }

    if (e.target.classList.contains("decrease-quantity")) {
      const itemId = e.target.dataset.id;
      updateQuantity(itemId, -1);
    }

    if (e.target.classList.contains("checkout-btn")) {
      proceedToCheckout();
    }
  });
}

function removeCartItem(itemId) {
  console.log("Removing item:", itemId);
  // Implement remove item functionality
}

function updateQuantity(itemId, change) {
  console.log("Updating quantity for item:", itemId, "change:", change);
  // Implement quantity update functionality
}

function proceedToCheckout() {
  window.location.href = "/checkout.html";
}

function showLoading() {
  const loader = document.getElementById("loading-indicator");
  if (loader) loader.style.display = "block";
}

function hideLoading() {
  const loader = document.getElementById("loading-indicator");
  if (loader) loader.style.display = "none";
}

function showError(message) {
  const errorEl = document.getElementById("error-message");
  if (errorEl) {
    errorEl.textContent = `Error: ${message}`;
    errorEl.style.display = "block";
  }
}
