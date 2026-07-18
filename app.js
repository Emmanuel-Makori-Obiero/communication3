document.addEventListener("DOMContentLoaded", () => {
  const form = document.getElementById("registerForm");
  const submitBtn = document.getElementById("submitBtn");
  const formAlert = document.getElementById("formAlert");

  // Base API Endpoint configured from your project swagger documentation
  const API_URL = "https://charity-minds-backend.onrender.com";

  form.addEventListener("submit", async (e) => {
    e.preventDefault();

    // Reset validation errors and global notifications
    clearErrors();
    showAlert("", "hidden");

    // Capture input values from form fields
    const firstName = document.getElementById("firstName").value.trim();
    const lastName = document.getElementById("lastName").value.trim();
    const email = document.getElementById("email").value.trim();
    const gender = document.getElementById("gender").value;

    // Front-end validation flags
    let hasError = false;

    if (!firstName) {
      showInputError("firstNameError", "First name is required.");
      hasError = true;
    }
    if (!lastName) {
      showInputError("lastNameError", "Last name is required.");
      hasError = true;
    }
    if (!email || !validateEmail(email)) {
      showInputError("emailError", "Please enter a valid email address.");
      hasError = true;
    }
    if (!gender) {
      showInputError("genderError", "Please select your gender.");
      hasError = true;
    }

    // If validation fails, halt the pipeline here
    if (hasError) return;

    // Construct the exact schema needed to clear database validation rules
    const payload = {
      firstName: firstName,
      lastName: lastName,
      username: firstName.toLowerCase() + Math.floor(Math.random() * 100), // Auto-generates unique string tracker
      email: email,
      phone: "+123456789", // Fallback text value
      dob: "2000-01-01", // Fallback birthdate value
      gender: gender,
      createdAt: new Date().toISOString(), // Dynamic real-time timestamp layout string
    };

    try {
      // Put UI into loading state
      setLoading(true);

      // Execute live POST request to your backend users route
      const response = await fetch(`${API_URL}/api/v1/users`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        body: JSON.stringify(payload),
      });

      const data = await response.json().catch(() => ({}));

      if (response.ok) {
        showAlert(
          "Registration successful! Redirecting to dashboard...",
          "success",
        );
        form.reset();

        // INTERLINK: Move browser focus automatically to dashboard canvas
        setTimeout(() => {
          window.location.href = "dashboard.html";
        }, 1500);
      } else {
        // Read exact server validation rejection messaging
        const serverMessage =
          data.message || "Server structural validation failed.";
        showAlert(serverMessage, "error");
      }
    } catch (error) {
      console.error("Network Error:", error);
      showAlert(
        "Could not reach the database server. Check your connection.",
        "error",
      );
    } finally {
      // Restore UI state
      setLoading(false);
    }
  });

  // Email matching verification regex helper
  function validateEmail(email) {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  }

  // Toggle styling to display targeted inline error feedback
  function showInputError(elementId, message) {
    const target = document.getElementById(elementId);
    target.textContent = message;
    target.classList.remove("hidden");
  }

  // Toggle styling to wipe current active error elements
  function clearErrors() {
    ["firstNameError", "lastNameError", "emailError", "genderError"].forEach(
      (id) => {
        const el = document.getElementById(id);
        if (el) el.classList.add("hidden");
      },
    );
  }

  // Adjust system alerts above the form wrapper
  function showAlert(message, type) {
    formAlert.className =
      "mb-6 p-4 rounded-lg text-sm transition-all duration-200";
    if (type === "hidden") {
      formAlert.classList.add("hidden");
      return;
    }
    if (type === "success") {
      formAlert.classList.add(
        "bg-green-50",
        "text-green-800",
        "border",
        "border-green-200",
      );
    } else if (type === "error") {
      formAlert.classList.add(
        "bg-red-50",
        "text-red-800",
        "border",
        "border-red-200",
      );
    }
    formAlert.textContent = message;
  }

  // Manage submission loader button logic
  function setLoading(isLoading) {
    if (isLoading) {
      submitBtn.disabled = true;
      submitBtn.textContent = "Saving Profile...";
    } else {
      submitBtn.disabled = false;
      submitBtn.textContent = "Create Account";
    }
  }
});
