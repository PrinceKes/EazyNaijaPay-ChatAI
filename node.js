// const express = require("express");
// const cors = require("cors");
// const bodyParser = require("body-parser");
// const fetch = require("node-fetch");

// const app = express();

// app.use(cors());
// app.use(bodyParser.json());

// // Constants
// const AIRTIME_API_URL = "https://www.husmodata.com/api/topup/";
// const DATA_API_URL = "https://www.husmodata.com/api/data/";
// const AUTH_TOKEN = "1b4b2afd4ef0f22d082ebaf6c327de30ea1b6bcf";

// // Airtime Top-Up Proxy
// app.post("/proxy/topup", async (req, res) => {
//     try {
//       const response = await fetch(API_URL, {
//         method: "POST",
//         headers: {
//           "Authorization": `Token ${AUTH_TOKEN}`,
//           "Content-Type": "application/json",
//         },
//         body: JSON.stringify(req.body),
//       });
  
//       const data = await response.json();
//       console.log("Husmodata API Response:", data);
  
//       if (data.Status === "successful") {
//         const { User_id, amount } = req.body;
  
//         // Log the transaction
//         await logTransaction({ ...data, User_id });
  
//         // Deduct balance
//         const updateBalanceResult = await updateUserBalance(User_id, parseFloat(amount));
//         if (!updateBalanceResult.success) {
//           console.error(`Error updating balance for User_id: ${User_id}`);
//         }
//       }
  
//       res.status(response.status).json(data);
//     } catch (error) {
//       console.error("Error in proxy:", error);
//       res.status(500).json({ error: "Failed to fetch data from API." });
//     }
//   });
  



// // Data Purchase Proxy
// app.post("/proxy/data", async (req, res) => {
//     try {
//         const response = await fetch(DATA_API_URL, {
//             method: "POST",
//             headers: {
//                 "Authorization": `Token ${AUTH_TOKEN}`,
//                 "Content-Type": "application/json",
//             },
//             body: JSON.stringify(req.body),
//         });

//         // Parse and send the response back
//         const data = await response.json();
//         console.log("Husmodata API Response (Data Purchase):", data); // Log API response
//         res.status(response.status).json(data);
//     } catch (error) {
//         console.error("Error in Data Purchase Proxy:", error);
//         res.status(500).json({ error: "Failed to fetch data from API." });
//     }
// });

// // Start Server
// const PORT = process.env.PORT || 5000;
// app.listen(PORT, () => {
//     console.log(`Server running on port ${PORT}`);
// });








const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
const fetch = require("node-fetch");

const app = express();

app.use(cors());
app.use(bodyParser.json());

// Constants
const AIRTIME_API_URL = "https://www.husmodata.com/api/topup/";
const DATA_API_URL = "https://www.husmodata.com/api/data/";
const AUTH_TOKEN = "1b4b2afd4ef0f22d082ebaf6c327de30ea1b6bcf";

// Airtime Top-Up Proxy
app.post("/proxy/topup", async (req, res) => {
    try {
        const response = await fetch(AIRTIME_API_URL, {
            method: "POST",
            headers: {
                "Authorization": `Token ${AUTH_TOKEN}`,
                "Content-Type": "application/json",
            },
            body: JSON.stringify(req.body),
        });

        const data = await response.json();
        console.log("Husmodata API Response (Top-Up):", data); // Log API response
        res.status(response.status).json(data);
    } catch (error) {
        console.error("Error in Top-Up Proxy:", error);
        res.status(500).json({ error: "Failed to fetch data from API." });
    }
});

// Data Purchase Proxy
app.post("/proxy/data", async (req, res) => {
    try {
        const response = await fetch(DATA_API_URL, {
            method: "POST",
            headers: {
                "Authorization": `Token ${AUTH_TOKEN}`,
                "Content-Type": "application/json",
            },
            body: JSON.stringify(req.body),
        });

        // Parse and send the response back
        const data = await response.json();
        console.log("Husmodata API Response (Data Purchase):", data); // Log API response
        res.status(response.status).json(data);
    } catch (error) {
        console.error("Error in Data Purchase Proxy:", error);
        res.status(500).json({ error: "Failed to fetch data from API." });
    }
});

// Start Server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});









// {
//     "User_id": "1446675700"
//     "Transaction_Type": "Top-Up"
//     "Amount": 100
//     "mobile_number": "08072975168"
//     "Status": "successful"
//     "Reference": "Airtime10c36dcedd-24c"
//     "CreatedAt": "2025-01-07T03:19:01.473Z"
// }