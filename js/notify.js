// Fetch transactions from the endpoint and display them
async function fetchAndDisplayTransactions() {
    const url = "https://eazynaijapay-server.onrender.com/transactions";
  
    try {
      const response = await fetch(url);
      const data = await response.json();
  
      // Check if the response is successful
      if (data.success) {
        const transactions = data.transactions;
        const notificationsContainer = document.getElementById("notifications-container");
  
        // Clear any previous content
        notificationsContainer.innerHTML = "";
  
        // Iterate over transactions and add to the container
        transactions.forEach((transaction) => {
          const status = transaction.Status || "N/A";
          const planAmount = transaction.plan_amount || "N/A";
          const mobileNumber = transaction.mobile_number || "N/A";
          const createDate = transaction.create_date
            ? new Date(transaction.create_date).toLocaleString()
            : "N/A";
          const customerRef = transaction.customer_ref || "N/A";
  
          // Mask the mobile number
          const maskedMobileNumber =
            mobileNumber.substring(0, 4) +
            "****" +
            mobileNumber.substring(mobileNumber.length - 3);
  
          // Create the notification HTML
          const notificationHTML = `
            <div class="notification">
              <h4>Airtime Purchase Successful</h4>
              <p>A User has bought ${planAmount} Airtime worth for ${maskedMobileNumber}</p>
              <span>${createDate}</span>
              <span id="reference">${customerRef}</span>
            </div>
          `;
  
          // Append to the notifications container
          notificationsContainer.innerHTML += notificationHTML;
        });
      } else {
        console.error("Failed to fetch transactions:", data.message);
      }
    } catch (error) {
      console.error("Error fetching transactions:", error);
    }
  }
  
  // Call the function when the page loads
  document.addEventListener("DOMContentLoaded", fetchAndDisplayTransactions);
  