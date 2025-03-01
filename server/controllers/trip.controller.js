const { checkIfEligibleToCreateTrip } = require('../helpers/checkEligibilityHelper');
const db = require('../models');
const { Op } = require('sequelize');
const { generateTripId } = require('../utils/generateTripId.util');
const { filterTrips } = require('../helpers/filterTrips');
const Trip = db.Trip;
const TripUserData = db.TripUserData;
const PreLoggedUser = db.PreLoggedUser;
const User = db.User
const TripUserRequest = db.TripUserRequest;
const Connections = db.Connections;

exports.createNewTrip = async (req, res) => {
    try {
        console.log(res.body)
        const {
            tripname,
            tripdescription,
            totalbudget,
            startdate,
            enddate,
            addedpeople,
            defaultCurrency
        } = req.body;
        const creator = req.user.id
        if ((!tripname || !tripdescription || !startdate || !addedpeople)) {
            return res.status(200).json({ success: false, message: "Please add all the required inputs", fields: { tripname, tripdescription, startdate, addedpeople } })
        }

        const generatedTripId = generateTripId(tripname);

        const checkEligibility = checkIfEligibleToCreateTrip(creator);
        if (!checkEligibility) {
            return res.status(200).json({ success: false, message: "You can only create 2 trips" })
        }

        const trip = await Trip.create({
            tripName: tripname,
            tripDescription: tripdescription,
            creatorId: creator,
            tripUniqueCode: generatedTripId,
            tripBeginDate: startdate,
            tripEndDate: enddate || null,
            budget: totalbudget || 0,
            defaultCurrency: defaultCurrency || "INR",
            createdAt: new Date(),
            updatedAt: new Date(),
        })

        addedpeople.push({
            id: creator,
            isPlc: false,
        })

        if (addedpeople.length > 0) {
            console.log("Adding friend ")
            for (let friend of addedpeople) {
                console.log("Trip ID is " + trip.id)
                TripUserData.create({
                    userId: friend.id,
                    tripId: trip.id,
                    isPlcUser: friend.isPlcUser === true ? true : false,
                    joinedVia: 1,
                    createdAt: new Date(),
                    updatedAt: new Date(),
                })

                console.log("Added one user to this trip")
            }
        }

        res.status(200).json({ success: true, message: "Trip created successfully" })
    } catch (error) {
        console.log(error)
        res.status(500).send(error)
    }
}

exports.getTripByIdWithUsers = async (req, res) => {
    console.log("Here's i am fetching the users and trip ------------------------->")
    try {
        const { tripId } = req.body;
        let trip = await Trip.findOne({
            where: {
                tripUniqueCode: tripId,
            },
            include: [
                {
                    model: TripUserData,
                    as: 'tripUsers',
                    required: false,
                    attributes: ['id', 'userId', 'isPlcUser']
                },
            ],
        });

        if (!trip) {
            console.log("Trip not found")
            return res.status(404).json({ success: true, message: "Trip Not Found", tripNotFound: true });
        }

        let tripUsersArray;
        if (trip && trip.tripUsers) {
            const tripUsers = await Promise.all(
                trip.tripUsers.map(async (user) => {
                    const plainUser = user.toJSON();

                    if (plainUser.isPlcUser) {
                        console.log(plainUser.userId);
                        const fetched = await PreLoggedUser.findOne({
                            where: { id: plainUser.userId },
                            attributes: ['id', 'emailId'],
                            raw: true,
                        });
                        const name = fetched.emailId.split('@')[0];
                        fetched.name = name;
                        plainUser.people = fetched || null;

                    } else {
                        plainUser.people = await User.findOne({
                            where: { id: plainUser.userId },
                            attributes: ['id', 'name', 'emailId'],
                            raw: true,
                        });
                    }

                    return plainUser;
                })
            );
            tripUsersArray = tripUsers;
            trip['tripUsers'] = tripUsers;
        }
        const plainTrip = trip.toJSON();
        delete plainTrip.tripUsers;
        return res.status(200).json({ success: true, message: "Trip fetched successfully", trip: plainTrip, tripUsersArray: tripUsersArray })
    } catch (error) {
        console.log(error)
        res.status(500).send(error)
    }
}

