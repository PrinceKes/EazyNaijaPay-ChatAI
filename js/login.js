document.getElementById('login').addEventListener('submit', async (e) => {
    e.preventDefault();
  
    // Get user input
    const user_id = localStorage.getItem('user_id'); // Retrieve user_id from localStorage
    const email = document.getElementById('email').value.trim();
    const pin = Array.from(document.querySelectorAll('.pin-input')).map(input => input.value).join('');
  
    // Validate inputs
    if (!user_id || !email || pin.length !== 4) {
      alert('Please fill in all fields correctly.');
      return;
    }
  
    // Send login request to the server
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
        window.location.href = '/Dashboard.html'; // Redirect on successful login
      } else {
        alert(data.message); // Show error message from server
      }
    } catch (error) {
      console.error('Error during login:', error);
      alert('An error occurred. Please try again.');
    }
  });
  