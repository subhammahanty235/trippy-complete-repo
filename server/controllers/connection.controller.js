const db = require('../models')
const Connection = db.Connections;
const User = db.User;
const PreLoggedUser = db.PreLoggedUser;
const { Op } = require('sequelize');

exports.createConnection = async (req, res) => {
    const { connectionID } = req.body;
    const userId = req.user.id
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

/*

User Requests API 
     |
     | ---> Extract userId
     |
     | ---> Fetch Main Connections (isPlcUser = false)
     |       | ---> Include user and connectedUser details
     |
     | ---> Transform Main Connections
     |       | ---> Determine other person and direction
     |       | ---> Format response with essential fields
     |
     | ---> Fetch Pre-Logged Connections (isPlcUser = true)
     |       | ---> Include PreLoggedUser details
     |
     | ---> Transform Pre-Logged Connections
     |       | ---> Extract email prefix as name
     |       | ---> Assign isPreLogged: true
     |
     | ---> Combine Main + Pre-Logged Connections
     |
     | ---> If connections exist → return 200 with connections
     | ---> If no connections → return 200 with empty list
     | ---> If error → return 500 response

*/
exports.getAllConnections = async (req, res) => {
    const userId = req.user.id
    try {
        // Get connections where the current user is either the creator or the connected person
        const connections = await Connection.findAll({
            where: {
                [Op.or]: [
                  { userId: userId },
                  { connectionUserId: userId }
                ],
                isPlcUser: false
            },
            include: [
                {
                    model: User,
                    as: 'user',
                    attributes: ['id', 'name', 'emailId', 'profilePic'],
                },
                {
                    model: User,
                    as: 'connectedUser',
                    attributes: ['id', 'name', 'emailId', 'profilePic'],
                }
            ],
        });
        
        // Transform to simplified format that only includes the other person's details
        const transformedConnections = connections.map(connection => {
            const conn = connection.toJSON();
            
            // Determine connection direction and the other person
            let otherPersonId, otherPerson;
            if (conn.userId === userId) {
                // Current user created this connection
                otherPersonId = conn.connectionUserId;
                otherPerson = conn.connectedUser;
                conn.direction = 'outgoing';
            } else {
                // Current user was added by someone else
                otherPersonId = conn.userId;
                otherPerson = conn.user;
                conn.direction = 'incoming';
            }
            
            // Return a simplified structure with just the essential information
            return {
                connectionId: conn.connectionId,
                direction: conn.direction,
                isBlocked: conn.isBlocked,
                isDeleted: conn.isDeleted,
                createdAt: conn.createdAt,
                contact: {
                    id: otherPersonId,
                    name: otherPerson?.name || 'Unknown',
                    email: otherPerson?.emailId || 'Unknown',
                    profilePic: otherPerson?.profilePic || null
                }
            };
        });

        // Handle temporary connections with pre-logged users
        let tempConnections = await Connection.findAll({
            where: { 
                userId: userId, 
                isPlcUser: true 
            },
            include: [
                {
                    model: PreLoggedUser,
                    as: 'preLoggedConnectedUser',
                    attributes: ['id', 'emailId'],
                }
            ],
        });

        if (tempConnections.length > 0) {
            tempConnections = tempConnections.map((connection) => {
                const conn = connection.toJSON();
                const preLoggedUser = conn.preLoggedConnectedUser;
                
                let name = 'Unknown';
                if (preLoggedUser && preLoggedUser.emailId) {
                    name = preLoggedUser.emailId.split('@')[0];
                }
                
                return {
                    connectionId: conn.connectionId,
                    direction: 'outgoing',
                    isBlocked: conn.isBlocked,
                    isDeleted: conn.isDeleted,
                    createdAt: conn.createdAt,
                    contact: {
                        id: conn.connectionUserId,
                        name: name,
                        email: preLoggedUser?.emailId || 'Unknown',
                        profilePic: null,
                        isPreLogged: true
                    }
                };
            });
        }

        const combinedList = [...transformedConnections, ...tempConnections];
        
        if (combinedList.length > 0) {
            return res.status(200).json({ 
                success: true, 
                connections: combinedList, 
                message: "Connections retrieved successfully" 
            });
        } else {
            return res.status(200).json({ 
                success: true, 
                connections: [], 
                message: "No connections found" 
            });
        }
    } catch (error) {
        console.error("Error fetching connections:", error);
        return res.status(500).json({ 
            success: false, 
            message: "Failed to retrieve connections", 
            error: error.message 
        });
    }
}

exports.createPLConnAndConnect = async (req, res) => {
    const { emailId } = req.body;
    const userId = req.user.id;
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
            console.log(preLoggedUserAcc)

            const conn = await Connection.create({
                connectionUserId: preLoggedUserAcc.id,
                userId: userId,
                isPlcUser: true,
                createdAt: new Date(),
                updatedAt: new Date()
            })
            console.log("<-------------------------------------->")
            console.log(conn)
            return res.status(200).json({ success: true, message: "Connection created" });

        }

    } catch (error) {
        console.log(error)
        return res.send(error)
    }
}



