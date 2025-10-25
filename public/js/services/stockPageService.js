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
 * Fetch all stock page data and return organized object
 */
export async function getStockPageData() {
    try {
        const stockData = await apiGet("/stock");

        console.log('Stock API Response:', stockData);

        const outOfStockArray = stockData.outOfStockData ? stockData.outOfStockData : [];
        const inStockArray = stockData.inStockData ? stockData.inStockData : [];

        return {
            success: true,
            data: {
                OutOfStockData:outOfStockArray || [],
                InStockData: inStockArray || []
            }
        };
    } catch (error) {
        console.error("Service: Failed to fetch stock page data:", error);
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
        OutOfStockData: [],
        InStockData: []
    };
}