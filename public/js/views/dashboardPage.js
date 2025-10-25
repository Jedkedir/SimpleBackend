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
  const element = document.querySelector(".sold_amount");
  if (element) {
    element.textContent = totalSold || 0;
  }
}

function renderTotalRevenue(totalRevenue) {
  const element = document.querySelector(".revenue_amount");
  if (element) {
    element.textContent = `$${totalRevenue || 0}`;
  }
}

function renderStockNotifications(stockNotifications) {
  const countElement = document.getElementById("stock-alerts-count");
  if (countElement) {
    countElement.textContent = stockNotifications ? stockNotifications.length : 0;
  }
  
  // Add to notifications panel
  if (stockNotifications && stockNotifications.length > 0) {
    const notificationContainer = document.querySelector(".notification");
    if (notificationContainer) {
      stockNotifications.forEach(notification => {
        const notificationElement = document.createElement("div");
        notificationElement.className = "notification_item alert alert-warning alert-sm mb-2";
        notificationElement.innerHTML = `
          <i class="bi bi-exclamation-triangle me-2"></i>
          <small>${notification.text || notification.message}</small>
        `;
        notificationContainer.appendChild(notificationElement);
      });
    }
  }
}

function renderOrderNotifications(orderNotifications) {
  const countElement = document.getElementById("new-orders-count");
  if (countElement) {
    countElement.textContent = orderNotifications ? orderNotifications.length : 0;
  }
  
  // Add to notifications panel
  if (orderNotifications && orderNotifications.length > 0) {
    const notificationContainer = document.querySelector(".notification");
    if (notificationContainer) {
      orderNotifications.forEach(notification => {
        const notificationElement = document.createElement("div");
        notificationElement.className = "notification_item alert alert-info alert-sm mb-2";
        notificationElement.innerHTML = `
          <i class="bi bi-bag me-2"></i>
          <small>${notification.text || notification.message}</small>
        `;
        notificationContainer.appendChild(notificationElement);
      });
    }
  }
}

function renderTopSelling(topSelling) {
  if (!topSelling || topSelling.length === 0) return;
  
  const barGraphContainer = document.querySelector(".bar_graph");
  if (!barGraphContainer) return;
  
  // Clear existing chart
  barGraphContainer.innerHTML = "";
  
  // Create canvas for chart
  const canvas = document.createElement("canvas");
  canvas.width = "100%";
  canvas.classList.add("graph");
  barGraphContainer.appendChild(canvas);
  
  // Create chart using Chart.js
  new Chart(canvas, {
    type: "bar",
    data: {
      labels: topSelling.map(item => item.name),
      datasets: [
        {
          label: "Units Sold",
          data: topSelling.map(item => item.sold),
          backgroundColor: "rgba(54, 162, 235, 0.6)",
          borderColor: "rgba(54, 162, 235, 1)",
          borderWidth: 1
        }
      ]
    },
    options: {
      responsive: true,
      plugins: {
        legend: {
          display: false
        }
      },
      scales: {
        y: {
          beginAtZero: true,
          ticks: {
            stepSize: 1
          }
        }
      }
    }
  });
}

function showLoading() {
  const spinner = document.getElementById("loading-spinner");
  if (spinner) {
    spinner.classList.remove("d-none");
  }
}

function hideLoading() {
  const spinner = document.getElementById("loading-spinner");
  if (spinner) {
    spinner.classList.add("d-none");
  }
}

function showError(message) {
  const errorAlert = document.getElementById("error-alert");
  const errorMessage = document.getElementById("error-message");
  
  if (errorAlert && errorMessage) {
    errorMessage.textContent = message;
    errorAlert.classList.remove("d-none");
    
    setTimeout(() => {
      errorAlert.classList.add("d-none");
    }, 5000);
  }
}
