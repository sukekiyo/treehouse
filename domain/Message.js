/**
 * Created by khuang on 9/24/14.
 */
// Creating schema for message storage
var mongoose = require('mongoose');

var messageSchema = mongoose.Schema({
    name: String,
    message: String,
    parent: String,
    children: [String]
});

var message = mongoose.model('Message', messageSchema);

module.exports = {Message : message};