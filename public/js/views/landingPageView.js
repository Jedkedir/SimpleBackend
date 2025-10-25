import { getLandingPageData } from "../services/landingPageService.js";

export async function initLandingPage() {
  console.log("Initializing landing page...");
  showLoading();

  const pageData = await getLandingPageData();
  console.log("Running landing page for :", pageData.data);
  if (pageData.success) {
    renderPage(pageData.data);
  } else {
    showError(pageData.error);
  }

  hideLoading();
  setupEventListeners();
}

function renderPage(data) {
  console.log("Rendering landing page:", data);
  renderBestSelling(data.bestSelling);
  renderFeatured(data.featured);
  
}

function renderBestSelling(products) {
  const container = document.getElementById("best-selling-products");
  
  if (!container) return;
  
  if (!products || products.length === 0) {
    container.innerHTML = `
      <div class="col-12 text-center py-5">
        <i class="bi bi-box fs-1 text-muted"></i>
        <p class="text-muted mt-2">No best selling products available</p>
      </div>
    `;
    return;
  }
  
  container.innerHTML = products
    .map(
      (product) => `
    <div class="col-md-6 col-lg-3 mb-4">
      <div class="card product-card h-100">
        <img src="${
          product.variant_image || "sample/placeholder-images.webp"
        }" onerror="this.onerror=null; this.src='sample/placeholder-images.webp';"class="card-img-top" alt="${
        product.name
      }" style="height: 250px; object-fit: cover;">
        <div class="card-body d-flex flex-column">
          <h6 class="card-title">${product.name}</h6>
          <p class="card-text text-muted small flex-grow-1">${
            product.description || ""
          }</p>
          <div class="d-flex justify-content-between align-items-center mt-auto">
            <span class="fw-bold text-primary">$${product.price}</span>
            <button class="btn btn-outline-primary btn-sm" onclick="viewProduct(${
              product.product_id
            },${product.variant_id})">
              View Details
            </button>
          </div>
        </div>
      </div>
    </div>
  `
    )
    .join("");
}

function renderFeatured(products) {
  console.log("Rendering featured products:", products);
  const container = document.getElementById("featured-products");
  
  if (!container) return;
  
  if (!products || products.length === 0) {
    container.innerHTML = `
      <div class="col-12 text-center py-5">
        <i class="bi bi-star fs-1 text-muted"></i>
        <p class="text-muted mt-2">No featured products available</p>
      </div>
    `;
    return;
  }
  
  container.innerHTML = products
    .map(
      (product) => `
    <div class="col-md-6 col-lg-3 mb-4">
      <div class="card product-card h-100">
        <div class="position-relative">
          <img src="${
            product.base_image_url || "sample/placeholder-images.webp"
          }" onerror="this.onerror=null; this.src='sample/placeholder-images.webp';" class="card-img-top" alt="${
        product.name
      }" style="height: 250px; object-fit: cover;">
          <span class="badge bg-warning position-absolute top-0 end-0 m-2">
            <i class="bi bi-star-fill"></i> Featured
          </span>
        </div>
        <div class="card-body d-flex flex-column">
          <h6 class="card-title">${product.name}</h6>
          <p class="card-text text-muted small flex-grow-1">${
            product.description || ""
          }</p>
          <div class="d-flex justify-content-between align-items-center mt-auto">
            <span class="fw-bold text-primary">$${product.price}</span>
            <button class="btn btn-primary btn-sm" onclick="viewProduct(${
              product.product_id
            },${-1})">
              View Details
            </button>
          </div>
        </div>
      </div>
    </div>
  `
    )
    .join("");
}



function setupEventListeners() {
  // Add event listeners for landing page interactions
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

// Global function for product navigation
window.viewProduct = function(productId, variantId) {
  window.location.href = `product.html?id=${productId}&variantId=${variantId}`;
};
