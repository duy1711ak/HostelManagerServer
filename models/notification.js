const mongoose = require('mongoose');

const notificationSchema = new mongoose.Schema({
    hostId: {
        type: String,
        required: true,
    },
	createAt: {
        type: DateTime,
        required: true
    },
	Subject: {
        type: String,
        required: true,
    },
	Content: {
        type: String,
        required: true,
    }
})

module.exports = mongoose.model("Notification", notificationSchema, "Notification")