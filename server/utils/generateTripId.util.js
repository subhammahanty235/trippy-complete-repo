exports.generateTripId = (tripname) => { 
    let digits = '0123456789'; 
    let characters = 'ABCDEFGHIJKLMNOPQRSTU'
    let initial = tripname[0];

    let tripId = ''; 
    let clen = characters.length
    let dlen = digits.length 
    tripId+=initial;
    for(let i = 0;i<1;i++){
        tripId+=characters[Math.floor(Math.random()*clen)];
    }
    for (let i = 0; i < 4; i++) { 
        tripId += digits[Math.floor(Math.random() * dlen)]; 
    } 
     
    return tripId; 
} 