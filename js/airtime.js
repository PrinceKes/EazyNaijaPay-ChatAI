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

// Function to update user balance
async function updateBalance(amount) {
    try {
        const response = await fetch(`${API_BASE_URL}/${userId}`, {
            method: "PATCH",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                Balance: -amount, // Deduct the amount
            }),
        });

        if (!response.ok) throw new Error("Failed to update balance.");

        const data = await response.json();
        if (!data.success) throw new Error("Balance update failed.");

        console.log("Balance updated successfully.");
    } catch (error) {
        console.error("Error updating balance:", error);
    }
}

// Function to save airtime transaction
async function saveAirtimeTransaction(networkId, amount, phone, transactionStatus) {
    try {
        const response = await fetch(`${API_BASE_URL}/${userId}/transactions`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                type: "airtime",
                network: networkMap[networkId],
                amount: amount,
                phone: phone,
                status: transactionStatus, // "success" or "failed"
                timestamp: new Date().toISOString(),
            }),
        });

        if (!response.ok) throw new Error("Failed to save transaction.");

        const data = await response.json();
        if (!data.success) throw new Error("Transaction saving failed.");

        console.log("Transaction saved successfully.");
    } catch (error) {
        console.error("Error saving transaction:", error);
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
            await saveAirtimeTransaction(networkId, amount, phone, "failed");
            throw new Error("Failed to process airtime purchase.");
        }

        const data = await response.json();
        console.log("Airtime Purchase Response:", data);
        alert("Airtime purchase successful!");

        // Save transaction and update balance
        await saveAirtimeTransaction(networkId, amount, phone, "success");
        await updateBalance(amount);
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









































// // Constants
// const API_BASE_URL = "https://eazynaijapay-server.onrender.com/Verified_Users";
// const AIRTIME_API_URL = "https://eazynaijapay-server.onrender.com/proxy/topup";
// const AUTH_TOKEN = "1b4b2afd4ef0f22d082ebaf6c327de30ea1b6bcf";

// // Mapping of numeric string network IDs to network names (for reference if needed)
// const networkMap = {
//     "1": "MTN",
//     "2": "GLO",
//     "3": "9MOBILE",
//     "4": "AIRTEL",
// };

// // Retrieve user_id from local storage
// const userId = localStorage.getItem("user_id") || localStorage.getItem("User_id");
// if (!userId) {
//     alert("User not authenticated. Please log in again.");
//     window.location.href = "/login.html"; // Redirect to login if no user_id
// }

// // Function to validate PIN
// async function validatePin(pin) {
//     try {
//         const response = await fetch(`${API_BASE_URL}/${userId}`);
//         if (!response.ok) throw new Error("Failed to validate PIN.");

//         const data = await response.json();
//         if (!data.success) throw new Error("Invalid user data.");

//         return data.user.User_pin === pin;
//     } catch (error) {
//         console.error("Error validating PIN:", error);
//         return false;
//     }
// }

// // Function to check balance
// async function checkBalance(amount) {
//     try {
//         const response = await fetch(`${API_BASE_URL}/${userId}`);
//         if (!response.ok) throw new Error("Failed to check balance.");

//         const data = await response.json();
//         if (!data.success) throw new Error("Invalid user data.");

//         return data.user.Balance >= amount;
//     } catch (error) {
//         console.error("Error checking balance:", error);
//         return false;
//     }
// }

// // Function to buy airtime
// async function buyAirtime(networkId, amount, phone) {
//     try {
//         console.log("Network ID:", networkId);
//         console.log("Phone Number:", phone);
//         console.log("Amount:", amount);

//         const response = await fetch(AIRTIME_API_URL, {
//             method: "POST",
//             headers: {
//                 "Content-Type": "application/json",
//                 "Authorization": `Token ${AUTH_TOKEN}`,
//             },
//             body: JSON.stringify({
//                 network: networkId,
//                 amount: amount,
//                 mobile_number: phone,
//                 Ported_number: true,
//                 airtime_type: "VTU",
//             }),
//         });

//         if (!response.ok) {
//             const errorText = await response.text();
//             console.error("Response Error Text:", errorText);
//             throw new Error("Failed to process airtime purchase.");
//         }

//         const data = await response.json();
//         console.log("Airtime Purchase Response:", data);
//         alert("Airtime purchase successful!");
//     } catch (error) {
//         console.error("Error processing airtime purchase:", error);
//         alert("Airtime purchase failed. Please try again.");
//     }
// }

// // Handle "Continue to Pay" button click
// document.getElementById("paynow").addEventListener("click", async () => {
//     const network = document.getElementById("network-dropdown").value; // Network ID from the dropdown
//     const phone = document.getElementById("phone-number").value.trim();
//     const amount = parseFloat(document.getElementById("amount").value);

//     console.log("Selected Network ID:", network);
//     console.log("Entered Phone Number:", phone);
//     console.log("Entered Amount:", amount);

//     // Gather PIN input
//     const pin = [
//         document.getElementById("pin1").value,
//         document.getElementById("pin2").value,
//         document.getElementById("pin3").value,
//         document.getElementById("pin4").value,
//     ].join("");

//     if (!network || !phone || isNaN(amount) || pin.length !== 4) {
//         alert("Please fill in all fields correctly.");
//         return;
//     }

//     // Validate PIN
//     const isPinValid = await validatePin(pin);
//     if (!isPinValid) {
//         alert("Invalid PIN. Please try again.");
//         return;
//     }

//     // Check balance
//     const hasSufficientBalance = await checkBalance(amount);
//     if (!hasSufficientBalance) {
//         alert("Insufficient balance.");
//         return;
//     }

//     // Process airtime purchase
//     await buyAirtime(network, amount, phone);
// });

// // Helper functions for UI interactions
// function setAmount(value) {
//     document.getElementById("amount").value = value.toFixed(2);
// }

// function moveToNext(current, next) {
//     if (current.value.length === 1) {
//         document.getElementById(next)?.focus();
//     }
// }
