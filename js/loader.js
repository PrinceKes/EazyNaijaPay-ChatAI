// loader.js

// Redirect user to Index.html with user_id parameter
window.addEventListener('load', () => {
    const urlParams = new URLSearchParams(window.location.search);
    const user_id = urlParams.get('user_id');
  
    if (!user_id) {
      alert('User ID is missing. Please click the correct link.');
      window.location.href = 't.me/EazyNaijaPayBot'; // Redirect to signup if no user_id is provided
    } else {
      console.log(`User ID detected: ${user_id}`);
    }
  });
  