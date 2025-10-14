const mongoose = require('mongoose');
const passport = require('passport');
const plm = require('passport-local-mongoose');


mongoose.connect('mongodb://127.0.0.1:27017/pin');

const userSchema = new mongoose.Schema({
    username: String,
    email: String,
    passport: String,
    profileImage: String,
    posts: [
        {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'post'
    }
    ]
});

userSchema.plugin(plm);

module.exports = mongoose.model('user', userSchema);

