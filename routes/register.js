const express = require('express')
const router = express.Router()
const usersModel = require('../models/users.js')
const roomModel = require('../models/roomList.js')
const notificationModel = require('../models/notification')

router.post('/', async (req, res) => {
    const existUser = await usersModel.find();
    const currentLength = existUser.length;
    var currentMaxId = await usersModel.find().sort({UId: -1}).limit(1);
    if (currentMaxId.length == 0) {
        currentMaxId = 0
    } else {
        currentMaxId = currentMaxId[0].UId;
    }
    const isClient = req.body.isClient;
    if (isClient == false) {
        const hostel = new roomModel({
        hostId: currentMaxId + 1,
        address: req.body.address,
        hostelName: req.body.hostelName
        });
        hostel.save();
        const notification = new notificationModel({
            hostId: currentMaxId + 1,
            numNotification: 0
        });
        notification.save();
    };
    const user = new usersModel({
        UId: currentMaxId + 1,
        name: req.body.name,
        phoneNum: req.body.phoneNum,
        username: req.body.username,
        password: req.body.password,
        isClient: req.body.isClient
    });
    try {
        const existUser = await usersModel.find({ username: req.body.username });
        if (existUser.length != 0) {
            res.status(400).send("Username already exists")
        } else {
            const newUser = await user.save();
            res.status(200).send(newUser);
        }
    } catch (err) {
        res.status(400).send(err);
    }
})

module.exports = router