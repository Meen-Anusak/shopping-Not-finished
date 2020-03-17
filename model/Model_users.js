var mongoose = require('mongoose');
var url = 'mongodb://localhost/m-shopping'
var bcrypt = require('bcryptjs');


mongoose.connect(url, {
    useNewUrlParser: true,
    useUnifiedTopology: true
})

var UserSchema = mongoose.Schema({
    username: {
        type: String
    },
    password: {
        type: String
    },
    email: {
        type: String
    },
    birthday: {
        type: String
    },
    gender: {
        type: String
    },
    type: {
        type: String
    }
})
var User = module.exports = mongoose.model('users', UserSchema);

module.exports.addUsers = function (newUser, callback) {
    bcrypt.genSalt(10, function (err, salt) {
        bcrypt.hash(newUser.password, salt, function (err, hash) {
            newUser.password = hash;
            newUser.save(callback);
        });
    });

}
module.exports.UserfindById = function(id,callback){
    User.findById(id,callback);
}
module.exports.findUsername = function(username,callback){
    var name ={
        username:username
    }
    User.findOne(name,callback);
}
module.exports.comparepassword = function(password,hash,callback){
    bcrypt.compare(password, hash, function(err, isMatch) {
        callback(null,isMatch);
    });
}