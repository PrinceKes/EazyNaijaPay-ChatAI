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
}
