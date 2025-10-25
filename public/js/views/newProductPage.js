import { newProductPageData } from "../services/NewProductPageService.js";

export async function initNewProductPage() {
  console.log("Initializing new product page...");
  setupEventListeners();
}

function setupEventListeners() {
  const productForm = document.getElementById("product-form");
  if (productForm) {
    productForm.addEventListener("submit", handleProductSubmit);
    console.log("Form event listener added");
  } else {
    console.error("Product form not found!");
  }

  const addVariantBtn = document.getElementById("add-variant");
  if (addVariantBtn) {
    addVariantBtn.addEventListener("click", addVariantField);
    console.log("Add variant button listener added");
  }

  // Initialize with one variant
  addVariantField();
}

async function handleProductSubmit(event) {
  event.preventDefault();
  console.log("Form submitted!");

  const formData = new FormData(event.target);

  // Validate required fields
  const name = formData.get("name");
  const description = formData.get("description");
  const price = formData.get("price");
  const category = formData.get("category");

  console.log("Form data:", { name, description, price, category });

  if (!name || !description || !price || !category) {
    showError("Please fill in all required fields");
    return;
  }

  const variants = getVariantsData();
  console.log("Variants data:", variants);

  if (variants.length === 0) {
    showError("Please add at least one product variant");
    return;
  }

  const productImages = formData.getAll("productImages");
  console.log("Product images:", productImages);

  const productData = {
    product: {
      name: name,
      description: description,
      basePrice: parseFloat(price),
      categoryName: category,
    },
    variants: variants,
    images: productImages,
  };

  console.log("Final product data to send:", productData);

  showLoading();

  try {
    console.log("Calling newProductPageData service...");
    const result = await newProductPageData(productData);
    console.log("Service result:", result);

    if (result.success) {
      showSuccess("Product created successfully!");
      event.target.reset();
      clearVariants();

      // Redirect to product or dashboard after success
      setTimeout(() => {
        window.location.href = "dashboard.html";
      }, 2000);
    } else {
      showError(result.error || "Failed to create product");
    }
  } catch (error) {
    console.error("Error in form submission:", error);
    showError("An error occurred while creating the product: " + error.message);
  }

  hideLoading();
}

function getVariantsData() {
  const variants = [];
  const variantElements = document.querySelectorAll(".variant-row");
  console.log("Found variant elements:", variantElements.length);

  variantElements.forEach((row, index) => {
    const colorInput = row.querySelector(".variant-color");
    const sizeInput = row.querySelector(".variant-size");
    const stockInput = row.querySelector(".variant-stock");
    const priceInput = row.querySelector(".variant-price-modifier");
    const imagesInput = row.querySelector(".variant-images");

    if (!colorInput || !sizeInput || !stockInput) {
      console.warn(`Variant ${index + 1} inputs not found`);
      return;
    }

    const color = colorInput.value.trim();
    const size = sizeInput.value.trim();
    const stock = parseInt(stockInput.value);
    const priceModifier = parseFloat(priceInput.value) || 0;
    const variantImages = imagesInput ? imagesInput.files : [];

    console.log(`Variant ${index + 1}:`, {
      color,
      size,
      stock,
      priceModifier,
      images: variantImages,
    });

    if (color && size && !isNaN(stock) && stock >= 0) {
      variants.push({
        color,
        size,
        stockQuantity: stock,
        priceModifier,
        images: variantImages,
      });
    } else {
      console.warn(`Variant ${index + 1} validation failed`);
    }
  });

  return variants;
}

function addVariantField() {
  const variantsContainer = document.getElementById("variants-container");

  if (!variantsContainer) {
    console.error("Variants container not found!");
    return;
  }

  const variantRow = document.createElement("div");
  variantRow.className = "variant-row card mb-3";
  variantRow.innerHTML = `
    <div class="card-body">
      <div class="row align-items-center">
        <div class="col-md-3">
          <label class="form-label">Color *</label>
          <input type="text" class="form-control variant-color" placeholder="e.g., Red, Blue" required>
        </div>
        <div class="col-md-2">
          <label class="form-label">Size *</label>
          <input type="text" class="form-control variant-size" placeholder="e.g., S, M, L" required>
        </div>
        <div class="col-md-2">
          <label class="form-label">Stock *</label>
          <input type="number" class="form-control variant-stock" placeholder="0" min="0" required>
        </div>
        <div class="col-md-3">
          <label class="form-label">Price Modifier ($)</label>
          <input type="number" class="form-control variant-price-modifier" placeholder="0.00" step="0.01" value="0">
        </div>
        <div class="col-md-2">
          <label class="form-label">&nbsp;</label>
          <button type="button" class="btn btn-outline-danger w-100 remove-variant">
            <i class="bi bi-trash"></i> Remove
          </button>
        </div>
      </div>
      <div class="row mt-2">
        <div class="col-12">
          <label class="form-label">Variant Images</label>
          <input type="file" class="form-control variant-images" multiple accept="image/*">
          <div class="form-text">Optional: Upload images specific to this variant</div>
        </div>
      </div>
    </div>
  `;

  variantsContainer.appendChild(variantRow);
  console.log("Variant field added");

  // Add remove event listener
  const removeBtn = variantRow.querySelector(".remove-variant");
  removeBtn.addEventListener("click", () => {
    const allVariants = document.querySelectorAll(".variant-row");
    if (allVariants.length > 1) {
      variantRow.remove();
      console.log("Variant removed");
    } else {
      showError("At least one variant is required");
    }
  });
}

function clearVariants() {
  const variantsContainer = document.getElementById("variants-container");
  if (variantsContainer) {
    variantsContainer.innerHTML = "";
    // Add one empty variant by default
    addVariantField();
  }
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
  console.log("Showing success:", message);
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
