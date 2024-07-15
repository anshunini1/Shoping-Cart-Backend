const JSEncrypt = require('nodejs-jsencrypt').default;
const privateKey =process.env.ENCRYPTED_KEY
var decrypt = new JSEncrypt()
decrypt.setPrivateKey(privateKey)
module.exports={
decryptText : async (encryptedText)=> {
    let serverGetData = await decrypt.decrypt(encryptedText)

    return serverGetData.toString("utf8");
}
}