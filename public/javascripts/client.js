/**
 * Created by Kevin on 9/13/2014.
 */

var socket = io.connect();
var name = "";
var responseID = "";
var respondIcon = "&#09;<i class='fa fa-mail-reply response'></i>";
var PLUS = "fa-plus";
var MINUS = "fa-minus";

// if we get an "message" emit from the socket server then console.log the data we receive
socket.on('message', function (data) {
//    console.log("Parent: " + data.parentID);
    if (data.parentID != null && data.parentID != "") {
        addChild(data.parentID, data.msgID, data.msg);
    } else {
//        console.log("Random");
        $("#message").append('<li id="' + data.msgID +'">' + data.msg + respondIcon + '</li>');
        register();
    }
});

// we use the "history" emit to display past results
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
                $("#message").append('<li id="' + entry._id +'">' + entry.name + ": " + entry.message + respondIcon + '</li>');
            }
            unused = newUnused;
        });
    } while (unused.length > 0);
    register();
    collapseAll();
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
    login();
    $('#msg').on("keypress", function(e) {
        if (e.keyCode == 13) {
            sendMessage();
        }
    });

    displayOldMessages();
});

var login = function() {
    name = $.cookie('currentUser');
//    console.log(name);
    while (name == 'undefined') {
        name = prompt("Please enter your name:");
    }
    $.cookie('currentUser', name, {path: '/'});
    $('#cur_user').html("Welcome, " + name);
};

var changeUser = function() {
    do {
        name = prompt("Please enter new name:");
    } while (name == "undefined" || name.length == 0);
    $.cookie('currentUser', name, {path: '/'});
    $('#cur_user').html("Welcome, " + name);
};

var register = function() {
    $('body').unbind().click( function (e) {
        if ( e.target == this ) {
            $("#response").html("");
            responseID = "";
        }
    });

//    $('UL LI').unbind().click(function(){
    $('.expandable').unbind().click(function(){
        var ele = $(this).parent().next();
        if(ele.is("ul")) {
            if (ele.is(":hidden")) {
                $(this).removeClass(PLUS).addClass(MINUS);
            } else {
                $(this).removeClass(MINUS).addClass(PLUS);
            }
            ele.slideToggle();
        }
    });

    $('.response').unbind().click(function() {
//        console.log($(this).parent());
        $("#response").html($(this).parent().html());
        responseID = $(this).parent().attr('id');
//        console.log(responseID);
        $('#response').children().remove();
    });
};

var addChild = function(id, messageid, message) {
//    console.log(message);
    var elem = $("#" + id);

    if (elem.next().is("ul")) { // add to the end of the previous list
        elem.next().append("<li id='"+ messageid + "'>" + message  + respondIcon + "</li>");
    } else { //create a new sublist
        var str = "<ul class='fa-ul'>" +
            "<li id='" + messageid + "'>" + message  + respondIcon + "</li>" +
            "</ul>";
        elem.prepend('<i class="fa ' + PLUS +' fa-fw expandable"></i>');
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
    $('.expandable').removeClass(MINUS).addClass(PLUS);
};

var openAll = function() {
    $('UL LI').each(function(){
        if($(this).next().is("ul") && $(this).next().is(":hidden")) {
//            $(this).removeClass(PLUS).addClass(MINUS);
            $(this).next().slideToggle();
        }
    });
    $('.expandable').removeClass(PLUS).addClass(MINUS);
};