var mongoose = require('mongoose');
var passportLocalMongoose = require('passport-local-mongoose');


var userSchema = new mongoose.Schema({
    firstName: String,
    lastName: String,
    createdAt: { type: Date, default: Date.now },
    username: String,
    password: String,
});

//add passportLocalMongoose plugin to handle salting and hasing of user passwords
userSchema.plugin(passportLocalMongoose);

module.exports = mongoose.model('User', userSchema);
