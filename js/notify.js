document.addEventListener("DOMContentLoaded", () => {
    const activitiesList = document.querySelector(".activities-list");
  
    // Function to fetch transactions
    async function fetchTransactions() {
      try {
        const response = await fetch("https://eazynaijapay-server.onrender.com/transactions");
        const data = await response.json();
  
        if (!data.success || !data.transactions) {
          console.error("Failed to fetch transactions:", data.message || "Unknown error");
          return;
        }
  
        const transactions = data.transactions;
  
        // Process and display the transactions
        transactions.forEach((transaction) => {
          // Extract necessary fields
          const { Status, plan_amount, mobile_number, create_date, customer_ref } = transaction;
  
          // Format the mobile number (e.g., "0706****708")
          const formattedMobileNumber = `${mobile_number.slice(0, 4)}****${mobile_number.slice(-3)}`;
  
          // Format the create_date to a readable format
          const formattedDate = new Date(create_date).toLocaleString("en-US", {
            weekday: "long",
            hour: "2-digit",
            minute: "2-digit",
            hour12: true,
          });
  
          // Create a new activity card
          const activityCard = document.createElement("div");
          activityCard.classList.add("activity-card");
  
          // Populate the card with transaction details
          activityCard.innerHTML = `
            <h4>${Status === "successful" ? "Airtime Purchase Successful" : "Transaction Failed"}</h4>
            <p>A user has bought ${plan_amount} Airtime worth for ${formattedMobileNumber}</p>
            <span>${formattedDate}</span>
            <span id="reference">${customer_ref}</span>
          `;
  
          // Append the card to the activities list
          activitiesList.appendChild(activityCard);
        });
      } catch (error) {
        console.error("Error fetching transactions:", error);
      }
    }
  
    // Fetch transactions on page load
    fetchTransactions();
  });
  