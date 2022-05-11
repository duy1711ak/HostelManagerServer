const mongoose = require('mongoose');

const clientSchema = new mongoose.Schema({
    UId: {
        type: String,
        required: true,
    },
	hostId: {
        type: String,
        required: true
    },
	roomId: {
        type: String,
        required: true
    }
})

module.exports = mongoose.model("Client", clientSchema, "Client");