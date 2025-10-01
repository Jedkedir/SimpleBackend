import { getStockPageData } from "../services/StockPageService.js";

export async function initStockPage() {
  showLoading();

  const pageData = await getStockPageData();

  if (pageData.success) {
    renderStockData(pageData.data);
  } else {
    showError(pageData.error);
  }

  hideLoading();
}

function renderStockData(data) {
  renderOutOfStock(data.OutOfStockData);
  renderInStock(data.InStockData);
}

function renderOutOfStock(outOfStock) {
  const container = document.getElementById("out-of-stock");
  if (!container) return;

  container.innerHTML = outOfStock
    .map(
      (product) => `
    <div class="stock-item out-of-stock">
      <h4>${product.name}</h4>
      <p>Out of Stock</p>
      <button class="restock-btn" data-id="${product.id}">Restock</button>
    </div>
  `
    )
    .join("");
}

function renderInStock(inStock) {
  const container = document.getElementById("in-stock");
  if (!container) return;

  container.innerHTML = inStock
    .map(
      (product) => `
    <div class="stock-item in-stock">
      <h4>${product.name}</h4>
      <p>Stock: ${product.stock_quantity}</p>
      <button class="update-stock-btn" data-id="${product.id}">Update Stock</button>
    </div>
  `
    )
    .join("");
}

function setupEventListeners() {
  document.addEventListener("click", (e) => {
    if (e.target.classList.contains("restock-btn")) {
      const productId = e.target.dataset.id;
      restockProduct(productId);
    }

    if (e.target.classList.contains("update-stock-btn")) {
      const productId = e.target.dataset.id;
      updateStock(productId);
    }
  });
}

function restockProduct(productId) {
  const newStock = prompt("Enter new stock quantity:");
  if (newStock) {
    console.log("Restocking product:", productId, "to:", newStock);
    // Implement restock functionality
  }
}

function updateStock(productId) {
  const newStock = prompt("Enter updated stock quantity:");
  if (newStock) {
    console.log("Updating stock for product:", productId, "to:", newStock);
    // Implement update stock functionality
  }
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
