import {
  getCartPageData,
  removeCartItem,
  updateCartItemQuantity,
  }from "../services/cartPageService.js";
let cartItems = [];

export async function initCartPage() {
  showLoading();

  const pageData = await getCartPageData();
  console.log("Running cart page for :", pageData.data);
  if (pageData.success) {
    cartItems = pageData.data.CartItemData;
    renderCart(cartItems);
    renderOrderHistory(pageData.data.OrderHistoryData);
  } else {
    showError(pageData.error);
  }

  hideLoading();
  setupEventListeners();
}

function renderCart(cartItems) {
  const container = document.getElementById("cart-items");
  const cartTotalElement = document.getElementById("cart-items-count");
cartTotalElement.innerText=cartItems.length

  if (!container) return;

  if (!cartItems || cartItems.length === 0) {
    container.innerHTML = `
      <div class="text-center py-5">
        <i class="bi bi-cart-x fs-1 text-muted"></i>
        <h5 class="text-muted mt-3">Your cart is empty</h5>
        <p class="text-muted">Add some items to get started!</p>
        <a href="shop.html" class="btn btn-primary">Continue Shopping</a>
      </div>
    `;
    updateCartTotal([]);
    return;
  }

  container.innerHTML = cartItems
    .map(
      (item) => `
    <div class="row align-items-center border-bottom py-3" data-item-id="${
      item.cart_item_id
    }">
      <div class="col-md-2">
        <img src="${
          item.variant_image || "sample/placeholder-images.webp"
        }" onerror="this.onerror=null; this.src='sample/placeholder-images.webp';"alt="${
        item.product_name
      }" class="img-fluid rounded" style="height: 80px; object-fit: cover;">
      </div>
      <div class="col-md-4">
        <h6 class="mb-1">${item.product_name}</h6>
        <small class="text-muted">${item.variant_color || ""} ${
        item.variant_size || ""
      }</small>
      </div>
      <div class="col-md-2">
        <span class="fw-bold">$${item.variant_price}</span>
      </div>
      <div class="col-md-2">
        <div class="input-group input-group-sm">
          <button class="btn btn-outline-secondary" type="button" onclick="updateQuantityHandler('${
            item.cart_item_id
          }', -1)">
            <i class="bi bi-dash"></i>
          </button>
          <input type="text" class="form-control text-center" value="${
            item.quantity
          }" readonly>
          <button class="btn btn-outline-secondary" type="button" onclick="updateQuantityHandler('${
            item.cart_item_id
          }', 1)">
            <i class="bi bi-plus"></i>
          </button>
        </div>
      </div>
      <div class="col-md-2 text-end">
        <button class="btn btn-outline-danger btn-sm" onclick="removeCartItemHandler('${
          item.cart_item_id
        }')">
          <i class="bi bi-trash"></i>
        </button>
      </div>
    </div>
  `
    )
    .join("");

  updateCartTotal(cartItems);
}

function renderOrderHistory(orderHistory) {
  const container = document.getElementById("order-history");
  console.log(orderHistory);
  if (!container) return;

  if (!orderHistory || orderHistory.length === 0) {
    container.innerHTML = `
      <div class="text-center py-4">
        <i class="bi bi-clock-history fs-1 text-muted"></i>
        <p class="text-muted mt-2">No order history found</p>
      </div>
    `;
    return;
  }

  container.innerHTML = orderHistory
    .map(
      (order) => `
    <div class="card mb-3">
      <div class="card-body">
        <div class="d-flex justify-content-between align-items-start">
          <div>
            <h6 class="card-title">Order #${order.order_id}</h6>
            <p class="card-text text-muted mb-1">
              <small>Placed on ${new Date(
                order.order_date
              ).toLocaleDateString()}</small>
            </p>
            <p class="card-text">
              <span class="badge bg-${getOrderStatusColor(
                order.status || "processing"
              )}">${order.status || "processing"}</span>
            </p>
          </div>
          <div class="text-end">
            <h6>$${order.price}</h6>
            <small class="text-muted">${order.quantity} items</small>
          </div>
        </div>
        <div class="mt-2">
          <button class="btn btn-outline-primary btn-sm" onclick="viewOrderDetails(${
            order.order_id
          })">
            View Details
          </button>
        </div>
      </div>
    </div>
  `
    )
    .join("");
}

