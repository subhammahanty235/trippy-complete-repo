//stats are different types of statistical or numercal data we show in user's dashboard for example total expenses or number of connectons
//required stats
// * Total Expense till date (user)
// * Total Expense in current trip (user)
// * connections 
// * total pending payments (lendings from other users)
// * total pending payments (lendings to other users)
// * a emoji as per the user's total history
const { Op } = require('sequelize');
const db = require('../models');
//Models 
const ExpenseSplit = db.ExpenseSplit
const Trip = db.Trip
const Connection = db.Connections;
const User = db.User;
const PreLoggedUser = db.PreLoggedUser;


const getAllStatsOfUser = async (req, res) => {
    try {
        const userId = req.user.id;
        const { liveTripCode } = req.body;
        const data = {};

        //get the total expense of the user till now 
        //we have stored all the splitted payments in the ExpenseSplit table, from where we can calculate the total expense of the user
        const totalExpense = await ExpenseSplit.sum('amount', { where: { userId } });
        data.totalExpense = {
            heading:"Total Expense",
            value:totalExpense,
            type:"val/num"
        };

        if (liveTripCode) {
            const getLiveTripOfUser = await Trip.findOne({ where: { tripUniqueCode: liveTripCode, isDeleted: false } });
            const totalTripExpense = await ExpenseSplit.sum('amount', { where: { userId: userId, tripId: getLiveTripOfUser.id } });
            data.liveTripExpense ={
                heading:"Current Expense",
                value:totalTripExpense,
                type:"val/num"
            }
        }

        //get all the connections with count and profile pics
        const connections = await getAllConnections(userId)
        data.connections = {
            heading:"Connections",
            value:connections,
            type:"profiles/objects"
        }

        // get the total pending payments
        const totalpendinglends = await ExpenseSplit.sum('amount', {
            where: {
                paidBy: userId,
                userId: { [Op.ne]: userId },
                paymentStatus: false
            }
        });

        data.totalpendinglends  ={
            heading:"Pending Lents",
            value:totalpendinglends,
            type:"val/num"
        }
    

        // get the total pending payments (lendings to other users)
        const totalpendinglents = await ExpenseSplit.sum('amount', {
            where: {
                paidBy: { [Op.ne]: userId },
                userId: userId,
                paymentStatus: false
            }
        });

        data.totalpendinglents= {
            heading:"Lendings",
            value:totalpendinglents,
            type:"val/num"
        }

        return res.status(200).json({ data: data })


    } catch (error) {
        res.status(400).json({ "Error": error })
    }
}


const getAllConnections = async (userId) => {
    try {
        const connection = await Connection.findAll({
            where: { userId: userId, isPlcUser: false },
            include: [
                {
                    model: User,
                    as: 'connectedUser',
                    attributes: ['profilePic'],
                }
            ],

        });
        console.log(connection)

        //fetch the temp connections
        const plcUserCount = await Connection.count({
            where: { userId: userId, isPlcUser: true },
        });

        const profilePics = connection.map(conn => ({
            profilePic: conn.connectedUser?.profilePic || 'https://trippy.blob.core.windows.net/trippy-user-profile-pictures/image-1-storage-test-2888' // Default profile pic if null
        }));

        const plcProfilePics = Array(plcUserCount).fill({ profilePic: 'https://trippy.blob.core.windows.net/trippy-user-profile-pictures/image-1-storage-test-2888' });
        console.log(plcProfilePics)
        const combinedList = [...profilePics, ...plcProfilePics];
        console.log(combinedList)
        return combinedList;

    } catch (error) {
        return []
    }
}
module.exports = getAllStatsOfUser

