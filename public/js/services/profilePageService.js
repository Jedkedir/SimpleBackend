import { apiGet, apiPost } from "./BaseService.js";

/**
 * Fetch user profile data
 */
export async function getUserProfileData() {
  try {
    const user = localStorage.getItem('userId') || '{}';
    const userId = user.id;
    
    if (!userId) {
      return {
        success: false,
        error: "User not authenticated"
      };
    }

    
    const profileData = await apiGet(`/users/${userId}`);
    
    
    return {
      success: true,
      data: {
        user: profileData.user || user,
        stats: profileData.stats || { totalOrders: 0, totalSpent: 0 },
        orders: profileData.orders || [],
        addresses: profileData.addresses || []
      },
    };
  } catch (error) {
    console.error("Service: Failed to fetch user profile data:", error);
    return {
      success: false,
      error: error.message,
      data: getFallbackUserData(),
    };
  }
}

/**
 * Fetch admin profile data
 */
export async function getAdminProfileData() {
  try {
    const userRole = localStorage.getItem('userRole')
    const adminId = localStorage.getItem('userId');
    
    if (userRole !== 'admin') {
      return {
        success: false,
        error: "Admin not authenticated"
      };
    }

    
    const profileData = await apiGet(`/profile/admin/${adminId}`);
    
    
    return {
      success: true,
      data: {
        admin: profileData.admin || user,
        stats: profileData.stats || { totalUsers: 0, totalProducts: 0, totalOrders: 0, totalRevenue: 0 },
        activities: profileData.activities || []
      },
    };
  } catch (error) {
    console.error("Service: Failed to fetch admin profile data:", error);
    return {
      success: false,
      error: error.message,
      data: getFallbackAdminData(),
    };
  }
}

/**
 * Update user profile
 */
export async function updateUserProfile(profileData) {
  try {
    const user = JSON.parse(localStorage.getItem('user') || '{}');
    const userId = user.id;
    
    if (!userId) {
      return {
        success: false,
        error: "User not authenticated"
      };
    }

    const response = await apiPost(`/profile/${userId}`, {
      body: profileData
    });
    
    
    if (response.success && response.data.user) {
      localStorage.setItem('user', JSON.stringify(response.data.user));
    }
    
    return response;
  } catch (error) {
    console.error("Service: Failed to update user profile:", error);
    return {
      success: false,
      error: error.message
    };
  }
}

/**
 * Update admin profile
 */
export async function updateAdminProfile(profileData) {
  try {
    const user = JSON.parse(localStorage.getItem('user') || '{}');
    const adminId = user.id;
    
    if (!adminId) {
      return {
        success: false,
        error: "Admin not authenticated"
      };
    }

    const response = await apiPost(`/profile/admin/${adminId}`, {
      body: profileData
    });
    
    
    if (response.success && response.data.admin) {
      localStorage.setItem('user', JSON.stringify(response.data.admin));
    }
    
    return response;
  } catch (error) {
    console.error("Service: Failed to update admin profile:", error);
    return {
      success: false,
      error: error.message
    };
  }
}


export async function postReviewOfProduct(review) {
  try {

    
    const [reviewData] = await apiPost('reviews', {body: review})
    
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


function getFallbackUserData() {
  return {
    user: {
      isAuthenticated: false,
      name: "Guest",
      email: "",
    },
    stats: { totalOrders: 0, totalSpent: 0 },
    orders: [],
    addresses: []
  };
}

function getFallbackAdminData() {
  return {
    admin: {
      isAuthenticated: false,
      name: "Admin",
      email: "",
      role: "Administrator"
    },
    stats: { totalUsers: 0, totalProducts: 0, totalOrders: 0, totalRevenue: 0 },
    activities: []
  };
}

