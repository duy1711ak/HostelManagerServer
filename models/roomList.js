const mongoose = require('mongoose')

const roomListSchema = new mongoose.Schema({
    hostId: {
        type: String,
        required: true,
    },
	Address: {
        type: String,
        required: true,
    },
	hostelName: {
        type: String,
        required: true,
    },
	roomList : [
		{
            roomId : {
                type: String,
                required: true,
            }, roomName: {
                type: String,
                required: true,
            }
        }
	]
})

module.exports = mongoose.model("RoomList", roomListSchema, "RoomList")