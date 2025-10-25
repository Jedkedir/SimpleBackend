import {
  getProductPageData,
  postReviewOfProduct,
  addToCart,
} from "../services/productPageService.js";

let currentProductId = null;
let currentVariantId = null;
let selectedVariant = null;

export async function initProductPage() {
  
  const urlParams = new URLSearchParams(window.location.search);
  currentProductId = urlParams.get("id");
  currentVariantId = urlParams.get("variantId");

  if (!currentProductId) {
    showError("Product ID not found");
    return;
  }

  showLoading();
  const pageData = await getProductPageData(currentProductId, currentVariantId);

  if (pageData.success) {
    renderProductPage(pageData.data);
  } else {
    showError(pageData.error);
  }

  hideLoading();
  setupEventListeners();
}

function renderProductPage(data) {
  renderProduct(data.Product, data.Variants);
  renderReviews(data.Reviews);
  renderSimilarProducts(data.SimilarProducts);
}

function renderProduct(product, variants) {
  const container = document.getElementById("product-details");
  console.log("Product:",product);
  console.log("Variants:",variants);
console.log("Selected Variant:",selectedVariant);
  if (!container || !product) return;

  const hasVariants = variants && variants.length > 0;

  
  const userId = localStorage.getItem("userId");
  container.innerHTML = `
    <div class="col-lg-6">
      <div class="product-image-container">
        <img src="${
          selectedVariant?.image_url ||
          product.base_image_url ||
          "sample/placeholder-images.webp"
        }" 
        onerror="this.onerror=null; this.src='sample/placeholder-images.webp';"
             alt="${product.name}" 
             class="img-fluid product-image rounded mb-3"
             id="main-product-image">
        
        <!-- Variant Thumbnails -->
        ${
          hasVariants
            ? `
          <div class="variant-thumbnails">
            <label class="form-label fw-bold mb-2">Available Variants:</label>
            <div class="d-flex gap-2 flex-wrap">
              ${variants
                .map(
                  (variant) => `
                <div class="variant-thumbnail ${
                  selectedVariant?.id === variant.id ? "active" : ""
                }" 
                     data-variant-id="${variant.variant_id}"
                     data-variant-image="${
                       variant.image_url ||
                       product.base_image_url ||
                       "sample/placeholder-images.webp"
                     }"
                     data-variant-color="${variant.color}"
                     data-variant-price="${variant.price}"
                     data-variant-size="${variant.size}"
                     data-variant-stock="${variant.stock_quantity}">
                  <img src="${
                    variant.image_url ||
                    product.base_image_url ||
                    "sample/placeholder-images.webp"
                  }"  onerror="this.onerror=null; this.src='sample/placeholder-images.webp';"
                       alt="${variant.color} - ${variant.size}"
                       class="thumbnail-img">
                  <div class="variant-info">
                    <small class="d-block">${variant.color}</small>
                    <small class="d-block">${variant.size}</small>
                    <small class="d-block text-muted">${
                      variant.stock_quantity
                    } in stock</small>
                  </div>
                </div>
              `
                )
                .join("")}
            </div>
          </div>
        `
            : ""
        }
      </div>
    </div>
    <div class="col-lg-6">
      <div class="ps-lg-4">
        <h1 class="h3">${product.name}</h1>
        <div class="mb-3">
          <span class="h4 text-primary fw-bold" id="product-price">$${
            selectedVariant ? selectedVariant.price : product.price
          }</span>
          ${
            product.price
              ? `<span class="text-muted text-decoration-line-through ms-2">$${
                  +product.price + Math.round(product.price * 0.1)
                }</span>`
              : ""
          }
        </div>
        
        ${
          product.rating
            ? `
          <div class="mb-3">
            <div class="rating-stars">
              ${generateStars(product.rating)}
            </div>
            <small class="text-muted ms-2">(${
              product.reviewCount || 0
            } reviews)</small>
          </div>
        `
            : ""
        }
        
        <p class="lead mb-4">${product.description || ""}</p>
        
        <!-- Selected Variant Info -->
        ${
          hasVariants
            ? `
          <div class="selected-variant-info mb-4 p-3 bg-light rounded" id="selected-variant-info" 
               style="${selectedVariant ? "" : "display: none;"}">
            ${
              selectedVariant
                ? `
              <h6 class="mb-2">Selected Variant:</h6>
              <div class="d-flex align-items-center gap-3">
                <img src="${
                  selectedVariant.image_url ||
                  product.base_image_url ||
                  "sample/placeholder-images.webp"
                }" onerror="this.onerror=null; this.src='sample/placeholder-images.webp';"
                     alt="${selectedVariant.color} - ${selectedVariant.size}"
                     class="rounded" style="width: 60px; height: 60px; object-fit: cover;">
                <div>
                  <strong>${selectedVariant.color} - ${
                    selectedVariant.size
                  }</strong>
                  <div class="text-muted">${
                    selectedVariant.stock_quantity
                  } in stock</div>
                </div>
              </div>
            `
                : "Please select a variant"
            }
          </div>
        `
            : ""
        }
        
        <!-- Stock Status -->
        <div class="mb-3">
          <strong>Availability:</strong>
          <span class="${
            selectedVariant?.stock_quantity > 0 || product.stock_quantity > 0
              ? "text-success"
              : "text-danger"
          }" id="stock-status">
            ${
              selectedVariant?.stock_quantity > 0 || product.stock_quantity > 0
                ? `In Stock (${
                    selectedVariant?.stock_quantity || product.stock_quantity
                  } available)`
                : "Out of Stock"
            }
          </span>
        </div>
        
        <div class="d-flex gap-3 mb-4">
          <button class="btn btn-primary btn-lg" id="add-to-cart-btn" 
                  ${
                    (hasVariants && !selectedVariant) ||
                    selectedVariant?.stock_quantity === 0 ||
                    (!hasVariants && product.stock_quantity === 0)
                      ? "disabled"
                      : ""
                  }>
            <i class="bi bi-cart-plus me-2"></i>Add to Cart
          </button>
          <button class="btn btn-outline-secondary btn-lg" onclick="addToWishlist(${
            product.id
          })">
            <i class="bi bi-heart me-2"></i>Wishlist
          </button>
        </div>
        
        <div class="border-top pt-3">
          <small class="text-muted">
            <strong>Category:</strong> ${product.catname || "N/A"}<br>
          </small>
        </div>
      </div>
    </div>
  `;

  
  container.dataset.hasVariants = hasVariants;

  
  setupVariantSelection(variants);

  
  setupAddToCartButton(userId);
}

