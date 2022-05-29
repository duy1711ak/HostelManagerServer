const mongoose = require('mongoose')

const userSchema = new mongoose.Schema({
    UId: {
        type: Number,
        required: true
    },
    name : {
        type: String,
        required: true
    },
    phoneNum : {
        type: String,
        required: true
    },
    username : {
        type: String,
        required: true
    },
    password: {
        type: String,
        required: true
    },
    isClient : {
        type: Boolean,
        required: true
    },
})

module.exports = mongoose.model('Users', userSchema, 'Users');