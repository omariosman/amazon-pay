const axios = require('axios');
const crypto = require('crypto');
require("dotenv").config();

const url = 'https://sbpaymentservices.payfort.com/FortAPI/paymentApi';

const { ACCESS_CODE, MERCHANT_IDENTIFIER, REQUEST_PHRASE } = process.env;

const requestParams = {
    command: 'AUTHORIZATION',
    access_code: ACCESS_CODE,
    merchant_identifier: MERCHANT_IDENTIFIER,
    merchant_reference: 'XYZ9239-yu898',
    amount: '100',
    currency: 'EGP',
    language: 'en',
    customer_email: 'elsayedzaki24@gmail.com',
    order_description: 'test',
    payment_option: 'VISA',
    card_number: '4005550000000001'
    // device_id: 'ffffffff-a9fa-0b44-7b27-29e70033c587',
};
// print the request params as a json object
// console.log(JSON.stringify(requestParams, null, 2) + '\n\n');

const generateSignature = (requestParams, requestPhrase) => {
    const sortedParams = Object.keys(requestParams).sort().reduce((acc, key) => {
        // console.log(`acc: ${JSON.stringify(acc)} } key: ${key}`)
        acc[key] = requestParams[key];
        return acc;
    }, {});

    const concatenatedParams = Object.entries(sortedParams)
        .map(([key, value]) => `${key}=${value}`)
        .join('');

    const signatureString = `${REQUEST_PHRASE}${concatenatedParams}${REQUEST_PHRASE}`;

    const signature = crypto.createHash('sha256').update(signatureString).digest('hex');

    return signature;

}

const generatedSignature = generateSignature(requestParams, REQUEST_PHRASE);
requestParams.signature = generatedSignature;

axios.post(url, requestParams)
    .then(response => {
        console.log(JSON.stringify(response.data, null, 2) + '\n\n');
    })
    .catch(error => {
        console.error(error);
    });