function setupVariantSelection(variants) {
  
  document.querySelectorAll(".variant-thumbnail").forEach((thumbnail) => {
    thumbnail.addEventListener("click", function () {
      const variantId = this.dataset.variantId;
      const variantImage = this.dataset.variantImage;
      const variantColor = this.dataset.variantColor;
      const variantSize = this.dataset.variantSize;
      const variantPrice = this.dataset.variantPrice;
      const variantStock = parseInt(this.dataset.variantStock);

      
      selectedVariant = {
        id: variantId,
        image: variantImage,
        color: variantColor,
        size: variantSize,
        price: variantPrice,
        stock_quantity: variantStock,
      };

      
      updateVariantSelection(this, variantImage);
    });
  });

  
  if (variants && variants.length > 0 && !selectedVariant) {
    const firstVariant = document.querySelector(".variant-thumbnail");
    if (firstVariant) {
      firstVariant.click();
    }
  }
}

function updateVariantSelection(selectedThumbnail, variantImage) {
  
  document.querySelectorAll(".variant-thumbnail").forEach((thumb) => {
    thumb.classList.remove("active", "border-primary");
  });
  selectedThumbnail.classList.add("active", "border-primary");

  
  const mainImage = document.getElementById("main-product-image");
  if (mainImage && variantImage) {
    mainImage.src = variantImage;
  }
  const productPrice = document.getElementById("product-price");
  if (productPrice && selectedVariant) {
    productPrice.textContent = selectedVariant.price;
  }
  const stockStatus = document.getElementById("stock-status");
  if (stockStatus && selectedVariant) {
    stockStatus.textContent =
      selectedVariant.stock_quantity > 0
        ? `In Stock (${selectedVariant.stock_quantity} available)`
        : "Out of Stock";
  }
  
  const selectedVariantInfo = document.getElementById("selected-variant-info");
  if (selectedVariantInfo && selectedVariant) {
    selectedVariantInfo.style.display = "block";
    selectedVariantInfo.innerHTML = `
      <h6 class="mb-2">Selected Variant:</h6>
      <div class="d-flex align-items-center gap-3">
        <img src="${selectedVariant.image || "sample/placeholder-images.webp"}" 
             alt="${selectedVariant.color} - ${selectedVariant.size}"
             onerror="this.onerror=null; this.src='sample/placeholder-images.webp';"
             class="rounded" style="width: 60px; height: 60px; object-fit: cover;">
        <div>
          <strong>${selectedVariant.color} - ${selectedVariant.size}</strong>
          <div class="text-muted">${
            selectedVariant.stock_quantity
          } in stock</div>
        </div>
      </div>
    `;
  }

  
  const addToCartBtn = document.getElementById("add-to-cart-btn");
  if (addToCartBtn) {
    if (selectedVariant.stock_quantity === 0) {
      addToCartBtn.disabled = true;
      addToCartBtn.innerHTML = '<i class="bi bi-cart-x me-2"></i>Out of Stock';
    } else {
      addToCartBtn.disabled = false;
      addToCartBtn.innerHTML =
        '<i class="bi bi-cart-plus me-2"></i>Add to Cart';
    }
  }
}

