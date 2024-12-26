// loader.js
window.addEventListener('load', () => {
    const urlParams = new URLSearchParams(window.location.search);
    const user_id = urlParams.get('user_id');
  
    if (!user_id) {
      alert('User ID is missing. Please click the correct link.');
      window.location.href = 't.me/EazyNaijaPayBot';
    } else {
      console.log(`User ID detected: ${user_id}`);
      document.getElementById('User_id').innerText = user_id; // Update User_id element
    }
  });