const API_BASE_URL = "/api";

const loginForm = document.getElementById("loginForm");
const registerForm = document.getElementById("registerForm");

async function handleLogin(email, password) {
  try {
    const response = await fetch(`${API_BASE_URL}/auth/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password }),
    });

    const data = await response.json();

    if (response.ok) {
      localStorage.setItem("userToken", data.token);
      localStorage.setItem("userId", data.userId);
      // Save token and user ID
    } else {
      // Failure: Display error message from backend (e.g., "Invalid credentials")
      localStorage.removeItem("userToken");
      localStorage.removeItem("userId");
    }
  } catch (error) {
    console.error("Network or unexpected error during login:", error);
  }
}

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

      //  clear the form
    } else {
      // Failure: Display error message (e.g., "Email already in use")
    }
  } catch (error) {
    console.error("Network or unexpected error during registration:", error);
  }
}

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
