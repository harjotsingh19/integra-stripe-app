

const messages = {
    // A
    accountCreated: 'Congratulations, your account has successfully been created. Please sign in.',
    accountDeactivated: "User account deactivated! Account will be activated again once you logged in again",
    accountVerification: "User account verification",
    allOrderCancelled: "all orders cancelled",
    accountDeleted: "User account deleted",
    amountNotFound:"Please enter valid amount",
    // B
    // C
    customerCreated: "customer created",
    customerFound:"customer already exists with this emailId",
    customerNotFound:"customer not found",
    cancelUnexecutedOrder: "Cancel unexecuted order to proceed",
    // D
    dataNotFound: 'Data not found.',
    dataFound: 'Data found successfully.',
    deactivatedUser: "Deactivated account! login to reactivate",
    documentUploaded: "User document uploaded",
    // E
    emailVerified: 'Congratulations your email has been verified.',
    emailRequired:"emailId is required",
    emailNotFound:
        'No registered user with this email',
    emailAlreadyExists: 'User with email already exists.',
    emailSend: 'otp have been send to your registered email.',
    enterRequiredData:"Required data",
    // F
    // G
    // H
    // I
    incorrectEmail: 'Incorrect Email.',
    incorrectEmailOrPassword:
        'Incorrect email id or password. Please check and try again.',
    incorrectMobile: 'Incorrect Mobile',
    incorrectMobileOrPassword: 'Incorrect mobile or password. Please check and try again.',
    incorrectPassword: 'You have entered the wrong current password.',
    incorrectOtp: 'Otp is incorrect.',
    insufficientBalance: "insufficient balance",
    invalid2fa: "Invalid 2fa token",
    imageUploaded: 'Image has been uploaded.',
    imageUploadedFailed: 'Unable to upload image.',
    internalServerError:'Internal Server Error',
    // J
    // K
    kycCompleted: "User kyc completed",
    kycDocRequired: "KYC documents required",
    kycDone: "User kyc completed",
    kycInitiated: "User kyc initiated",
    kycNotInitiated: "kyc not initiated by user",
    kycRequired: "Complete kyc to create wallet",
    kycAlreadyCompleted: "kyc already verified",
    // L
    lockedProfile: "User profile is locked. contact support",
    logoutSuccess: 'User logout successfully.',
    loginSuccess: 'User login successfully.',
    // M
    mobileAlreadyExists: "User with mobile number already exists",
    mobileNotFound: "No registered user with this email",
    // N
    noUserFound: 'No User Found.',
    noUserWallet: "User wallet required",
    // O
 

    // P
    paymentAttached: "payment attached",
    paymentMethodNotAttach:"payment method not attached",
    paymentRequiredAction:"payment requires additional actions",
    paymentReadyToConfirmed:"payment is ready to be confirmed",
    paymentMethodFound:"payment methods found",
    passwordUpdated: 'Password updated successfully. Please log in again.',
    paymentType: 'card',
    paymentSuccess:"Payment completed successfully",
    paymentfailed:"Payment failed",
    paymentFurtherAction:"Payment requires further action",
    paymentCanceled:"payment canceled",
    paymentProcessing:'Payment is currently being processed',
    paymentFailed:"payment failed",
    paymentFound:"payment found",
    paymentNotFound:"payment not found",
    // Q
    // R
    // S
    sessionExpired: 'Your session has been expired. Please log in again.',
    signUpRequiredData: "Register with email or mobile",
    signUpSuccess:
        'An OTP has been sent to your registered email address, please use given OTP to veify your email address.',
    // T

    tokenNotFound:"token for card details not found",
    tokensNumbersValid:"number of tokens should be a positive number",
    tokenAdded:"tokens added successfully",
    tokenPriceFound:"token price found",
    tokenPriceNotFound:"token price not found",
    // U
    userNotFound: "No registered user",
    userNotVerified: 'User not verified',
    userVerified: 'User has been verified successfully.',
    unauthorizedUser: 'User is unauthorized.',
    userAlreadyVerified: 'User is already verified.',
    userUpdatedSuccess: 'User updated successfully.',
    userAlreadyExist: 'User already exist.',
    unexpectedError: "Something went wrong. try again later",
    userNotRegistered: "No registered user",
    urlredirected:"redirection url",
    // V
    VersionFetched:"versions fetched successfully",
    VersionNotFetched:"versions not found",
    // W
    walletCreated: "User wallet created",
    walletExists: "User wallet already exists",
    walletFound: "User Wallet Found",
    walletNotFound: "User wallet not found",
    // X
    // Y
    // Z
    //
    _2faDisabled: "2 factor authentication has been disabled",
    _2faEnabled: "2 factor authentication has been enabled",
    _2faTokenRequired: "2 fa token required",
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

const otpVerificationMsgSignup = (otp) => {
    return `Dear valued Debut trader,

    Your registration verification code is ${otp}. It is valid for 1 minute.
    
    For security purposes, please do not share this code with anyone.
    
    Regards,
    
    The Debut Team`;
};



const otpOperations = {
    emailVerification: 1,
    mobileVerification: 2,
    passwordReset: 3,
    google2fa: 8,
};

const idDocumentType = {
    ID: 1,
    PASSPORT: 2,
    DL: 3,
    RESIDENCE_PERMIT: 4,
    SELFIE: 5,
};

const orderStatus = {
    // OPEN STATUS
    OPEN: 1,
    PartiallyFilled: 2,
    // CLOSED STATUS
    Rejected: 3,
    PartiallyFilledCanceled: 4,
    Filled: 5,
    Cancelled: 6,
    insufficientBalance: 7,
}

const chainNetworks = {
    1: "mainnet",
    80002: "polygon-amoy",
    11155111: "sepolia",
    137: "polygon-mainnet"
}
export {
    messages,
    statusCode,
    responseStatus,
    otpVerificationMsgSignup,
    otpOperations,
    idDocumentType,
    orderStatus,
    chainNetworks
}


