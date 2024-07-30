// // import fs from 'fs';
// import crypto from 'crypto';
// import paymentIntentModel from './models/paymentIntentModel';
// // import { CustomerId } from './config/config';


// import fs from 'fs';
import crypto from 'crypto';
// import { CustomerId } from './config/config';

// Function to generate a random integer
function getRandomInt(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

// Function to generate a random email ID
function generateRandomEmail() {
    const randomString = crypto.randomBytes(5).toString('hex');
    return `${randomString}@example.com`;
}

// Function to generate a random name
function generateRandomName() {
    const names = ['Alice', 'Bob', 'Charlie', 'David', 'Eve'];
    return names[Math.floor(Math.random() * names.length)];
}

// Generate dynamic data for the first payload
// const emailId = generateRandomEmail();
const numberOfTokens = getRandomInt(1, 10); // Random number of tokens between 1 and 10
const amount = 1; // $1 per token
const integraPublicKeyId = "integra-pubKey2" // Random public key ID

 const emailId = '1c8b1d1254@example.com'

const payload4 = {
    emailId,
    numberOfTokens,
    amount,
    integraPublicKeyId,
    paymentMethodId :"pm_1Pi9tcB49VjnIsx404egmqt7"
};

// Encode payloads using Base64
// const encodedPayload1 = Buffer.from(JSON.stringify(payload1)).toString('base64');
// const encodedPayload2 = Buffer.from(JSON.stringify(payload2)).toString('base64');
// const encodedPayload3 = Buffer.from(JSON.stringify(payload3)).toString('base64');
const encodedPayload4 = Buffer.from(JSON.stringify(payload4)).toString('base64');

// Save encoded payloads to files
// fs.writeFileSync('encodedPayload1.txt', encodedPayload1);
// fs.writeFileSync('encodedPayload2.txt', encodedPayload2);

// console.log('Encoded payload 1 saved to encodedPayload1.txt');
// console.log('Encoded payload 2 saved to encodedPayload2.txt');
// console.log('Encoded Payload 1 customer:', encodedPayload1);
// console.log("");
// console.log('Encoded Payload 2 list payment methods:', encodedPayload2);
// console.log("");
// console.log('Encoded Payload 3: attach payment ', encodedPayload3);
console.log("");
console.log('Encoded Payload 4: create payment ', encodedPayload4);