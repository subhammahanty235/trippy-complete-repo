const db = require('../models');
const User = db.User;
const PreLoggedUser = db.PreLoggedUser;
const Connections = db.Connections
const TripUserData = db.TripUserData;
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

//PLC checklist 
/*
    1. Fetch the PLC user's details using the emailID 
    2. Update all the connections of users who added the plc user as a conection
    3. Modify the TripUserData table to update the new user id with the existing plc user's id
    4. Cross verify to change the isPlcUser flag in the respected tables.
*/
exports.createProfileFromPLC = async(req,res) => {
    const {emailId} = req.body;
    const {userId} = req.user.id;
    if(!emailId){
        return res.status(404).json({success:false, message:"Emailid not provided"});
    }

    try {
        const PLCUserDetails = await PreLoggedUser.findOne({where:{
            emailId:emailId,
            isAccountCreated:false,
        }})
        if(!PLCUserDetails){
            return res.status(400).json({success:false, message:"Profile already created or user doesn't exist"})
        }

        const plcUserID = PLCUserDetails.id;
        //Update the connections
        await Connections.update(
            {
                connectionUserId: userId,
                isPlcUser: false
            },
            {
                where: {
                    connectionUserId: plcUserID,
                    isPlcUser: true
                }
            }
        );
        //Update the Trip User Data Table
        await TripUserData.update(
            {
                userId: userId,
                isPlcUser: false
            },
            {
                where: {
                    userId: plcUserID,
                    isPlcUser: true
                }
            }
        );

        await PreLoggedUser.update(
            {
                isAccountCreated:true,
            },
            {
                where:{
                    id:plcUserID
                }
            }
               
        )



        return res.status(201).json({success:true, message:"Profile migrated from PLC profile successfully"})
    } catch (error) {
        console.log(error)
        return res.status(500).json({ success: false, message: "An error occurred while updating the profile" });
    }
}
