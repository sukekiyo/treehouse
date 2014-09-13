/**
 * Created by Kevin on 9/13/2014.
 */

var socket = io.connect();
var name = "";

// if we get an "info" emit from the socket server then console.log the data we recive
socket.on('message', function (data) {
//    console.log(data);
    $('#message').append('<p>' + data.msg + '</p>');
});

socket.on('history', function (data) {
    data.forEach(function(entry) {
        $('#message').append('<p>' + entry.name + ": " + entry.message + '</p>');
    });
});

var sendMessage = function() {
    var msg = $('#msg');
//    console.log(msg);
    socket.emit('client', {c_msg: msg.val(), user: name});
    msg.val("");
};

var displayOldMessages = function() {
//    console.log("Fetching old messages");
    socket.emit('action', {});
};

$( document ).ready(function() {
    name = prompt("Please enter your name:");
    $('#cur_user').html("Welcome, " + name);
    $('#msg').on("keypress", function(e) {
        if (e.keyCode == 13) {
            sendMessage();
        }
    });

    displayOldMessages();
});