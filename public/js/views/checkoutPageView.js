import {
  getCartItems,
  createAddress,
  createOrder as createOrderAPI,
  createOrderItems,
  createPayment as createPaymentAPI,
} from "../services/checkoutService.js";

let checkoutPage;

// Global state
let currentStep = "address";
let selectedAddress = null;
let selectedPaymentMethod = null;
let cartItems = [];
let orderData = null;
let shippingAddressId = null;

/**
 * Initialize checkout page
 */
export function initCheckoutPage() {
  console.log("Initializing checkout page...");

  const userId = localStorage.getItem("userId") || null;
  console.log("User ID:", userId);

  if (!userId) {
    showError("Please log in to checkout");
    setTimeout(() => {
      window.location.href = "login.html";
    }, 2000);
    return;
  }

  loadCartItems(userId);
  setupEventListeners();
  updateOrderSummary();
}

/**
 * Load cart items for checkout
 */
async function loadCartItems(userId) {
  try {
    showLoading();
    const result = await getCartItems(userId);

    if (result.success) {
      cartItems = result.data;
      updateOrderSummary();

      if (cartItems.length === 0) {
        showError("Your cart is empty");
        setTimeout(() => {
          window.location.href = "cart.html";
        }, 2000);
      }
    } else {
      showError(result.error || "Failed to load cart items");
    }
  } catch (error) {
    console.error("Error loading cart items:", error);
    showError("Failed to load cart items");
  } finally {
    hideLoading();
  }
}

/**
 * Setup event listeners for checkout page
 */
function setupEventListeners() {
  // Payment method selection
  document.querySelectorAll(".payment-method-card").forEach((card) => {
    card.addEventListener("click", () => {
      selectPaymentMethod(card);
    });
  });

  // Address form validation
  const addressForm = document.getElementById("address-form");
  if (addressForm) {
    addressForm.addEventListener("input", validateAddressForm);
  }
}

/**
 * Select payment method
 */
function selectPaymentMethod(card) {
  // Remove selected class from all cards
  document.querySelectorAll(".payment-method-card").forEach((c) => {
    c.classList.remove("selected");
  });

  // Add selected class to clicked card
  card.classList.add("selected");

  selectedPaymentMethod = card.dataset.method;

  // Show/hide credit card form
  const creditCardForm = document.getElementById("credit-card-form");
  if (selectedPaymentMethod === "credit_card") {
    creditCardForm.style.display = "block";
  } else {
    creditCardForm.style.display = "none";
  }

  // Update pay now button text
  const payNowBtn = document.getElementById("pay-now-btn");
  if (payNowBtn) {
    if (selectedPaymentMethod === "cash") {
      payNowBtn.textContent = "Place Order (Cash)";
    } else {
      payNowBtn.textContent = "Pay Now";
    }
  }
}

/**
 * Validate address form
 */
function validateAddressForm() {
  const requiredFields = ["street", "city", "state", "postalCode", "country"];
  const isValid = requiredFields.every((field) => {
    const element = document.getElementById(field);
    return element && element.value.trim() !== "";
  });

  return isValid;
}

/**
 * Update order summary
 */
function updateOrderSummary() {
  const container = document.getElementById("order-summary-items");
  const subtotalElement = document.getElementById("summary-subtotal");
  const totalElement = document.getElementById("summary-total");

  if (!container) return;

  if (cartItems.length === 0) {
    container.innerHTML = '<p class="text-muted">No items in cart</p>';
    if (subtotalElement) subtotalElement.textContent = "$0.00";
    if (totalElement) totalElement.textContent = "$0.00";
    return;
  }

  const subtotal = cartItems.reduce((sum, item) => {
    return sum + item.variant_price * item.quantity;
  }, 0);

  const tax = subtotal * 0.1; // 10% tax
  const total = subtotal + tax;

  // Update items list
  container.innerHTML = cartItems
    .map(
      (item) => `
        <div class="order-summary-item">
            <div class="d-flex justify-content-between align-items-start">
                <div>
                    <h6 class="mb-1">${item.product_name}</h6>
                    <small class="text-muted">${item.variant_color} - ${
        item.variant_size
      }</small>
                    <br>
                    <small class="text-muted">Qty: ${item.quantity}</small>
                </div>
                <span class="fw-bold">$${(
                  item.variant_price * item.quantity
                ).toFixed(2)}</span>
            </div>
        </div>
    `
    )
    .join("");

  // Update totals
  if (subtotalElement) subtotalElement.textContent = `$${subtotal.toFixed(2)}`;

  const taxElement = document.getElementById("summary-tax");
  if (taxElement) taxElement.textContent = `$${tax.toFixed(2)}`;

  if (totalElement) totalElement.textContent = `$${total.toFixed(2)}`;

  return { subtotal, tax, total };
}

/**
 * Proceed to order step
 */
