import plans from './plans.js';

const networkSelect = document.getElementById('network-select');
const preferablePlanSelect = document.getElementById('preferable-plan');
const amountToPay = document.getElementById('amount-to-pay');
const payNowButton = document.getElementById('paynow');

let userId = localStorage.getItem('user_id');

const getPlansByNetworkId = (networkId) => {
  switch (networkId) {
    case '1': return plans.MTN;
    case '2': return plans.GLO;
    case '3': return plans["9MOBILE"];
    case '4': return plans.AIRTEL;
    default: return [];
  }
};

networkSelect.addEventListener('change', () => {
  const selectedNetworkId = networkSelect.value;
  preferablePlanSelect.innerHTML = '<option value="" disabled selected>Choose your desired plan</option>';

  const selectedPlans = getPlansByNetworkId(selectedNetworkId);

  selectedPlans.forEach(plan => {
    const option = document.createElement('option');
    option.value = plan.plan_id;
    option.textContent = `${plan.type} - ${plan.size} (${plan.amount})`;
    preferablePlanSelect.appendChild(option);
  });
});

preferablePlanSelect.addEventListener('change', (e) => {
  const selectedPlanId = e.target.value;
  const selectedNetworkId = networkSelect.value;

  const selectedPlans = getPlansByNetworkId(selectedNetworkId);
  const selectedPlan = selectedPlans.find(plan => plan.plan_id == selectedPlanId);

  if (selectedPlan) {
    amountToPay.value = selectedPlan.amount.replace("₦", "");
  }
});

payNowButton.addEventListener('click', () => {
  const selectedNetworkId = networkSelect.value;
  const selectedPlanId = preferablePlanSelect.value;
  const phoneNumber = document.getElementById('phone-number').value;
  const pin = `${document.getElementById('pin1').value}${document.getElementById('pin2').value}${document.getElementById('pin3').value}${document.getElementById('pin4').value}`;

  console.log('Phone Number:', phoneNumber);
  console.log('Selected Network ID:', selectedNetworkId);
  console.log('Selected Plan ID:', selectedPlanId);
  console.log('Pin:', pin);

  if (!selectedNetworkId || !selectedPlanId || !phoneNumber || !pin) {
    alert('Please complete all the fields and select a plan');
    return;
  }

  if (pin.length !== 4) {
    alert('Pin must be a 4-digit number.');
    return;
  }

  fetch(`https://eazynaijapay-server.onrender.com/Verified_Users/${userId}`)
    .then(response => response.json())
    .then(data => {
      if (!data.success) {
        alert('Error validating user information.');
        return;
      }

      if (data.user.User_pin.trim() !== pin.trim()) {
        alert('Invalid Pin');
        return;
      }

      fetch(`https://eazynaijapay-server.onrender.com/Verified_Users/${userId}/Balance`)
        .then(response => response.json())
        .then(balanceData => {
          if (!balanceData.success) {
            console.error('Error fetching balance:', balanceData.message);
            alert('Error fetching balance. Please try again later.');
            return;
          }

          const userBalance = balanceData.balance;
          const selectedPlans = getPlansByNetworkId(selectedNetworkId);
          const selectedPlan = selectedPlans.find(plan => plan.plan_id == selectedPlanId);

          if (!selectedPlan) {
            alert('Selected plan not found.');
            return;
          }

          const amount = parseFloat(selectedPlan.amount.replace('₦', '').trim());

          if (userBalance < amount) {
            alert('Insufficient balance');
            return;
          }

          const requestBody = {
            network: selectedNetworkId,
            mobile_number: phoneNumber,
            plan: selectedPlanId,
            Ported_number: true
          };

          console.log('Payload:', requestBody);

          // Use the proxy URL
          fetch('http://localhost:5000/proxy/topup', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json'
            },
            body: JSON.stringify(requestBody)
          })
            .then(response => response.json())
            .then(responseData => {
              console.log('API Response:', responseData);

              // Check for the actual API response status
              if (responseData.Status && responseData.Status.toLowerCase() === 'successful') {
                alert('Data purchase successful: ' + responseData.api_response);
              } else {
                alert('Failed to purchase data: ' + (responseData.api_response || 'Unknown error'));
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
