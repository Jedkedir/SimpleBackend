import {
  getShopPageData,
  searchProducts,
  addToCart,
} from "../services/shopPageService.js";

let currentFilters = {
  categories: [],
  priceMin: null,
  priceMax: null,
  colors: [],
  sizes: [],
  search: "",
  sort: "",
};

let currentPage = 1;
const itemsPerPage = 12;

export async function initShopPage() {
  
  setupEventListeners();
  await loadProducts();
}

async function loadProducts() {
  showLoading();

  try {
    const shopData = await getShopPageData(currentPage, itemsPerPage);
   
    if (shopData.success) {
      renderProducts(shopData.data.products || []);
      setupPagination(shopData.data.totalCount || 0);
    } else {
      showError(shopData.error || "Failed to load shop data");
    }
  } catch (error) {
    console.error("Error loading shop:", error);
    showError("An error occurred while loading shop");
  }

  hideLoading();
}

function renderProducts(products) {
   console.log("Products", products);
  const container = document.getElementById("products-container");
  if (!container) {
    console.error("Products container not found!");
    return;
  }

  if (!products || products.length === 0) {
    container.innerHTML = `
      <div class="col-12 text-center py-5">
        <i class="bi bi-search fs-1 text-muted"></i>
        <h5 class="text-muted mt-3">No products found</h5>
        <p class="text-muted">Try adjusting your search or filters</p>
        <button class="btn btn-primary" onclick="clearAllFilters()">Clear Filters</button>
      </div>
    `;
    return;
  }

  container.innerHTML = products
    .map(
      (product) => `
    <div class="col-md-6 col-lg-4 col-xl-3 mb-4">
      <div class="card product-card h-100">
        <div class="position-relative">
          <img src="${
            product.image || "sample/placeholder-images.webp"
          }" class="card-img-top" alt="${
        product.name
      }" onerror="this.onerror=null; this.src='sample/placeholder-images.webp';"style="height: 250px; object-fit: cover;" onerror="this.src='sample/placeholder-images.webp'">
          ${
            product.isNew
              ? '<span class="badge bg-success position-absolute top-0 start-0 m-2">New</span>'
              : ""
          }
          ${
            product.discount
              ? `<span class="badge bg-danger position-absolute top-0 end-0 m-2">-${product.discount}%</span>`
              : ""
          }
        </div>
        <div class="card-body d-flex flex-column">
          <h6 class="card-title">${product.name}</h6>
          <p class="card-text text-muted small flex-grow-1">${(
            product.description || ""
          ).substring(0, 100)}${
        product.description && product.description.length > 100 ? "..." : ""
      }</p>
      <p class="card-text text-muted small flex-grow-1">${
        "Size: " + product.size || "Not Available"
      }</p>
          <div class="mb-2">
            ${
              product.rating
                ? `
              <div class="rating-stars text-warning">
                ${generateStars(product.rating)}
                <small class="text-muted ms-1">(${
                  product.reviewCount || 0
                })</small>
              </div>
            `
                : ""
            }
          </div>
          <div class="d-flex justify-content-between align-items-center mt-auto">
            <div>
              <span class="fw-bold text-primary">$${product.price}</span>
              ${
                product.originalPrice
                  ? `<small class="text-muted text-decoration-line-through ms-1">$${product.originalPrice}</small>`
                  : ""
              }
            </div>
            <div class="btn-group" role="group">
              <button class="btn btn-outline-primary btn-sm" onclick="viewProduct(${
                product.id
              },${product.variantId})" title="View Details">
                <i class="bi bi-eye"></i>
              </button>
              
            </div>
          </div>
        </div>
      </div>
    </div>
  `
    )
    .join("");
}

function setupPagination(totalCount) {
  const totalPages = Math.ceil(totalCount / itemsPerPage);
  const paginationContainer = document.getElementById("pagination");

  if (!paginationContainer || totalPages <= 1) {
    if (paginationContainer) paginationContainer.innerHTML = "";
    return;
  }

  let paginationHTML = "";

  // Previous button
  paginationHTML += `
    <li class="page-item ${currentPage === 1 ? "disabled" : ""}">
      <a class="page-link" href="#" onclick="changePage(${
        currentPage - 1
      })">Previous</a>
    </li>
  `;

  // Page numbers
  for (let i = 1; i <= totalPages; i++) {
    if (
      i === 1 ||
      i === totalPages ||
      (i >= currentPage - 2 && i <= currentPage + 2)
    ) {
      paginationHTML += `
        <li class="page-item ${i === currentPage ? "active" : ""}">
          <a class="page-link" href="#" onclick="changePage(${i})">${i}</a>
        </li>
      `;
    } else if (i === currentPage - 3 || i === currentPage + 3) {
      paginationHTML += `<li class="page-item disabled"><span class="page-link">...</span></li>`;
    }
  }

  // Next button
  paginationHTML += `
    <li class="page-item ${currentPage === totalPages ? "disabled" : ""}">
      <a class="page-link" href="#" onclick="changePage(${
        currentPage + 1
      })">Next</a>
    </li>
  `;

  paginationContainer.innerHTML = paginationHTML;
}