async function proceedToOrder() {
  if (!validateAddressForm()) {
    showError("Please fill in all required address fields");
    return;
  }

  // Collect address data
  const addressData = {
    userId: localStorage.getItem("userId"),
    street: document.getElementById("street").value.trim(),
    street_2: document.getElementById("street_2").value.trim() || null,
    city: document.getElementById("city").value.trim(),
    state: document.getElementById("state").value.trim(),
    postalCode: document.getElementById("postalCode").value.trim(),
    country: document.getElementById("country").value,
  };

  const saveAddress = document.getElementById("save-address").checked;

  try {
    showLoading();

    // Create address
    const addressResult = await createAddress(addressData, saveAddress);
    console.log("Address result:", addressResult);
    if (addressResult.success) {
      shippingAddressId = addressResult.data.addressId;
      selectedAddress = addressData;

      // Update UI
      showSelectedAddress();
      showOrderStep();
      updateOrderItemsList();
    } else {
      showError(addressResult.error || "Failed to save address");
    }
  } catch (error) {
    console.error("Error creating address:", error);
    showError("Failed to save address");
  } finally {
    hideLoading();
  }
}

/**
 * Show selected address
 */
function showSelectedAddress() {
  const container = document.getElementById("selected-address");
  if (container && selectedAddress) {
    const { street, street_2, city, state, postalCode, country } =
      selectedAddress;
    container.innerHTML = `
      <p class="mb-1">${street}${street_2 ? `<br>${street_2}` : ""}</p>
      <p class="mb-1">${city}, ${state} ${postalCode}</p>
      <p class="mb-0">${country}</p>
    `;
  }
}

/**
 * Update order items list
 */
function updateOrderItemsList() {
  const container = document.getElementById("order-items-list");
  console.log("Cart items:", cartItems);
  if (container) {
    container.innerHTML = cartItems
      .map(
        (item) => `
          <div class="card mb-2">
            <div class="card-body">
              <div class="row align-items-center">
                <div class="col-2">
                  <img src="${
                    item.variant_image || "sample/placeholder-images.webp"
                  }" 
                       onerror="this.onerror=null; this.src='sample/placeholder-images.webp';"
                       alt="${item.product_name}" 
                       class="img-fluid rounded">
                </div>
                <div class="col-6">
                  <h6 class="mb-1">${item.product_name}</h6>
                  <small class="text-muted">${item.variant_color} - ${
          item.variant_size
        }</small>
                </div>
                <div class="col-2 text-center">
                  <small>Qty: ${item.quantity}</small>
                </div>
                <div class="col-2 text-end">
                  <strong>$${(item.variant_price * item.quantity).toFixed(
                    2
                  )}</strong>
                </div>
              </div>
            </div>
          </div>
        `
      )
      .join("");
  }
}

/**
 * Proceed to payment step
 */
async function proceedToPayment() {
  showPaymentStep();
}

/**
 * Process payment
 */
async function processPayment() {
  if (!selectedPaymentMethod) {
    showError("Please select a payment method");
    return;
  }

  try {
    showLoading();

    // Create order first
    const orderResult = await createCheckoutOrder();

    if (orderResult.success) {
      const orderId = orderResult.data.orderId;

      // Process payment if not cash
      if (selectedPaymentMethod !== "cash") {
        const paymentResult = await createPayment(orderId);

        if (paymentResult.success) {
          showConfirmation(orderId, paymentResult.data.transactionId, true);
        } else {
          showError(paymentResult.error || "Payment failed");
        }
      } else {
        // For cash, just show order confirmation without payment processing
        showConfirmation(orderId, null, false);
      }

      // Clear cart
      localStorage.removeItem("cartItems");
    } else {
      showError(orderResult.error || "Failed to create order");
    }
  } catch (error) {
    console.error("Error processing payment:", error);
    showError("Failed to process payment");
  } finally {
    hideLoading();
  }
}
/**
 * Place order without payment (cash on delivery)
 */

async function placeOrderWithoutPayment() {
  try {
    showLoading();

    const orderResult = await createCheckoutOrder();

    if (orderResult.success) {
      const orderId = orderResult.data.orderId;
      
      // For cash on delivery, create a pending payment record
      const paymentData = {
        orderId: parseInt(orderId),
        amount: parseFloat(updateOrderSummary().total),
        method: "cash",
        transactionId: generateTransactionId(),
        status: "pending",
      };
      
      console.log("Creating pending payment for cash order:", paymentData);
      await createPaymentAPI(paymentData);
      
      showConfirmation(orderId, null, false);

      // Clear cart
      localStorage.removeItem("cartItems");
    } else {
      showError(orderResult.error || "Failed to create order");
    }
  } catch (error) {
    console.error("Error placing order:", error);
    showError("Failed to place order");
  } finally {
    hideLoading();
  }
}

/**
 * Create order for checkout
 */
