const API_BASE_URL = "https://eazynaijapay-server.onrender.com/Verified_Users";
const AIRTIME_API_URL = "https://www.husmodata.com/api/topup/";
const AUTH_TOKEN = "bab528e3b6653c6eb7809b56f6c83bcaf25bb5ec";

// Mapping of network names to network IDs
const networkMap = {
    "mtn": 1,
    "glo": 2,
    "etisalat": 3,
    "airtel": 4
};

// Retrieve user_id from local storage
const userId = localStorage.getItem("user_id") || localStorage.getItem("User_id");
if (!userId) {
    alert("User not authenticated. Please log in again.");
    window.location.href = "/login.html"; // Redirect to login if no user_id
}

// Function to validate PIN
async function validatePin(pin) {
    try {
        const response = await fetch(`${API_BASE_URL}/${userId}`);
        if (!response.ok) throw new Error("Failed to validate PIN.");

        const data = await response.json();
        if (!data.success) throw new Error("Invalid user data.");

        return data.user.User_pin === pin;
    } catch (error) {
        console.error("Error validating PIN:", error);
        return false;
    }
}

// Function to check balance
async function checkBalance(amount) {
    try {
        const response = await fetch(`${API_BASE_URL}/${userId}`);
        if (!response.ok) throw new Error("Failed to check balance.");

        const data = await response.json();
        if (!data.success) throw new Error("Invalid user data.");

        return data.user.Balance >= amount;
    } catch (error) {
        console.error("Error checking balance:", error);
        return false;
    }
}

async function buyAirtime(network, amount, phone) {
    try {
        // Map network value to network ID
        const networkId = networkMap[network];
        if (!networkId) {
            alert("Invalid network selected.");
            return;
        }

        const response = await fetch("http://localhost:5000/proxy/topup", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Token ${AUTH_TOKEN}`
            },
            body: JSON.stringify({
                network: networkId,       // Use the mapped network ID
                amount: amount,
                mobile_number: phone,
                Ported_number: true,    // Matches API documentation
                airtime_type: "VTU",    // Matches API documentation
            }),
        });

        if (!response.ok) {
            const errorText = await response.text();
            console.error("Response Error Text:", errorText); // Log response error text
            throw new Error("Failed to process airtime purchase.");
        }

        const data = await response.json();
        console.log("Airtime Purchase Response:", data); // Log response from API
        alert("Airtime purchase successful!");
    } catch (error) {
        console.error("Error processing airtime purchase:", error);
        alert("Airtime purchase failed. Please try again.");
    }
}

// Handle "Continue to Pay" button click
document.getElementById("paynow").addEventListener("click", async () => {
    const network = document.getElementById("network-select").value; // Use correct dropdown ID
    const phone = document.getElementById("phone-number").value.trim();
    const amount = parseFloat(document.getElementById("amount").value);

    // Gather PIN input
    const pin = [
        document.getElementById("pin1").value,
        document.getElementById("pin2").value,
        document.getElementById("pin3").value,
        document.getElementById("pin4").value,
    ].join("");

    if (!network || !phone || isNaN(amount) || pin.length !== 4) {
        alert("Please fill in all fields correctly.");
        return;
    }

    // Validate PIN
    const isPinValid = await validatePin(pin);
    if (!isPinValid) {
        alert("Invalid PIN. Please try again.");
        return;
    }

    // Check balance
    const hasSufficientBalance = await checkBalance(amount);
    if (!hasSufficientBalance) {
        alert("Insufficient balance.");
        return;
    }

    // Process airtime purchase
    await buyAirtime(network, amount, phone);
});

// Helper functions for UI interactions
function setAmount(value) {
    document.getElementById("amount").value = value.toFixed(2);
}

function moveToNext(current, next) {
    if (current.value.length === 1) {
        document.getElementById(next)?.focus();
    }
}
