// fund_acct.js

window.addEventListener('DOMContentLoaded', async () => {
    const user_id = localStorage.getItem('user_id'); // Retrieve user_id from local storage
    
    if (!user_id) {
      alert('User ID not found. Please log in again.');
      window.location.href = '/login.html';
      return;
    }
  
    console.log('User ID loaded:', user_id); // Debugging log
  
    try {
      const response = await fetch(`/Verified_Users/${user_id}/Account_number`); // Fetch account number from server
      
      if (!response.ok) {
        console.error('Error fetching account number:', response.status);
        alert('Error retrieving account number. Please try again later.');
        return;
      }
  
      const { success, account_number } = await response.json(); // Parse JSON response
  
      if (success && account_number) {
        const accountNumberElement = document.getElementById('Account_number');
        if (accountNumberElement) {
          accountNumberElement.textContent = account_number; // Update the account number in the UI
        }
      } else {
        alert('Unable to retrieve account number. Please contact support.');
      }
    } catch (error) {
      console.error('Error fetching account number:', error);
      alert('An error occurred while retrieving the account number. Please try again later.');
    }
  });
  
  // Copy button functionality
  document.querySelector('.copy-btn').addEventListener('click', () => {
    const accountNumberElement = document.getElementById('Account_number');
    const accountNumber = accountNumberElement.textContent;
    
    if (accountNumber) {
      navigator.clipboard.writeText(accountNumber).then(() => {
        alert('Account number copied to clipboard!');
      }).catch(err => {
        console.error('Failed to copy account number:', err);
        alert('Failed to copy account number. Please try again.');
      });
    } else {
      alert('No account number available to copy.');
    }
  });
  