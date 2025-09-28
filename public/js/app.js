/**
 * app.js
 * Frontend JavaScript logic for handling user authentication (Login/Register)
 * and testing protected API routes using Vanilla JS.
 */

// --- 1. DOM Elements and Configuration ---
const API_BASE_URL = "/api"; // Assuming the frontend is served from the same host as the backend

const messageArea = document.getElementById("messageArea");
const loginForm = document.getElementById("loginForm");
const registerForm = document.getElementById("registerForm");
const testProtectedButton = document.getElementById("testProtected");
const profileResultPre = document.getElementById("profileResult");

// --- 2. Utility Functions ---

/**
 * Displays a message in the designated area.
 * @param {string} text - The message text.
 * @param {string} type - 'success' or 'error'.
 */
function displayMessage(text, type) {
  messageArea.textContent = text;
  messageArea.style.display = "block";
  messageArea.style.backgroundColor =
    type === "success" ? "#d4edda" : "#f8d7da";
  messageArea.style.color = type === "success" ? "#155724" : "#721c24";
  console.log(`[${type.toUpperCase()}] ${text}`);
}

/**
 * Checks for a stored token and updates the UI state (e.g., enables the protected button).
 */
function updateUiState() {
  const token = localStorage.getItem("userToken");
  if (token) {
    testProtectedButton.disabled = false;
    testProtectedButton.textContent = "Test Protected Route (Logged In)";
  } else {
    testProtectedButton.disabled = true;
    testProtectedButton.textContent = "Test Protected Route (Login First)";
    profileResultPre.textContent = "";
  }
}

// --- 3. Authentication Handlers ---

/**
 * Handles user login request.
 * @param {string} email - User's email.
 * @param {string} password - User's password.
 */
async function handleLogin(email, password) {
  try {
    const response = await fetch(`${API_BASE_URL}/auth/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password }),
    });

    const data = await response.json();

    if (response.ok) {
      // Success: Save token and user ID
      localStorage.setItem("userToken", data.token);
      localStorage.setItem("userId", data.userId);
      displayMessage("Login successful! Token saved.", "success");
      updateUiState();
    } else {
      // Failure: Display error message from backend (e.g., "Invalid credentials")
      displayMessage(data.error || "Login failed.", "error");
      localStorage.removeItem("userToken");
      localStorage.removeItem("userId");
      updateUiState();
    }
  } catch (error) {
    console.error("Network or unexpected error during login:", error);
    displayMessage("A network error occurred during login.", "error");
  }
}

/**
 * Handles user registration request.
 * @param {object} userData - User registration data (firstName, lastName, email, etc.).
 */
async function handleRegister(userData) {
  try {
    const response = await fetch(`${API_BASE_URL}/auth/register`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(userData),
    });

    const data = await response.json();

    if (response.ok) {
      // Success: Registration returns a token upon creation
      localStorage.setItem("userToken", data.token);
      localStorage.setItem("userId", data.userId);
      displayMessage(
        "Registration successful! Logged in automatically.",
        "success"
      );
      updateUiState();
      // Optionally clear the form
      registerForm.reset();
    } else {
      // Failure: Display error message (e.g., "Email already in use")
      displayMessage(data.error || "Registration failed.", "error");
    }
  } catch (error) {
    console.error("Network or unexpected error during registration:", error);
    displayMessage("A network error occurred during registration.", "error");
  }
}

/**
 * Handles the request to a protected endpoint using the saved JWT.
 */
async function testProtectedRoute() {
  profileResultPre.textContent = "Loading...";
  const token = localStorage.getItem("userToken");

  if (!token) {
    profileResultPre.textContent =
      "Error: No token found. Please log in first.";
    return;
  }

  try {
    const response = await fetch(`${API_BASE_URL}/users/profile`, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    const data = await response.json();

    if (response.ok) {
      displayMessage("Successfully fetched profile data!", "success");
      profileResultPre.textContent = JSON.stringify(data, null, 2);
    } else {
      displayMessage(
        `Protected route failed: ${data.error || response.statusText}`,
        "error"
      );
      profileResultPre.textContent = `Status: ${response.status}\nError: ${
        data.error || "Unauthorized"
      }`;
    }
  } catch (error) {
    console.error("Network error during protected test:", error);
    profileResultPre.textContent =
      "A network error occurred while testing the protected route.";
  }
}

// --- 4. Event Listeners ---

// Initialize the UI state on page load
window.onload = updateUiState;

// LOGIN Form Submission
loginForm.addEventListener("submit", (event) => {
  event.preventDefault();
  const email = document.getElementById("loginEmail").value;
  const password = document.getElementById("loginPassword").value;
  handleLogin(email, password);
});

// REGISTER Form Submission
registerForm.addEventListener("submit", (event) => {
  event.preventDefault();

  // Collect data from the form fields based on their IDs/names
  const fName = document.getElementById("fName").value;
  const lName = document.getElementById("lName").value;
  const phone = document.getElementById("phone").value;
  const email = document.getElementById("regEmail").value;
  const password = document.getElementById("passwordReg").value;

  const userData = {
    firstName: fName,
    lastName: lName,
    phoneNumber: phone || null,
    email: email,
    password: password,
  };

  handleRegister(userData);
});

// PROTECTED Route Button Click
testProtectedButton.addEventListener("click", testProtectedRoute);
