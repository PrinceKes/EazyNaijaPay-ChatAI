// dashboard.js

window.addEventListener('DOMContentLoaded', async () => {
  const user_id = localStorage.getItem('user_id');
  
  if (!user_id) {
    alert('User ID not found. Please log in again.');
    window.location.href = '/login.html'; // Redirect to login page if no user_id is found
    return;
  }

  try {
    // Fetch the user's balance from the server
    const response = await fetch(`/Verified_Users/${user_id}/Balance`);

    if (!response.ok) {
      console.error('Error fetching balance:', response.status);
      alert('Error retrieving balance. Please try again later.');
      return;
    }

    const { success, balance } = await response.json();

    if (success && balance !== undefined) {
      // Update the balance field on the dashboard
      const balanceElement = document.getElementById('balance');
      if (balanceElement) {
        balanceElement.textContent = `${balance} NGN`;
      }
    } else {
      alert('Unable to retrieve balance. Please contact support.');
    }
  } catch (error) {
    console.error('Error fetching balance:', error);
    alert('An error occurred while retrieving balance. Please try again later.');
  }
});





// document.addEventListener('DOMContentLoaded', () => {
//   // Retrieve the user_id from localStorage
//   const user_id = localStorage.getItem('user_id');

//   if (!user_id) {
//     alert('User ID is missing. Please log in again.');
//     window.location.href = 'https://t.me/EazyNaijaPayBot';
//     return;
//   }

//   // Fetch the user's balance from the server
//   const balanceEndpoint = `http://localhost:5000/Verified_Users/${user_id}/Balance`;

//   fetch(balanceEndpoint)
//     .then(response => response.json())
//     .then(data => {
//       if (data.success) {
//         // Update the balance on the page
//         const balanceElement = document.getElementById('balance');
//         if (balanceElement) {
//           balanceElement.textContent = `${data.balance.toLocaleString()} NGN`;
//         }
//       } else {
//         console.error('Failed to fetch balance:', data.message);
//       }
//     })
//     .catch(error => {
//       console.error('Error fetching balance:', error);
//     });
// });
