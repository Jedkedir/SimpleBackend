import { apiGet, apiPost } from "./BaseService.js";

/**
 * Fetch all landing page data and return organized object
 */
export async function AddToCartPageData(itemData) {
  try {
    // Fetch all data in parallel
    // const [cartItemsData] = await apiGet(`/cart-items/:${cartId}`);
    // const [orderHistoryData] = await apiGet(`/order/orders-history/:${orderId}`)
    const addToCartData = await apiPost('/cart-items/', {body: itemData});
    
    // Return organized data object
    return {
      success: true,
    //   data: {
    //     CartItemData: cartItemsData.cartItems || [],
    //     OrderHistoryData: orderHistoryData.orderHis || [],

    //     user: {
    //       isAuthenticated: !!localStorage.getItem("authToken"),
    //       name: "Guest",
    //       cartItems: 0,
    //     },
    //   },
    };
  } catch (error) {
    console.error("Service: Failed to add product to cart:", error);
    return {
      success: false,
      error: error.message,
      data: getFallbackData(),
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

// Helper function
function getFallbackData() {
  return {
//    CartItemData: [],
//    orderHistoryData: [],
    user: {
      isAuthenticated: false,
      name: "Guest",
      cartItems: 0,
    },
  };
}

