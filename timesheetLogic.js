// Steps to complete:

//+ 1. Initialize Firebase 
//+ 2. Create button for adding new employees - then update the html + update the database
//+ 3. Create a way to retrieve employees from the employee database.
// 4. Create a way to calculate the months worked. Using difference between start and current time.
//    Then use moment.js formatting to set difference in months.
// 5. Calculate Total billed

// 1. Initialize Firebase
// var config = {
//   apiKey: "AIzaSyA_QypGPkcjPtylRDscf7-HQl8ribnFeIs",
//   authDomain: "time-sheet-55009.firebaseapp.com",
//   databaseURL: "https://time-sheet-55009.firebaseio.com",
//   storageBucket: "time-sheet-55009.appspot.com"
// };
 // Your web app's Firebase configuration
 var firebaseConfig = {
  apiKey: "AIzaSyAvSR4-UxzaFaXTLGwlkU6GxXdC6U32Qsw",
  authDomain: "train-scheduler-befdd.firebaseapp.com",
  databaseURL: "https://train-scheduler-befdd.firebaseio.com",
  projectId: "train-scheduler-befdd",
  storageBucket: "train-scheduler-befdd.appspot.com",
  messagingSenderId: "164996209901",
  appId: "1:164996209901:web:a76b1b6029f8c10085c0e4"
};
// Initialize Firebase
firebase.initializeApp(firebaseConfig);

// firebase.initializeApp(config);

var database = firebase.database();

// 2. Button for adding Employees
$("#add-train-btn").on("click", function(event) {
  event.preventDefault();

  // Grabs user input
  var trainName = $("#Train-Name-input").val().trim();
  var trainDest = $("#Destination-input").val().trim();
  var trainStart = moment($("#FirstTrain-input").val().trim(), "hh:mm").format("X");
  var trainFreq = $("#Freq-input").val().trim();
console.log("train Start"+trainStart);
  // Creates local "temporary" object for holding employee data
  var newTrain = {
    name: trainName,
    dest: trainDest,
    start: trainStart,
    freq: trainFreq
  };

  // Uploads employee data to the database
  database.ref().push(newTrain);

  // Logs everything to console
  console.log(newTrain.name);
  console.log(newTrain.dest);
  console.log("start time"+ newTrain.start);
  console.log("freq" + newTrain.freq);

  alert("Employee successfully added");

  // Clears all of the text-boxes
  $("#Train-Name-input").val("");
  $("#Train-input").val("");
  $("#Start-input").val("");
  $("#Freq-input").val("");
});

// 3. Create Firebase event for adding employee to the database and a row in the html when a user adds an entry
database.ref().on("child_added", function(childSnapshot) {
  console.log(childSnapshot.val());

  // Store everything into a variable.
  var trainName = childSnapshot.val().name;
  var trainDest = childSnapshot.val().dest;
  var trainStart = childSnapshot.val().start;
  var trainFreq = childSnapshot.val().freq;

  // Employee Info
  console.log(trainName);
  console.log(trainDest);
  console.log("train start"+trainStart);
  console.log(trainFreq);

  // Prettify the employee start
  var trainStartPretty = moment.unix(trainStart).format("hh:mm");
console.log("trainstartpretty"+trainStartPretty);
  // Calculate the months worked using hardcore math
  // To calculate the months worked
  var trainMonths = moment().diff(moment(trainStart, "X"), "months");
  console.log("months "+trainMonths);

  // Calculate the total billed rate
  var trainBilled = trainMonths * trainFreq;
  console.log("train billed " +trainBilled);
  var firstTimeConverted = moment(trainStartPretty, "HH:mm").subtract(1, "years");
  console.log("firsttimeconverted " + firstTimeConverted);

  // Current Time
  var currentTime = moment();
  console.log("CURRENT TIME: " + moment(currentTime).format("hh:mm"));

  // Difference between the times
  var diffTime = moment().diff(moment(firstTimeConverted), "minutes");
  console.log("DIFFERENCE IN TIME: " + diffTime);

  // Time apart (remainder)
  var tRemainder = diffTime % trainFreq;
  console.log("tremainder="+tRemainder);

  // Minute Until Train
  var tMinutesTillTrain = trainFreq - tRemainder;
  console.log("MINUTES TILL TRAIN: " + tMinutesTillTrain);

  // Next Train
  var nextTrain = moment().add(tMinutesTillTrain, "minutes");
  console.log("ARRIVAL TIME: " + moment(nextTrain).format("hh:mm"));

  // Create the new row
  var newRow = $("<tr>").append(
    $("<td>").text(trainName),
    $("<td>").text(trainDest),
    $("<td>").text(trainStartPretty),
    // $("<td>").text(trainMonths),
    $("<td>").text(trainFreq),
    $("<td>").text(moment(nextTrain).format("hh:mm")),
    $("<td>").text(tMinutesTillTrain)
  );

  // Append the new row to the table
  $("#train-table > tbody").append(newRow);
});
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

    // Assumptions
    var tFrequency = 3;

    // Time is 3:30 AM
    var firstTime = "03:30";
    // console.log ("first time " + );
    // console.log("first time trainstart  " + trainStart);

    // First Time (pushed back 1 year to make sure it comes before current time)
    var firstTimeConverted = moment(firstTime, "HH:mm").subtract(1, "years");
    console.log("firsttimeconverted " + firstTimeConverted);

    // Current Time
    var currentTime = moment();
    console.log("CURRENT TIME: " + moment(currentTime).format("hh:mm"));

    // Difference between the times
    var diffTime = moment().diff(moment(firstTimeConverted), "minutes");
    console.log("DIFFERENCE IN TIME: " + diffTime);

    // Time apart (remainder)
    var tRemainder = diffTime % tFrequency;
    console.log("tremainder="+tRemainder);

    // Minute Until Train
    var tMinutesTillTrain = tFrequency - tRemainder;
    console.log("MINUTES TILL TRAIN: " + tMinutesTillTrain);

    // Next Train
    var nextTrain = moment().add(tMinutesTillTrain, "minutes");
    console.log("ARRIVAL TIME: " + moment(nextTrain).format("hh:mm"));
// Example Time Math
// -----------------------------------------------------------------------------
// Assume Employee start date of January 1, 2015
// Assume current date is March 1, 2016

// We know that this is 15 months.
// Now we will create code in moment.js to confirm that any attempt we use meets this test case
