/**
 * Navigation Service - Handles dynamic navigation updates based on user role
 */
export function updateNavigation() {

  const mainCollapse = document.getElementById("mainCollapse");
  const userRole = localStorage.getItem("userRole");
  const userToken = localStorage.getItem("userToken");

  
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

  
  const loginBtn = document.getElementById("loginBtn");
  if (loginBtn) {
    if (userToken) {
      loginBtn.textContent = "Logout";
      loginBtn.href = "#";

      
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
      
      loginBtn.replaceWith(loginBtn.cloneNode(true));
    }
  }

  
  const cartLink = document.getElementById("cartId");
  if (cartLink) {
    
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


export default { updateNavigation };
