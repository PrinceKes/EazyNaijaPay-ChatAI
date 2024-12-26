// login.js

document.getElementById('login').addEventListener('submit', async (e) => {
    e.preventDefault();
  
    // Get user input
    const urlParams = new URLSearchParams(window.location.search);
    const user_id = urlParams.get('user_id');
    const email = document.getElementById('email').value.trim();
    const pin = Array.from(document.querySelectorAll('.pin-input')).map(input => input.value).join('');
  
    // Validate inputs
    if (!user_id || !email || pin.length !== 4) {
      alert('Please fill in all fields correctly.');
      return;
    }
  
    // Send login request to server
    try {
      const response = await fetch('/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ user_id, email, pin }),
      });
  
      const data = await response.json();
  
      if (data.success) {
        window.location.href = '/Dashboard.html';
      } else {
        alert(data.message);
      }
    } catch (error) {
      console.error('Error during login:', error);
      alert('An error occurred. Please try again.');
    }
  });
  