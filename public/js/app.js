/**
 * app.js
 * Main application entry point and router
 */

// Import all view modules
import { initLandingPage } from "./views/landingPageView.js";
import { initLoginOrRegisterPage } from "./views/loginOrRegisterPageView.js";
import { initProductPage } from "./views/productPageView.js";
import { initCartPage } from "./views/cartPageView.js";
import { initNewProductPage } from "./views/newProductPage.js";
import { initStockPage } from "./views/stockPageView.js";
import { initializeDashboard } from "./views/adminDashboardView.js";
import { initShopPage } from "./views/shopPageView.js";
import {initCheckoutPage} from "./views/checkoutPageView.js";
import { updateNavigation } from "./services/navigationService.js"; 

// Router function to initialize the correct page
function initializePage() {
  const path = window.location.pathname;
  const filename = path.split("/").pop() || "index.html";

  console.log("Initializing page:", filename);

  try {
    // Update navigation on every page load
    updateNavigation();

    switch (filename) {
      case "index.html":
      case "":
        initLandingPage();
        break;
      case "login.html":
      case "Signup.html":
        initLoginOrRegisterPage();
        break;
      case "product.html":
        initProductPage();
        break;
      case "cart.html":
        initCartPage();
        break;
      case "new-product.html":
        initNewProductPage();
        break;
      case "stock.html":
        initStockPage();
        break;
      case "dashboard.html":
        initializeDashboard();
        break;
      case "checkout.html":
        initCheckoutPage();
        break;     
      case "shop.html":
        initShopPage();
        break;
      default:
        console.log("No specific initialization for:", filename);
        // If no specific handler, try to initialize landing page as fallback
        if (document.getElementById("best-selling-products")) {
          initLandingPage();
        }
    }
  } catch (error) {
    console.error("Error initializing page:", error);
  }
}

// Initialize when DOM is loaded
document.addEventListener("DOMContentLoaded", initializePage);

// Handle browser back/forward buttons
window.addEventListener("popstate", initializePage);
