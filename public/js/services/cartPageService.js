import { apiGet, apiDelete, apiPost,apiPut } from "./BaseService.js";

export async function getCartPageData() {
  try {
    
   
    let userId = localStorage.getItem("userId") || null;
    
    if (!userId) {
      
      return {
        success: true,
        data: {
          CartItemData: [],
          OrderHistoryData: [],
          user: {
            isAuthenticated: !!localStorage.getItem("authToken"),
            name: "Guest",
            cartItems: 0,
          },
        },
      };
    }

    
    const cartItemsData = await apiGet(`/cart-items/${userId}`);
    const orderHistoryData = await apiGet(`/orders/order-history/${userId}`);
    
    return {
      success: true,
      data: {
        CartItemData: cartItemsData.cartItems || [],
        OrderHistoryData: orderHistoryData.orderHis || [],
        user: {
          isAuthenticated: !!localStorage.getItem("authToken"),
          name: "Guest",
          cartItems: cartItemsData.items?.length || 0,
        },
      },
    };
  } catch (error) {
    console.error("Service: Failed to fetch cart page data:", error);
    return {
      success: false,
      error: error.message,
      data: getFallbackData(),
    };
  }
}

export async function updateCartItemQuantity(itemId, quantity) {
  try {
    console.log(itemId, quantity);
    const result = await apiPut(`/cart-items/`, { 
      cart_item_id: itemId,
      quantity : quantity
    });
console.log(result);
    return {
      success: true,
      data: result,
    };
  } catch (error) {
    console.error("Service: Failed to update cart item:", error);
    return {
      success: false,
      error: error.message,
    };
  }
}

export async function removeCartItem(itemId) {
  try {
    const result = await apiDelete(`/cart-items/${itemId}`);

    return {
      success: true,
      data: result,
    };
  } catch (error) {
    console.error("Service: Failed to remove cart item:", error);
    return {
      success: false,
      error: error.message,
    };
  }
}

/**
 * Search products and return results object
 */
export async function searchProducts(query) {
  try {
    if (!query || query.trim().length < 2) {
      return { success: true, data: [], query, count: 0 };
    }

    const products = await apiGet("/products/get-all");
    const allProducts = products.products || [];
    const searchTerm = query.toLowerCase().trim();

    const results = allProducts
      .filter(
        (product) =>
          product.name?.toLowerCase().includes(searchTerm) ||
          product.description?.toLowerCase().includes(searchTerm)
      )
      .slice(0, 5);

    return {
      success: true,
      data: results,
      query,
      count: results.length,
    };
  } catch (error) {
    console.error("Service: Search failed:", error);
    return {
      success: false,
      error: error.message,
      data: [],
      query,
      count: 0,
    };
  }
}

/**
 * Get product details for quick view
 */
export async function getProductDetails(productId) {
  try {
    const product = await apiGet(`/products/${productId}`);
    return {
      success: true,
      data: product,
    };
  } catch (error) {
    console.error("Service: Product details failed:", error);
    return {
      success: false,
      error: error.message,
      data: null,
    };
  }
}


function getFallbackData() {
  return {
    CartItemData: [],
    OrderHistoryData: [],
    user: {
      isAuthenticated: false,
      name: "Guest",
      cartItems: 0,
    },
  };
}