async function createCheckoutOrder() {
  const totals = updateOrderSummary();
  const userId = localStorage.getItem("userId");

  if (!userId) {
    throw new Error("User not authenticated");
  }

  const orderData = {
    userId: parseInt(userId), // Ensure it's a number
    shippingAddressId: shippingAddressId,
    total_amount: totals.total,
  };

  console.log("Creating order:", orderData);
  const orderResult = await createOrderAPI(orderData);

  if (orderResult.success) {
    const orderId = orderResult.data.orderId;
    console.log("Created order with ID:", orderId);

    // Create order items array for bulk creation
    const orderItemsData = cartItems.map((item) => ({
      orderId: parseInt(orderId), // Ensure orderId is a number
      variantId: parseInt(item.variant_id), // Ensure variantId is a number
      quantity: parseInt(item.quantity), // Ensure quantity is a number
      price: parseFloat(item.variant_price), // Ensure price is a number
    }));

    console.log("Creating order items with data:", orderItemsData);

    // Use the bulk creation endpoint
    const orderItemsResult = await createOrderItems(orderItemsData);

    if (orderItemsResult.success) {
      console.log("Order items created successfully:", orderItemsResult.data);
      return { success: true, data: { orderId } };
    } else {
      console.error("Failed to create order items:", orderItemsResult.error);
      throw new Error(orderItemsResult.error || "Failed to create order items");
    }
  } else {
    throw new Error(orderResult.error || "Failed to create order");
  }
}

/**
 * Create payment
 */
async function createPayment(orderId) {
  const totals = updateOrderSummary();

  const paymentData = {
    orderId: parseInt(orderId),
    amount: parseFloat(totals.total),
    method: selectedPaymentMethod,
    transactionId: generateTransactionId(),
    status: selectedPaymentMethod === "cash" ? "pending" : "completed",
  };

  console.log("Creating payment:", paymentData);
  
  // Call the API, not itself recursively
  return await createPaymentAPI(paymentData);
}

/**
 * Generate transaction ID
 */
function generateTransactionId() {
  return "txn_" + Date.now() + "_" + Math.random().toString(36).substr(2, 9);
}

// Step navigation methods
function showOrderStep() {
  document.getElementById("address-step").classList.remove("active");
  document.getElementById("order-step").style.display = "block";
  document.getElementById("order-step").classList.add("active");
  currentStep = "order";
}

function showPaymentStep() {
  document.getElementById("order-step").classList.remove("active");
  document.getElementById("payment-step").style.display = "block";
  document.getElementById("payment-step").classList.add("active");
  currentStep = "payment";
}

function showConfirmation(orderId, transactionId, isPaid) {
  document.getElementById("payment-step").classList.remove("active");
  document.getElementById("confirmation-step").style.display = "block";
  document.getElementById("confirmation-step").classList.add("active");

  const orderIdElement = document.getElementById("order-id");
  if (orderIdElement) orderIdElement.textContent = orderId;

  const confirmationMessage = document.getElementById("confirmation-message");

  if (isPaid && transactionId) {
    const paymentInfo = document.getElementById("payment-info");
    const transactionIdElement = document.getElementById("transaction-id");

    if (paymentInfo) paymentInfo.style.display = "block";
    if (transactionIdElement) transactionIdElement.textContent = transactionId;
    if (confirmationMessage) {
      confirmationMessage.textContent = `Your order has been confirmed and payment has been processed successfully via ${selectedPaymentMethod}.`;
    }
  } else {
    if (confirmationMessage) {
      confirmationMessage.textContent =
        "Your order has been placed successfully. You can pay when your order arrives (Cash on Delivery).";
    }
  }

  currentStep = "confirmation";
}

function backToAddress() {
  document.getElementById("order-step").style.display = "none";
  document.getElementById("order-step").classList.remove("active");
  document.getElementById("address-step").classList.add("active");
  currentStep = "address";
}

function backToOrder() {
  document.getElementById("payment-step").style.display = "none";
  document.getElementById("payment-step").classList.remove("active");
  document.getElementById("order-step").classList.add("active");
  currentStep = "order";
}

// Utility functions
function showLoading() {
  const spinner = document.getElementById("loading-spinner");
  if (spinner) spinner.classList.remove("d-none");
}

function hideLoading() {
  const spinner = document.getElementById("loading-spinner");
  if (spinner) spinner.classList.add("d-none");
}

function showError(message) {
  const alert = document.getElementById("error-alert");
  const messageElement = document.getElementById("error-message");

  if (alert && messageElement) {
    messageElement.textContent = message;
    alert.classList.remove("d-none");

    setTimeout(() => {
      alert.classList.add("d-none");
    }, 5000);
  }
}

// Global functions for HTML onclick handlers
window.proceedToOrder = proceedToOrder;
window.proceedToPayment = proceedToPayment;
window.processPayment = processPayment;
window.placeOrderWithoutPayment = placeOrderWithoutPayment;
window.backToAddress = backToAddress;
window.backToOrder = backToOrder;
window.goToCart = () => (window.location.href = "cart.html");
window.showNewAddressForm = () => {
  const savedAddresses = document.getElementById("saved-addresses");
  if (savedAddresses) savedAddresses.style.display = "none";
};
