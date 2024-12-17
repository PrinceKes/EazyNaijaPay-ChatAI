async function signup(event) {
    event.preventDefault();
  
    const email = document.getElementById("email").value;
    const phone = document.getElementById("phone").value;
    const username = document.getElementById("username").value;
    const password = document.getElementById("password").value;
  
    const response = await fetch('/signup', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, phone, username, password })
    });
    
    // Check if the response is valid (status code 200-299)
    if (!response.ok) {
      const errorData = await response.json();
      console.error('Error:', errorData.message);
      throw new Error(errorData.message || 'Something went wrong');
    }
    
    // If the response is valid, process the JSON data
    const data = await response.json();
    console.log('Success:', data);
  }
  
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
  