function setupEventListeners() {
 

  // Search functionality
  const searchInput = document.getElementById("search-input");
  const searchBtn = document.getElementById("search-btn");

  if (searchInput && searchBtn) {
    searchBtn.addEventListener("click", handleSearch);
    searchInput.addEventListener("keypress", (e) => {
      if (e.key === "Enter") {
        handleSearch();
      }
    });
  }

  // Sort functionality
  const sortSelect = document.getElementById("sort-select");
  if (sortSelect) {
    sortSelect.addEventListener("change", handleSort);
  }

  // Filter functionality
  const applyFiltersBtn = document.getElementById("apply-filters");
  const clearFiltersBtn = document.getElementById("clear-filters");

  if (applyFiltersBtn) {
    applyFiltersBtn.addEventListener("click", applyFilters);
  }

  if (clearFiltersBtn) {
    clearFiltersBtn.addEventListener("click", clearAllFilters);
  }

  // Color and size filter buttons
  document.querySelectorAll(".color-filter").forEach((btn) => {
    btn.addEventListener("click", function () {
      this.classList.toggle("btn-primary");
      this.classList.toggle("btn-outline-secondary");
    });
  });

  document.querySelectorAll(".size-filter").forEach((btn) => {
    btn.addEventListener("click", function () {
      this.classList.toggle("btn-primary");
      this.classList.toggle("btn-outline-secondary");
    });
  });
}

async function handleSearch() {
  const searchInput = document.getElementById("search-input");
  if (!searchInput) return;

  currentFilters.search = searchInput.value.trim();
  currentPage = 1;

  await performSearch();
}

async function handleSort() {
  const sortSelect = document.getElementById("sort-select");
  if (!sortSelect) return;

  currentFilters.sort = sortSelect.value;
  currentPage = 1;

  await performSearch();
}

async function applyFilters() {
  

  // Collect category filters
  currentFilters.categories = [];
  document
    .querySelectorAll('input[type="checkbox"]:checked')
    .forEach((checkbox) => {
      if (checkbox.id.startsWith("cat-")) {
        currentFilters.categories.push(checkbox.value);
      }
    });

  // Collect price filters
  const priceMin = document.getElementById("price-min");
  const priceMax = document.getElementById("price-max");

  currentFilters.priceMin = priceMin
    ? parseFloat(priceMin.value) || null
    : null;
  currentFilters.priceMax = priceMax
    ? parseFloat(priceMax.value) || null
    : null;

  // Collect color filters
  currentFilters.colors = [];
  document.querySelectorAll(".color-filter.btn-primary").forEach((btn) => {
    currentFilters.colors.push(btn.dataset.color);
  });

  // Collect size filters
  currentFilters.sizes = [];
  document.querySelectorAll(".size-filter.btn-primary").forEach((btn) => {
    currentFilters.sizes.push(btn.dataset.size);
  });

  currentPage = 1;

  // Close offcanvas
  const offcanvas = bootstrap.Offcanvas.getInstance(
    document.getElementById("filterOffcanvas")
  );
  if (offcanvas) offcanvas.hide();

  await performSearch();
}

async function performSearch() {
  showLoading();

  try {
    const searchData = {
      ...currentFilters,
      page: currentPage,
      limit: itemsPerPage,
    };

    
    const result = await searchProducts(searchData);

    if (result.success) {
      renderProducts(result.data.products || []);
      setupPagination(result.data.totalCount || 0);
    } else {
      showError(result.error || "Search failed");
    }
  } catch (error) {
    console.error("Search error:", error);
    showError("An error occurred during search");
  }

  hideLoading();
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
  console.error("Showing error:", message);
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

// Global functions
window.viewProduct = function (productId,variantId) {
  window.location.href = `product.html?id=${productId}&variantId=${variantId}`;
};

window.addToCartHandlerFromShop = async function (productId) {
  showLoading();
  try {
    const result = await addToCart(productId);
    if (result.success) {
      showSuccess(result.message || "Product added to cart successfully!");
    } else {
      showError(result.error || "Failed to add product to cart");
    }
  } catch (error) {
    console.error("Add to cart error:", error);
    showError("Error adding product to cart. Please try again.");
  }
  hideLoading();
};

window.changePage = function (page) {
  if (page < 1) return;
  currentPage = page;
  performSearch();
};

window.clearAllFilters = function () {
  

  // Reset filters
  currentFilters = {
    categories: [],
    priceMin: null,
    priceMax: null,
    colors: [],
    sizes: [],
    search: "",
    sort: "",
  };

  // Reset UI
  document
    .querySelectorAll('input[type="checkbox"]')
    .forEach((cb) => (cb.checked = false));
  document.querySelectorAll(".color-filter, .size-filter").forEach((btn) => {
    btn.classList.remove("btn-primary");
    btn.classList.add("btn-outline-secondary");
  });

  const priceMin = document.getElementById("price-min");
  const priceMax = document.getElementById("price-max");
  const searchInput = document.getElementById("search-input");
  const sortSelect = document.getElementById("sort-select");

  if (priceMin) priceMin.value = "";
  if (priceMax) priceMax.value = "";
  if (searchInput) searchInput.value = "";
  if (sortSelect) sortSelect.value = "";

  currentPage = 1;
  loadProducts();
};

