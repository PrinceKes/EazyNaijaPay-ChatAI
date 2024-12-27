document.getElementById('login').addEventListener('submit', async (e) => {
    e.preventDefault();
  
    console.log("Login form submitted");
  
    // Get user input
    const user_id = localStorage.getItem('user_id');
    const email = document.getElementById('email').value.trim();
    const pinInputs = document.querySelectorAll('.pin-input');
    const pin = Array.from(pinInputs).map(input => input.value).join('');
  
    console.log("Inputs captured:", { user_id, email, pin });
  
    // Validate inputs
    if (!user_id || !email || pin.length !== 4) {
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

  if (!response.ok) {
    console.error('Server returned an error:', response.status, response.statusText);
    alert(`Error: ${response.statusText}`);
    return;
  }

  // Attempt to parse response as JSON
  let data;
  try {
    data = await response.json();
  } catch (parseError) {
    console.error('Failed to parse JSON response:', parseError);
    alert('Invalid response from server.');
    return;
  }

  console.log("Server response:", data);

  if (data.success) {
    console.log("Login successful, redirecting to Dashboard.html");
    window.location.href = '/Dashboard.html';
  } else {
    alert(data.message);
    console.log("Login failed:", data.message);
  }
} catch (error) {
  console.error('Error during login:', error);
  alert('An error occurred. Please try again.');
}

});
  