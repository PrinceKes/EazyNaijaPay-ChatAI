const SERVER_URL = 'https://eazynaijapay-server.onrender.com';

// Helper function to send POST requests
async function postData(endpoint = '', data = {}) {
  try {
    const response = await fetch(`${SERVER_URL}${endpoint}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });

    if (!response.ok) throw new Error(`Error: ${response.statusText}`);
    return await response.json();
  } catch (error) {
    console.error('Fetch error:', error.message);
    alert(`Error: ${error.message}`);
    throw error;
  }
}

// Handle user signup
document.getElementById('signupForm')?.addEventListener('submit', async (event) => {
  event.preventDefault();

  const email = document.getElementById('email').value.trim();
  const phone = document.getElementById('phone').value.trim();
  const username = document.getElementById('username').value.trim();
  const password = document.getElementById('password').value.trim();

  try {
    const data = { email, phone, username, password };
    const result = await postData('/signup', data);
    alert(result.message);

    if (result.redirect) {
      window.location.href = result.redirect;
    }
  } catch (error) {
    console.error('Signup failed:', error.message);
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
