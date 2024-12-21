// Handle signup form submission
document.getElementById('signupForm').addEventListener('submit', async (event) => {
  event.preventDefault();

  const email = document.getElementById('email').value;
  const phone = document.getElementById('phone').value;
  const username = document.getElementById('username').value;
  const password = document.getElementById('password').value;

  const userData = { email, phone, username, password };

  try {
    const response = await fetch('/signup', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(userData),
    });

    // Check if response is JSON
    if (response.ok) {
      const result = await response.json();
      alert('Signup successful. Redirecting to set PIN...');
      window.location.href = result.redirect;
    } else {
      const result = await response.json().catch(() => ({})); // Fallback for empty response
      alert(result.message || 'Signup failed. Please try again.');
    }
  } catch (error) {
    console.error('Error during signup:', error);
    alert('An error occurred. Please try again.');
  }
});


// Handle PIN setting form submission
document.getElementById('setPinForm').addEventListener('submit', async (event) => {
  event.preventDefault();
  
  const pin = [
    document.getElementById('pin1').value,
    document.getElementById('pin2').value,
    document.getElementById('pin3').value,
    document.getElementById('pin4').value,
  ].join('');

  if (pin.length !== 4 || isNaN(pin)) {
    alert('PIN must be a 4-digit number.');
    return;
  }

  try {
    const response = await fetch('/set-pin', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ pin }),
    });

    const result = await response.json();
    if (response.ok) {
      alert('PIN set successfully. You can now log in.');
      window.location.href = 'index.html';
    } else {
      alert(result.message || 'Failed to set PIN. Please try again.');
    }
  } catch (error) {
    console.error('Error during PIN setting:', error);
    alert('An error occurred. Please try again.');
  }
});









// // Handle user login
// document.getElementById('login')?.addEventListener('submit', async (event) => {
//   event.preventDefault();

//   const email = document.getElementById('email').value.trim();
//   const password = document.getElementById('password').value.trim();

//   try {
//     const data = { email, password };
//     const result = await postData('/login', data); // Endpoint remains relative to SERVER_URL
//     alert(result.message);

//     if (result.redirect) {
//       window.location.href = result.redirect; // Redirect to Dashboard.html
//     }
//   } catch (error) {
//     console.error('Login failed:', error.message);
//   }
// });










// // Handle setting PIN
// async function setPin(event) {
//   event.preventDefault();

//   const pinInputs = document.querySelectorAll('.pin-input');
//   const pin = Array.from(pinInputs).map((input) => input.value.trim()).join('');
//   const email = localStorage.getItem('email'); // Assuming the email is stored during signup

//   if (!email) {
//     alert('No email found. Please sign up first.');
//     return;
//   }

//   if (pin.length !== 4 || isNaN(pin)) {
//     alert('Please enter a valid 4-digit PIN.');
//     return;
//   }

//   try {
//     const data = { email, pin };
//     const result = await postData('/set-pin', data); // Endpoint remains relative to SERVER_URL
//     alert(result.message);

//     if (result.redirect) {
//       window.location.href = result.redirect; // Redirect to index.html
//     }
//   } catch (error) {
//     console.error('Setting PIN failed:', error.message);
//   }
// }

// // Utility function to toggle password visibility
// function togglePassword() {
//   const passwordInput = document.getElementById('password');
//   const type = passwordInput.type === 'password' ? 'text' : 'password';
//   passwordInput.type = type;
// }
