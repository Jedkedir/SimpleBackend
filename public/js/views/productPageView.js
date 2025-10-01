import {
  getProductPageData,
  postReviewOfProduct,
} from "../services/ProductPageService.js";

let currentProductId = null;

export async function initProductPage() {
  // Get product ID from URL
  const urlParams = new URLSearchParams(window.location.search);
  currentProductId = urlParams.get("id");

  if (!currentProductId) {
    showError("Product ID not found");
    return;
  }

  showLoading();
  const pageData = await getProductPageData(currentProductId);

  if (pageData.success) {
    renderProductPage(pageData.data);
  } else {
    showError(pageData.error);
  }

  hideLoading();
  setupEventListeners();
}

function renderProductPage(data) {
  renderProduct(data.Product);
  renderReviews(data.Reviews);
  renderSimilarProducts(data.SimilarProducts);
}

function renderProduct(product) {
  const container = document.getElementById("product-details");
  if (!container) return;

  container.innerHTML = `
    <div class="product-images">
      <img src="${product.image_url || "/images/placeholder.jpg"}" alt="${
    product.name
  }">
    </div>
    <div class="product-info">
      <h1>${product.name}</h1>
      <p class="price">$${product.price || product.base_price}</p>
      <p class="description">${product.description || ""}</p>
      <div class="product-actions">
        <button class="add-to-cart">Add to Cart</button>
        <button class="buy-now">Buy Now</button>
      </div>
    </div>
  `;
}

function renderReviews(reviews) {
  const container = document.getElementById("reviews-container");
  if (!container) return;

  container.innerHTML = reviews
    .map(
      (review) => `
    <div class="review">
      <div class="review-header">
        <span class="rating">${"★".repeat(review.rating)}${"☆".repeat(
        5 - review.rating
      )}</span>
        <span class="reviewer">${review.user_name || "Anonymous"}</span>
      </div>
      <p class="review-content">${review.content || ""}</p>
    </div>
  `
    )
    .join("");
}

function renderSimilarProducts(products) {
  const container = document.getElementById("similar-products");
  if (!container) return;

  container.innerHTML = products
    .map(
      (product) => `
    <div class="similar-product">
      <img src="${product.image_url || "/images/placeholder.jpg"}" alt="${
        product.name
      }">
      <h4>${product.name}</h4>
      <p>$${product.price || product.base_price}</p>
    </div>
  `
    )
    .join("");
}

function setupEventListeners() {
  const reviewForm = document.getElementById("review-form");
  if (reviewForm) {
    reviewForm.addEventListener("submit", handleReviewSubmit);
  }
}

async function handleReviewSubmit(event) {
  event.preventDefault();

  const formData = new FormData(event.target);
  const review = {
    productId: currentProductId,
    rating: parseInt(formData.get("rating")),
    content: formData.get("content"),
  };

  const result = await postReviewOfProduct(review);
  if (result.success) {
    alert("Review submitted successfully!");
    event.target.reset();
    // Refresh reviews
    initProductPage();
  } else {
    showError(result.error);
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
