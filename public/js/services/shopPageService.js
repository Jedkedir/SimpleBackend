import { apiGet, apiPost } from "./BaseService.js";

/**
 * Fetch shop page data with products
 */
export async function getShopPageData(page = 1, limit = 12) {
  try {
    
    const response = await apiGet("/products/get-all");

    
    const products = (response.products || []).map((product) => ({
      id: product.product_id,
      variantId: product.variant_id,
      name: product.product_name || product.name,
      description: product.description,
      price: product.variant_price || product.base_price || product.price,
      originalPrice: null,
      
      image: getFullImageUrl(product.variant_image || product.base_image_url),
      category: product.category_name,
      color: product.color,
      size: product.size,
      stockQuantity: product.stock_quantity,
      rating: product.average_rating,
      reviewCount: product.review_count,
      isNew: isNew(product),
      discount: getDiscount(product),
    }));

    return {
      success: true,
      data: {
        products: products,
        totalCount: products.length,
        currentPage: page,
        totalPages: Math.ceil(products.length / limit),
      },
    };
  } catch (error) {
    console.error("Service: Failed to fetch shop data:", error);
    return {
      success: false,
      error: error.message,
      data: getFallbackShopData(),
    };
  }
}

/**
 * Search and filter products
 */
export async function searchProducts(searchParams) {
  try {
    const {
      search = "",
      categories = [],
      priceMin = null,
      priceMax = null,
      colors = [],
      sizes = [],
      sort = "",
      page = 1,
      limit = 12,
    } = searchParams;

    
    const response = await apiGet("/products/get-all");
    let products = response.products || [];

    
    if (search) {
      const searchLower = search.toLowerCase();
      products = products.filter(
        (product) =>
          (product.product_name || product.name)
            .toLowerCase()
            .includes(searchLower) ||
          (product.description || "").toLowerCase().includes(searchLower)
      );
    }

    
    if (categories.length > 0) {
      products = products.filter((product) =>
        categories.includes((product.category_name || "").toLowerCase())
      );
    }

    
    if (priceMin !== null) {
      products = products.filter(
        (product) =>
          (product.variant_price || product.base_price || product.price) >=
          priceMin
      );
    }
    if (priceMax !== null) {
      products = products.filter(
        (product) =>
          (product.variant_price || product.base_price || product.price) <=
          priceMax
      );
    }

    
    if (colors.length > 0) {
      products = products.filter((product) =>
        colors.includes((product.color || "").toLowerCase())
      );
    }

    
    if (sizes.length > 0) {
      products = products.filter((product) => sizes.includes(product.size));
    }

    
    if (sort) {
      switch (sort) {
        case "price-low":
          products.sort(
            (a, b) =>
              (a.variant_price || a.base_price || a.price) -
              (b.variant_price || b.base_price || b.price)
          );
          break;
        case "price-high":
          products.sort(
            (a, b) =>
              (b.variant_price || b.base_price || b.price) -
              (a.variant_price || a.base_price || a.price)
          );
          break;
        case "name":
          products.sort((a, b) =>
            (a.product_name || a.name).localeCompare(b.product_name || b.name)
          );
          break;
        case "newest":
          products.sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());
          break;
      }
    }

    
    const transformedProducts = products.map((product) => ({
      id: product.product_id,
      name: product.product_name || product.name,
      description: product.description,
      price: product.variant_price || product.base_price || product.price,
      originalPrice: null,
      image: getFullImageUrl(product.variant_image || product.base_image_url),
      category: product.category_name,
      color: product.color,
      size: product.size,
      stockQuantity: product.stock_quantity,
      rating: product.average_rating,
      reviewCount: product.review_count,
      isNew: isNew(product),
      discount: getDiscount(product),
    }));

    
    const startIndex = (page - 1) * limit;
    const endIndex = startIndex + limit;
    const paginatedProducts = transformedProducts.slice(startIndex, endIndex);

    return {
      success: true,
      data: {
        products: paginatedProducts,
        totalCount: transformedProducts.length,
        currentPage: page,
        totalPages: Math.ceil(transformedProducts.length / limit),
        filters: {
          search,
          categories,
          priceRange: { min: priceMin, max: priceMax },
          colors,
          sizes,
          sort,
        },
      },
    };
  } catch (error) {
    console.error("Service: Product search failed:", error);
    return {
      success: false,
      error: error.message,
      data: getFallbackSearchData(),
    };
  }
}
/**
 * Get isNew using created at and current date
 */