function setupAddToCartButton(userId) {
  const addToCartBtn = document.getElementById("add-to-cart-btn");
  if (addToCartBtn) {
    addToCartBtn.addEventListener("click", async () => {
      await addToCartHandler(userId);
    });
  }
}

function renderReviews(reviews) {
  const container = document.getElementById("reviews-container");

  if (!container) return;
  console.log("Name",reviews)
  if (!reviews || reviews.length === 0) {
    container.innerHTML = `
      <div class="text-center py-4">
        <i class="bi bi-chat-square-text fs-1 text-muted"></i>
        <p class="text-muted mt-2">No reviews yet. Be the first to review this product!</p>
      </div>
    `;
    return;
  }

  container.innerHTML = reviews
    .map(
      (review) => `
    <div class="card review-card mb-3">
      <div class="card-body">
        <div class="d-flex justify-content-between align-items-start mb-2">
          <div>
            <h6 class="card-title mb-1">${review.username || "Anonymous"}</h6>
            <div class="rating-stars">
              ${generateStars(review.rating)}
            </div>
          </div>
          <small class="text-muted">${new Date(
            review.created_at
          ).toLocaleDateString()}</small>
        </div>
        <p class="card-text">${review.comment}</p>
      </div>
    </div>
  `
    )
    .join("");
}

