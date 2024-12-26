document.getElementById('login').addEventListener('submit', async (e) => {
    e.preventDefault(); // Prevent the default form submission behavior
  
    console.log("Login form submitted");
  
    // Get user input
    const user_id = localStorage.getItem('user_id'); // Ensure user_id is saved in localStorage
    const email = document.getElementById('email').value.trim();
    const pinInputs = document.querySelectorAll('.pin-input');
    const pin = Array.from(pinInputs).map(input => input.value).join('');
  
    console.log("Inputs captured:", { user_id, email, pin });
  
    // Validate inputs
    if (!user_id) {
      alert('User ID is missing. Please ensure you are registered.');
      console.log("User ID missing");
      return;
    }
    if (!email || pin.length !== 4) {
      alert('Please fill in all fields correctly.');
      console.log("Validation failed");
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
      console.log("Server response:", data);
  
      if (data.success) {
        console.log("Login successful, redirecting to Dashboard.html");
        window.location.href = '/Dashboard.html'; // Redirect on successful login
      } else {
        alert(data.message); // Show error message from server
        console.log("Login failed:", data.message);
      }
    } catch (error) {
      console.error('Error during login:', error);
      alert('An error occurred. Please try again.');
    }
  });
  