window.addEventListener('load', () => {
  // Check for user ID in localStorage
  const userId = localStorage.getItem('user_id') || localStorage.getItem('User_id');

  if (!userId) {
      // Redirect user to the bot for authentication if ID is missing
      alert('User ID is missing. Please log in again.');
      window.location.href = 'https://t.me/EazyNaijaPayBot';
  } else {
      console.log(`User ID loaded: ${userId}`);
      // Save the consistent key format back to localStorage
      localStorage.setItem('user_id', userId); // Normalize to 'user_id'
  }
});





// window.addEventListener('load', () => {
//     const user_id = localStorage.getItem('user_id');
  
//     if (!user_id) {
//       alert('User ID is missing. Please log in again.');
//       window.location.href = 'https://t.me/EazyNaijaPayBot';
//     } else {
//       console.log(`User ID loaded: ${user_id}`);
//     }
//   });
  