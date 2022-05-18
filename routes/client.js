const express = require("express");
const clientsModel = require("../models/clients");
const roomListModel = require("../models/roomList");
const notificationModel = require("../models/notification");
const router = express.Router();

router.get('/info', async (req, res) => {
    try {
        var clientInfo = await clientsModel.find({ "clientId": req.body.clientId });
        if (clientInfo.length == 0) {
            res.status(400).send("Client is not added to any room");
        } else {
            clientInfo = clientInfo[0];
            const hostId = clientInfo.hostId;
            var roomInfo = await roomListModel.find({ "hostId": hostId });
            roomInfo = roomInfo[0];
            clientInfo = {
                "hostelName": roomInfo.hostelName,
                "address": roomInfo.address,
                "roomId": clientInfo.roomId
            };
            res.status(200).send(clientInfo);
        }
    } catch (err) {
        res.status(400).send(err);
    }
});

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