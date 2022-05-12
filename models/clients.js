const mongoose = require('mongoose');

const clientSchema = new mongoose.Schema({
    clientPhoneNum: {
        type: String,
        required: true,
    },
	hostPhoneNum: {
        type: String,
        required: true
    },
	roomId: {
        type: String,
        required: true
    }
})

module.exports = mongoose.model("Client", clientSchema, "Client");