function renderSimilarProducts(products) {
  const container = document.getElementById("similar-products");

  if (!container) return;

  if (!products || products.length === 0) {
    container.innerHTML = `
      <div class="col-12 text-center py-4">
        <i class="bi bi-box fs-1 text-muted"></i>
        <p class="text-muted mt-2">No similar products found</p>
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
          product.base_image_url ||
          product.variant_image_url ||
          "sample/placeholder-images.webp"
        }"onerror="this.onerror=null; this.src='sample/placeholder-images.webp';"class="card-img-top" alt="${
        product.name
      }" style="height: 200px; object-fit: cover;">
        <div class="card-body d-flex flex-column">
          <h6 class="card-title">${product.name}</h6>
          <div class="d-flex justify-content-between align-items-center mt-auto">
            <span class="fw-bold text-primary">$${product.price}</span>
            <button class="btn btn-outline-primary btn-sm" onclick="viewProduct(${
              product.product_id
            })">
              View
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
  const reviewForm = document.getElementById("review-form");
  if (reviewForm) {
    reviewForm.addEventListener("submit", handleReviewSubmit);
  }
}

async function handleReviewSubmit(event) {
  event.preventDefault();
  const userId = localStorage.getItem("userId");
  const userRole = localStorage.getItem("role");
  if (userRole === "admin") {
    showError("Admins cannot submit reviews.");
    console.log(userId,userRole)
    return;
  }
  if (!userId) {
    showError("Please log in to submit a review.");
    return;
  }
  
  const formData = new FormData(event.target);
  const review = {
    userId:userId,
    productId: currentProductId,
    rating: parseInt(formData.get("rating")),
    content: formData.get("content"),
  };

  showLoading();

  try {
    const result = await postReviewOfProduct(review);
    if (result.success) {
      showSuccess("Review submitted successfully!");
      event.target.reset();
      
      setTimeout(() => {
        initProductPage();
      }, 1000);
    } else {
      showError(result.error || "Failed to submit review");
    }
  } catch (error) {
    showError("An error occurred while submitting the review");
  }

  hideLoading();
}


window.viewProduct = function (productId) {
  window.location.href = `product.html?id=${productId}`;
};


window.addToCartHandler = async function (userId) {
  try {
    const userRole = localStorage.getItem("userRole");
    if (userRole === "admin") {
      showError("Admins cannot add items to cart. Please use a customer account.");
      return;
    }
    if (!userRole) {
      showError("Please log in to add items to cart");
      sessionStorage.setItem('redirectAfterLogin', window.location.href);
      setTimeout(() => {
        window.location.href = 'login.html';
      }, 1500);
      return;
    }
    
    
    if (!selectedVariant) {
      showError("Please select a variant");
      return;
    }

    
    if (selectedVariant.stock_quantity === 0) {
      showError("This variant is out of stock");
      return;
    }

    showLoading();
    

    const result = await addToCart(userId, 1, selectedVariant.id);

    if (result.success) {
      showSuccess("Product added to cart successfully!");
      
      updateCartCount();
    } else {
      showError(result.error || "Failed to add product to cart");
    }
  } catch (error) {
    console.error("Add to cart error:", error);
    showError("An error occurred while adding to cart");
  } finally {
    hideLoading();
  }
};

window.addToWishlist = function (productId) {
  showSuccess("Product added to wishlist! (Feature will be available soon)");
};

function updateCartCount() {
  
  const cartCountElements = document.querySelectorAll(".cart-count");
  cartCountElements.forEach((element) => {
    const currentCount = parseInt(element.textContent) || 0;
    element.textContent = currentCount + 1;
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

function showSuccess(message) {
  const successAlert = document.getElementById("success-alert");
  const successMessage = document.getElementById("success-message");

  if (successAlert && successMessage) {
    successMessage.textContent = message;
    successAlert.classList.remove("d-none");

    setTimeout(() => {
      successAlert.classList.add("d-none");
    }, 3000);
  }
}

function generateStars(rating) {
  const fullStars = Math.floor(rating);
  const hasHalfStar = rating % 1 !== 0;
  const emptyStars = 5 - Math.ceil(rating);

  let stars = "";

  for (let i = 0; i < fullStars; i++) {
    stars += '<i class="bi bi-star-fill"></i>';
  }

  if (hasHalfStar) {
    stars += '<i class="bi bi-star-half"></i>';
  }

  for (let i = 0; i < emptyStars; i++) {
    stars += '<i class="bi bi-star"></i>';
  }

  return stars;
}

