import { getStockPageData } from "../services/stockPageService.js";

// Export the initialization function
export function initStockPage() {
  console.log("🚀 Initializing stock page...");
  initializeStockPage();
}

function showLoading(show) {
  const spinner = document.getElementById("loading-spinner");
  if (spinner) {
    spinner.classList.toggle("d-none", !show);
  }
}

function showError(message) {
  const errorAlert = document.getElementById("error-alert");
  const errorMessage = document.getElementById("error-message");
  if (errorAlert && errorMessage) {
    errorMessage.textContent = message;
    errorAlert.classList.remove("d-none");
    setTimeout(() => errorAlert.classList.add("d-none"), 5000);
  }
}

function showSuccess(message) {
  const successAlert = document.getElementById("success-alert");
  const successMessage = document.getElementById("success-message");
  if (successAlert && successMessage) {
    successMessage.textContent = message;
    successAlert.classList.remove("d-none");
    setTimeout(() => successAlert.classList.add("d-none"), 3000);
  }
}

function updateStockSummary(data) {

  const inStockCount = data.InStockData ? data.InStockData.length : 0;
  const outOfStockCount = data.OutOfStockData ? data.OutOfStockData.length : 0;

  const lowStockCount = data.InStockData
    ? data.InStockData.filter((item) => item.stock_info < 10).length
    : 0;
  document.getElementById("in-stock-count").textContent = inStockCount;
  document.getElementById("low-stock-count").textContent = lowStockCount;
  document.getElementById("out-of-stock-count").textContent = outOfStockCount;
}

window.handleImageError = function (img) {
  console.log("🖼️ Image failed to load:", img.src);
  img.onerror = null; // Prevent infinite loop
  img.src = "/sample/placeholder-images.webp";
  img.alt = "Placeholder image";
};

function renderOutOfStock(outOfStockData) {
  const container = document.getElementById("out-of-stock-products");
  if (!container) return;

  if (!outOfStockData || outOfStockData.length === 0) {
    container.innerHTML = `
            <div class="text-center py-4">
                <i class="bi bi-check-circle fs-1 text-success"></i>
                <p class="text-muted mt-2">Great! No products are out of stock.</p>
            </div>
        `;
    return;
  }

  container.innerHTML = `
        <div class="table-responsive">
            <table class="table table-hover">
                <thead class="table-dark">
                    <tr>
                        <th>Product</th>
                        <th>Product ID</th>
                        <th>Current Stock</th>
                        <th>Status</th>
                    </tr>
                </thead>
                <tbody>
                    ${outOfStockData
                      .map(
                        (product) => `
                        <tr>
                            <td>
                                <div class="d-flex align-items-center">
                                    <img src="${product.image_url || "sample/placeholder-images.webp"}" 
                                         alt="${product.name}" 
                                         class="rounded me-3" 
                                         style="width: 50px; height: 50px; object-fit: cover;"
                                         onerror="handleImageError(this)">
                                    <div>
                                        <h6 class="mb-0">${product.name}</h6>
                                        <small class="text-muted">${
                                          product.category || "General"
                                        }</small>
                                    </div>
                                </div>
                            </td>
                            <td>${product.product_id}</td>
                            <td><span class="badge bg-danger">${
                              product.stock_info
                            }</span></td>
                            <td><span class="badge bg-danger">Out of Stock</span></td>                            
                        </tr>
                    `
                      )
                      .join("")}
                </tbody>
            </table>
        </div>
    `;
}

function renderInStock(inStockData) {
  const container = document.getElementById("in-stock-products");
  if (!container) return;

  if (!inStockData || inStockData.length === 0) {
    container.innerHTML = `
            <div class="text-center py-4">
                <i class="bi bi-box fs-1 text-muted"></i>
                <p class="text-muted mt-2">No products in stock.</p>
            </div>
        `;
    return;
  }

  container.innerHTML = `
        <div class="table-responsive">
            <table class="table table-hover">
                <thead class="table-dark">
                    <tr>
                        <th>Product</th>
                        <th>Product ID</th>
                        <th>Stock Level</th>
                        <th>Status</th>                       
                    </tr>
                </thead>
                <tbody>
                    ${inStockData
                      .map((product) => {
                        const isLowStock = product.stock_info < 100;
                        return `
                            <tr class="${isLowStock ? "table-warning" : ""}">
                                <td>
                                    <div class="d-flex align-items-center">
                                        <img src="${product.image_url || "sample/placeholder-images.webp"}" 
                                             alt="${product.name}" 
                                             class="rounded me-3" 
                                             style="width: 50px; height: 50px; object-fit: cover;"
                                             onerror="handleImageError(this)">
                                        <div>
                                            <h6 class="mb-0">${
                                              product.name
                                            }</h6>
                                            <small class="text-muted">${
                                              product.category || "General"
                                            }</small>
                                        </div>
                                    </div>
                                </td>
                                <td>${product.product_id}</td>
                                <td>
                                    <span class="fw-bold ${
                                      isLowStock
                                        ? "text-warning"
                                        : "text-success"
                                    }">
                                        ${product.stock_info}
                                    </span>
                                </td>
                                <td>
                                    <span class="badge bg-${
                                      isLowStock ? "warning" : "success"
                                    }">
                                        ${isLowStock ? "Low Stock" : "In Stock"}
                                    </span>
                                </td>                                
                            </tr>
                        `;
                      })
                      .join("")}
                </tbody>
            </table>
        </div>
    `;
}

function confirmStockUpdate() {
  const productId = document.getElementById("product-id-to-update").value;
  const newQuantity = document.getElementById("new-stock-quantity").value;

  if (!newQuantity || isNaN(newQuantity) || parseInt(newQuantity) < 0) {
    showError("Please enter a valid stock quantity");
    return;
  }

  console.log("Updating stock for product:", productId, "to:", newQuantity);

  const modal = bootstrap.Modal.getInstance(
    document.getElementById("stockUpdateModal")
  );
  if (modal) modal.hide();

  showSuccess(
    `Stock updated successfully! Product ${productId} now has ${newQuantity} units.`
  );

  setTimeout(() => {
    initializeStockPage();
  }, 1000);
}

async function initializeStockPage() {
  try {
    showLoading(true);
    const result = await getStockPageData();
    const outOfStockData = result.data.OutOfStockData || [];
    const inStockData = result.data.InStockData || [];
    if (result.success) {
      updateStockSummary(result.data);
      renderOutOfStock(outOfStockData);
      renderInStock(inStockData);
      showSuccess("Stock data loaded successfully");
    } else {
      showError(result.error || "Failed to load stock data");
    }
  } catch (error) {
    console.error("Stock page initialization error:", error);
    showError("An error occurred while loading stock data");
  } finally {
    showLoading(false);
  }
}

