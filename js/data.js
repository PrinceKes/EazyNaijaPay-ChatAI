import dataPlans from "./plans.js"; // Import plans from the plans.js file

document.addEventListener("DOMContentLoaded", () => {
  const networkDropdown = document.getElementById("network-select");
  const planDropdown = document.getElementById("preferable-plan");
  const amountInput = document.getElementById("amount-to-pay");
  const payNowButton = document.getElementById("paynow");

  const username = "Strongnationdev";
  const password = "Adeboye200312";

  let selectedNetworkId = "";
  let selectedPlanPrice = 0;

  // Populate networks from plans.js
  const populateNetworks = () => {
    networkDropdown.innerHTML =
      '<option value="" disabled selected>Choose your network</option>';
    Object.keys(dataPlans).forEach((network) => {
      const option = document.createElement("option");
      option.value = network;
      option.textContent = network;
      networkDropdown.appendChild(option);
    });
  };

  // Fetch and display plans for the selected network
  const displayPlans = (networkId) => {
    const plans = dataPlans[networkId];
    if (!plans) {
      alert("No plans available for this network.");
      return;
    }

    planDropdown.innerHTML =
      '<option value="" disabled selected>Choose your desired plan</option>';

    // Populate dropdown with fetched plans
    plans.forEach((plan) => {
      const option = document.createElement("option");
      option.value = plan.id;
      option.textContent = `${plan.name} - ₦${plan.price}`;
      option.setAttribute("data-price", plan.price);
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
    selectedPlanPrice = selectedOption.getAttribute("data-price");
    amountInput.value = selectedPlanPrice;
  });

  payNowButton.addEventListener("click", async () => {
    const phoneInput = document.getElementById("phone-number").value;
    if (!selectedNetworkId || !selectedPlanPrice || !phoneInput) {
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

  populateNetworks();
});







// import dataPlans from "./plans.js"; // Import plans from the plans.js file

// document.addEventListener("DOMContentLoaded", () => {
//   const networkDropdown = document.getElementById("network-select");
//   const planDropdown = document.getElementById("preferable-plan");
//   const amountInput = document.getElementById("amount-to-pay");
//   const payNowButton = document.getElementById("paynow");

//   const username = "Strongnationdev";
//   const password = "Adeboye200312";

//   let selectedNetworkId = "";
//   let selectedPlanAmount = 0;

//   // Populate networks from plans.js
//   const populateNetworks = () => {
//     networkDropdown.innerHTML =
//       '<option value="" disabled selected>Choose your network</option>';
//     Object.keys(dataPlans).forEach((network) => {
//       const option = document.createElement("option");
//       option.value = network;
//       option.textContent = network;
//       networkDropdown.appendChild(option);
//     });
//   };

//   // Fetch and display plans for the selected network
//   const displayPlans = (networkId) => {
//     const plans = dataPlans[networkId];
//     if (!plans) {
//       alert("No plans available for this network.");
//       return;
//     }

//     planDropdown.innerHTML =
//       '<option value="" disabled selected>Choose your desired plan</option>';

//     // Populate dropdown with fetched plans
//     plans.forEach((plan) => {
//       const option = document.createElement("option");
//       option.value = plan.id;
//       option.textContent = `${plan.name} - ₦${plan.amount}`;
//       option.setAttribute("data-amount", plan.amount);
//       planDropdown.appendChild(option);
//     });
//   };

//   // Event listener for network selection
//   networkDropdown.addEventListener("change", (event) => {
//     selectedNetworkId = event.target.value;
//     if (selectedNetworkId) {
//       displayPlans(selectedNetworkId);
//     }
//   });

//   // Event listener for plan selection
//   planDropdown.addEventListener("change", (event) => {
//     const selectedOption = event.target.options[event.target.selectedIndex];
//     selectedPlanAmount = selectedOption.getAttribute("data-amount");
//     amountInput.value = selectedPlanAmount;
//   });

//   payNowButton.addEventListener("click", async () => {
//     const phoneInput = document.getElementById("phone-number").value;
//     if (!selectedNetworkId || !selectedPlanAmount || !phoneInput) {
//       alert("Please fill all fields before proceeding.");
//       return;
//     }

//     const variationId = planDropdown.value;
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

//   populateNetworks();
// });

