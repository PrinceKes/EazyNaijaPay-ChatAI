// Define constants for admin credentials and eBills API endpoint
const ADMIN_USERNAME = "Enoch";
const ADMIN_PASSWORD = "Adeboye@02";
const EBILLS_BASE_URL = "https://ebills.africa/wp-json/api/v1"; // Confirm this base URL

// Function to handle "Continue to Pay" button click
document.querySelector("#paynow").addEventListener("click", async () => {
  try {
    // Get user inputs
    const networkDropdown = document.getElementById("network-dropdown");
    const network = networkDropdown.value; // Get selected network_id
    const phone = document.getElementById("phone-number").value.trim();
    const amount = parseFloat(document.getElementById("amount").value);
    const pinInputs = document.querySelectorAll(".pin-input");
    const userPin = Array.from(pinInputs).map(input => input.value).join("");

    // Validate inputs
    if (!network || !phone || isNaN(amount) || userPin.length !== 4) {
      alert("Please fill all fields correctly.");
      return;
    }

    // Fetch user details from your server
    const userId = localStorage.getItem("user_id") || localStorage.getItem("User_id");
    if (!userId) {
      alert("User ID not found in local storage.");
      return;
    }

    const userResponse = await fetch(`https://eazynaijapay-server.onrender.com/Verified_Users/${userId}`);
    const userData = await userResponse.json();

    if (!userData.success) {
      alert("Failed to fetch user details.");
      return;
    }

    const userBalance = userData.user.Balance;
    const storedPin = userData.user.User_pin;

    // Check user balance
    if (userBalance < amount) {
      alert("Insufficient balance. Please top up your wallet.");
      return;
    }

    // Validate user PIN
    if (userPin !== storedPin) {
      alert("Invalid PIN. Please try again.");
      return;
    }

    // Process airtime purchase
    const apiUrl = `${EBILLS_BASE_URL}/airtime?username=${ADMIN_USERNAME}&password=${ADMIN_PASSWORD}&phone=${phone}&network_id=${network}&amount=${amount}`;

    const airtimeResponse = await fetch(apiUrl, { method: "GET" });
    const airtimeData = await airtimeResponse.json();

    // Handle API response
    if (airtimeData.code === "success") {
      alert(`Airtime purchase successful: ₦${amount} for ${phone}`);
    } else {
      alert(`Failed to process airtime: ${airtimeData.message}`);
    }
  } catch (error) {
    console.error("Error processing airtime purchase:", error);
    alert("An unexpected error occurred. Please try again later.");
  }
});

// Function to handle amount button clicks
function setAmount(value) {
  const amountInput = document.getElementById("amount");
  amountInput.value = value.toFixed(2);
  enableInput(amountInput);
}

// Enable input field on focus
function enableInput(input) {
  input.readOnly = false;
}

// Disable input field on blur
function disableInput(input) {
  if (!input.value.trim()) {
    input.readOnly = true;
  }
}

// Validate and format amount
function validateAmount(input) {
  const value = parseFloat(input.value);
  if (isNaN(value) || value < 0) {
    input.value = "0.00";
  } else {
    input.value = value.toFixed(2);
  }
}

// Automatically move to the next PIN input
function moveToNext(current, nextId) {
  if (current.value.length === 1) {
    document.getElementById(nextId).focus();
  }
}
