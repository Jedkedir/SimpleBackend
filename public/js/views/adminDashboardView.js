

import { getDashboardPageData } from '../services/dashboardPageService.js';

// Utility functions
function showLoading(show) {
    const spinner = document.getElementById('loading-spinner');
    if (show) {
        spinner.classList.remove('d-none');
    } else {
        spinner.classList.add('d-none');
    }
}

function showError(message) {
    const errorAlert = document.getElementById('error-alert');
    const errorMessage = document.getElementById('error-message');
    errorMessage.textContent = message;
    errorAlert.classList.remove('d-none');
    
    setTimeout(function() {
        errorAlert.classList.add('d-none');
    }, 5000);
}

function showSuccess(message) {
    const successAlert = document.getElementById('success-alert');
    const successMessage = document.getElementById('success-message');
    successMessage.textContent = message;
    successAlert.classList.remove('d-none');
    
    setTimeout(function() {
        successAlert.classList.add('d-none');
    }, 3000);
}

// Update key metrics
function updateKeyMetrics(data) {
    console.log('Updating metrics with:', data);
    
    // Total Sold
    const totalSold = data.totalSoldData?.total_sold || "0";
    const soldElement = document.querySelector('.sold_amount');
    if (soldElement) soldElement.textContent = totalSold;

    // Total Revenue
    const totalRevenue = data.totalRevenueData?.total_revenue || "0.00";
    const revenueElement = document.querySelector('.revenue_amount');
    if (revenueElement) revenueElement.textContent = '$' + totalRevenue;

    // Stock Alerts
    const stockAlertCount = (data.stokeNotificationData?.stock_notification <= 5) ? 1 : 0;
    const stockElement = document.getElementById('stock-alerts-count');
    if (stockElement) stockElement.textContent = stockAlertCount;

    // New Orders
    const newOrdersCount = data.orderNotificationData ? 1 : 0;
    const ordersElement = document.getElementById('new-orders-count');
    if (ordersElement) ordersElement.textContent = newOrdersCount;
}

// Render top selling data
function renderTopSellingChart(topSellingData) {
    const barGraphContainer = document.querySelector('.bar_graph');
    if (!barGraphContainer) return;
    
    if (!topSellingData || Object.keys(topSellingData).length === 0) {
        barGraphContainer.innerHTML = '<p class="text-muted">No top selling data available</p>';
        return;
    }

    const productName = topSellingData.product_id ? ` ${topSellingData.name}` : 'Top Product';
    const salesData = topSellingData.total_sold || "0";

    barGraphContainer.innerHTML = `
        <div class="card">
            <div class="card-body">
                <h6 class="card-title">Top Selling Product</h6>
                <div class="d-flex justify-content-between align-items-center">
                    <div>
                        <h4 class="text-primary">${productName}</h4>
                        <p class="text-muted mb-0">Total Sold: <strong>${salesData}</strong> units</p>
                    </div>
                    <div class="bg-primary text-white rounded p-3">
                        <i class="bi bi-trophy fs-1"></i>
                    </div>
                </div>
            </div>
        </div>
    `;
}

// Create notification elements
function createStockNotificationElement(notification) {
    const div = document.createElement('div');
    div.className = 'alert alert-warning alert-dismissible fade show mb-2';
    div.innerHTML = `
        <strong>Stock Alert:</strong> ${notification.name || 'Product'} is low on stock 
        (${notification.stock_notification || 0} remaining)
        <button type="button" class="btn-close" data-bs-dismiss="alert"></button>
    `;
    return div;
}

function createOrderNotificationElement(order) {
    const div = document.createElement('div');
    div.className = 'alert alert-info alert-dismissible fade show mb-2';
    
    const orderDate = order.order_date ? new Date(order.order_date).toLocaleDateString() : 'Today';
    
    div.innerHTML = `
        <strong>New Order:</strong> ${order.product_name || 'Product'} - 
        Status: ${order.status || 'Pending'} - ${orderDate}
        <button type="button" class="btn-close" data-bs-dismiss="alert"></button>
    `;
    return div;
}

// Render notifications
function renderNotifications(data) {
    const notificationContainer = document.querySelector('.notification');
    const recentActionContainer = document.querySelector('.recent_action');
    
    if (!notificationContainer || !recentActionContainer) return;
    
    // Clear existing content
    notificationContainer.innerHTML = '';
    recentActionContainer.innerHTML = '';

    // Stock Notifications
    if (data.stokeNotificationData && data.stokeNotificationData.stock_notification <= 5) {
        const notificationElement = createStockNotificationElement(data.stokeNotificationData);
        notificationContainer.appendChild(notificationElement);
    } else {
        notificationContainer.innerHTML += '<p class="text-muted">No stock notifications</p>';
    }

    // Order Notifications
    if (data.orderNotificationData && Object.keys(data.orderNotificationData).length > 0) {
        const orderElement = createOrderNotificationElement(data.orderNotificationData);
        notificationContainer.appendChild(orderElement);
    } else {
        notificationContainer.innerHTML += '<p class="text-muted">No new orders</p>';
    }

    // Recent Actions
    const recentActions = [];
    
    if (data.stokeNotificationData && data.stokeNotificationData.stock_notification <= 5) {
        recentActions.push({
            type: 'stock',
            data: data.stokeNotificationData,
            timestamp: new Date().toISOString()
        });
    }
    
    if (data.orderNotificationData && Object.keys(data.orderNotificationData).length > 0) {
        recentActions.push({
            type: 'order', 
            data: data.orderNotificationData,
            timestamp: data.orderNotificationData.order_date
        });
    }

    if (recentActions.length > 0) {
        recentActions.forEach(function(action) {
            const actionElement = document.createElement('div');
            actionElement.className = 'd-flex justify-content-between align-items-center border-bottom pb-2 mb-2';
            
            let actionText = '';
            let badgeClass = 'bg-secondary';
            
            if (action.type === 'stock') {
                actionText = `Stock alert for ${action.data.name}`;
                badgeClass = 'bg-warning';
            } else if (action.type === 'order') {
                actionText = `New order for ${action.data.product_name}`;
                badgeClass = 'bg-info';
            }
            
            const actionDate = action.type === 'order' && action.data.order_date 
                ? new Date(action.data.order_date).toLocaleDateString() 
                : 'Today';
            
            actionElement.innerHTML = `
                <div>
                    <span class="badge ${badgeClass} me-2">${action.type}</span>
                    ${actionText}
                </div>
                <small class="text-muted">${actionDate}</small>
            `;
            recentActionContainer.appendChild(actionElement);
        });
    } else {
        recentActionContainer.innerHTML = '<p class="text-muted">No recent actions</p>';
    }
}

// Main initialization function
export async function initializeDashboard() {
  try {
    showLoading(true);
    const result = await getDashboardPageData();

    if (result.success) {
      updateKeyMetrics(result.data);
      renderTopSellingChart(result.data.topSellingData);
      renderNotifications(result.data);
      //showSuccess('Dashboard loaded successfully');
    } else {
      showError(result.error || "Failed to load dashboard data");
    }
  } catch (error) {
    // showError('An error occurred while loading the dashboard');
    console.error("Dashboard initialization error:", error);
  } finally {
    showLoading(false);
  }
}

