// Define constants for the API endpoint and authorization token
const CRESTVTU_API_URL = "https://crestvtu.com/api/topup/";
const AUTHORIZATION_TOKEN = "7395a91d4c6693cacbb6631a6457fa2567bb4cf4";

document.querySelector("#paynow").addEventListener("click", async () => {
  try {
    const networkDropdown = document.getElementById("network-dropdown");
    const network = networkDropdown.value;
    const phone = document.getElementById("phone-number").value.trim();
    const amount = parseFloat(document.getElementById("amount").value);
    const pinInputs = document.querySelectorAll(".pin-input");
    const userPin = Array.from(pinInputs).map(input => input.value).join("");

    // Validate input fields
    if (!network || !phone || isNaN(amount) || userPin.length !== 4) {
      alert("Please fill all fields correctly.");
      return;
    }

    const userId = localStorage.getItem("user_id") || localStorage.getItem("User_id");
    if (!userId) {
      alert("User ID not found in local storage.");
      return;
    }

    // Fetch user details
    const userResponse = await fetch(`https://eazynaijapay-server.onrender.com/Verified_Users/${userId}`);
    const userData = await userResponse.json();

    if (!userData.success) {
      alert("Failed to fetch user details.");
      return;
    }

    const userBalance = userData.user.Balance;
    const storedPin = userData.user.User_pin;

    // Check user balance and PIN
    if (userBalance < amount) {
      alert("Insufficient balance. Please top up your wallet.");
      return;
    }

    if (userPin !== storedPin) {
      alert("Invalid PIN. Please try again.");
      return;
    }

    // Prepare the API payload
    const payload = {
      network: network,
      amount: amount,
      mobile_number: phone,
      Ported_number: true,
      airtime_type: "VTU"
    };

    // Make the POST request to the API
    const response = await fetch(CRESTVTU_API_URL, {
      method: "POST",
      headers: {
        "Authorization": `Token ${AUTHORIZATION_TOKEN}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify(payload)
    });

    const responseData = await response.json();

    // Handle API response
    if (responseData.code === "success") {
      alert(`Airtime purchase successful: ₦${amount} for ${phone}`);
    } else {
      alert(`Failed to process airtime: ${responseData.message || "Unknown error"}`);
    }
  } catch (error) {
    console.error("Error processing airtime purchase:", error);
    alert("An unexpected error occurred. Please try again later.");
  }
});

function setAmount(value) {
  const amountInput = document.getElementById("amount");
  amountInput.value = value.toFixed(2);
  enableInput(amountInput);
}

function enableInput(input) {
  input.readOnly = false;
}

function disableInput(input) {
  if (!input.value.trim()) {
    input.readOnly = true;
  }
}

function validateAmount(input) {
  const value = parseFloat(input.value);
  if (isNaN(value) || value < 0) {
    input.value = "0.00";
  } else {
    input.value = value.toFixed(2);
  }
}

function moveToNext(current, nextId) {
  if (current.value.length === 1) {
    document.getElementById(nextId).focus();
  }
}
