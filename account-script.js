// Function to handle signup
async function signup(event) {
  event.preventDefault();

  const email = document.getElementById("email").value;
  const phone = document.getElementById("phone").value;
  const username = document.getElementById("username").value;
  const password = document.getElementById("password").value;

  try {
    const response = await fetch('/signup', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, phone, username, password })
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(errorText || 'Something went wrong');
    }

    const data = await response.json();
    console.log('Success:', data);

    // Redirect to set-pin.html after successful signup
    window.location.href = '/set-pin.html';
  } catch (error) {
    console.error('Signup failed:', error);
    alert('Error: ' + error.message);
  }
}

document.getElementById('signupForm')?.addEventListener('submit', signup);

// Function to handle PIN setup
async function setPin(event) {
  event.preventDefault();

  // Collecting the PIN inputs
  const pinInputs = document.getElementsByClassName("pin-input");
  const pin = Array.from(pinInputs).map(input => input.value).join("");

  if (pin.length !== 4 || isNaN(pin)) {
    alert("Please enter a valid 4-digit PIN.");
    return;
  }

  try {
    const response = await fetch('/set-pin', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ pin })
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(errorText || 'Failed to set PIN');
    }

    const data = await response.json();
    console.log('PIN set successfully:', data);

    // Redirect to login page (index.html)
    window.location.href = '/index.html';
  } catch (error) {
    console.error('Set PIN failed:', error);
    alert('Error: ' + error.message);
  }
}

// Function to handle login
async function login(event) {
  event.preventDefault();

  const email = document.getElementById("email").value;
  const password = document.getElementById("password").value;

  try {
    const response = await fetch('/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password })
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(errorText || 'Invalid credentials');
    }

    const data = await response.json();
    console.log('Login successful:', data);

    // Redirect to the dashboard page
    window.location.href = '/dashboard.html';
  } catch (error) {
    console.error('Login failed:', error);
    alert('Error: ' + error.message);
  }
}

document.getElementById('login')?.addEventListener('submit', login);


















  // async function setPin(event) {
  //   event.preventDefault();
  
  //   const pin = Array.from(document.getElementsByClassName("pin-input"))
  //                    .map(input => input.value).join('');
  //   const email = localStorage.getItem("userEmail");
  
  //   const response = await fetch('/set-pin', {
  //     method: 'POST',
  //     headers: { 'Content-Type': 'application/json' },
  //     body: JSON.stringify({ email, pin })
  //   });
  
  //   const data = await response.json();
  //   if (response.ok) {
  //     alert(data.message);
  //     window.location.href = data.redirect;
  //   } else {
  //     alert(data.message);
  //   }
  // }
  
  // async function login(event) {
  //   event.preventDefault();
  
  //   const email = document.getElementById("email").value;
  //   const password = document.getElementById("password").value;
  
  //   const response = await fetch('/login', {
  //     method: 'POST',
  //     headers: { 'Content-Type': 'application/json' },
  //     body: JSON.stringify({ email, password })
  //   });
  
  //   const data = await response.json();
  //   if (response.ok) {
  //     alert(data.message);
  //     window.location.href = data.redirect;
  //   } else {
  //     alert(data.message);
  //   }
  // }
  