/**
 * Created by Kevin on 9/9/2014.
 */
var mongoose = require('mongoose');
mongoose.connect('mongodb://localhost/test');

var db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));

var messageSchema = mongoose.Schema({
    name: String,
    message: String
});
messageSchema.methods.speak = function () {
    var greeting = this.name ? (this.name + " said " + this.message) : this.message;
    console.log(greeting);
    return greeting;
};

module.exports = {
    MessageSchema : messageSchema,
    Message : mongoose.model('Message', messageSchema)
};
