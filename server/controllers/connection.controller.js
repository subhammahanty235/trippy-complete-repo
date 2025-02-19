const db = require('../models')
const Connection = db.Connections;
const User = db.User;
const PreLoggedUser = db.PreLoggedUser;

exports.createConnection = async (req, res) => {
    const { userId, connectionID } = req.body;
    //check if a connection already exists
    try {
        const checkExists = await Connection.findOne({ where: { userId: userId, connectionUserId: connectionID } });
        if (checkExists) {
            console.log(checkExists)
            return res.status(200).json({ success: false, message: "Connection already exists" });
        }
        await Connection.create({
            connectionUserId: connectionID,
            userId: userId,
            isPlcUser: false,
            createdAt: new Date(),
            updatedAt: new Date()
        })

        return res.status(200).json({ success: true, message: "Connection created" });

    } catch (error) {
        console.log(error)
        return res.send(error)
    }

}
exports.getUserDetailsForConnection = async (req, res) => {
    const { emailId } = req.body;
    console.log(emailId)
    try {
        const fetchUser = await User.findOne({
            where: {
                emailId: emailId,
            },
        })

        if (!fetchUser) {
            return res.status(200).json({ found: false, message: "No account found with this userId" })
        } else {
            //case to cover --> user searched their own emailId : TODO
            return res.status(200).json({ found: true, message: "Account fetched", user: fetchUser })

        }
    } catch (error) {
        console.log(error)
        return res.send(error)
    }
}
exports.getAllConnections = async (req, res) => {
    const userId = req.user.id
    try {
        const connection = await Connection.findAll({
            where: { userId: userId, isPlcUser: false },
            include: [
                {
                    model: User,
                    as: 'connectedUser',
                    attributes: ['id', 'name', 'emailId', 'profilePic'],
                }
            ],

        });
        console.log(connection)


        //fetch the temp connections
        let tempconnection = await Connection.findAll({
            where: { userId: userId, isPlcUser: true },
            include: [
                {
                    model: PreLoggedUser,
                    as: 'preLoggedConnectedUser',
                    attributes: ['id', 'emailId'],
                }
            ],

        });

        if (tempconnection.length > 0) {
            tempconnection = tempconnection.map((connection) => {
                const connectionObject = connection.toJSON(); // Convert to plain object
                if (
                    connectionObject.preLoggedConnectedUser &&
                    connectionObject.preLoggedConnectedUser.emailId
                ) {
                    const emailId = connectionObject.preLoggedConnectedUser.emailId;
                    console.log("Email id " + emailId);
                    const name = emailId.split('@')[0]; // Extract the substring before the "@" symbol
                    connectionObject.preLoggedConnectedUser.name = name; // Add the name property
                }
                console.log(connectionObject);
                return connectionObject;
            });
        }

        const combinedList = [...connection, ...tempconnection];
        if (connection) {
            return res.status(200).json({ success: true, connections: combinedList, message: "Connection created" });
        } else {
            return res.status(200).json({ success: false, message: "No connections" });
        }
    } catch (error) {
        console.error("Error fetching connection with user details:", error);
        return res.send(error)
    }
}

exports.createPLConnAndConnect = async (req, res) => {
    const { emailId, userId } = req.body;
    try {
        //cases -> check if emailId already exists as an existing user(edge case) -> return false
        //cases -> PreLoggedUser Already exists, (created by someone else already) -> just add a new connection
        const checkIfAlreadyExists = await User.findOne({ where: { emailId: emailId } });
        if (checkIfAlreadyExists) {
            return res.status(400).json({ success: false, message: "User with the mailId already exists" });
        }


        const checkIfPreLoggedUserExists = await PreLoggedUser.findOne({ where: { emailId: emailId } });
        if (checkIfPreLoggedUserExists) {
            await Connection.create({
                connectionUserId: checkIfPreLoggedUserExists.id,
                userId: userId,
                isPlcUser: true,
                createdAt: new Date(),
                updatedAt: new Date()
            })
            return res.status(200).json({ success: true, message: "Connection created" });
        } else {
            const preLoggedUserAcc = await PreLoggedUser.create({
                emailId: emailId,
                createdBy: userId,
                createdAt: new Date()
            })

            await Connection.create({
                connectionUserId: preLoggedUserAcc.id,
                userId: userId,
                isPlcUser: true,
                createdAt: new Date(),
                updatedAt: new Date()
            })

            return res.status(200).json({ success: true, message: "Connection created" });

        }

    } catch (error) {
        return res.send(error)
    }
}



