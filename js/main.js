import dataPlans from "./plans.js";

document.getElementById("network-select").addEventListener("change", (event) => {
  const selectedNetwork = event.target.value;
  const plans = dataPlans[selectedNetwork];

  if (!plans) {
    alert("No plans available for this network.");
    return;
  }

  const preferablePlanSelect = document.getElementById("preferable-plan");
  preferablePlanSelect.innerHTML = '<option value="" disabled selected>Choose your desired plan</option>'; // Clear previous options

  plans.forEach((plan) => {
    const option = document.createElement("option");
    option.value = plan.id;
    option.textContent = plan.name;
    preferablePlanSelect.appendChild(option);
  });
});

function handlePlanSelection(variationId) {
  alert(`Selected Plan Variation ID: ${variationId}`);
  // Add logic to process the plan selection
}






// import dataPlans from "./plans.js";

// document.getElementById("networkSelect").addEventListener("change", (event) => {
//   const selectedNetwork = event.target.value;
//   const plans = dataPlans[selectedNetwork];

//   if (!plans) {
//     alert("No plans available for this network.");
//     return;
//   }

//   const plansContainer = document.getElementById("plansContainer");
//   plansContainer.innerHTML = ""; // Clear previous plans

//   plans.forEach((plan) => {
//     const planElement = document.createElement("div");
//     planElement.textContent = plan.name;
//     planElement.dataset.variationId = plan.id;
//     planElement.classList.add("plan");
//     planElement.addEventListener("click", () => {
//       handlePlanSelection(plan.id);
//     });
//     plansContainer.appendChild(planElement);
//   });
// });

// function handlePlanSelection(variationId) {
//   alert(`Selected Plan Variation ID: ${variationId}`);
//   // Add logic to process the plan selection
// }
