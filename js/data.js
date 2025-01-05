import plans from './plans.js';

const networkSelect = document.getElementById('network-select');
const preferablePlanSelect = document.getElementById('preferable-plan');
const amountToPay = document.getElementById('amount-to-pay');
const payNowButton = document.getElementById('paynow');

let userId = localStorage.getItem('user_id'); // Fetch user_id from local storage

// Get plans based on selected network
networkSelect.addEventListener('change', () => {
  const selectedNetworkId = networkSelect.value;
  
  preferablePlanSelect.innerHTML = '<option value="" disabled selected>Choose your desired plan</option>';
  
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

  selectedPlans.forEach(plan => {
    const option = document.createElement('option');
    option.value = plan.plan_id;
    option.textContent = `${plan.type} - ${plan.size} (${plan.amount})`;
    preferablePlanSelect.appendChild(option);
  });
});

// Update the amount to pay based on the selected plan
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

  selectedPlan = selectedPlans.find(plan => plan.plan_id == selectedPlanId);
  
  if (selectedPlan) {
    amountToPay.value = selectedPlan.amount.replace("₦", "");
  }
});

// Proceed with the transaction
payNowButton.addEventListener('click', () => {
  const selectedNetworkId = networkSelect.value;
  const selectedPlanId = preferablePlanSelect.value;
  const phoneNumber = document.getElementById('phone-number').value;
  const pin = `${document.getElementById('pin1').value}${document.getElementById('pin2').value}${document.getElementById('pin3').value}${document.getElementById('pin4').value}`;

  if (!selectedNetworkId || !selectedPlanId || !phoneNumber || !pin) {
    alert('Please complete all the fields and select a plan');
    return;
  }

  if (pin.length !== 4) {
    alert('Pin must be a 4-digit number.');
    return;
  }

  // 1. Validate the pin with the API
  fetch(`https://eazynaijapay-server.onrender.com/Verified_Users/${userId}`)
    .then(response => response.json())
    .then(data => {
      if (data.User_pin !== pin) {
        alert('Invalid Pin');
        return;
      }

      // 2. Validate the balance
      fetch(`https://eazynaijapay-server.onrender.com/Verified_Users/${userId}/Balance`)
        .then(response => response.json())
        .then(balanceData => {
          const userBalance = balanceData.balance;
          const selectedPlan = plans[selectedNetworkId].find(plan => plan.plan_id == selectedPlanId);
          const amount = parseFloat(selectedPlan.amount.replace('₦', '').trim());

          if (userBalance < amount) {
            alert('Insufficient balance');
            return;
          }

          // 3. If pin and balance are valid, process the data purchase
          const requestBody = {
            network: selectedNetworkId,
            mobile_number: phoneNumber,
            plan: selectedPlanId,
            Ported_number: true
          };

          console.log('Sending data purchase request...');
          console.log({
            Authorization: `Token ${'bab528e3b6653c6eb7809b56f6c83bcaf25bb5ec'}`,
            ContentType: 'application/json',
            Body: requestBody
          });

          fetch('https://www.husmodata.com/api/data/', {
            method: 'POST',
            headers: {
              'Authorization': 'Token bab528e3b6653c6eb7809b56f6c83bcaf25bb5ec',
              'Content-Type': 'application/json'
            },
            body: JSON.stringify(requestBody)
          })
            .then(response => response.json())
            .then(responseData => {
              if (responseData.status === 'success') {
                alert('Data purchase successful');
              } else {
                alert('Failed to purchase data');
              }
            })
            .catch(error => {
              console.error('Error processing data purchase:', error);
              alert('Error occurred. Please try again later.');
            });

        })
        .catch(error => {
          console.error('Error fetching balance:', error);
          alert('Error fetching balance. Please try again later.');
        });
    })
    .catch(error => {
      console.error('Error validating pin:', error);
      alert('Error validating pin. Please try again later.');
    });
});








// import plans from './plans.js';

// const networkSelect = document.getElementById('network-select');
// const preferablePlanSelect = document.getElementById('preferable-plan');
// const amountToPay = document.getElementById('amount-to-pay');

// networkSelect.addEventListener('change', () => {
//   const selectedNetworkId = networkSelect.value;
  
//   preferablePlanSelect.innerHTML = '<option value="" disabled selected>Choose your desired plan</option>';
  
//   let selectedPlans = [];
//   if (selectedNetworkId == '1') {
//     selectedPlans = plans.MTN;
//   } else if (selectedNetworkId == '2') {
//     selectedPlans = plans.GLO;
//   } else if (selectedNetworkId == '3') {
//     selectedPlans = plans["9MOBILE"];
//   } else if (selectedNetworkId == '4') {
//     selectedPlans = plans.AIRTEL;
//   }

//   selectedPlans.forEach(plan => {
//     const option = document.createElement('option');
//     option.value = plan.plan_id;
//     option.textContent = `${plan.type} - ${plan.size} (${plan.amount})`;
//     preferablePlanSelect.appendChild(option);
//   });
// });

// preferablePlanSelect.addEventListener('change', (e) => {
//   const selectedPlanId = e.target.value;
//   const selectedNetworkId = networkSelect.value;

//   let selectedPlan = null;
//   let selectedPlans = [];
  
//   if (selectedNetworkId == '1') {
//     selectedPlans = plans.MTN;
//   } else if (selectedNetworkId == '2') {
//     selectedPlans = plans.GLO;
//   } else if (selectedNetworkId == '3') {
//     selectedPlans = plans["9MOBILE"];
//   } else if (selectedNetworkId == '4') {
//     selectedPlans = plans.AIRTEL;
//   }

//   selectedPlan = selectedPlans.find(plan => plan.plan_id == selectedPlanId);
  
//   if (selectedPlan) {
//     amountToPay.value = selectedPlan.amount.replace("₦", "");
//   }
// });

// const payNowButton = document.getElementById('paynow');
// payNowButton.addEventListener('click', () => {
//   const selectedNetworkId = networkSelect.value;
//   const selectedPlanId = preferablePlanSelect.value;
//   const phoneNumber = document.getElementById('phone-number').value;
//   const pin = `${document.getElementById('pin1').value}${document.getElementById('pin2').value}${document.getElementById('pin3').value}${document.getElementById('pin4').value}`;

//   if (!selectedNetworkId || !selectedPlanId || !phoneNumber || !pin) {
//     alert('Please complete all the fields and select a plan');
//     return;
//   }

//   if (pin.length !== 4) {
//     alert('Pin must be a 4-digit number.');
//     return;
//   }

//   console.log('Transaction Proceeding...');
// });

