import { apiGet, apiPost } from "./BaseService.js";

export async function getCartItems(userId) {
  try {
    const response = await apiGet(`/cart-items/${userId}`);
    const cartItems = response.cartItems;
    

    return {
      success: true,
      data: cartItems,
    };
  } catch (error) {
    console.error("Error getting cart items:", error);
    return {
      success: false,
      error: "Failed to load cart items",
    };
  }
}

export async function createAddress(addressData, saveAddress = false) {
  try {
    const response = await apiPost("/addresses", addressData);

    return {
      success: true,
      data: {
        addressId: response.addressId || response.id,
      },
    };
  } catch (error) {
    console.error("Error creating address:", error);
    return {
      success: false,
      error: "Failed to create address",
    };
  }
}

export async function createOrder(orderData) {
  try {
    const response = await apiPost("/orders/", orderData);

    return {
      success: true,
      data: {
        orderId: response.orderId || response.id,
      },
    };
  } catch (error) {
    console.error("Error creating order:", error);
    return {
      success: false,
      error: "Failed to create order",
    };
  }
}

// In checkoutService.js - update createOrderItems with better error handling

export async function createOrderItems(orderItemsData) {
    try {
    console.log("Sending order items to backend:", orderItemsData);
    
    const response = await apiPost("/order-items/from-array/", { 
      orderItems: orderItemsData 
    });

    console.log("Backend response for order items:", response);

    return {
      success: true,
      data: response,
    };
  } catch (error) {
    console.error("Error creating order items:", error);
    return {
      success: false,
      error: error.message || "Failed to create order items",
    };
  }
}

export async function createPayment(paymentData) {
  try {
    const response = await apiPost("/payments/", paymentData);

    return {
      success: true,
      data: {
        transactionId: response.transaction_id || paymentData.transactionId,
      },
    };
  } catch (error) {
    console.error("Error creating payment:", error);
    return {
      success: false,
      error: "Failed to process payment",
    };
  }
}
