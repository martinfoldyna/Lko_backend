const jwt = require('jsonwebtoken');

// module.exports = (token, secret) => {
//     return new Promise((resolve, reject) => {
//         jwt.verify(token, secret, {}, (err, tokenInfo) => {
//             if(tokenInfo){
//                 resolve(tokenInfo);
//             }
//             if (err) {
//                 reject(err);
//             }
//         });
//     })
// }
