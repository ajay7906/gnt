


// const express = require('express');
const axios = require('axios');
const crypto = require('crypto');
//const cors = require("cors");
// const { v4: uuidv4 } = require('uuid');

// const app = express();
// app.use(express.json());
// app.use(cors());

// Constants
const MERCHANT_KEY = "f778d572-37b5-469a-aaec-8bce837a28f7";
const MERCHANT_ID = "GNTONLINE";
//const MERCHANT_KEY = "7f4c7cf2-bf4d-4ad6-9c57-7306393e966c";
// const MERCHANT_ID = "M22ZKINBPY7OU";
const MERCHANT_BASE_URL = "https://api.phonepe.com/apis/hermes/pg/v1/pay";
const MERCHANT_STATUS_URL = "https://api.phonepe.com/apis/hermes/pg/v1/status";


const redirectUrl="https://gntindia.com:5000/api/v1/payment/status"

const successUrl="http://localhost:5173/payment-success"
const failureUrl="http://localhost:5173/payment-failure"

// Helper function to generate checksum
const generateChecksum = (payload, endpoint) => {
    const keyIndex = 1;
    const string = payload + endpoint + MERCHANT_KEY;
    const sha256 = crypto.createHash('sha256').update(string).digest('hex');
    return sha256 + '###' + keyIndex;
};

















exports.createPayment = async (req, res) => {





    try {
        const { name, mobileNumber, amount } = req.body;

        // Input validation
        if (!name || !mobileNumber || !amount) {
            return res.status(400).json({ error: 'Missing required fields' });
        }

        const orderId = crypto.randomUUID();

        const paymentPayload = {
            merchantId: MERCHANT_ID,
            merchantUserId: `USER_${name.replace(/\s+/g, '_').toUpperCase()}`,
            merchantTransactionId: orderId,
            amount: Math.round(amount * 100), // Ensure amount is in paise and rounded
            redirectUrl: `${redirectUrl}/?id=${orderId}`,
            redirectMode: 'POST',
            callbackUrl: `${redirectUrl}/?id=${orderId}`,
            mobileNumber: mobileNumber.toString().replace(/\D/g, ''),
            paymentInstrument: {
                type: 'PAY_PAGE'
            }
        };

        const payload = Buffer.from(JSON.stringify(paymentPayload)).toString('base64');
        const checksum = generateChecksum(payload, '/pg/v1/pay');

        const response = await axios({
            method: 'POST',
            url: MERCHANT_BASE_URL,
            headers: {
                accept: 'application/json',
                'Content-Type': 'application/json',
                'X-VERIFY': checksum
            },
            data: {
                request: payload
            }
        });

        if (!response.data.success) {
            throw new Error(response.data.message || 'Payment initiation failed');
        }

        const paymentRedirectUrl = response.data.data.instrumentResponse.redirectInfo.url; // Renamed here
        res.status(200).json({ 
            success: true, 
            url: paymentRedirectUrl, // Use renamed variable
            merchantTransactionId: orderId 
        });

    } catch (error) {
        console.error("Payment Error:", error.response?.data || error.message);
        res.status(500).json({
            success: false,
            error: 'Failed to initiate payment',
            details: error.response?.data || error.message
        });
    }









};


exports.successPaymentControllers = async (req, res) =>{

    try {
        const merchantTransactionId = req.query.id;
        
        if (!merchantTransactionId) {
            return res.status(400).json({ error: 'Transaction ID is required' });
        }

        const checksum = generateChecksum('', `/pg/v1/status/${MERCHANT_ID}/${merchantTransactionId}`);

        const response = await axios({
            method: 'GET',
            url: `${MERCHANT_STATUS_URL}/${MERCHANT_ID}/${merchantTransactionId}`,
            headers: {
                accept: 'application/json',
                'Content-Type': 'application/json',
                'X-VERIFY': checksum,
                'X-MERCHANT-ID': MERCHANT_ID
            }
        });

        // Log the complete response for debugging
        console.log('Payment Status Response:', JSON.stringify(response.data, null, 2));

        if (response.data.success === true) {
            // Add additional payment verification checks here
            if (response.data.code === 'PAYMENT_SUCCESS') {
                return res.redirect(successUrl);
            }
        }
        
        return res.redirect(failureUrl);

    } catch (error) {
        console.error("Status Check Error:", error.response?.data || error.message);
        return res.redirect(failureUrl);
    }


}