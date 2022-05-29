const mongoose = require('mongoose');

const notificationSchema = new mongoose.Schema({
    hostId: {
        type: Number,
        required: true,
    },
    numNotification: {
        type: Number,
        required: true
    },
    notification: {
        type: [
            {
                id: {
                    type: Number,
                    required: true
                },
                createAt: {
                    type: Date,
                    required: true
                },
                subject: {
                    type: String,
                    required: true,
                },
                content: {
                    type: String,
                    required: true,
                }
            }
        ],
        default: []
    }
})

module.exports = mongoose.model("Notification", notificationSchema, "Notification")