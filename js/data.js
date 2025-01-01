// data.js
document.getElementById("data-form").addEventListener("submit", function (event) {
    event.preventDefault(); // Prevent form submission
  
    // Get form input values
    const username = document.getElementById("username").value;
    const password = document.getElementById("password").value;
    const phone = document.getElementById("phone").value;
    const network = document.getElementById("network").value;
    const variation = document.getElementById("variation").value;
  
    // Validate inputs
    if (!username || !password || !phone || !network || !variation) {
      alert("All fields are required!");
      return;
    }
  
    // Data API endpoint
    const apiUrl = `https://ebills.africa/wp-json/api/v1/data?username=${username}&password=${password}&phone=${phone}&network_id=${network}&variation_id=${variation}`;
  
    // Make the API request
    fetch(apiUrl, {
      method: "GET",
    })
      .then((response) => response.json())
      .then((data) => {
        if (data.code === "success") {
          alert(`Data purchased successfully for ${phone}.`);
          console.log(data);
        } else {
          alert(`Error: ${data.message}`);
        }
      })
      .catch((error) => {
        alert("An error occurred while processing your request.");
        console.error(error);
      });
  });
  