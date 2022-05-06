const mongoose = require('mongoose')

const userSchema = new mongoose.Schema({
    UId: {
        type: String,
        required: true,
    },
    name : {
        type: String,
        required: true,
        min: 6,
        max: 255
    },
    phoneNum : {
        type: String,
        required: true,
        min: 8,
        max: 20
    },
    password: {
        type: String,
        required: true,
        min: 6,
        max: 255
    },
    isClient : {
        type: Boolean,
        required: true
    },
    
})

module.exports = mongoose.model('Users', userSchema, 'Users');