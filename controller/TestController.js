const express = require('express');
const port = process.env.PORT;
const url = process.env.auth_url;
const consumerKey = process.env.consumer_key;
const consumerSecret = process.env.consumer_secret;
const ipnurl = process.env.PESAPAL_DEMO_URL;
const callbackurl = process.env.callback_url;


const getToken = async(req,res)=>{
    try {
        const headers = {
            'Content-Type': 'application/json',
            'Accept':'application/json'
        }
        const body = {
            consumer_key:consumerKey,
            consumer_secret:consumerSecret

        }

        const response = await axios.post(url,body,{headers})
        return response.data.token
        
    } catch (error) {
        console.log(error)
        
    }
}


//register a new ipn
const registerIpn = async()=>{
    try {
        const headers = {
            'Authorization':`Bearer ${accessToken}`,
            'Content-Type':'application/json',
            'Accept':'application/json'
        }

        const body = {
            url:callbackurl,
            ipn_notification_type:'POST',
        }
        

        const response = await axios.post(ipnurl,body,{headers})
        const ipn_id = response.data.ipn_id;
        return ipn_id;
        
    } catch (error) {
        console.log("error registering IPN",error)
        
    }
}

const orderDetails = {

}

const submitOrderRequest = async(orderDetails)=>{
    console.log(orderDetails)
    try {
        const accessToken = await getToken();
        console.log(accessToken);

        const my_ipn_id = registerIpn(accessToken);

        const orderUrl = ""

        const headers = {
            'Authorization':`Bearer ${accessToken}`,
            'Content-Type':'application/json',
            'Accept':'application/json'
        }

        const body = {
            // body here from order details
        }

        const response = await axios.post(orderUrl,body,{headers});
        console.log("Order submitted", response.data);
        return response.data;
        
    } catch (error) {
        console.log(error)
        
    }
}