function isNew(product) {
  const createdAt = new Date(product.created_at);
  const today = new Date();
  return createdAt.getDate() === today.getDate();
}

function getDiscount(product) {
  const createdAt = new Date(product.created_at);
  const today = new Date();
  const timeDiff = today.getTime() - createdAt.getTime();
  const daysDiff = Math.floor(timeDiff / (1000 * 60 * 60 * 24));
  return daysDiff;
}

/**
 * Get product categories for filters
 */
export async function getProductCategories() {
  try {
    const response = await apiGet("/categories/get-all");

    return {
      success: true,
      data: response.categories || [],
    };
  } catch (error) {
    console.error("Service: Failed to fetch categories:", error);
    return {
      success: false,
      error: error.message,
      data: getFallbackCategories(),
    };
  }
}

/**
 * Get product by ID for quick view
 */
export async function getProductById(productId) {
  try {
    const response = await apiGet(`/products/${productId}`);

    return {
      success: true,
      data: response || null,
    };
  } catch (error) {
    console.error("Service: Failed to fetch product:", error);
    return {
      success: false,
      error: error.message,
      data: null,
    };
  }
}

/**
 * Add product to cart
 */
export async function addToCart(productId, variantId = null, quantity = 1) {
  try {
    
    const userData = JSON.parse(localStorage.getItem("userData") || "{}");
    const userId = userData.id;
    console.log(userId);
    if (!userId) {
      return {
        success: false,
        error: "Please log in to add items to cart",
      };
    }

    
    let cartResponse = await apiGet(`/carts/user/${userId}`);

    if (!cartResponse || !cartResponse.cart_id) {
      
      cartResponse = await apiPost("/carts", { userId });
    }

    const cartId = cartResponse.cart_id;

    
    const cartItemData = {
      cartId: cartId,
      productId: productId,
      variantId: variantId,
      quantity: quantity,
    };

    const response = await apiPost("/cart-items", cartItemData);

    return {
      success: true,
      message: "Product added to cart successfully",
      data: response,
    };
  } catch (error) {
    console.error("Service: Failed to add to cart:", error);
    return {
      success: false,
      error: error.message || "Failed to add product to cart",
    };
  }
}


function getFullImageUrl(imagePath) {
  if (!imagePath) {
    return "sample/placeholder-images.webp"; // Fallback image
  }

  // If it's already a full URL, return as is
  if (imagePath.startsWith("http") || imagePath.startsWith("//")) {
    return imagePath;
  }

  // If it's an absolute path starting with /, prepend the server URL
  if (imagePath.startsWith("/")) {
    return `http://localhost:8000${imagePath}`;
  }

  // If it's a relative path, assume it's in the public/images directory
  return `http://localhost:8000/images/${imagePath}`;
}


function getFallbackShopData() {
  return {
    products: [],
    totalCount: 0,
    currentPage: 1,
    totalPages: 0,
  };
}

function getFallbackSearchData() {
  return {
    products: [],
    totalCount: 0,
    currentPage: 1,
    totalPages: 0,
    filters: {
      search: "",
      categories: [],
      priceRange: { min: null, max: null },
      colors: [],
      sizes: [],
      sort: "",
    },
  };
}

function getFallbackCategories() {
  return [
    { id: 1, name: "Shirts", slug: "shirts" },
    { id: 2, name: "Pants", slug: "pants" },
    { id: 3, name: "Dresses", slug: "dresses" },
    { id: 4, name: "Shoes", slug: "shoes" },
    { id: 5, name: "Accessories", slug: "accessories" },
  ];
}
