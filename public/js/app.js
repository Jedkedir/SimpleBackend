/**
 * app.js
 * Main application entry point and router
 */


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


/**
 * Initializes the page based on the current URL path.
 * Uses a switch statement to call the specific initialization function for each page.
 * If no specific initialization function is found, it will log a message and do nothing.
 * If an error occurs during initialization, it will log the error to the console.
 */

function initializePage() {
  const path = window.location.pathname;
  const filename = path.split("/").pop() || "index.html";

  console.log("Initializing page:", filename);

  try {
    
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
        
        if (document.getElementById("best-selling-products")) {
          initLandingPage();
        }
    }
  } catch (error) {
    console.error("Error initializing page:", error);
  }
}


document.addEventListener("DOMContentLoaded", initializePage);


window.addEventListener("popstate", initializePage);
