// Wait for the DOM to fully load
window.addEventListener('DOMContentLoaded', async () => {
    // Retrieve the User ID from local storage
    const user_id = localStorage.getItem('user_id');
  
    if (!user_id) {
      alert('User ID not found. Please log in again.');
      window.location.href = '/login.html';
      return;
    }
  
    console.log(`User ID loaded: ${user_id}`); // Debugging log
  
    try {
      // Construct the correct API URL
      const apiUrl = `https://eazynaijapay-server.onrender.com/Verified_Users/${user_id}/Account_number`;
  
      // Make a request to fetch the user's account number
      const response = await fetch(apiUrl);
  
      if (!response.ok) {
        console.error('Error fetching account number:', response.status);
        alert('Error retrieving account number. Please try again later.');
        return;
      }
  
      // Parse the response as JSON
      const { success, account_number } = await response.json();
  
      if (success && account_number) {
        // Update the account number in the HTML
        const accountNumberElement = document.getElementById('Account_number');
        if (accountNumberElement) {
          accountNumberElement.textContent = account_number;
        }
      } else {
        alert('Unable to retrieve account number. Please contact support.');
      }
    } catch (error) {
      console.error('Error fetching account number:', error);
      alert('An error occurred while retrieving the account number. Please try again later.');
    }
  
    // Add functionality to the "Copy" button
    const copyButton = document.querySelector('.copy-btn');
    copyButton.addEventListener('click', () => {
      const accountNumberElement = document.getElementById('Account_number');
      const accountNumber = accountNumberElement.textContent;
  
      if (accountNumber) {
        // Copy account number to clipboard
        navigator.clipboard.writeText(accountNumber)
          .then(() => {
            alert('Account number copied to clipboard!');
          })
          .catch(err => {
            console.error('Error copying account number:', err);
            alert('Failed to copy account number. Please try again.');
          });
      }
    });
  });
  