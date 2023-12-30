const axios = require('axios');
const crypto = require('crypto');
require("dotenv").config();

const url = 'https://sbpaymentservices.payfort.com/FortAPI/paymentApi';

const { ACCESS_CODE, MERCHANT_IDENTIFIER, REQUEST_PHRASE } = process.env;

const requestParams = {
    service_command: 'SDK_TOKEN',
    access_code: ACCESS_CODE,
    merchant_identifier: MERCHANT_IDENTIFIER,
    language: 'en',
    device_id: 'ffffffff-a9fa-0b44-7b27-29e70033c587',
};

const generateSignature = (requestParams, requestPhrase) => {
    const sortedParams = Object.keys(requestParams).sort().reduce((acc, key) => {
        console.log(`acc: ${JSON.stringify(acc)} } key: ${key}`)
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
