const db = require('../models');
const User = db.User;

exports.getUserUsingToken = async(req,res) => {
    const userId = req.user.id;
    try {
        const user = await User.findOne({ where: { id: userId }, attributes: ["name", "bio", "emailId", "profilePic"] });
        if(!user){
            return res.status(404).json({success:false, message:"User not found"})
        }

        return res.status(200).json({success:true, user:user , message:"User Fetched successfully"})
    } catch (error) {
        return res.status(500).json({ success: false, message: "Internal server error" , error:error});
    }
}


exports.editUserProfile = async(req,res) => {
    const userId = req.user.id;
    const data = req.body
    if(!data){
        return res.status(200).json({success:true , message:"Noting to update"})
    }

    try {
        
    const [updated] = await User.update(data, {
        where: { id: userId },
    });
    console.log(updated)
    if (updated) {
        return res.status(200).json({ success: true, message: "Profile updated successfully" });
    } else {
        return res.status(400).json({ success: false, message: "User not found or no changes made" });
    }
    } catch (error) {
        console.log(error)
        return res.status(500).json({ success: false, message: "An error occurred while updating the profile" });
    }
}

