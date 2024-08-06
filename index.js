const express = require("express");
const app = express();
const axios = require("axios");
const cors = require("cors");
require("dotenv").config();

app.use(express.json());
app.use(cors());
app.use(express.static("public"));
app.use(express.urlencoded({ extended: true }));

//routres

const paymentRoute = require('./routes/PaymentRoutes')

//get data from env variables
if (process.env.NODE_ENV !== "PRODUCTION") {
  require("dotenv").config({
    path: "./.env",
  });
}

const port = process.env.PORT;
const url = process.env.auth_url;
const consumerKey = process.env.consumer_key;
const consumerSecret = process.env.consumer_secret;



app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});

app.get("/", (req, res) => {
  res.send("Welcome to my payment gateway");
});

//register/athenticate url to issue auth token
// app.post("/requesttoken", async (req, res) => {
//   try {
//     //prepare api headers
//     const headers = {
//       "Content-Type": "application/json",
//       Accept: "application/json",
//     };

//     //prepare the body
//     const body = {
//       consumer_key: consumerKey,
//       consumer_secret: consumerSecret,
//     };

//     //prepare api response
//     const response = await axios.post(url, body, { headers });
//     console.log(response.data);
//     //return response to the client
//     res.json(response.data);
//   } catch (error) {
//     console.log(error);
//     if(error.response){
//         console.log("error response data",error.response.data);
//         // console.log("reponse error status",response.error.status);
//         // res.status(response.error.status);
//     }
//   }
// });


// Endpoint to register IPN URL
// app.post('/register-ipn', async (req, res) => {
//     const url = 'https://cybqa.pesapal.com/pesapalv3/api/URLSetup/RegisterIPN';
//     const { accessToken, ipnUrl, ipnReference } = req.body; // Get these from the client request
  
//     try {
//       // Set up the request headers
//       const headers = {
//         'Authorization': `Bearer ${accessToken}`,
//         'Content-Type': 'application/json',
//         'Accept': 'application/json',
//       };
  
//       // Set up the request body
//       const body = {
//         url: ipnUrl,
//         ipn_reference: ipnReference,
//       };
  
//       // Make the Axios request
//       const response = await axios.post(url, body, { headers });
  
//       // Send the response data to the client
//       res.json(response.data);
//     } catch (error) {
//       console.error('Error:', error);
//       if (error.response) {
//         console.error('Response error data:', error.response.data);
//         console.error('Response error status:', error.response.status);
//         res.status(error.response.status).send(error.response.data);
//       } else {
//         res.status(500).send('Internal Server Error');
//       }
//     }
//   });


  app.use('/api/v1/payment',paymentRoute);
