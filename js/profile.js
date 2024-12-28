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
      // Fetch the profile picture
      const profileImgElement = document.querySelector('.profile-img');
  
      const response = await fetch(`http://localhost:5000/profile-picture/${user_id}`);
      if (!response.ok) {
        console.error('Error fetching profile picture:', response.status);
        alert('Unable to load profile picture. Using default image.');
        return;
      }
  
      // Update the profile picture src
      const blob = await response.blob();
      const imageUrl = URL.createObjectURL(blob);
      profileImgElement.src = imageUrl;
    } catch (error) {
      console.error('Error fetching profile picture:', error);
      alert('An error occurred while loading the profile picture. Please try again later.');
    }
  });
  