import { getDashboardPageData } from "../services/DashboardPageService.js";

export async function initDashboardPage() {
  showLoading();

  const pageData = await getDashboardPageData();

  if (pageData.success) {
    renderDashboard(pageData.data);
  } else {
    showError(pageData.error);
  }

  hideLoading();
}

function renderDashboard(data) {
  renderTotalSold(data.TotalSoldData);
  renderTotalRevenue(data.TotalRevenueData);
  renderStockNotifications(data.StockNotificationData);
  renderOrderNotifications(data.OrderNotificationData);
  renderTopSelling(data.TopSellingData);
}

function renderTotalSold(totalSold) {
  const container = document.getElementById("total-sold");
  if (container) {
    container.textContent = `Total Sold: ${totalSold}`;
  }
}

function renderTotalRevenue(totalRevenue) {
  const container = document.getElementById("total-revenue");
  if (container) {
    container.textContent = `Total Revenue: $${totalRevenue}`;
  }
}

function renderStockNotifications(stockNotifications) {
  const container = document.getElementById("stock-notifications");
  if (!container) return;

  container.innerHTML = stockNotifications
    .map(
      (notification) => `
    <div class="notification stock-notification">
      <p>${notification.message}</p>
    </div>
  `
    )
    .join("");
}

function renderOrderNotifications(orderNotifications) {
  const container = document.getElementById("order-notifications");
  if (!container) return;

  container.innerHTML = orderNotifications
    .map(
      (notification) => `
    <div class="notification order-notification">
      <p>${notification.message}</p>
    </div>
  `
    )
    .join("");
}

function renderTopSelling(topSelling) {
  const container = document.getElementById("top-selling");
  if (!container) return;

  container.innerHTML = topSelling
    .map(
      (product) => `
    <div class="top-product">
      <span>${product.name}</span>
      <span>${product.sales_count} sold</span>
    </div>
  `
    )
    .join("");
}

function showLoading() {
  const loader = document.getElementById("loading-indicator");
  if (loader) loader.style.display = "block";
}

function hideLoading() {
  const loader = document.getElementById("loading-indicator");
  if (loader) loader.style.display = "none";
}

function showError(message) {
  const errorEl = document.getElementById("error-message");
  if (errorEl) {
    errorEl.textContent = `Error: ${message}`;
    errorEl.style.display = "block";
  }
}
