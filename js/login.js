// form.addEventListener('submit', async (event) => {
//   event.preventDefault();

//   const user_id = document.querySelector('#user_id').value;
//   const email = document.querySelector('#email').value;
//   const pin = document.querySelector('#pin').value;

//   console.log("Login form submitted");
//   const inputs = { user_id, email, pin };
//   console.log("Inputs captured:", inputs);

//   try {
//     const response = await fetch('https://eazynaijapay-app.onrender.com/login', {
//             method: 'POST',
//             headers: { 'Content-Type': 'application/json' },
//             body: JSON.stringify(inputs),
//         });
    
//         if (!response.ok) {
//             console.error(`Server responded with status: ${response.status}`);
//             throw new Error(`HTTP error! status: ${response.status}`);
//         }
    
//         // Attempt to parse JSON
//         let data;
//         try {
//             data = await response.json();
//         } catch (jsonError) {
//             console.error("Failed to parse JSON:", jsonError);
//             throw new Error('Invalid JSON response from server.');
//         }
    
//         console.log("Server response:", data);
    
//         if (data.success) {
//             alert('Login successful!');
//         } else {
//             alert(`Login failed: ${data.message}`);
//         }
//     } catch (error) {
//         console.error("Error during login:", error);
//         alert("An error occurred. Please try again.");
//     }    
// });




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
  
    try {
      // Fetch all users from the database
      const response = await fetch('http://localhost:5000/Verified_Users');
      if (!response.ok) {
        console.error('Error fetching users:', response.status);
        alert('Error fetching user details from the server.');
        return;
      }
  
      const { success, data: users } = await response.json();
      if (!success || !Array.isArray(users)) {
        alert('Error retrieving users. Please try again.');
        return;
      }
  
      // Validate user credentials
      const matchedUser = users.find(
        user => user.User_id === user_id && user.Email === email && user.User_pin === pin
      );
  
      if (matchedUser) {
        console.log("Login successful, redirecting to Dashboard.html");
        window.location.href = '/Dashboard.html';
      } else {
        alert('Invalid credentials. Please try again.');
        console.log("Login failed: User not found.");
      }
    } catch (error) {
      console.error('Error during login:', error);
      alert('An error occurred. Please try again.');
    }
  });
  