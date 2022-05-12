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
	roomId: {
        type: String,
        required: true
    }
})

module.exports = mongoose.model("Client", clientSchema, "Client");