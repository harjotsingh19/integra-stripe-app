import bcrypt from 'bcryptjs';

const salt = bcrypt.genSaltSync(10);
const hash = bcrypt.hashSync('B4c0//', salt);

const encryptPassword = (password) => new Promise((resolve, reject) => {
    bcrypt.hash(password, hash, (err, pwHash) => {
        if (err) {
            reject(new Error(err))
        };
        resolve(pwHash);
    });
});

const comparePassword = ({ plainPassword, hashPassword }) => new Promise((resolve, reject) => {
    console.log("🚀 ~ comparePassword ~ hashPassword:", hashPassword)
    console.log("🚀 ~ comparePassword ~ plainPassword:", plainPassword)
    // Load hash from the db, which was previously stored
    bcrypt.compare(plainPassword, hashPassword, (err, res) => {
        
        if (err) {
            console.log(err);
            reject(new Error(err));   
        }
        resolve(res);
    });
});

export {
    encryptPassword,
    comparePassword
}