// Toggle Password Visibility
function togglePassword() {
    const passwordInput = document.getElementById('password');
    const eyeIcon = document.querySelector('.eye-icon');
    
    if (passwordInput.type === 'password') {
      passwordInput.type = 'text';
      eyeIcon.innerHTML = '&#128065;'; // Change eye icon
    } else {
      passwordInput.type = 'password';
      eyeIcon.innerHTML = '&#128065;'; // Default eye icon
    }
  }
  



  // Navigation Button Highlight
const navButtons = document.querySelectorAll('.nav-btn');
navButtons.forEach(button => {
    button.addEventListener('click', () => {
        navButtons.forEach(btn => btn.classList.remove('active'));
        button.classList.add('active');
    });
});
