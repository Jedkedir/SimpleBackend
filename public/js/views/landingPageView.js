import { getLandingPageData } from "../services/LandingPageService.js";

export async function initLandingPage() {
  showLoading();

  const pageData = await getLandingPageData();

  if (pageData.success) {
    renderPage(pageData.data);
  } else {
    showError(pageData.error);
  }

  hideLoading();
  setupEventListeners();
}

function renderPage(data) {
  renderBestSelling(data.bestSelling);
  renderFeatured(data.featured);
  renderUserContext(data.user);
}

function renderBestSelling(products) {
  const container = document.getElementById("best-selling-grid");
  if (!container) return;

  container.innerHTML = products
    .map(
      (product) => `
    <div class="product-card">
      <img src="${product.image_url || "/images/placeholder.jpg"}" alt="${
        product.name
      }">
      <h3>${product.name}</h3>
      <p>$${product.price || product.base_price}</p>
      <span class="badge">Bestseller</span>
    </div>
  `
    )
    .join("");
}

function renderFeatured(products) {
  const container = document.getElementById("featured-grid");
  if (!container) return;

  container.innerHTML = products
    .map(
      (product) => `
    <div class="product-card">
      <img src="${product.image_url || "/images/placeholder.jpg"}" alt="${
        product.name
      }">
      <h3>${product.name}</h3>
      <p>$${product.price || product.base_price}</p>
      <span class="badge">Featured</span>
    </div>
  `
    )
    .join("");
}

function renderUserContext(user) {
  const userElement = document.getElementById("user-context");
  if (userElement) {
    userElement.textContent = `Welcome, ${user.name}`;
  }
}

function setupEventListeners() {
  // Add event listeners for landing page interactions
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
