// dashboard.js

document.addEventListener('DOMContentLoaded', () => {
    // Retrieve user_id from localStorage
    const user_id = localStorage.getItem('user_id');
  
    if (!user_id) {
      alert('User ID not found. Redirecting to login.');
      window.location.href = 'https://t.me/EazyNaijaPayBot'; // Redirect to Telegram bot
      return;
    }
  
    // Update balance dynamically
    const updateBalance = async () => {
      try {
        const response = await fetch(`http://localhost:5000/Verified_Users/${user_id}/Balance`);
        const data = await response.json();
        if (data.success) {
          document.getElementById('balance').textContent = `${data.balance} NGN`;
        } else {
          console.error('Failed to fetch balance:', data.message);
        }
      } catch (error) {
        console.error('Error fetching balance:', error);
      }
    };
  
    // Call updateBalance on page load
    updateBalance();
  
    // Example: You can add similar fetch requests for account_number, username, etc.
  });
  