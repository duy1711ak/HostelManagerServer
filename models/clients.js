const mongoose = require('mongoose');

const clientSchema = new mongoose.Schema({
    clientId: {
        type: Number,
        required: true,
    },
	hostId: {
        type: Number,
        required: true
    },
	roomName: {
        type: String,
        required: true
    }
})

module.exports = mongoose.model("Client", clientSchema, "Client");