const crypto = require('crypto');

// Generate a 256-bit (32 bytes) encryption key and a 16-byte IV (initialization vector).
const encryptionKey = Buffer.from('6ad0c626d10877a8074ca27067b1b8df51e024fbeb47f26b8f2dfa19b289b2ad', 'hex');
const iv = Buffer.from("29ee3ac3c38483c67874d899ce42b4b1", 'hex')

exports.encryptData = (datapiece) => {
    const cipher = crypto.createCipheriv('aes-256-cbc', encryptionKey, iv);
    let encrypted = cipher.update(datapiece, 'utf8', 'hex');
    encrypted += cipher.final('hex');
    return encrypted;
}

// Decrypt datapiece function
exports.decryptData = (encryptedData) => {
    const decipher = crypto.createDecipheriv('aes-256-cbc', encryptionKey, iv);
    let decrypted = decipher.update(encryptedData, 'hex', 'utf8');
    decrypted += decipher.final('utf8');
    return decrypted;
}

