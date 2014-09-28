/**
 * Created by Kevin on 9/13/2014.
 */
var app = require('../app');
var mongoose = require('mongoose');
var msg = require('../domain/Message');
//mongoose.connect('mongodb://localhost/test');
mongoose.connect('mongodb://admin:password@ds035290.mongolab.com:35290/treehouse');

var db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));

var server = app.listen(process.env.PORT || 3000);
var io = require('socket.io').listen(server);
console.log("Express server listening on port 3000");

// Connection for socket.io
io.sockets.on('connection', function (socket) {
//    console.log('A new user connected!');

    socket.on('client', function(data){
//        console.log(data.c_msg);
        var id = saveMessage(data.user, data.c_msg, data.parent);
        var results = data.user + ": " + data.c_msg;
        io.emit('message', { msg: results, msgID: id, parentID: data.parent});
    });

    socket.on('action', function(data){
        msg.Message.find(function (err, messages) {
            if (err) return console.error(err);
//            console.log(messages);
            socket.emit('history', messages);
        });
    });
});

var saveMessage = function(name, message, parentID) {
    console.log("Saving Message");
    var newMsg = new msg.Message({name: name, message: message, parent: parentID});
    newMsg.save(function (err, msg) {
        if (err) return console.error(err);
//        console.log(msg.name + " " + msg.message);
    });
    return newMsg.id;
};