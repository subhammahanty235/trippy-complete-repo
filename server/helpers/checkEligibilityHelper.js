const db = require('../models')
const Trip = db.Trip;
exports.checkIfEligibleToCreateTrip = async(userId) => {
    //Cases to check -> 
    /*
        1. If already created 2 trips 
            | -> Return a false success and simply give a message about the limitation
        2. If Not added any payment methods 
            | -> save to draft and inform user, -> next time when they will try to create a new trip, the draft trip will be shown to them
    */
    let checkResult =  true;
    const tripsofUser = await Trip.findAll({
        where:{
            creatorId:userId
        }
    })
    if(!tripsofUser){
        checkResult = true;
    }
    else if(tripsofUser.length >= 2){
        checkResult = false;
    }

    return checkResult;
}