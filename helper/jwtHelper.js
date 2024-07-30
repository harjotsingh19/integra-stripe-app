import jwt from 'jsonwebtoken';

const jwtSign = (user, secret, expires) => new Promise((resolve, reject) => {
    console.log("🚀 ~ jwtSign ~ secret:", secret)
    
    const payload = { id: user._id };
    const options = {
        expiresIn: expires,
    };
    jwt.sign(payload, secret, options, (err, data) => {
        if (err) reject(new Error(err));
        resolve(data);
    });
});

const jwtVerify = (token, secret) => new Promise((resolve, reject) => {
    jwt.verify(token, secret, (err, data) => {
        if (err) reject(new Error(err));
        resolve(data);
    });
});

export {
    jwtSign,
    jwtVerify,
}