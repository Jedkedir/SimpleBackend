import { apiGet, apiPost, apiPostFormData } from "./BaseService.js";

/**
 * Create new product with variants
 */
export async function newProductPageData(productData) {
  try {
    console.log("Starting product creation with data:", productData);
    
    const { product, variants, images } = productData;
    
    // Upload product images first and get URLs
    let productImageUrl = '';
    if (images && images.length > 0 && images[0].size > 0) {
      console.log("Uploading product images...");
      const imageFormData = new FormData();
      imageFormData.append('images', images[0]);
      
      const uploadResult = await apiPostFormData("/upload/upload-multiple", imageFormData);
      console.log("Image upload result:", uploadResult);
      
      if (uploadResult.success && uploadResult.data.files.length > 0) {
        productImageUrl = uploadResult.data.files[0].url;
        console.log("Product image URL:", productImageUrl);
      }
    }

    // Create the product with image URL
    const productPayload = {
      ...product,
      image_url: productImageUrl
    };
    
    console.log("Creating product with payload:", productPayload);
    const addedProduct = await apiPost("/products", productPayload);
    console.log("Product created response:", addedProduct);
    
    const addedProductId = addedProduct.productId;
    if (!addedProductId) {
      throw new Error("No product ID returned from server");
    }

    console.log("Creating variants for product ID:", addedProductId);
    // Create variants
    for (const variant of variants) {
      console.log("Processing variant:", variant);
      let variantImageUrl = '';
      
      // Upload variant image if exists
      if (variant.images && variant.images.length > 0 && variant.images[0].size > 0) {
        console.log("Uploading variant image...");
        const variantFormData = new FormData();
        variantFormData.append('images', variant.images[0]);
        
        const variantUploadResult = await apiPostFormData("/upload/upload-multiple", variantFormData);
        console.log("Variant image upload result:", variantUploadResult);
        
        if (variantUploadResult.success && variantUploadResult.data.files.length > 0) {
          variantImageUrl = variantUploadResult.data.files[0].url;
          console.log("Variant image URL:", variantImageUrl);
        }
      }
      
      const variantPayload = {
        ...variant, 
        productId: addedProductId,
        image_url: variantImageUrl
      };
      
      console.log("Creating variant with payload:", variantPayload);
      const variantResult = await apiPost("/variants", variantPayload);
      console.log("Variant created response:", variantResult);
    }
        
    console.log("Product creation completed successfully");
    return {
      success: true,      
    };
  } catch (error) {
    console.error("Service: Failed to create product:", error);
    return {
      success: false,
      error: error.message || "Failed to create product",
    };
  }
}

/**
 * Search products and return results object
 */
export async function searchProducts(query) {
  try {
    if (!query || query.trim().length < 2) {
      return { success: true, data: [], query, count: 0 };
    }

    const products = await apiGet("/products/get-all");
    const allProducts = products.products || [];
    const searchTerm = query.toLowerCase().trim();

    const results = allProducts
      .filter(
        (product) =>
          product.name?.toLowerCase().includes(searchTerm) ||
          product.description?.toLowerCase().includes(searchTerm)
      )
      .slice(0, 5);

    return {
      success: true,
      data: results,
      query,
      count: results.length,
    };
  } catch (error) {
    console.error("Service: Search failed:", error);
    return {
      success: false,
      error: error.message,
      data: [],
      query,
      count: 0,
    };
  }
}

/**
 * Get product details for quick view
 */
export async function getProductDetails(productId) {
  try {
    const product = await apiGet(`/products/${productId}`);
    return {
      success: true,
      data: product,
    };
  } catch (error) {
    console.error("Service: Product details failed:", error);
    return {
      success: false,
      error: error.message,
      data: null,
    };
  }
}
