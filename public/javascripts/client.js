/**
 * Created by Kevin on 9/13/2014.
 */

var socket = io.connect();
var name = "";
var responseID = "";

// if we get an "info" emit from the socket server then console.log the data we recive
socket.on('message', function (data) {
//    console.log("Parent: " + data.parentID);
    if (data.parentID != null && data.parentID != "") {
        addChild(data.parentID, data.msgID, data.msg);
    } else {
//        console.log("Random");
        $("#message").append('<li id="' + data.msgID +'"><i  class="fa-li"></i>' + data.msg + '</li>');
        register();
    }
});

socket.on('history', function (data) {
//    console.log(data);
    var unused = data;
    do {
//        console.log(unused);
        var newUnused = {};
        unused.forEach(function (entry) {
            if (entry.parent != null && entry.parent != "") {
                if ($("#" + entry.parent) != null)
                    addChild(entry.parent, entry._id, entry.name + ": " + entry.message);
                else
                    newUnused.append(entry);
            } else {
                $("#message").append('<li id="' + entry._id +'"><i  class="fa-li"></i>' + entry.name + ": " + entry.message + '</li>');
            }
            unused = newUnused;
//            $('#message').append('<li id=' + entry._id + '><i  class="fa-li"></i>' + entry.name + ": " + entry.message + '</li>');
        });
    } while (unused.length > 0);
    register();
});

var sendMessage = function() {
    var msg = $('#msg');
//    console.log(msg);
    socket.emit('client', {c_msg: msg.val(), user: name, parent: responseID});

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
    $('body').unbind().click( function (e) {
        if ( e.target == this ) {
            $("#response").html("");
            responseID = "";
        }
    });

    $('UL LI').unbind().click(function(){
        if($(this).next().is("ul")) {
            $(this).next().slideToggle();
        }
    }).click(function() {
        $("#response").html($(this).html());
        responseID = $(this).attr('id');
//        console.log(responseID);
    });
};

var addChild = function(id, messageid, message) {
//    console.log(message);

    var elem = $("#" + id);

    if (elem.next().is("ul")) { // add to the end of the previous list
        elem.next().append("<li id='"+ messageid + "'><i  class='fa-li'></i>" + message + "</li>");
    } else { //create a new sublist
        var str = "<ul class='fa-ul'>" +
            "<li id='" + messageid + "'><i  class='fa-li'></i>" + message + "</li>" +
            "</ul>";
        elem.addClass("fa").addClass("fa-plus-circle");
        elem.after(str);
    }

    register();
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