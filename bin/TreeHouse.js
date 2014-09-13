/**
 * Created by Kevin on 9/13/2014.
 */
var app = require('../app');
var mongoose = require('mongoose');
mongoose.connect('mongodb://localhost/test');

var db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));

var server = app.listen(3000);
var io = require('socket.io').listen(server);
console.log("Express server listening on port 3000");

// Creating schema for message storage
var messageSchema = mongoose.Schema({
    name: String,
    message: String
});

var Message = mongoose.model('Message', messageSchema);

// Connection for socket.io
io.sockets.on('connection', function (socket) {
//    console.log('A new user connected!');

    socket.on('client', function(data){
//        console.log(data.c_msg);
        saveMessage(data.user, data.c_msg);
        var results = data.user + ": " + data.c_msg;
        io.emit('message', { msg: results });
    });

    socket.on('action', function(data){
        Message.find(function (err, messages) {
            if (err) return console.error(err);
//            console.log(messages);
            socket.emit('history', messages);
        });
    });
});

var saveMessage = function(name, message) {
    console.log("Saving Message");
    var msg = new Message({name: name, message: message});
    msg.save(function (err, msg) {
        if (err) return console.error(err);
//        console.log(msg.name + " " + msg.message);
    });
};

var findAllMessage = function() {
    Message.find(function (err, messages) {
        if (err) return console.error(err);
        return messages;
    });
};