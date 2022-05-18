const mongoose = require('mongoose')

const roomListSchema = new mongoose.Schema({
    hostId: {
        type: Number,
        required: true,
    },
	address: {
        type: String,
        required: true,
    },
	hostelName: {
        type: String,
        required: true,
    },
	roomList : [
		{
            roomId: {
                type: Number,
                required: true,
            },
            roomName: {
                type: String,
                required: true,
            }
        }
	]
})

module.exports = mongoose.model("RoomList", roomListSchema, "RoomList")