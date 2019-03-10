// Initialize Firebase
var config = {
    apiKey: "AIzaSyDDoEfxyeUGZp2IBrjJfoo5I0POCmR_WUE",
    authDomain: "traintime-e4a24.firebaseapp.com",
    databaseURL: "https://traintime-e4a24.firebaseio.com",
    projectId: "traintime-e4a24",
    storageBucket: "",
    messagingSenderId: "448085962852"
};
firebase.initializeApp(config);

database = firebase.database();

// Assume the following situations.

// (TEST 1)
// First Train of the Day is 3:00 AM
// Assume Train comes every 3 minutes.
// Assume the current time is 3:16 AM....
// What time would the next train be...? (Use your brain first)
// It would be 3:18 -- 2 minutes away

// (TEST 2)
// First Train of the Day is 3:00 AM
// Assume Train comes every 7 minutes.
// Assume the current time is 3:16 AM....
// What time would the next train be...? (Use your brain first)
// It would be 3:21 -- 5 minutes away


// ==========================================================

// Solved Mathematically
// Test case 1:
// 16 - 00 = 16
// 16 % 3 = 1 (Modulus is the remainder)
// 3 - 1 = 2 minutes away
// 2 + 3:16 = 3:18

// Solved Mathematically
// Test case 2:
// 16 - 00 = 16
// 16 % 7 = 2 (Modulus is the remainder)
// 7 - 2 = 5 minutes away
// 5 + 3:16 = 3:21

$( document ).ready(function() {

    $('.btn').click(function(){
        
        event.preventDefault();

        var tName = $('#name-input').val().trim();
        var tDestination = $('#destination-input').val().trim();
        var tTime = $('#time-input').val().trim();
        var tFrequency = $('#frequency-input').val().trim();


        if( (tName === '')||
            (tDestination === '')||
            (tTime === '')||
            (tFrequency === '') ){

            alert('Please fill out all fields');
        }
        else{
            getVal(tName,tDestination,tTime,tFrequency);
        }

    })

    addInfo();
    

});

function getVal(tName,tDestination,tTime,tFrequency){


    console.log(tName);
    console.log(tDestination);
    console.log(tTime);
    console.log(tFrequency);

    database.ref().push({
        tName: tName,
        tDestination: tDestination,
        tTime: tTime,
        tFrequency: tFrequency
    });

     $('.inputField').val('');

}


function addInfo(){

    database.ref().on('child_added', function(snapshot) {

        var sv = snapshot.val();

        //Stored initial arrival time of train
        var Time = (sv.tTime).toString();

        if(moment(Time).isBefore(moment())){
            console.log(moment(Time,'HH:mm').diff(moment(),'minutes'));

            var diff = parseInt(moment(Time,'HH:mm').diff(moment(),'minutes'));

            console.log(typeof parseInt(moment(Time,'mm')));
        }
        else{
            console.log(moment(moment()).diff(moment(Time,'HH:mm'),'minutes'));

            var diff = parseInt(moment(moment()).diff(moment(Time,'HH:mm'),'minutes'));
            var remaining = diff%sv.tFrequency;
            var next = sv.tFrequency - remaining;
            console.log('diff = '+diff);
            console.log('remainder = '+remaining);
            console.log('Time Till = '+next);
            var nextArrival = moment().format('hh:mm A');
            console.log(moment(nextArrival).add(2,'minutes'));
            
        }



        var row = $('<tr>');
        var Name = $('<td>').text(sv.tName);
        var Destination = $('<td>').text(sv.tDestination);
        if(sv.tFrequency == 1){
            var Frequency = $('<td>').text(sv.tFrequency+' minute'); 
        }
        else{
            var Frequency = $('<td>').text(sv.tFrequency+' minutes');
        }
        var nextArrival = $('<td>').text(next + ' minutes');
        
        
        row.append(Name).append(Destination).append(Frequency).append(nextArrival);
        $('#table').append(row);
    })

}
