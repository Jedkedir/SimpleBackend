import { loginUser, registerUser } from "../services/loginOrRegisterService.js";

/**
 * Login and Registration Page View
 * Handles UI interactions for authentication pages
 */
export function initLoginOrRegisterPage() {
  console.log("Initializing login/register page");

  // Check which page we're on and run appropriate code
  const loginForm = document.getElementById("loginForm");
  const registerForm = document.getElementById("registerForm");

  // LOGIN PAGE FUNCTIONALITY
  if (loginForm) {
    initLoginPage();
  }

  // SIGNUP PAGE FUNCTIONALITY
  if (registerForm) {
    initRegisterPage();
  }
}

/**
 * Initialize login page functionality
 */
function initLoginPage() {
  const loginForm = document.getElementById("loginForm");
  const signupBtn = document.getElementById("signupBtn");

  // Sign up button redirect (for login page)
  if (signupBtn) {
    signupBtn.addEventListener("click", function () {
      window.location.href = "Signup.html";
    });
  }

  // Login form submission
  loginForm.addEventListener("submit", async (event) => {
    event.preventDefault();

    const email = document.getElementById("loginEmail").value;
    const password = document.getElementById("loginPassword").value;

    await handleLogin(email, password);
  });
}

/**
 * Initialize registration page functionality
 */
function initRegisterPage() {
  const registerForm = document.getElementById("registerForm");

  // Add password toggle functionality
  const toggleButtons = document.querySelectorAll(".toggle-password");
  toggleButtons.forEach((button) => {
    button.addEventListener("click", function () {
      const input = this.parentElement.querySelector("input");
      const type = input.type === "password" ? "text" : "password";
      input.type = type;
      this.textContent = type === "password" ? "Show" : "Hide";
    });
  });

  // Register form submission
  registerForm.addEventListener("submit", async (event) => {
    event.preventDefault();

    // Validate passwords match
    const password = document.getElementById("passwordReg").value;
    const confirmPassword = document.getElementById("confirmPassword").value;

    if (password !== confirmPassword) {
      showMessage("registerMessage", "Passwords do not match!", "error");
      return;
    }

    const fName = document.getElementById("fName").value;
    const lName = document.getElementById("lName").value;
    const phone = document.getElementById("phone").value;
    const email = document.getElementById("regEmail").value;

    const userData = {
      firstName: fName,
      lastName: lName,
      phoneNumber: phone || null,
      email: email,
      password: password,
    };

    await handleRegister(userData);
  });
}

/**
 * Handle user login
 */
async function handleLogin(email, password) {
  try {
    showMessage("loginMessage", "Logging in...", "loading");

    const result = await loginUser({ email, password });

    if (result.success) {
      showMessage(
        "loginMessage",
        "Login successful! Redirecting...",
        "success"
      );

      // Redirect to dashboard or home page after successful login
      setTimeout(() => {
        window.location.href = "index.html";
      }, 1500);
    } else {
      showMessage("loginMessage", result.error || "Login failed!", "error");
    }
  } catch (error) {
    console.error("Network or unexpected error during login:", error);
    showMessage("loginMessage", "Network error. Please try again.", "error");
  }
}

/**
 * Handle user registration
 */
async function handleRegister(userData) {
  try {
    showMessage("registerMessage", "Creating account...", "loading");

    const result = await registerUser(userData);

    if (result.success) {
      showMessage(
        "registerMessage",
        "Account created successfully! Redirecting...",
        "success"
      );

      // Clear the form
      document.getElementById("registerForm").reset();

      // Redirect after successful registration
      setTimeout(() => {
        window.location.href = "index.html";
      }, 1500);
    } else {
      showMessage(
        "registerMessage",
        result.error || "Registration failed!",
        "error"
      );
    }
  } catch (error) {
    console.error("Network or unexpected error during registration:", error);
    showMessage("registerMessage", "Network error. Please try again.", "error");
  }
}

/**
 * Helper function to show messages
 */
function showMessage(elementId, message, type) {
  const element = document.getElementById(elementId);
  if (element) {
    element.textContent = message;
    element.style.display = "block";
    element.className = type + "-message";

    // Auto-hide success messages after 3 seconds
    if (type === "success") {
      setTimeout(() => {
        element.style.display = "none";
      }, 3000);
    }
  }
}
