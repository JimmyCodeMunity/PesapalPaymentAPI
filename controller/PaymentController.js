//credentials

const { default: axios } = require("axios");

const port = process.env.PORT;
const url = process.env.auth_url;
const consumerKey = process.env.consumer_key;
const consumerSecret = process.env.consumer_secret;
const ipnurl = process.env.PESAPAL_DEMO_URL;
const callbackurl = process.env.callback_url;

let ipn_iD = "";

//get access token
const getToken = async (req, res) => {
  try {
    const headers = {
      "Content-Type": "application/json",
      Accept: "application/json",
    };
    const body = {
      consumer_key: consumerKey,
      consumer_secret: consumerSecret,
    };

    //handle request
    const response = await axios.post(url, body, { headers });

    const accessToken = response.data.token;
    console.log(response.data.token);
    return response.data.token;
  } catch (error) {
    console.log("error ocurred while getting token", error);
  }
};

//register ipn
const registerIPN = async (accessToken) => {
//   const accessToken = await getToken();
  //   try {
  const headers = {
    Authorization: `Bearer ${accessToken}`,
    "Content-Type": "application/json",
    Accept: "application/json",
  };
  const body = {
    url: callbackurl,
    ipn_notification_type: "POST",
  };
  const response = await axios.post(ipnurl, body, { headers });
  console.log("IPN registered successfully", response.data);
  
//   const createddata = response.data.created_date;
  const ipn_id = response.data.ipn_id;
  
//   const status = response.data.status;
  await getIpnLists(accessToken);
  return ipn_id;
  //   } catch (error) {
  //     console.log("error occurred while registering IPN", error);
  //   }
};

// Correcting the function to get IPN lists
const getIpnLists = async (accessToken) => {
    try {
      const ipnListUrl = "https://cybqa.pesapal.com/pesapalv3/api/URLSetup/GetIpnList";
      const headers = {
        Authorization: `Bearer ${accessToken}`,
        "Content-Type": "application/json",
        Accept: "application/json",
      };
  
      // Send a GET request with headers, not with a body
      const response = await axios.get(ipnListUrl, { headers });
  
      console.log("IPN lists retrieved", response.data);
    } catch (error) {
      console.log("Error occurred while getting IPN lists", error);
    }
  };
  

const handleCallback = async (req, res, response) => {
  console.log(response.data);
  res.send("callback active");
};

const getRandomNumber = ()=>{
    return Math.floor(Math.random() * 1000000);
  
}



const orderDetails = {
    id: getRandomNumber(), // Replace with your transaction ID
    currency: "KES", // Replace with your currency code
    amount: "1.00", // Replace with your amount
    description: "Order payment", // Replace with your description
    email: "customer@example.com", // Replace with customer's email
    phone: "254112163919", // Replace with customer's phone number
    countryCode: "KE", // Replace with customer's country code
    firstName: "John", // Replace with customer's first name
    middleName: "Doe", // Replace with customer's middle name
    lastName: "Smith", // Replace with customer's last name
    addressLine1: "123 Street", // Replace with address line 1
    addressLine2: "", // Replace with address line 2 (if any)
    city: "Nairobi", // Replace with customer's city
    state: "", // Replace with customer's state (if any)
    postalCode: "00100", // Replace with customer's postal code
    zipCode: "00100", // Replace with customer's zip code
  };

  const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

//submit order request
const submitOrderRequest = async () => {
    console.log(orderDetails);
    try {
      // Ensure you have the access token
      const accessToken = await getToken();
      console.log("token",accessToken)
    //   await registerIPN(accessToken);
      const myipn_id = await registerIPN(accessToken);
      console.log('generated',myipn_id)
    //   return
  
      // Define the endpoint URL for order submission
      const orderUrl = "https://cybqa.pesapal.com/pesapalv3/api/Transactions/SubmitOrderRequest";
  
      // Set up the headers
      const headers = {
        Authorization: `Bearer ${accessToken}`,
        "Content-Type": "application/json",
        Accept: "application/json",
      };
  
      // Prepare the body with order details
      const body = {
        // Populate these fields with actual data from your application
        id: orderDetails.id, // Unique identifier for the transaction
        currency: orderDetails.currency, // e.g., "KES"
        amount: orderDetails.amount, // e.g., "1000.00"
        description: orderDetails.description, // e.g., "Order payment"
        callback_url: process.env.callback_url, // Callback URL for notifications
        notification_id:myipn_id,
        billing_address: {
          email_address: orderDetails.email, // Customer's email address
          phone_number: orderDetails.phone, // Customer's phone number
          country_code: orderDetails.countryCode, // e.g., "KE"
          first_name: orderDetails.firstName, // Customer's first name
          middle_name: orderDetails.middleName, // Customer's middle name
          last_name: orderDetails.lastName, // Customer's last name
          line_1: orderDetails.addressLine1, // Address line 1
          line_2: orderDetails.addressLine2, // Address line 2 (optional)
          city: orderDetails.city, // Customer's city
          state: orderDetails.state, // Customer's state (optional)
          postal_code: orderDetails.postalCode, // Customer's postal code
          zip_code: orderDetails.zipCode, // Customer's zip code
        },
      };
  
      // Send the POST request
      const response = await axios.post(orderUrl, body, { headers });
  
      // Log the response data
      console.log("Order submitted successfully", response.data);
      return response.data;
    } catch (error) {
      console.log("Error occurred while submitting order", error);
    }
  };

module.exports = {
  getToken,
  handleCallback,
  submitOrderRequest,

  registerIPN,
};