exports.getLiveTripOfUser = async (req, res) => {
    try {
        const userId = req.user.id;

        const today = new Date()
        const tripsOfUser = await TripUserData.findAll({
            where: {
                userId: userId,
            }
        })

        if (!tripsOfUser) {
            return res.send("No trips found")
        }
        let ftrip;

        for (let ctrip of tripsOfUser) {
            const trip = await Trip.findOne({
                where: {
                    id: ctrip.tripId,
                    [Op.and]: [
                        {
                            [Op.or]: [{ tripBeginDate: { [Op.lte]: today } }],
                        },
                        {
                            [Op.or]: [
                                { tripEndDate: { [Op.gte]: today } },
                                { tripEndDate: null },
                            ],
                        },
                    ],
                },
            })

            if (trip) {
                ftrip = trip;
                break;
            }
        }
        if (ftrip) {
            const liveTrip = await Trip.findOne({
                where: {
                    tripUniqueCode: ftrip.tripUniqueCode,
                },
                include: [
                    {
                        model: TripUserData,
                        as: 'tripUsers',
                        required: false,
                        include: [
                            {
                                model: User,
                                as: 'people',
                                attributes: ['id', 'name','profilePic' , 'emailId']
                            },
                        ],
                    },
                ],
                attributes: ['tripName', 'tripUniqueCode']
            })

            return res.status(200).json({ success: true, trip: liveTrip })
        }
        return res.status(404).json({ success: false, message: "No trip found" })
    } catch (error) {
        console.log(error)
        return res.send(error)
    }
}

exports.getUpcomingTripOfUser = async (req, res) => {
    try {
        const userId = req.params.userId;
        const today = new Date()
        const tripsOfUser = await TripUserData.findAll({
            where: {
                userId: userId,
            }
        })

        if (!tripsOfUser) {
            return res.send("No trips found")
        }
        let ftrip;
        for (let ctrip of tripsOfUser) {
            const trip = await Trip.findOne({
                where: {
                    id: ctrip.tripId,
                    [Op.and]: [
                        {
                            [Op.or]: [{ tripBeginDate: { [Op.gte]: today } }],
                        },
                        {
                            [Op.or]: [
                                { tripEndDate: { [Op.gte]: today } },
                                { tripEndDate: null },
                            ],
                        },
                    ],
                },
            })

            if (trip) {
                ftrip = trip;
                break;
            }
        }
        if (ftrip) {
            const liveTrip = await Trip.findOne({
                where: {
                    tripUniqueCode: ftrip.tripUniqueCode,
                },
                include: [
                    {
                        model: TripUserData,
                        as: 'tripUsers',
                        required: false,
                        include: [
                            {
                                model: User,
                                as: 'people',
                                attributes: ['id', 'name',],
                            },
                        ],
                    },
                ],
                attributes: ['tripName', 'tripUniqueCode']
            })
            return res.status(200).json({ success: true, trip: liveTrip })
        }
        return res.status(404).json({ success: false, message: "No Uploading trip found" })
    } catch (error) {
        console.log(error)
        return res.send(error)
    }
}

exports.tripJoinRequest = async (req, res) => {
    const { tripId } = req.body;
    const userId = req.user.id;
    try {
        const checkRequestExists = await TripUserRequest.findOne({ where: { requestedUserId: userId, tripId: tripId, isAccepted: false, isRejected: false } });
        if (checkRequestExists) {
            return res.status(400).json({ success: false, message: "Request already exists" })
        }

        await TripUserRequest.create({
            requestedUserId: userId,
            tripId: tripId,
            createdAt: new Date()
        })

        res.status(200).json({ success: true, message: "Request sent to admins" });

    } catch (error) {
        return res.send(error)
    }
}

