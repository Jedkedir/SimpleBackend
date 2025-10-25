/**
 * Navigation Service - Handles dynamic navigation updates based on user role
 */
export function updateNavigation() {

  const mainCollapse = document.getElementById("mainCollapse");
  const userRole = localStorage.getItem("userRole");
  const userToken = localStorage.getItem("userToken");

  // Update Dashboard link for admin - only if mainCollapse exists
  if (mainCollapse) {
    let dashboardItem = document.getElementById("dashboard-nav");

    if (userRole === "admin") {
      if (!dashboardItem) {
        dashboardItem = document.createElement("li");
        dashboardItem.className = "nav-item";
        dashboardItem.id = "dashboard-nav";
        dashboardItem.innerHTML = `<a class="nav-link" href="dashboard.html">Dashboard</a>`;

        if (mainCollapse.firstChild) {
          mainCollapse.insertBefore(dashboardItem, mainCollapse.children[2]);
        } else {
          mainCollapse.appendChild(dashboardItem);
        }
      }
    } else {
      if (dashboardItem) dashboardItem.remove();
    }
  }

  // Update Login/Logout button - only if loginBtn exists
  const loginBtn = document.getElementById("loginBtn");
  if (loginBtn) {
    if (userToken) {
      loginBtn.textContent = "Logout";
      loginBtn.href = "#";

      // Remove existing event listeners to prevent duplicates
      loginBtn.replaceWith(loginBtn.cloneNode(true));
      const newLoginBtn = document.getElementById("loginBtn");

      newLoginBtn.addEventListener("click", (e) => {
        e.preventDefault();
        localStorage.removeItem("userToken");
        localStorage.removeItem("userRole");
        localStorage.removeItem("userId");
        localStorage.removeItem("userData");
        window.location.href = "index.html";
      });
    } else {
      loginBtn.textContent = "Login";
      loginBtn.href = "login.html";
      // Remove any existing logout event listeners
      loginBtn.replaceWith(loginBtn.cloneNode(true));
    }
  }

  // Add cart access protection - only if cartId exists
  const cartLink = document.getElementById("cartId");
  if (cartLink) {
    // Remove existing event listeners
    cartLink.replaceWith(cartLink.cloneNode(true));
    const newCartLink = document.getElementById("cartId");

    newCartLink.addEventListener("click", (e) => {
      if (!userToken) {
        e.preventDefault();
        alert("Please login to access your cart.");
        window.location.href = "login.html";
      }
    });
  }

  console.log("✅ Navigation updated successfully");
}

// Export for use in other modules
export default { updateNavigation };
