// fund_acct.js

window.addEventListener('DOMContentLoaded', async () => {
    // Get the User_id from localStorage
    const user_id = localStorage.getItem('user_id');
  
    if (!user_id) {
      alert('User ID not found. Please log in again.');
      window.location.href = '/login.html'; // Redirect to login if User_id is missing
      return;
    }
  
    try {
      // Fetch the account number from the server
      const response = await fetch(`/Verified_Users/${user_id}/Account_number`);
  
      if (!response.ok) {
        console.error('Error fetching account number:', response.status);
        alert('Error retrieving account number. Please try again later.');
        return;
      }
  
      // Parse the response
      const { success, account_number } = await response.json();
  
      if (success && account_number) {
        // Update the HTML with the fetched account number
        const accountNumberElement = document.getElementById('Account_number');
        if (accountNumberElement) {
          accountNumberElement.textContent = account_number;
        }
  
        // Add copy-to-clipboard functionality
        const copyButton = document.querySelector('.copy-btn');
        if (copyButton) {
          copyButton.addEventListener('click', () => {
            navigator.clipboard.writeText(account_number)
              .then(() => alert('Account number copied to clipboard!'))
              .catch((err) => console.error('Failed to copy account number:', err));
          });
        }
      } else {
        alert('Unable to retrieve account number. Please contact support.');
      }
    } catch (error) {
      console.error('Error fetching account number:', error);
      alert('An error occurred while retrieving the account number. Please try again later.');
    }
  });
  