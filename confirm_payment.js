// import { CustomerId } from "./config/config";

const payload4 = {
    paymentId:'pi_3PglUXB49VjnIsx40xgatUAU',
    paymentMethodId:'pm_1PgkwnB49VjnIsx4NXaJjO98'
};

const encodedPayload4 = Buffer.from(JSON.stringify(payload4)).toString('base64');

console.log("");
console.log('Encoded Payload 4: create payment ', encodedPayload4);


const payload5 = {
    paymentId:'pi_3PglUXB49VjnIsx40xgatUAUa',
};


const encodedPayload5 = Buffer.from(JSON.stringify(payload5)).toString('base64');

console.log("");
console.log('Encoded Payload 4: payment id encoded ', encodedPayload5);



const customerIdPayload = {
    customerIda:'cus_QXqcuuvMc0W7YQa',
};



const encodedcustomerIdPayload = Buffer.from(JSON.stringify(customerIdPayload)).toString('base64');

console.log("");
console.log('Encoded Payload 6: cusotmer d encoded ', encodedcustomerIdPayload);



const emailIdPayload = {
    emailId:'8e4f6dc551@example.comq',
};



const encodedemailIdPayload = Buffer.from(JSON.stringify(emailIdPayload)).toString('base64');

console.log("");
console.log('Encoded Payload 6: email d encoded ', encodedemailIdPayload);