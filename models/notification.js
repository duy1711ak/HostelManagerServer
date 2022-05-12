const mongoose = require('mongoose');

const notificationSchema = new mongoose.Schema({
    hostId: {
        type: Number,
        required: true,
    },
    notification: [
        {
            createAt: {
                type: DateTime,
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
    ]
})

module.exports = mongoose.model("Notification", notificationSchema, "Notification")