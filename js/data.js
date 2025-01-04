import plans from './plans.js'; // Import plans from plans.js

// Function to handle network selection
const networkSelect = document.getElementById('network-select');
const preferablePlanSelect = document.getElementById('preferable-plan');
const amountToPay = document.getElementById('amount-to-pay'); // Display plan amount

networkSelect.addEventListener('change', () => {
  // Get selected network ID
  const selectedNetworkId = networkSelect.value;
  
  // Clear any existing plans in the dropdown
  preferablePlanSelect.innerHTML = '<option value="" disabled selected>Choose your desired plan</option>';
  
  // Fetch the corresponding plans based on network ID
  let selectedPlans = [];
  if (selectedNetworkId == '1') {
    selectedPlans = plans.MTN; // Fetch MTN plans
  } else if (selectedNetworkId == '2') {
    selectedPlans = plans.GLO; // Fetch GLO plans
  } else if (selectedNetworkId == '3') {
    selectedPlans = plans["9MOBILE"]; // Fetch 9MOBILE plans
  } else if (selectedNetworkId == '4') {
    selectedPlans = plans.AIRTEL; // Fetch AIRTEL plans
  }

  // Dynamically populate the preferable plan dropdown
  selectedPlans.forEach(plan => {
    const option = document.createElement('option');
    option.value = plan.plan_id;  // Plan ID is stored but hidden from user
    option.textContent = `${plan.type} - ${plan.size} (${plan.amount})`; // Display plan details to user
    preferablePlanSelect.appendChild(option);
  });
});

// Display the selected plan's amount when a plan is chosen
preferablePlanSelect.addEventListener('change', (e) => {
  const selectedPlanId = e.target.value;
  const selectedNetworkId = networkSelect.value;

  let selectedPlan = null;
  let selectedPlans = [];
  
  if (selectedNetworkId == '1') {
    selectedPlans = plans.MTN;
  } else if (selectedNetworkId == '2') {
    selectedPlans = plans.GLO;
  } else if (selectedNetworkId == '3') {
    selectedPlans = plans["9MOBILE"];
  } else if (selectedNetworkId == '4') {
    selectedPlans = plans.AIRTEL;
  }

  // Find the selected plan by ID
  selectedPlan = selectedPlans.find(plan => plan.plan_id == selectedPlanId);
  
  // Display the amount to pay for the selected plan
  if (selectedPlan) {
    amountToPay.value = selectedPlan.amount.replace("₦", ""); // Remove the currency symbol for the amount input
  }
});

// Pay Now Button functionality (you can add this if needed)
const payNowButton = document.getElementById('paynow');
payNowButton.addEventListener('click', () => {
  const selectedNetworkId = networkSelect.value;
  const selectedPlanId = preferablePlanSelect.value;
  const phoneNumber = document.getElementById('phone-number').value;
  const pin = `${document.getElementById('pin1').value}${document.getElementById('pin2').value}${document.getElementById('pin3').value}${document.getElementById('pin4').value}`;

  // Validate user input before proceeding with the transaction
  if (!selectedNetworkId || !selectedPlanId || !phoneNumber || !pin) {
    alert('Please complete all the fields and select a plan');
    return;
  }

  // Validate pin length or any other logic you may have
  if (pin.length !== 4) {
    alert('Pin must be a 4-digit number.');
    return;
  }

  // Proceed with the transaction logic here (API call or other operations)
  console.log('Transaction Proceeding...');
  // You can replace the above log with actual API call logic to process the payment
});


























// import plans from './plans.js'; // Import the plans data

// // Function to update the plans dropdown based on selected network
// const updatePlansDropdown = (networkId) => {
//     const planDropdown = document.getElementById('preferable-plan');
//     planDropdown.innerHTML = '<option value="" disabled selected>Choose your desired plan</option>'; // Clear previous options

//     // Select the plans based on networkId
//     let selectedPlans = [];
//     switch (networkId) {
//         case "1": // MTN
//             selectedPlans = plans.MTN;
//             break;
//         case "2": // GLO
//             selectedPlans = plans.GLO;
//             break;
//         case "3": // 9MOBILE
//             selectedPlans = plans["9MOBILE"];
//             break;
//         case "4": // AIRTEL
//             selectedPlans = plans.AIRTEL;
//             break;
//         default:
//             return; // If no valid network is selected, do nothing
//     }

//     // Populate the plan dropdown with available plans
//     selectedPlans.forEach((plan) => {
//         const option = document.createElement('option');
//         option.value = plan.plan_id;
//         option.textContent = `${plan.type} - ${plan.amount} - ${plan.size} (${plan.validity})`;
//         planDropdown.appendChild(option);
//     });
// };

// // Event listener for network selection
// document.getElementById('network-select').addEventListener('change', (event) => {
//     const selectedNetworkId = event.target.value;
//     updatePlansDropdown(selectedNetworkId); // Update the plans based on selected network
// });

// // Function to fetch the selected plan details
// const getSelectedPlanDetails = () => {
//     const planId = document.getElementById('preferable-plan').value;
//     let selectedPlanDetails = null;

//     // Loop through the plans to find the selected plan by plan_id
//     Object.keys(plans).forEach((networkKey) => {
//         const networkPlans = plans[networkKey];
//         networkPlans.forEach((plan) => {
//             if (plan.plan_id === parseInt(planId)) {
//                 selectedPlanDetails = plan;
//             }
//         });
//     });

//     return selectedPlanDetails;
// };

// // Add event listener for the "Continue to Pay" button to verify pin and make the purchase
// document.getElementById('paynow').addEventListener('click', () => {
//     const pin1 = document.getElementById('pin1').value;
//     const pin2 = document.getElementById('pin2').value;
//     const pin3 = document.getElementById('pin3').value;
//     const pin4 = document.getElementById('pin4').value;

//     const enteredPin = pin1 + pin2 + pin3 + pin4;

//     // Verify pin (you can add a function to check if enteredPin matches the stored pin)
//     if (isPinValid(enteredPin)) {
//         const selectedPlan = getSelectedPlanDetails();

//         if (selectedPlan) {
//             // Display the selected plan details (or proceed with the payment process)
//             alert(`You have selected the plan: ${selectedPlan.type} - ${selectedPlan.amount} - ${selectedPlan.size} (${selectedPlan.validity})`);
//             // Here, you can integrate the logic for making a data purchase using the selected plan
//         } else {
//             alert("Please select a valid data plan.");
//         }
//     } else {
//         alert("Invalid PIN. Please try again.");
//     }
// });

// // Function to simulate pin verification
// const isPinValid = (enteredPin) => {
//     // Implement the actual pin verification logic here (e.g., check against the stored pin)
//     const storedPin = "1234"; // Placeholder for the stored pin
//     return enteredPin === storedPin;
// };
