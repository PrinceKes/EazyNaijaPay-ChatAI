document.getElementById('login').addEventListener('submit', async (e) => {
  e.preventDefault();

  console.log("Login form submitted");

  // Get user input
  const user_id = localStorage.getItem('user_id'); // user_id from localStorage
  const email = document.getElementById('email').value.trim();
  const pinInputs = document.querySelectorAll('.pin-input');
  const pin = Array.from(pinInputs).map(input => input.value).join('');

  console.log("Inputs captured:", { User_id: user_id, Email: email, User_pin: pin });

  // Validate inputs
  if (!user_id || !email || pin.length !== 4) {
      alert('Please fill in all fields correctly.');
      console.log("Validation failed");
      return;
  }

  try {
      // Send login details to the server for verification
      const response = await fetch('http://localhost:5000/login', {
          method: 'POST',
          headers: {
              'Content-Type': 'application/json',
          },
          body: JSON.stringify({
              User_id: user_id, 
              Email: email,
              User_pin: pin
          }),
      });

      const data = await response.json();

      if (response.ok && data.success) {
          console.log("Login successful, redirecting to Dashboard.html");
          window.location.href = '/Dashboard.html';
      } else {
          console.error('Login failed:', data.message || 'Invalid credentials');
          alert(data.message || 'Invalid credentials. Please try again.');
      }
  } catch (error) {
      console.error('Error during login:', error);
      alert('An error occurred. Please try again.');
  }
});

