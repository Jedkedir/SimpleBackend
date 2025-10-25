import {
  apiPost,
  apiGet,
  setAuthToken,
  setCurrentUser,
  removeAuthToken,
} from "./BaseService.js";

/**
 * Authentication Service - Handles login and registration
 */
class LoginOrRegisterService {
  constructor() {
    
  }

  async loginUser(loginData) {
    try {
      console.log("Attempting login with:", { email: loginData.email });
      const response = await apiPost("/auth/login", loginData);
      console.log("Login API response:", response.token);

      if (response.token) {
        console.log("Login successful, token received");

        
        setAuthToken(response.token);

        
        const userData = {
          userId: response.userId,
          email: response.email || loginData.email,
          firstName: response.firstName || loginData.email.split("@")[0],
          lastName: response.lastName || "",
          role: response.role || "user",
          token:response.token||"",
        };

        
        setCurrentUser(userData);

        console.log("Final user data:", userData);
        return { success: true, data: response, user: userData };
      } else {
        console.log("Login failed - no token in response");
        return {
          success: false,
          error: response.message || response.error || "Login failed",
        };
      }
    } catch (error) {
      console.error("Login error:", error);
      return {
        success: false,
        error: error.message || "Login failed - server error",
      };
    }
  }

  async registerUser(registerData) {
    try {
      console.log("Attempting registration with:", {
        email: registerData.email,
        firstName: registerData.firstName,
        lastName: registerData.lastName,
      });

      
      const registrationPayload = {
        firstName: registerData.firstName,
        lastName: registerData.lastName,
        email: registerData.email,
        password: registerData.password,
        phoneNumber: registerData.phoneNumber || null,

      };

      const response = await apiPost("/auth/register", registrationPayload);
      console.log("Registration API response:", response);

      if (response.token) {
        console.log("Registration successful, token received");

        
        const userData = {
          userId: response.userId,
          email: response.email || registerData.email,
          firstName: registerData.firstName,
          lastName: registerData.lastName,
          phoneNumber: registerData.phoneNumber,
          role: response.role || "user",
          token:response.token||"",
        };

        console.log("User data after registration:", userData);

        
        setAuthToken(response.token);
        setCurrentUser(userData);

        return { success: true, data: response, user: userData };
      } else {
        console.log("Registration failed - no token in response");
        return {
          success: false,
          error: response.message || response.error || "Registration failed",
        };
      }
    } catch (error) {
      console.error("Registration error:", error);

      
      if (
        error.message.includes("unique constraint") ||
        error.message.includes("already registered")
      ) {
        return { success: false, error: "Email already registered" };
      }

      if (error.message.includes("400")) {
        return { success: false, error: "Invalid registration data" };
      }

      return {
        success: false,
        error: error.message || "Registration failed. Please try again.",
      };
    }
  }

  logoutUser() {
    removeAuthToken();
    return { success: true };
  }

  isAuthenticated() {
    return !!localStorage.getItem("userToken");
  }

  getCurrentUser() {
    try {
      const userToken = localStorage.getItem("userToken");
      const userId = localStorage.getItem("userId");
      const userRole = localStorage.getItem("userRole");
      return userId ? JSON.parse(userId) : null;
    } catch {
      return null;
    }
  }
}


const loginOrRegisterService = new LoginOrRegisterService();


export const loginUser = (loginData) =>
  loginOrRegisterService.loginUser(loginData);
export const registerUser = (registerData) =>
  loginOrRegisterService.registerUser(registerData);
export const logoutUser = () => loginOrRegisterService.logoutUser();
export const isAuthenticated = () => loginOrRegisterService.isAuthenticated();
export const getCurrentUser = () => loginOrRegisterService.getCurrentUser();
