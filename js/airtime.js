// Constants
const API_BASE_URL = "https://eazynaijapay-server.onrender.com/Verified_Users";
const AIRTIME_API_URL = "https://eazynaijapay-server.onrender.com/proxy/topup";
const AUTH_TOKEN = "1b4b2afd4ef0f22d082ebaf6c327de30ea1b6bcf";

// Mapping of numeric string network IDs to network names (for reference if needed)
const networkMap = {
    "1": "MTN",
    "2": "GLO",
    "3": "9MOBILE",
    "4": "AIRTEL",
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

// Function to buy airtime
async function buyAirtime(networkId, amount, phone) {
    try {
        console.log("Network ID:", networkId);
        console.log("Phone Number:", phone);
        console.log("Amount:", amount);

        const response = await fetch(AIRTIME_API_URL, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Token ${AUTH_TOKEN}`,
            },
            body: JSON.stringify({
                network: networkId,
                amount: amount,
                mobile_number: phone,
                Ported_number: true,
                airtime_type: "VTU",
            }),
        });

        if (!response.ok) {
            const errorText = await response.text();
            console.error("Response Error Text:", errorText);
            throw new Error("Failed to process airtime purchase.");
        }

        const data = await response.json();
        console.log("Airtime Purchase Response:", data);
        alert("Airtime purchase successful!");
    } catch (error) {
        console.error("Error processing airtime purchase:", error);
        alert("Airtime purchase failed. Please try again.");
    }
}

// Handle "Continue to Pay" button click
document.getElementById("paynow").addEventListener("click", async () => {
    const network = document.getElementById("network-dropdown").value; // Network ID from the dropdown
    const phone = document.getElementById("phone-number").value.trim();
    const amount = parseFloat(document.getElementById("amount").value);

    console.log("Selected Network ID:", network);
    console.log("Entered Phone Number:", phone);
    console.log("Entered Amount:", amount);

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



// New updating
// Function to handle and save airtime transactions
async function handleAirtimeResponse(apiResponse) {
    const transactionData = {
        User_id: userId, // Retrieved from local storage
        Transaction_Type: "Airtime Top-Up",
        Amount: parseFloat(apiResponse.plan_amount), // Ensure it's a number
        mobile_number: apiResponse.mobile_number,
        Status: apiResponse.Status,
        Reference: apiResponse.customer_ref,
        CreatedAt: new Date(apiResponse.create_date),
    };

    try {
        const response = await fetch(`${API_BASE_URL}/${userId}/transactions`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Token ${AUTH_TOKEN}`,
            },
            body: JSON.stringify(transactionData),
        });

        if (!response.ok) throw new Error("Failed to save transaction to database.");
        console.log("Transaction saved successfully.");
    } catch (error) {
        console.error("Error saving transaction:", error);
    }
}

// Modify buyAirtime function to include transaction handling
async function buyAirtime(networkId, amount, phone) {
    try {
        const response = await fetch(AIRTIME_API_URL, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Token ${AUTH_TOKEN}`,
            },
            body: JSON.stringify({
                network: networkId,
                amount: amount,
                mobile_number: phone,
                Ported_number: true,
                airtime_type: "VTU",
            }),
        });

        if (!response.ok) throw new Error("Failed to process airtime purchase.");

        const apiResponse = await response.json();
        console.log("Airtime Purchase Response:", apiResponse);

        if (apiResponse.Status === "successful") {
            alert("Airtime purchase successful!");
            await handleAirtimeResponse(apiResponse); // Save transaction data
        } else {
            alert("Airtime purchase failed: " + apiResponse.Status);
        }
    } catch (error) {
        console.error("Error processing airtime purchase:", error);
        alert("Airtime purchase failed. Please try again.");
    }
}




// Function to update user balance
async function updateBalance(amount) {
    try {
        // Fetch current balance
        const response = await fetch(`${API_BASE_URL}/${userId}`);
        if (!response.ok) throw new Error("Failed to fetch user balance.");

        const data = await response.json();
        if (!data.success) throw new Error("Invalid user data.");

        const newBalance = data.user.Balance - amount;

        // Update balance on the server
        const updateResponse = await fetch(`${API_BASE_URL}/${userId}/Balance`, {
            method: "PUT",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Token ${AUTH_TOKEN}`,
            },
            body: JSON.stringify({ Balance: newBalance }),
        });

        if (!updateResponse.ok) throw new Error("Failed to update user balance.");

        console.log("Balance updated successfully. New Balance:", newBalance);
    } catch (error) {
        console.error("Error updating balance:", error);
    }
}




// function to validate Amount
function validateAmount(input) {
    const value = parseFloat(input.value.replace(/,/g, ''));
    if (isNaN(value) || value <= 0) {
        input.value = "0.00";
    } else {
        input.value = value.toFixed(2); // Format to 2 decimal places
    }
}


// Call updateBalance after a successful transaction
if (apiResponse.Status === "successful") {
    await updateBalance(parseFloat(apiResponse.plan_amount));
}
