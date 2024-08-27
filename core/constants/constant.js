


const messages = {
    // A
    amountNotFound:"Please enter valid amount",
    authenticationTokenFailure:"Error getting authentication token",
    // B
    // C
    customerCreated: "customer created",
    customernotCreated:"customer not created",
    customerFound:"customer already exists with this emailId",
    customerNotFound:"customer not found",
    customerNotFoundWithEmail: "provided customerId does not match the associated emailId",
    // D
    dataNotFound: 'Data not found.',
    dataFound: 'Data found successfully.',
    // E
    emailRequired:"emailId is required",
    emailNotFound:
        'No registered user with this email',
    emailAlreadyExists: 'User with email already exists.',
    enterRequiredData:"Required data",
    // F
    firstTimeSubscription:"No previous renewal found ,its a first time subscription",
    // G
    // H
    // I
    incorrectEmail: 'Incorrect Email.',
    internalServerError:'Internal Server Error',
    integraPublicKeyIdNotFound:"integra public key not valid",
    invoiceFalseStatus:"invoice paid status is false , tokens will be added later, once paymen tis confirmed",
    // J
    // K
    // L
   
    logoutSuccess: 'User logout successfully.',
    loginSuccess: 'User login successfully.',
    // M
    // N
    // O
 

    // P
    paymentAttached: "payment attached",
    paymentMethodNotAttach:"payment method not attached",
    paymentRequiredAction:"payment requires additional actions",
    paymentReadyToConfirmed:"payment is ready to be confirmed",
    paymentMethodFound:"payment methods found",
    paymentType: 'card',
    paymentSuccess:"Payment completed successfully",
    paymentfailed:"Payment failed",
    paymentFurtherAction:"Payment requires further action",
    paymentCanceled:"payment canceled",
    paymentProcessing:'Payment is currently being processed',
    paymentFailed:"payment failed",
    paymentFound:"payment found",
    paymentNotFound:"payment not found",
    priceIdNotFound:"priceId not valid",
    plansFound:"subscription plans found",
    plansNotFound:"no subscription plans found",
    // Q
    // R
    renewalDataNotFound:"no renewal data found in db",
    // S
    subscriptionCreated:"subscription created successfully",    
    subscriptionAlreadyRenewed:"subscription already renewed",
    subscriptionNotFoundWithSession:"No session found with this subscription Id",
    subscriptionPlanNotFound:"subscription plan not found",
    // T

    tokenNotFound:"token for card details not found",
    tokensNumbersValid:"number of tokens should be a positive number",
    tokenAdded:"tokens added to integra public key",
    tokenNotAdded:"failed to add tokens",
    tokenPriceFound:"token price found",
    tokenPriceNotFound:"token price not found",
    tokensAlreadyAdded:"tokens already credited",
    tokenCreditAfterInvoice:"token will be added after invoice status becomes paid",
    // U
    userNotRegistered: "No registered user",
    urlredirected:"redirection url",
    // V
    VersionFetched:"versions fetched successfully",
    VersionNotFetched:"versions not found",
    // W
    // X
    // Y
    // Z
    //
};

const statusCode = {
    ok: 200,
    created: 201,
    accepted: 202,
    found: 302,
    badRequest: 400,
    unAuthorized: 401,
    noContent: 204,
    forbidden: 403,
    errorPage: 404,
    serverError: 500,
}

const responseStatus = {
    success: 1,
    failure: 0
}


export {
    messages,
    statusCode,
    responseStatus,
   
}


