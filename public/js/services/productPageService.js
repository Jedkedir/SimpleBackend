import { apiGet, apiPost } from "./BaseService.js";

export async function getProductPageData(productId, variantId) {
  try {
    
    
    const productResponse = await apiGet(`/products/${productId}`);
    
    
    let categoryName = "";

    if (Array.isArray(productResponse) && productResponse.length > 0) {
      
      categoryName = productResponse[0].catname || productResponse[0].category;
    } else if (productResponse && typeof productResponse === "object") {
      
      categoryName = productResponse.catname || productResponse.category;
    }

    

    
    const [reviewResponse, similarResponse] = await Promise.all([
      apiGet(`/reviews/product/${productId}`).catch((err) => ({
        error: err.message,
      })),
      categoryName
        ? apiPost("/products/get-by-cat/", { catName: categoryName }).catch(
            (err) => ({ error: err.message })
          )
        : Promise.resolve({ similarPro: [] }), 
    ]);

    
    let productData = productResponse;
    let currentVariant = null;
    let variants = [];

    if (Array.isArray(productData)) {
      variants = productData;
      currentVariant =
        productData.find((v) => v.variant_id == variantId) || productData[0];
    } else if (productData && typeof productData === "object") {
      currentVariant = productData;
      variants = [productData];
    }

    
    let reviews = [];
    if (reviewResponse && !reviewResponse.error) {
      reviews =
        reviewResponse.reviewsRes ||
        reviewResponse.reviews ||
        reviewResponse.data ||
        reviewResponse ||
        [];
    }

    
    let similarProducts = [];
    if (similarResponse && !similarResponse.error) {
      similarProducts =
        similarResponse.similarPro ||
        similarResponse.products ||
        similarResponse.data ||
        similarResponse ||
        [];

      
      similarProducts = similarProducts.filter((product) => {
        const productIdToCompare = product.product_id || product.id;
        return productIdToCompare !== parseInt(productId);
      });
    }

    console.log("✅ Final Processed Data:", {
      product: currentVariant?.name,
      variantsCount: variants.length,
      reviewsCount: reviews.length,
      similarProductsCount: similarProducts.length,
      similarProducts: similarProducts,
    });

    return {
      success: true,
      data: {
        Product: currentVariant,
        Variants: variants,
        Reviews: reviews,
        SimilarProducts: similarProducts,
        user: {
          isAuthenticated: !!localStorage.getItem("userToken"),
          name: "Guest",
          cartItems: 0,
        },
      },
    };
  } catch (error) {
    console.error("❌ Service: Failed to fetch product page data:", error);
    return {
      success: false,
      error: error.message,
      data: getFallbackData(),
    };
  }
}


export async function postReviewOfProduct(review) {
  try {
    const reviewData = await apiPost("/reviews", review);

    return {
      success: true,
      data: reviewData,
    };
  } catch (error) {
    console.error("Service: Failed to add review:", error);
    return {
      success: false,
      error: error.message,
    };
  }
}

export async function addToCart(userId, quantity = 1, variantId) {
  
 console.log("userId service",userId);
  try {
    const cartData = await apiPost("/cart-items", {
      userId: userId,
      quantity: quantity,
      variantId: variantId,
    });

    return {
      success: true,
      data: cartData,
    };
  } catch (error) {
    console.error("Service: Failed to add to cart:", error);
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
    Product: null,
    Reviews: [],
    SimilarProducts: [],
    user: {
      isAuthenticated: false,
      name: "Guest",
      cartItems: 0,
    },
  };
}
