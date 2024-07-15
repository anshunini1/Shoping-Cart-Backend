const crypto = require( 'crypto')
module.exports={
decryptText : (encryptedText)=> {
    const decrypted = crypto.privateDecrypt(
        {
            key: process.env.ENCRYPTED_KEY,
            passphrase: '',
        },
        Buffer.from(encryptedText, "base64")
    );
    return decrypted.toString("utf8");
}
}