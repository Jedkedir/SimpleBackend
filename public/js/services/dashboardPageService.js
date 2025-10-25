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