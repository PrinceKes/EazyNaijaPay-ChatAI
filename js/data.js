import dataPlans from "./plans.js"; // Import plans from the plans.js file

document.addEventListener("DOMContentLoaded", () => {
  const networkDropdown = document.getElementById("network-select");
  const planDropdown = document.getElementById("preferable-plan");
  const amountInput = document.getElementById("amount-to-pay");
  const payNowButton = document.getElementById("paynow");

  const username = "Strongnationdev";
  const password = "Adeboye200312";

  let selectedNetworkId = "";
  let selectedPlanAmount = 0;

  // Populate networks from plans.js
  const populateNetworks = () => {
    networkDropdown.innerHTML =
      '<option value="" disabled selected>Choose your network</option>';
    Object.keys(dataPlans).forEach((network) => {
      const option = document.createElement("option");
      option.value = network;
      option.textContent = network; // Network name from plans.js
      networkDropdown.appendChild(option);
    });
  };

  // Fetch and display plans for the selected network
  const displayPlans = (networkId) => {
    const plans = dataPlans[networkId]; // Get plans from plans.js
    if (!plans) {
      alert("No plans available for this network.");
      return;
    }

    // Clear existing options
    planDropdown.innerHTML =
      '<option value="" disabled selected>Choose your desired plan</option>';

    // Populate dropdown with fetched plans
    plans.forEach((plan) => {
      const option = document.createElement("option");
      option.value = plan.id;
      option.textContent = `${plan.name} - ₦${plan.amount}`;
      option.setAttribute("data-amount", plan.amount);
      planDropdown.appendChild(option);
    });
  };

  // Event listener for network selection
  networkDropdown.addEventListener("change", (event) => {
    selectedNetworkId = event.target.value;
    if (selectedNetworkId) {
      displayPlans(selectedNetworkId);
    }
  });

  // Event listener for plan selection
  planDropdown.addEventListener("change", (event) => {
    const selectedOption = event.target.options[event.target.selectedIndex];
    selectedPlanAmount = selectedOption.getAttribute("data-amount");
    amountInput.value = selectedPlanAmount; // Update the amount input field
  });

  // Handle payment logic
  payNowButton.addEventListener("click", async () => {
    const phoneInput = document.getElementById("phone-number").value;
    if (!selectedNetworkId || !selectedPlanAmount || !phoneInput) {
      alert("Please fill all fields before proceeding.");
      return;
    }

    const variationId = planDropdown.value;
    const url = `https://vtu.ng/wp-json/api/v1/data?username=${username}&password=${password}&phone=${phoneInput}&network_id=${selectedNetworkId}&variation_id=${variationId}`;
    try {
      const response = await fetch(url, { method: "GET" });
      const data = await response.json();
      if (data.code === "success") {
        alert(`Success: ${data.message}. Order ID: ${data.data.order_id}`);
      } else {
        alert(`Failed: ${data.message}`);
      }
    } catch (error) {
      console.error("Error during purchase:", error);
      alert("An error occurred while processing your request.");
    }
  });

  // Populate networks on page load
  populateNetworks();
});
















// document.addEventListener("DOMContentLoaded", () => {
//   const networkDropdown = document.getElementById("network-select"); // Network selection dropdown
//   const planDropdown = document.getElementById("preferable-plan"); // Plan selection dropdown
//   const amountInput = document.getElementById("amount-to-pay"); // Amount to display
//   const payNowButton = document.getElementById("paynow"); // Payment button

//   const username = "Strongnationdev";
//   const password = "Adeboye200312";

//   let selectedNetworkId = ""; // To store the selected network ID
//   let selectedPlanAmount = 0; // To store the selected plan amount

//   // Function to fetch available data plans for a network
//   const fetchDataPlans = async (networkId) => {
//     const url = `https://vtu.ng/wp-json/api/v1/data?username=${username}&password=${password}&network_id=${networkId}`;
//     try {
//       const response = await fetch(url);
//       const data = await response.json();
//       if (data.code === "success") {
//         // Clear existing options
//         planDropdown.innerHTML = '<option value="" disabled selected>Choose your desired plan</option>';
//         // Populate dropdown with fetched plans
//         data.data.forEach((plan) => {
//           const option = document.createElement("option");
//           option.value = plan.variation_id;
//           option.textContent = `${plan.data_plan} - ₦${plan.amount}`;
//           option.setAttribute("data-amount", plan.amount);
//           planDropdown.appendChild(option);
//         });
//       } else {
//         alert("Failed to fetch data plans. Please try again.");
//       }
//     } catch (error) {
//       console.error("Error fetching data plans:", error);
//       alert("An error occurred while fetching data plans.");
//     }
//   };

//   // Event listener for network selection
//   networkDropdown.addEventListener("change", (event) => {
//     selectedNetworkId = event.target.value; // Store the selected network ID
//     if (selectedNetworkId) {
//       fetchDataPlans(selectedNetworkId); // Fetch plans for the selected network
//     }
//   });

//   // Event listener for plan selection
//   planDropdown.addEventListener("change", (event) => {
//     const selectedOption = event.target.options[event.target.selectedIndex];
//     selectedPlanAmount = selectedOption.getAttribute("data-amount"); // Get plan amount
//     amountInput.value = selectedPlanAmount; // Update the amount input field
//   });

//   // Event listener for payment button
//   payNowButton.addEventListener("click", async () => {
//     const phoneInput = document.getElementById("phone-number").value; // Phone number input
//     if (!selectedNetworkId || !selectedPlanAmount || !phoneInput) {
//       alert("Please fill all fields before proceeding.");
//       return;
//     }

//     const variationId = planDropdown.value; // Selected plan variation ID
//     const url = `https://vtu.ng/wp-json/api/v1/data?username=${username}&password=${password}&phone=${phoneInput}&network_id=${selectedNetworkId}&variation_id=${variationId}`;
    
//     try {
//       const response = await fetch(url, { method: "GET" });
//       const data = await response.json();
//       if (data.code === "success") {
//         alert(`Success: ${data.message}. Order ID: ${data.data.order_id}`);
//       } else {
//         alert(`Failed: ${data.message}`);
//       }
//     } catch (error) {
//       console.error("Error during purchase:", error);
//       alert("An error occurred while processing your request.");
//     }
//   });

//   // Fetch user balance and details from your server
//   const userId = localStorage.getItem("telegram_user_id");
//   if (userId) {
//     const balanceUrl = `https://eazynaijapay-server.onrender.com/Verified_Users/${userId}/Balance`;
//     const userDetailsUrl = `https://eazynaijapay-server.onrender.com/Verified_Users/${userId}`;
    
//     // Fetch and display user balance
//     fetch(balanceUrl)
//       .then((res) => res.json())
//       .then((data) => {
//         if (data.success) {
//           document.getElementById("user-balance").textContent = `₦${data.balance}`;
//         }
//       })
//       .catch((error) => console.error("Error fetching balance:", error));

//     // Fetch and display user details
//     fetch(userDetailsUrl)
//       .then((res) => res.json())
//       .then((data) => {
//         if (data.success) {
//           document.getElementById("user-details").textContent = `User: ${data.user.Username} - Phone: ${data.user.Phone}`;
//         }
//       })
//       .catch((error) => console.error("Error fetching user details:", error));
//   } else {
//     alert("User ID not found in local storage.");
//   }
// });
