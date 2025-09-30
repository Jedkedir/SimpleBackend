/**
 * Base Service - Pure function utilities for API communication
 * Handles all HTTP requests, authentication, and error handling
 */

/**
 * Generic request function
 * @param {string} endpoint - API endpoint
 * @param {Object} options - Fetch options
 * @returns {Promise} - Response data
 */
export async function baseRequest(endpoint, options = {}) {
  try {
    const url = `/api${endpoint}`;

    // Default headers
    const headers = {
      "Content-Type": "application/json",
      ...options.headers,
    };

    // Add authorization header if token exists
    const token = getAuthToken();
    if (token) {
      headers.Authorization = `Bearer ${token}`;
    }

    const config = {
      method: options.method || "GET",
      headers,
      ...options,
    };

    // Add body for non-GET requests
    if (config.body && typeof config.body === "object") {
      config.body = JSON.stringify(config.body);
    }

    console.log(
      `API Call: ${config.method} ${url}`,
      config.body ? { body: config.body } : ""
    );

    const response = await fetch(url, config);

    // Handle HTTP errors
    if (!response.ok) {
      const errorData = await parseErrorResponse(response);
      throw new Error(
        errorData.message || `HTTP error! status: ${response.status}`
      );
    }

    // Handle no-content responses
    if (response.status === 204) {
      return null;
    }

    // Parse successful response
    const data = await response.json();
    return data;
  } catch (error) {
    console.error("API Request failed:", {
      endpoint,
      error: error.message,
      timestamp: new Date().toISOString(),
    });

    // Re-throw with more context
    throw new Error(`API call failed: ${error.message}`);
  }
}

/**
 * Parse error response from server
 * @param {Response} response - Fetch response object
 * @returns {Promise<Object>} - Error data
 */
async function parseErrorResponse(response) {
  try {
    const contentType = response.headers.get("content-type");
    if (contentType && contentType.includes("application/json")) {
      return await response.json();
    } else {
      return { message: await response.text() };
    }
  } catch {
    return { message: `HTTP ${response.status}: ${response.statusText}` };
  }
}

/**
 * GET request
 * @param {string} endpoint - API endpoint
 * @returns {Promise} - Response data
 */
export async function apiGet(endpoint) {
  return baseRequest(endpoint, { method: "GET" });
}

/**
 * POST request
 * @param {string} endpoint - API endpoint
 * @param {Object} data - Request body
 * @returns {Promise} - Response data
 */
export async function apiPost(endpoint, data) {
  return baseRequest(endpoint, {
    method: "POST",
    body: data,
  });
}

/**
 * PUT request
 * @param {string} endpoint - API endpoint
 * @param {Object} data - Request body
 * @returns {Promise} - Response data
 */
export async function apiPut(endpoint, data) {
  return baseRequest(endpoint, {
    method: "PUT",
    body: data,
  });
}

/**
 * DELETE request
 * @param {string} endpoint - API endpoint
 * @returns {Promise} - Response data
 */
export async function apiDelete(endpoint) {
  return baseRequest(endpoint, { method: "DELETE" });
}

/**
 * Get authentication token from storage
 * @returns {string|null} - JWT token or null
 */
export function getAuthToken() {
  return localStorage.getItem("authToken");
}

/**
 * Set authentication token
 * @param {string} token - JWT token
 */
export function setAuthToken(token) {
  localStorage.setItem("authToken", token);
}

/**
 * Remove authentication token (logout)
 */
export function removeAuthToken() {
  localStorage.removeItem("authToken");
  localStorage.removeItem("userData");
}

/**
 * Check if user is authenticated
 * @returns {boolean} - Authentication status
 */
export function isAuthenticated() {
  return !!getAuthToken();
}

/**
 * Get current user data from storage
 * @returns {Object|null} - User data or null
 */
export function getCurrentUser() {
  try {
    const userData = localStorage.getItem("userData");
    return userData ? JSON.parse(userData) : null;
  } catch {
    return null;
  }
}

/**
 * Set current user data
 * @param {Object} userData - User data
 */
export function setCurrentUser(userData) {
  localStorage.setItem("userData", JSON.stringify(userData));
}
