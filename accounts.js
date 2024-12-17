// This function handles the form submission asynchronously
async function signup(event) {
  event.preventDefault(); // Prevent the default form submission behavior

  // Get values from the form fields
  const email = document.getElementById("email").value;
  const phone = document.getElementById("phone").value;
  const username = document.getElementById("username").value;
  const password = document.getElementById("password").value;

  // Send the form data to the server
  try {
    const response = await fetch('/signup', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, phone, username, password })
    });

    // Check if the response is valid (status code 200-299)
    if (!response.ok) {
      const errorText = await response.text(); // Get error response text if any
      throw new Error(errorText || 'Something went wrong');
    }

    // If the response is valid, try parsing the response JSON
    const data = await response.json();
    console.log('Success:', data);
    // You can redirect the user or give feedback here (e.g., redirect to login)
    window.location.href = '/login'; // Example: redirect to login page after successful signup

  } catch (error) {
    console.error('Signup failed:', error);
    // Handle any errors that occurred during the fetch request or JSON parsing
    alert('Error: ' + error.message); // Optionally show the error message to the user
  }
}

// Attach the event listener to the form
document.getElementById('signupForm').addEventListener('submit', signup);


  async function setPin(event) {
    event.preventDefault();
  
    const pin = Array.from(document.getElementsByClassName("pin-input"))
                     .map(input => input.value).join('');
    const email = localStorage.getItem("userEmail");
  
    const response = await fetch('/set-pin', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, pin })
    });
  
    const data = await response.json();
    if (response.ok) {
      alert(data.message);
      window.location.href = data.redirect;
    } else {
      alert(data.message);
    }
  }
  
  async function login(event) {
    event.preventDefault();
  
    const email = document.getElementById("email").value;
    const password = document.getElementById("password").value;
  
    const response = await fetch('/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password })
    });
  
    const data = await response.json();
    if (response.ok) {
      alert(data.message);
      window.location.href = data.redirect;
    } else {
      alert(data.message);
    }
  }
  