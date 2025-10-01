import { apiGet, apiPost } from "BaseService.js";

/**
 * Fetch all landing page data and return organized object
 */
export async function getProductPageData(productId) {
  try {
    // Fetch all data in parallel
    const [productData] = await apiGet(`/products/: ${productId}`);
    const [reviewData] = await apiGet(`reviews/product/:${productId}`)    
    // const [addReview] = await apiPost("/reviews", { body: review});
    const [similarData] = await apiPost('products/get-by-cat', {body: productData.catName})

    // Return organized data object
    return {
      success: true,
      data: {
        Product: productData.products || [],   
        Reviews: reviewData.reviewRes || [],
        SimilarProducts: similarData.similarPro || [],
        user: {
          isAuthenticated: !!localStorage.getItem("authToken"),
          name: "Guest",
          cartItems: 0,
        },
      },
    };
  } catch (error) {
    console.error("Service: Failed to fetch product page data:", error);
    return {
      success: false,
      error: error.message,
      data: getFallbackData(),
    };
  }
}


export async function postReviewOfProduct(review) {
  try {

    // Fetch all data in parallel
    const [reviewData] = await apiPost('reviews', {body: review})
    // Return organized data object
    return {
      success: true,     
    };
  } catch (error) {
    console.error("Service: Failed to add review page data:", error);
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
    Product: [],
    Reviews: [],
    SimilarProduct: [],
    user: {
      isAuthenticated: false,
      name: "Guest",
      cartItems: 0,
    },
  };
}

