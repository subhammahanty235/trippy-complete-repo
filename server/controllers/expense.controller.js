const db = require('../models')
const TripExpense = db.TripExpense;
const ExpenseSplit = db.ExpenseSplit
const Trip = db.Trip

exports.addNewExpense = async (req, res) => {

    try {
        const userId = req.user.id;
        const { title, description, amount, splitPattern,tripId, addedMembers, paymentMethod } = req.body;

        const newexpense = await TripExpense.create({
            title: title,
            description: description,
            tripId: tripId,
            userId:userId,
            totalExpanse: amount,
            paymentMethod: paymentMethod,
            splitPattern: splitPattern,
            createdAt: new Date(),
            updatedAt: new Date(),
        })

        // here we are refering the uniqueCode of trip as tripID
        let expenseSplitIds = [];
        for (let expense of addedMembers) {
            let expsaved = await ExpenseSplit.create({
                tripId: tripId, 
                paidBy: userId,
                amount: expense.amount,
                userId: expense.userId,
                expenseId: newexpense.id,
                createdAt: new Date(),
                updatedAt: new Date(),
            })

            expenseSplitIds.push(expsaved.id)
        }
   
        // if(expenseSplitIds.length === addedMembers.length){

        // }

        res.status(200).json({success:true, message:"expense added " , expense:newexpense})

    } catch (error) {
        console.log(error)
        res.status(500).send(error)
    }
}

exports.getTotalTripExpense = async(req,res) => {
    try {
        const  tripId  = req.params.tripCode;
        console.log(req.params)
        const selectedTrip = await Trip.findOne({where:{tripUniqueCode:tripId , isDeleted:false}});
        console.log(selectedTrip)
        const tripExpenses = await TripExpense.findAll({
            where:{
                tripId:selectedTrip.id
            }
        })
        let totalCost = 0;
        if(tripExpenses.length > 0){
            tripExpenses.map((exp) => {
                totalCost += parseInt(exp['dataValues'].totalExpanse);
            })
        }
        
        res.status(200).json({success:true , amount: totalCost});
    } catch (error) {
        console.log(error)
        res.status(500).send(error)
    }
}


exports.fetchAllLendingsOfUserTripBased = async(req,res)=>{
    const userId = req.user.id;
    const tripId = req.params.tripId;
    console.log(userId)
    try {
        const lendings = await ExpenseSplit.findAll({
            where:{tripId:tripId , userId:userId , paymentStatus:false},
            attributes:['id' , 'amount' ],
            include:[
                {
                    model:db.User,
                    as:'lender',
                    required:true,
                    attributes:['id' , 'name' , 'profilePic']
                },
                {
                    model:db.TripExpense,
                    as:'expense',
                    required:true,
                    attributes:['id' , 'title']
                }
            ]
        
        })
        console.log(lendings)
        if(!lendings){
            return res.status(200).json({success:true , message:"No lendings found" , lendings:[]})
        }
        return res.status(200).json({success:true , message:"lendings found" , lendings:lendings})


    } catch (error) {
        res.send(error)
    }
}