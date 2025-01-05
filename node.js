const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
const fetch = require("node-fetch");

const app = express();

app.use(cors());
app.use(bodyParser.json());

const API_URL = "https://www.husmodata.com/api/data/";
const AUTH_TOKEN = "bab528e3b6653c6eb7809b56f6c83bcaf25bb5ec";

app.post("/proxy/topup", async (req, res) => {
    console.log("Incoming Request to Proxy:", req.body);  // Log the incoming request body

    try {
        const response = await fetch(API_URL, {
            method: "POST",
            headers: {
                "Authorization": `Token ${AUTH_TOKEN}`,
                "Content-Type": "application/json",
            },
            body: JSON.stringify(req.body),
        });

        const data = await response.json();
        console.log("Husmodata API Response:", data); // Log the response from the API
        res.status(response.status).json(data);
    } catch (error) {
        console.error("Error in proxy:", error);
        res.status(500).json({ error: "Failed to fetch data from API." });
    }
});



const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});








// const express = require("express");
// const cors = require("cors");
// const bodyParser = require("body-parser");
// const fetch = require("node-fetch");

// const app = express();

// app.use(cors());
// app.use(bodyParser.json());

// const API_URL = "https://www.husmodata.com/api/topup/";
// const AUTH_TOKEN = "bab528e3b6653c6eb7809b56f6c83bcaf25bb5ec";

// app.post("/proxy/topup", async (req, res) => {
//     try {
//         const response = await fetch(API_URL, {
//             method: "POST",
//             headers: {
//                 "Authorization": `Token ${AUTH_TOKEN}`,
//                 "Content-Type": "application/json",
//             },
//             body: JSON.stringify(req.body),
//         });

//         const data = await response.json();
//         console.log("Husmodata API Response:", data); // Log API response
//         res.status(response.status).json(data);
//     } catch (error) {
//         console.error("Error in proxy:", error);
//         res.status(500).json({ error: "Failed to fetch data from API." });
//     }
// });


// const PORT = process.env.PORT || 5000;
// app.listen(PORT, () => {
//     console.log(`Server running on port ${PORT}`);
// });
