const db = require('../models')
const User = db.User
const TempOTP = db.TempOTP
const { encryptData } = require('../utils/dataSecurity.util');
const { generateOTP } = require('../utils/generateOTP.util');
const jwt = require("jsonwebtoken");

exports.SignUpWithOTP = async (req, res) => {
    const { emailId } = req.body;
    if (!emailId) {
        return res.status(200).json({ success: false, message: "Please provide all the required details" });
    }
    const genOTP = generateOTP()
    //check the user if any user with this email exists
    const checkUser = await User.findOne({ where: { emailId: emailId } });
    if (checkUser) {
        return res.status(400).json({ success: false, message: "user already exists, please login" });
    }
    //check if any otp already generated for this email
    const encryptEmail = encryptData(emailId);
    const checkOtpExists = TempOTP.findOne({ where: { emailId: encryptEmail } });
    if (checkOtpExists) {
        TempOTP.destroy({ where: { emailId: encryptEmail } });
        console.log("OTP deleted successfully")
    }
    try {
        await TempOTP.create({ emailId: encryptEmail, otpCode: genOTP, created: new Date(), expiry: new Date(Date.now() + 2 * 60 * 1000) });
        console.log(genOTP)
        res.status(201).json({ success: false, message: "OTP Sent successfully", otp: genOTP });
    } catch (error) {
        res.status(500).json({ success: false, message: "Error Occured" });
    }

}

//For Signup
exports.validateOTPAndCreateUser = async (req, res) => {
    const { emailId, name, recievedOtp } = req.body;
    console.log(req.body)
    const encryptEmail = encryptData(emailId);
    const checkOtp = await TempOTP.findOne({ where: { emailId: encryptEmail } });

    if (!checkOtp) {
        return res.status(500).json({ success: false, message: "Error occured" })
    }

    if (checkOtp.otpCode !== recievedOtp) {
        return res.status(200).json({ success: false, message: "Wrong OTP" })
    }

    if (checkOtp.expiry < new Date()) {
        return res.status(400).json({
            success: false,
            message: "OTP expired",
        });
    }

    if (checkOtp.otpCode === recievedOtp) {
        await TempOTP.destroy({ where: { emailId: encryptEmail } });
        try {
            const newUser = await User.create({
                name: name,
                emailId: emailId,
                primaryLogIn: 2
            })
            const data = {
                user: {
                    id: newUser.id
                }
            }
            const token = jwt.sign(data, "jwt67689797979");
            console.log("User created")
            return res.status(201).json({ success: true,token:token, message: "OTP verified and user created" });

        } catch (error) {
            console.log(error)
            return res.status(500).json({ success: false, message: "Error occured" })
        }
    }
}



exports.LoginWithOtp = async (req, res) => {
    const { emailId } = req.body;
    if (!emailId) {
        return res.status(200).json({ success: false, message: "Please provide all the required details" });
    }
    const genOTP = generateOTP()
    const checkUser = await User.findOne({ where: { emailId: emailId } });
    if (!checkUser) {
        return res.status(400).json({ success: false, message: "user doesn't exists, please Signup" });
    }
    const encryptEmail = encryptData(emailId);
    const checkOtpExists = TempOTP.findOne({ where: { emailId: encryptEmail } });
    if (checkOtpExists) {
        TempOTP.destroy({ where: { emailId: encryptEmail } });
    }
    try {
        await TempOTP.create({ emailId: encryptEmail, otpCode: genOTP, created: new Date(), expiry: new Date(Date.now() + 2 * 60 * 1000) });
        console.log(genOTP)
        res.status(201).json({ success: false, message: "OTP Sent successfully", otp: genOTP });
    } catch (error) {
        res.status(500).json({ success: false, message: "Error Occured" });
    }

}
exports.validateOTPForLogin = async (req, res) => {
    const { emailId, recievedOtp } = req.body;
    console.log(req.body)
    const encryptEmail = encryptData(emailId);
    const checkOtp = await TempOTP.findOne({ where: { emailId: encryptEmail } });
    console.log("Checked Otp is " + checkOtp);
    if (!checkOtp) {
        return res.status(500).json({ success: false, message: "Error occured" })
    }

    if (checkOtp.otpCode !== recievedOtp) {
        return res.status(200).json({ success: false, message: "Wrong OTP" })
    }

    if (checkOtp.expiry < new Date()) {
        return res.status(400).json({
            success: false,
            message: "OTP expired",
        });
    }

    if (checkOtp.otpCode === recievedOtp) {
        await TempOTP.destroy({ where: { emailId: encryptEmail } });
        try {
            const user = await User.findOne({ where: { emailId: emailId } });
            console.log("User created")
            if (user) {

                const data = {
                    user: {
                        id: user.id
                    }
                }
                const token = jwt.sign(data, "jwt67689797979");
                return res.status(201).json({ success: true, token: token, message: "OTP verified and user found" });
            }


        } catch (error) {
            console.log(error)
            return res.status(500).json({ success: false, message: "Error occured" })
        }
    }
}

