const { type } = require('express/lib/response')
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
	roomList : {
        type: [
            {
                roomId: {
                    type: Number
                },
                roomName: {
                    type: String
                }
            }
        ],
        default: []
    }
})

module.exports = mongoose.model("RoomList", roomListSchema, "RoomList")