//This helper function is to filter the trips based on terms like - upcoming, live or past
exports.filterTrips = (trips) => {
    //the data will include the tripuserdata as well so first we need to filter that out
    if(trips.length <= 0){
        return [];
    }
    const today = new Date()
    let filteredTrips = trips.map((trip)=>trip.trip);
    // now first map the past trips (if any)
    let pastTrips = filteredTrips.filter((trip)=>{
        if(trip.tripBeginDate<today && trip.tripEndDate < today && trip.tripEndDate !== null){
            return trip;
        }
    })

    let liveTrips = filteredTrips.filter((trip)=>{
        if(trip.tripBeginDate<today && (trip.tripEndDate > today || !trip.tripEndDate)){
            return trip;
        }
    })

    let futureTrips = filteredTrips.filter((trip)=>{
        if(trip.tripBeginDate>today && (trip.tripEndDate > today || !trip.tripEndDate)){
            return trip;
        }
    })

    let tripObj = {
        past:pastTrips,
        live:liveTrips,
        future:futureTrips,
    }

    return tripObj

}