// Initialize Firebase
var config = {
  apiKey: "AIzaSyDJfHu2MSQBKlcoqfdi8ryaYPCMWaTNPrI",
  authDomain: "train-schedule-f2ae6.firebaseapp.com",
  databaseURL: "https://train-schedule-f2ae6.firebaseio.com",
  projectId: "train-schedule-f2ae6",
  storageBucket: "train-schedule-f2ae6.appspot.com",
  messagingSenderId: "45001388551"
};

firebase.initializeApp(config);

var database = firebase.database();

// Button for adding Trains
$("#add-train-btn").on("click", function(event) {
  event.preventDefault();

  // Get user input
  var trainName = $("#train-name-input").val().trim();
  var trainDestination = $("#destination-input").val().trim();
  var trainStart = moment($("#first-train-input").val().trim(), "HH:mm").format("HH:mm");
  var trainFrequency = $("#frequency-input").val().trim();

  // Create Train object
  var newTrain = {
    name: trainName,
    destination: trainDestination,
    start: trainStart,
    frequency: trainFrequency
  };

  // Upload train data to the database
  database.ref().push(newTrain);

  alert("Train successfully added");

  // Clear "Add Train" inputs
  $("#train-name-input").val("");
  $("#destination-input").val("");
  $("#first-train-input").val("");
  $("#frequency-input").val("");

});

// Create Firebase event for adding train to the database and a row in the html when a user adds an entry
database.ref().on("child_added", function(childSnapshot, prevChildKey) {

  // Store everything into a variable.
  var trainName = childSnapshot.val().name;
  var trainDestination = childSnapshot.val().destination;
  var trainStart = childSnapshot.val().start;
  var trainFrequency = parseInt(childSnapshot.val().frequency);

  // First train (hack - set it back a year)
  var firstTrain = moment(trainStart, "hh:mm").subtract(1, "years");

  // Current Time
  var now = moment();

  // Difference between now and train start
  var diff = moment().diff(moment(firstTrain), "minutes");

  // Minutes away
  var dAway = trainFrequency - (diff % trainFrequency);

  // Next train
  var dNext = moment().add(dAway, "minutes");
  dNext = moment(dNext).format("HH:mm");

  // Add train's data to the table
  $("#train-table > tbody").append("<tr><td>" + 
    trainName + "</td><td>" + 
    trainDestination + "</td><td>" +
    trainFrequency + "</td><td>" + 
    dNext + "</td><td>" + 
    dAway + "</td></tr>");
});
