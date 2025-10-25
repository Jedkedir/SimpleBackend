// import { apiGet } from "./BaseService.js";

// /**
//  * Fetch all landing page data and return organized object
//  */
// export async function getDashboardPageData() {
//   try {
//     // Fetch all data in parallel
//     const [dashboardData] = await apiGet("/products/dashboard");

//     // Return organized data object
//     return {
//       success: true,
//       data: {
//         TotalSoldData: dashboardData.totalSoldData || [],
//         TotalRevenueData: dashboardData.totalRevenueData || [],
//         StockNotificationData: dashboardData.stokeNotificationData || [],
//         OrderNotificationData: dashboardData.orderNotificationData || [],
//         TopSellingData: dashboardData.topSellingData || [],
//         user: {
//           isAuthenticated: !!localStorage.getItem("authToken"),
//           name: "Guest",
//           cartItems: 0,
//         },
//       },
//     };
//   } catch (error) {
//     console.error("Service: Failed to fetch dashboard page data:", error);
//     return {
//       success: false,
//       error: error.message,
//       data: getFallbackData(),
//     };
//   }
// }

// /**
//  * Search products and return results object
//  */
// export async function searchProducts(query) {
//   try {
//     if (!query || query.trim().length < 2) {
//       return { success: true, data: [], query, count: 0 };
//     }

//     const products = await apiGet("/products/get-all");
//     const allProducts = products.products || [];
//     const searchTerm = query.toLowerCase().trim();

//     const results = allProducts
//       .filter(
//         (product) =>
//           product.name?.toLowerCase().includes(searchTerm) ||
//           product.description?.toLowerCase().includes(searchTerm)
//       )
//       .slice(0, 5);

//     return {
//       success: true,
//       data: results,
//       query,
//       count: results.length,
//     };
//   } catch (error) {
//     console.error("Service: Search failed:", error);
//     return {
//       success: false,
//       error: error.message,
//       data: [],
//       query,
//       count: 0,
//     };
//   }
// }

// /**
//  * Get product details for quick view
//  */
// export async function getProductDetails(productId) {
//   try {
//     const product = await apiGet(`/products/${productId}`);
//     return {
//       success: true,
//       data: product,
//     };
//   } catch (error) {
//     console.error("Service: Product details failed:", error);
//     return {
//       success: false,
//       error: error.message,
//       data: null,
//     };
//   }
// }

// // Helper function
// function getFallbackData() {
//   return {
//     TotalSoldData: [],
//     TotalRevenueData: [],
//     StockNotificationData: [],
//     OrderNotificationData: [],
//     TopSellingData: [],
//     user: {
//       isAuthenticated: false,
//       name: "Guest",
//       cartItems: 0,
//     },
//   };
// }




// Simple API call function
async function apiGet(endpoint) {
    const response = await fetch(`http://localhost:8000/api${endpoint}`, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${localStorage.getItem('userToken') || ''}`
        }
    });

    if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
    }

    return await response.json();
}

/**
 * Fetch all dashboard data and return organized object
 */
export async function getDashboardPageData() {
    try {
        // Fetch dashboard data from your backend API
        const dashboardData = await apiGet("/dashboard");

        console.log('Dashboard API Response:', dashboardData);

        // Return organized data object
        return {
            success: true,
            data: {
                totalSoldData: dashboardData.totalSoldData || { total_sold: "0" },
                totalRevenueData: dashboardData.totalRevenueData || { total_revenue: "0.00" },
                stokeNotificationData: dashboardData.stokeNotificationData || {},
                orderNotificationData: dashboardData.orderNotificationData || {},
                topSellingData: dashboardData.topSellingData || {}
            }
        };
    } catch (error) {
        console.error("Service: Failed to fetch dashboard page data:", error);
        return {
            success: false,
            error: error.message,
            data: getFallbackData()
        };
    }
}

// Helper function
function getFallbackData() {
    return {
        totalSoldData: { total_sold: "0" },
        totalRevenueData: { total_revenue: "0.00" },
        stokeNotificationData: {},
        orderNotificationData: {},
        topSellingData: {}
    };
}