const db = require('../models')
const TripExpense = db.TripExpense;
const ExpenseSplit = db.ExpenseSplit
const PaymentMethodUser = db.PaymentMethodUser
const Trip = db.Trip

exports.addPaymentMethodOfUser = async (req, res) => {
    const { paymentMethodKey, paymentDetails } = req.body;
    const userId = req.user.id;
    try {
        //we will verify the payment method : TODO
        //We will check some scenarios before allowing user to save the details : TODO
        
        await PaymentMethodUser.create({
            userId: userId,
            paymentMethodKey: paymentMethodKey,
            paymentDetails: paymentDetails,
            createdAt: new Date(),
        })

        return res.status(200).json({ success: true, message: "Payment Method Added Successfully" })
    } catch (error) {

    }
}

exports.getPaymentMethodsOfSelectedUser = async (req, res) => {
    const userId = req.params.userId;
    try {
        const paymentMethodsOfUser = await PaymentMethodUser.findAll({
            where: { userId: userId, isDeleted: false },
            include: [
                {
                    model: db.PaymentMethods,
                    as: 'paymentMethodDetails',
                    required: true,
                    attributes: ['id', 'paymentMethodName', 'paymentMethodDescription', 'paymentMethodIcon',]
                }
            ]

        })

        if (!paymentMethodsOfUser) {
            return res.status(200).json({ success: true, message: "No Payment methods found", paymentMethods: [] })
        }
        return res.status(200).json({ success: true, message: "Payment methods found", paymentMethods: paymentMethodsOfUser })
    } catch (error) {
        console.log(error)
        res.send(error)
    }
}

//flow
        /*
            Check Payment Details  
            │  
            ├── Has Payment Been Made?  
            │   ├── Yes → STOP (No further action needed)  
            │   ├── No → Move Forward  
            │  
            ├── Check Payment Method  
            │   ├── Is Payment Method Enabled?  
            │   │   ├── No → STOP (Cannot proceed)  
            │   │   ├── Yes → Move Forward  
            │  
            ├── Create a New Row in lendingPayment Table  
            │  
            ├── Send Notifications/Emails  
            │  
            ├── Mark Split as Pending Confirmation  
            │  
            └── DONE  
        */

exports.makeNonComfirmedPayment = async (req, res) => {
    try {
        const userId = req.user.id;
        const { splitId, paymentMethod } = req.body;
        if (!splitId || !paymentMethod) {
            return res.status(400).json({ success: false, message: "Missed some data, please try again" })
        }

        //check payment status from lending payments / either confirmation pending/completed
        const {checkPayment , checkpaymentMethod} =await Promise.all([
            lendingPaymentModel.findOne({
                where:{
                    expenseSplitId:splitId,
                    paymentConfirmation: { [Op.in]: [0, 1] }
                }
            }),
            paymentMethodUser.findOne({
                where:{
                    userId:userId,
                    paymentMethodKey:paymentMethod,
                    isDeleted:false
                }
            })
        ])

        if(checkPayment){
           return res.status(400).json({success:false, message:"Payment is already completed/pending confirmation"})
        }
        if(!checkpaymentMethod){
           return res.status(400).json({success:false, message:"Payment Method is not acceptable to user"})
        }

        const newpayment = await lendingPaymentModel.create({
            expenseSplitId:splitId,
            paymentDate:new Date(),
            paymentMethod:paymentMethod,
        })

        
        //Notification and Emails will be added here later// 


        res.status(200).json({success:true, message:"Payment sent for confirmation"})

    } catch (error) {
        return res.status(500).json({ success: false, message: "Internal server error" });
    }
}




