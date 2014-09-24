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
    var str = "<ul class='fa-ul'>";
    data.forEach(function(entry) {
        str += '<li><i  class="fa-li fa fa-plus-circle"></i>' + entry.name + ": " + entry.message + '</li>';
        str += "<ul class='fa-ul'><li><i  class='fa-li fa fa-plus-circle'></i>Response 1</li>" +
            "<ul class='fa-ul'><li>Response 1.1</li><li>Response 1.2</li></ul>" +
            "<li>Response 2</li></ul>";
    });
    str += "</ul>";
    $('#message').append(str);
    register();
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

var register = function() {
    $('UL LI').click(function(){
        if($(this).next().is("ul")) {
            $(this).next().slideToggle();
        }
    });
};

var collapseAll = function() {
    $('UL LI').each(function(){
        if($(this).next().is("ul") && !$(this).next().is(":hidden")) {
            $(this).next().slideToggle();
        }
    });
};

var openAll = function() {
    $('UL LI').each(function(){
        if($(this).next().is("ul") && $(this).next().is(":hidden")) {
            $(this).next().slideToggle();
        }
    });
};