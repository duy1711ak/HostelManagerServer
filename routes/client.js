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

router.get('/:cid/notification/page/:pageNum', async (req, res) => {
    try {
        const clientId = req.params.cid;
        const pageNum = req.params.pageNum;
        const firstPos = (pageNum-1)*10;
        const lastPos = pageNum*10;
        var clientInfo = await clientsModel.find({ "clientId": clientId });
        if (clientInfo.length == 0) {
            res.status(400).send({message: "Client is not added to any room"});
        } else {
            var clientInfo = clientInfo[0];
            const hostId = clientInfo.hostId;
            var notification = await notificationModel.find({ "hostId": hostId });
            const list = notification[0].notification;
            const last = lastPos <= list.length ? lastPos : list.length;
            const result = await list.slice(-last, -firstPos).map(
                (obj)=>{
                    return {
                        "id" : obj.id,
                        "createAt" : obj.createAt,
                        "subject": obj.subject
                    }
                }
            );
            res.status(200).send({
                'total': list.length,
                'result': result.reverse()});
        }
    } catch (err) {
        res.status(400).send(err);
    }
});

router.get('/:cid/notification/:notiId', async (req, res) => {
    try {
        const clientId = req.params.cid;
        const notiId = req.params.notiId;
        var clientInfo = await clientsModel.find({ "clientId": clientId });
        if (clientInfo.length == 0) {
            res.status(400).send({message: "Client is not added to any room"});
        } else {
            var clientInfo = clientInfo[0];
            const hostId = clientInfo.hostId;
            var notification = await notificationModel.find({ "hostId": hostId });
            const list = notification[0].notification;
            res.status(200).send({'result': list[notiId].content});
        }
    } catch (err) {
        res.status(400).send(err);
    }
});

module.exports = router