exports.acceptTripJoinRequest = async (req, res) => {
    const userId = req.user.id;
    const requestId = req.params.reqid;
    try {
        const requestDetails = await TripUserRequest.findOne({ where: { id: requestId } });
        if (requestDetails.isAccepted === true && requestDetails.isRejected === true) {
            return res.status(400).json({ success: false, message: "Action already taken" })
        }
    
        //check access of user who is responding 
        const isAdmin = await TripUserData.findOne({ where: { userId: userId, tripId: requestDetails.tripId, permission: 3 } });
        if (!isAdmin) {
            return res.status(400).json({ success: false, message: "No Admin Access" })
        }
    
        //add user to trip
        TripUserData.create({
            userId:requestDetails.requestedUserId ,
            tripId: requestDetails.tripId,
            isPlcUser: false,
            joinedVia: 2,
            createdAt: new Date(),
            updatedAt: new Date(),
        })

        await TripUserRequest.update({
            isAccepted:true,
            actionTakenBy:userId,
        }, {
            where:{
                id:requestId
            }
        })
        res.status(200).json({ success: true, message: "Request Approved by admins" });
        

    } catch (error) {
        return res.send(error)
    }
    

}

exports.rejectTripJoinRequest = async (req, res) => {
    const userId = req.user.id;
    const requestId = req.params.reqid;
    try {
        const requestDetails = await TripUserRequest.findOne({ where: { id: requestId } });
        if (requestDetails.isAccepted === true && requestDetails.isRejected === true) {
            return res.status(400).json({ success: false, message: "Action already taken" })
        }
        //check access of user who is responding 
        const isAdmin = await TripUserData.findOne({ where: { userId: userId, tripId: requestDetails.tripId, permission: 3 } });
        if (!isAdmin) {
            return res.status(400).json({ success: false, message: "No Admin Access" })
        }

        await TripUserRequest.update({
            isRejected:true,
            actionTakenBy:userId,
        }, {
            where:{
                id:requestId
            }
        })
        res.status(200).json({ success: true, message: "Request rejected by admins" });
    } catch (error) {
        return res.send(error)
    }
    

}

exports.getAllTripsOfUser = async(req,res) => {
    try {
        const userId = req.user.id;
        const trips = await TripUserData.findAll({
            where:{
                userId:userId,
            },
            include:[
            {
                model:Trip,
                as:'trip'
            }
            ]
        })
        let tripObj = filterTrips(trips)
        return res.status(201).json({success:true, message:"Trips fetched successfully", trips:tripObj})

    } catch (error) {
        return res.status(400).json({
            success: false,
            message: error.message
        });
    }
}

exports.addConnectionToTrip = async (req, res) => {
    try {
        // Input validation
        const { connectionId } = req.body;
        const tripId = req.params.tripId;
        console.log(connectionId)
        console.log(tripId)

        if (!connectionId || !tripId) {
            return res.status(400).json({
                success: false,
                message: 'Connection ID and Trip ID are required'
            });
        }

        // Fetch the connection details
        const connectionDetails = await Connections.findOne({
            where: {
                connectionId: connectionId,
                // isDeleted: false
            }
        });

        if (!connectionDetails) {
            return res.status(404).json({
                success: false,
                message: 'Connection not found or has been deleted'
            });
        }

        const connectedUserId = connectionDetails.connectionUserId;

        // Check if user already exists in the trip
        const existingTripUser = await TripUserData.findOne({
            where: {
                tripId: tripId,
                userId: connectedUserId
            }
        });

        if (existingTripUser) {
            return res.status(409).json({
                success: false,
                message: 'User is already added to this trip'
            });
        }

        await TripUserData.create({
            userId: connectedUserId,
            tripId: tripId,
            isPlcUser: connectionDetails.isPlcUser || false,
            joinedVia: 2,
            createdAt: new Date(),
            updatedAt: new Date()
        });

        return res.status(201).json({
            success: true,
            message: 'Connection successfully added to trip'
        });

    } catch (error) {
        // Log the error for debugging
        // logger.error('Error in addConnectionToTrip:', {
        //     error: error.message,
        //     stack: error.stack,
        //     connectionId: req.body.connectionId,
        //     tripId: req.params.tripId
        // });

        // Check if it's a validation error
            console.log(error)
            return res.status(400).json({
                success: false,
                message: error.message
            });

        // // Return generic error for other cases
        // return res.status(500).json({
        //     success: false,
        //     message: 'An error occurred while adding connection to trip'
        // });
    }
};