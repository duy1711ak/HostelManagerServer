const express = require("express");
const clientsModel = require("../models/clients");
const roomListModel = require("../models/roomList");
const notificationModel = require("../models/notification");
const router = express.Router();
const userModal = require('../models/users')

router.get('/:id/info', async (req, res) => {
    try {
        const clientId = parseInt(req.params.id);
        var clientInfo = await clientsModel.find({ "clientId": clientId });
        if (clientInfo.length == 0) {
            res.status(400).send('Client not in any room');
        } else {
            clientInfo = clientInfo[0];
            const hostId = clientInfo.hostId;
            var hostInfo = await userModal.find({UId: hostId});
            var roomInfo = await roomListModel.find({ "hostId": hostId });
            roomInfo = roomInfo[0];
            
            clientInfo = {
                hostelName: roomInfo.hostelName,
                address: roomInfo.address,
                roomName: clientInfo.roomName,
                hostName: hostInfo[0].name,
                hostPhoneNum: hostInfo[0].phoneNum
            };
            res.status(200).send(clientInfo);
        }
    } catch (err) {
        res.status(400).send(err);
    }
});

router.delete('/:id/info', async (req, res) =>{
    try {
        const uid = parseInt(req.params.id);
        await clientsModel.findOneAndDelete({ clientId: uid });
        res.status(200).send("User is successfully deleted");
    } catch (err) {
        res.status(400).send(err);
    }
})

router.get('/notification', async (req, res) => {
    try {
        var clientInfo = await clientsModel.find({ "clientId": req.body.clientId });
        if (clientInfo.length == 0) {
            res.status(400).send("Client is not added to any room");
        } else {
            var clientInfo = clientInfo[0];
            const hostId = clientInfo.hostId;
            var notification = await notificationModel.find({ "hostId": hostId });
            if (notification.length == 0) {
                res.status(200).send([]);
            } else {
                var notification = notification[0];
                const notificationList = notification.notification;
                res.status(200).send(notificationList);
            }
        }
    } catch (err) {
        res.status(400).send(err);
    }
});

module.exports = router