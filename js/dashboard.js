document.addEventListener('DOMContentLoaded', () => {
  // Retrieve the user_id from localStorage
  const user_id = localStorage.getItem('user_id');

  if (!user_id) {
    alert('User ID is missing. Please log in again.');
    window.location.href = 'https://t.me/EazyNaijaPayBot';
    return;
  }

  // Fetch the user's balance from the server
  const balanceEndpoint = `http://localhost:5000/Verified_Users/${user_id}/Balance`;

  fetch(balanceEndpoint)
    .then(response => response.json())
    .then(data => {
      if (data.success) {
        // Update the balance on the page
        const balanceElement = document.getElementById('balance');
        if (balanceElement) {
          balanceElement.textContent = `${data.balance.toLocaleString()} NGN`;
        }
      } else {
        console.error('Failed to fetch balance:', data.message);
      }
    })
    .catch(error => {
      console.error('Error fetching balance:', error);
    });
});
