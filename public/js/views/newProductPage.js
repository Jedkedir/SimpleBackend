import { newProductPageData } from "../services/NewProductPageService.js";

export async function initNewProductPage() {
  setupEventListeners();
}

function setupEventListeners() {
  const productForm = document.getElementById("product-form");
  if (productForm) {
    productForm.addEventListener("submit", handleProductSubmit);
  }

  const addVariantBtn = document.getElementById("add-variant");
  if (addVariantBtn) {
    addVariantBtn.addEventListener("click", addVariantField);
  }
}

async function handleProductSubmit(event) {
  event.preventDefault();

  const formData = new FormData(event.target);
  const productData = {
    product: {
      name: formData.get("name"),
      description: formData.get("description"),
      basePrice: parseFloat(formData.get("price")),
      categoryName: formData.get("category"),
    },
    variants: getVariantsData(),
  };

  showLoading();
  const result = await newProductPageData(productData);

  if (result.success) {
    alert("Product created successfully!");
    event.target.reset();
    clearVariants();
  } else {
    showError(result.error);
  }

  hideLoading();
}

function getVariantsData() {
  const variants = [];
  const variantElements = document.querySelectorAll(".variant-row");

  variantElements.forEach((row) => {
    const color = row.querySelector(".variant-color").value;
    const size = row.querySelector(".variant-size").value;
    const stock = parseInt(row.querySelector(".variant-stock").value);
    const priceModifier =
      parseFloat(row.querySelector(".variant-price-modifier").value) || 0;

    if (color && size && !isNaN(stock)) {
      variants.push({
        color,
        size,
        stockQuantity: stock,
        priceModifier,
      });
    }
  });

  return variants;
}

function addVariantField() {
  const variantsContainer = document.getElementById("variants-container");
  const variantRow = document.createElement("div");
  variantRow.className = "variant-row";
  variantRow.innerHTML = `
    <input type="text" class="variant-color" placeholder="Color" required>
    <input type="text" class="variant-size" placeholder="Size" required>
    <input type="number" class="variant-stock" placeholder="Stock" required>
    <input type="number" class="variant-price-modifier" placeholder="Price Modifier" step="0.01">
    <button type="button" class="remove-variant">Remove</button>
  `;

  variantsContainer.appendChild(variantRow);

  variantRow.querySelector(".remove-variant").addEventListener("click", () => {
    variantRow.remove();
  });
}

function clearVariants() {
  const variantsContainer = document.getElementById("variants-container");
  variantsContainer.innerHTML = "";
  // Add one empty variant by default
  addVariantField();
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
