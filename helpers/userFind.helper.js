const azureJWT = require('azure-jwt-verify');
const verifier = require('google-id-token-verifier');
const AuthorisedUser = require('./../models/authorisedUser.model');
require('dotenv').config();


module.exports.findUserByToken = (reqToken) => {
    return new Promise((resolve, reject) => {
        const splittedToken = reqToken.split(' ');
        const provider = splittedToken[1];
        const token = splittedToken[2];
        if(provider === "google") {

            let clientID = process.env.TOKEN_STRATEGY_GOOGLE;

            verifier.verify(token, clientID, function (err, tokenInfo) {
                if(tokenInfo) {
                    resolve({email: tokenInfo.email});
                } else {
                    reject('Nejste autorizován');

                }

            });
        } else if(provider === "microsoft") {
            let microsoftIss = process.env.TOKEN_STRATEGY_MICROSOFT_ISS;
            let microsoftUri = process.env.TOKEN_STRATEGY_MICROSOFT_URI;
            let microsoftAud = process.env.TOKEN_STRATEGY_MICROSOFT_AUD;
            azureJWT.verify(token, {JWK_URI: microsoftUri, ISS: microsoftIss,AUD: microsoftAud}).then(tokenResponse => {
                if(tokenResponse){
                    resolve(tokenResponse);
                }
            }).catch(err => {
                reject(err);
            });
        } else {
            reject('Během ověřování nastala chyba.');
        }
    })
}

module.exports.getUserInfoByToken = async function (token) {
    return new Promise((resolve, reject) => {
        this.findUserByToken(token).then(tokenInfo => {
            AuthorisedUser.findOne({email: tokenInfo.email}).then(user => {
                resolve(user)
            }).catch(err => reject(err));
        })
    })
}