function updateCartTotal(cartItems) {
  const total = cartItems.reduce(
    (sum, item) => sum + item.variant_price * item.quantity,
    0
  );

  const subtotalElement = document.getElementById("cart-subtotal");
  const totalElement = document.getElementById("cart-total");

  if (subtotalElement) {
    subtotalElement.textContent = `$${total.toFixed(2)}`;
  }

  if (totalElement) {
    totalElement.textContent = `$${total.toFixed(2)}`;
  }
}

function setupEventListeners() {
  const checkoutBtn = document.getElementById("checkout-btn");
  if (checkoutBtn) {
    checkoutBtn.addEventListener("click", proceedToCheckout);
  }
}

async function removeCartItemHandler(itemId) {
  try {
    showLoading();

    const result = await removeCartItem(itemId);

    if (result.success) {
      // Remove item from local array
      cartItems = cartItems.filter((item) => item.cart_item_id !== itemId);

      // Re-render cart
      renderCart(cartItems);
      showSuccess("Item removed from cart");

      // Update cart count in navbar
      updateNavbarCartCount();
    } else {
      showError(result.error || "Failed to remove item from cart");
    }
  } catch (error) {
    showError("An error occurred while removing the item");
  } finally {
    hideLoading();
  }
}

async function updateQuantityHandler(itemId, change) {
  try {
    const item = cartItems.find((item) => item.cart_item_id == itemId);
    console.log(cartItems, item);
    if (!item) return;
    
    const newQuantity = item.quantity + change;
    
    if (newQuantity < 1) {
      await removeCartItemHandler(itemId);
      return;
    }

    showLoading();

    const result = await updateCartItemQuantity(itemId, newQuantity);

    if (result.success) {
      // Update local array
      item.quantity = newQuantity;

      // Re-render cart
      renderCart(cartItems);
      showSuccess("Quantity updated");
    } else {
      showError(result.error || "Failed to update quantity");
    }
  } catch (error) {
    showError("An error occurred while updating quantity");
  } finally {
    hideLoading();
  }
}


function proceedToCheckout() {
  if (cartItems.length === 0) {
    showError("Your cart is empty. Add some items before checkout.");
    return;
  }

  // Check if user can checkout
  const userRole = localStorage.getItem("userRole");
  if (!userRole) {
    showError("Please log in to proceed with checkout");
    sessionStorage.setItem('redirectAfterLogin', 'checkout.html');
    setTimeout(() => {
      window.location.href = 'login.html';
    }, 1500);
    return;
  }
  if (userRole === "admin") {
    showError("Admins cannot place orders. Please use a customer account.");
    return;
  }

 

  // Save cart items and proceed to checkout
  try {
    localStorage.setItem('cartItems', JSON.stringify(cartItems));
  } catch (error) {
    console.error('Error saving cart items:', error);
  }

  window.location.href = 'checkout.html';
}
function updateNavbarCartCount() {
  const cartCountElements = document.querySelectorAll(".cart-count");
  cartCountElements.forEach((element) => {
    element.textContent = cartItems.length;
  });
}

function showLoading() {
  const spinner = document.getElementById("loading-spinner");
  if (spinner) {
    spinner.classList.remove("d-none");
  }
}

function hideLoading() {
  const spinner = document.getElementById("loading-spinner");
  if (spinner) {
    spinner.classList.add("d-none");
  }
}

function showError(message) {
  const errorAlert = document.getElementById("error-alert");
  const errorMessage = document.getElementById("error-message");

  if (errorAlert && errorMessage) {
    errorMessage.textContent = message;
    errorAlert.classList.remove("d-none");

    setTimeout(() => {
      errorAlert.classList.add("d-none");
    }, 5000);
  }
}

function showSuccess(message) {
  const successAlert = document.getElementById("success-alert");
  const successMessage = document.getElementById("success-message");

  if (successAlert && successMessage) {
    successMessage.textContent = message;
    successAlert.classList.remove("d-none");

    setTimeout(() => {
      successAlert.classList.add("d-none");
    }, 3000);
  }
}

function getOrderStatusColor(status) {
  switch (status?.toLowerCase()) {
    case "pending":
      return "warning";
    case "processing":
      return "info";
    case "shipped":
      return "primary";
    case "delivered":
      return "success";
    case "cancelled":
      return "danger";
    default:
      return "secondary";
  }
}

// Global functions
window.updateQuantityHandler = updateQuantityHandler; 
window.removeCartItemHandler = removeCartItemHandler;
window.proceedToCheckout = proceedToCheckout;
window.viewOrderDetails = function (orderId) {
  const modal = new bootstrap.Modal(
    document.getElementById("featureNotAvailableModal")
  );
  modal.show();
};

