exports.generateOTP = () => { 
    let digits = '0123456789'; 
    let OTP = ''; 
    let len = digits.length 
    for (let i = 0; i < 5; i++) { 
        OTP += digits[Math.floor(Math.random() * len)]; 
    } 
     
    return OTP; 
} 