// Handle signup form submission
document.getElementById('signupForm').addEventListener('submit', async (event) => {
  event.preventDefault();

  const email = document.getElementById('email').value;
  const phone = document.getElementById('phone').value;
  const username = document.getElementById('username').value;
  const password = document.getElementById('password').value;

  const userData = { email, phone, username, password };

  try {
    const response = await fetch('https://eazynaijapay-server.onrender.com/signup', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(userData),
    });

    if (!response.ok) {
      const error = await response.json();
      alert(error.message || 'Signup failed. Please try again.');
      return;
    }

    const result = await response.json();
    alert('Signup successful. Redirecting to set PIN...');
    window.location.href = result.redirect;
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
    const response = await fetch('https://eazynaijapay-server.onrender.com/set-pin', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ pin }),
    });

    if (!response.ok) {
      const error = await response.json();
      alert(error.message || 'Failed to set PIN. Please try again.');
      return;
    }

    alert('PIN set successfully. You can now log in.');
    window.location.href = 'index.html';
  } catch (error) {
    console.error('Error during PIN setting:', error);
    alert('An error occurred. Please try again.');
  }
});

