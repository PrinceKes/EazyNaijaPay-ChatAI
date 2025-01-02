window.addEventListener('load', () => {
  const userId = localStorage.getItem('user_id') || localStorage.getItem('User_id');

  if (!userId) {
      alert('User ID is missing. Please log in again.');
      window.location.href = 'https://t.me/EazyNaijaPayBot';
  } else {
      console.log(`User ID loaded: ${userId}`);
      localStorage.setItem('user_id', userId);
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
  