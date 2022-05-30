const express = require("express");
const clientModel = require("../models/clients");
const usersModel = require("../models/users");
const roomModel = require("../models/roomList");
const notificationModel = require("../models/notification");
const router = express.Router();

router.get('/:id/clients', async (req, res) => {
    try {
        const hId = parseInt(req.params.id);
        const host = await usersModel.find( {UId: hId} );
        if (host.length == 0) {
            res.status(400).send("Host id does not exist");
        } else if (host[0].isClient) {
            res.status(400).send("Invalid host id");
        } else {
            clientList = await clientModel.find({ hostId: hId });
            res.status(200).send({list: clientList});
        }
    } catch (err) {
        res.status(400).send(err);
    }
});

router.post('/:id/clients', async (req, res) => {
    try {
        const hostId = parseInt(req.params.id);
        const client = await usersModel.find({$and:[{UId: req.body.clientId},{isClient: true}]});
        const phoneNum = client[0].phoneNum;
        const name = client[0].name;
        const host = await usersModel.find({$and:[{UId: hostId},{isClient: false}]});
        var roomList = await roomModel.find({ hostId: hostId });
        if (client.length == 0) res.status(400).send({message: "Client does not exist"});
        else if (host.length == 0) res.status(400).send({message: "Host does not exist"});
        else {
            const room = (roomList[0].roomList).filter((x) => x.roomName == req.body.roomName);
            if (room.length == 0) {
                res.status(400).send({message: "Room does not exist"});
            } else {
                if (phoneNum != req.body.phoneNum) {
                    res.status(400).send({message: "Phone number is not match with phone number client used to register."})
                }
                const existClient = await clientModel.find({ clientId: req.body.clientId });
                if (existClient.length != 0) {
                    res.status(400).send({message: "Client already exists in a room"});
                } else {
                    const client = new clientModel({
                        clientId: req.body.clientId,
                        hostId: hostId,
                        roomName: req.body.roomName,
                        phoneNum: phoneNum,
                        clientName: name
                    });
                    client.save();
                    res.status(200).send();
                }
            }
        }
    } catch (err) {
        res.status(400).send(err);
    }
});


router.delete('/:id/clients/:uid', async (req, res) => {
    try {
        await clientModel.findOneAndDelete({ clientId: req.params.uid });
        res.status(200).send("User is successfully deleted");
    } catch (err) {
        res.status(400).send(err);
    }
});

router.get('/:id/rooms', async (req, res) => {
    try {
        const hId = parseInt(req.params.id);
        var roomList = await roomModel.find({ hostId: hId });
        const host = await usersModel.find({$and:[{"UId": hId},{"isClient": false}]});
        if (host.length == 0) {
            res.status(400).send("Host does not exist");
        } else {
            if (roomList.length == 0) {
                res.status(200).send([]);
            } else {
                roomList = {list: roomList[0].roomList};
                res.status(200).send(roomList);            
            }
        }
    } catch (err) {
        res.status(400).send(err);
    }
});

router.post('/:id/rooms', async (req, res) => {
    try {
        const hId = parseInt(req.params.id);
        var roomList = await roomModel.find({ hostId: hId });
        const host = await usersModel.find({$and:[{"UId": hId},{"isClient": false}]});
        if (host.length == 0) {
            res.status(400).send({message: "Host does not exist"});
        } else {
            roomList = roomList[0].roomList;
            const size = roomList.length;
            const existRoom = roomList.filter((x) => x.roomName == req.body.roomName);
            if (existRoom.length != 0) {
                res.status(400).send({message: "Room already exists in hostel"});
            } else {
                var roomId;
                if (roomList.length == 0){
                    roomId = 0
                }
                else{
                    roomId = roomList[size-1].roomId + 1
                }
                const newRoom = {
                    roomId: roomId,
                    roomName: req.body.roomName
                };
                roomList.push(newRoom);
                roomList = await roomModel.findOneAndUpdate({ hostId: hId }, {roomList: roomList} , {new: true});
                res.status(200).send();
            }
        }
    } catch (err) {
        res.status(400).send({message: err});
    }
});

router.put('/:id/rooms/:rid', async (req, res) => {
    try {
        const hId = parseInt(req.params.id);
        const roomId = parseInt(req.params.rid);
        var roomList = await roomModel.find({ hostId: hId });
        const host = await usersModel.find({$and:[{"UId": hId},{"isClient": false}]});
        if (host.length == 0) {
            res.status(400).send("Host does not exist");
        } else {
            if (roomList.length == 0) {
                res.status(400).send("Room does not exist");
            } else {
                roomList = roomList[0].roomList;
                var existRoom = roomList.filter((x) => x.roomId == roomId);
                var sameNameRoom = roomList.filter((x)=> x.roomName == req.body.roomName);
                if (sameNameRoom.length > 0) {
                    res.status(400).send("Room name is exist");
                }
                if (existRoom.length == 0) {
                    res.status(400).send("Room does not exist");
                } else {
                    existRoom = existRoom[0];
                    existRoom.roomName = req.body.roomName;
                    var newRoomList = await roomModel.findOneAndUpdate({ hostId: hId }, { roomList: roomList } , { new: true })
                    res.status(200).send();
                }
            }
        }
    } catch (err) {
        res.status(400).send(err);
    }
});

router.delete('/:id/rooms/:rid', async (req, res) => {
    try {
        const hId = req.params.id;
        const roomId = parseInt(req.params.rid);
        var roomList = await roomModel.find({ hostId: hId});
        const host = await usersModel.find({$and:[{"UId": hId},{"isClient": false}]});
        if (host.length == 0) {
            res.status(400).send({message: "Host does not exist"});
        } else {
            if (roomList.length == 0) {
                res.status(400).send({message: "Room does not exist"});
            } else {
                roomList = roomList[0].roomList;
                var existRoom = roomList.filter((x) => x.roomId == roomId);
                if (existRoom.length == 0) {
                    res.status(400).send({message: "Room does not exist"});
                } else {
                    const deletedRoom = roomList.filter((x) => x.roomId == roomId);
                    const clientInRoom = await clientModel.find({$and: [{hostId: hId}, {roomName: deletedRoom[0].roomName}]});
                    if (clientInRoom.length != 0) {
                        res.status(400).send({message: "This room still have client"});
                    }
                    var newRoomList = roomList.filter((x) => x.roomId != roomId);
                    newRoomList = await roomModel.findOneAndUpdate({ hostId: hId }, { roomList: newRoomList } , { new: true })
                    res.status(200).send("Room is successfully deleted");
                }
            }
        }
    } catch (err) {
        res.status(400).send(err);
    }
});

router.get('/:hid/notification/page/:pageNum', async (req, res) => {
    try {
        const hostId = req.params.hid;
        const pageNum = req.params.pageNum;
        const firstPos = (parseInt(pageNum)-1)*10;
        const lastPos = parseInt(pageNum)*10;
        const postList = await notificationModel.find({"hostId": hostId});
        if (postList.length == 0) {
            res.status(400).send("Host does not exist");
        } else {
            const list = postList[0].notification;
            if (lastPos > list.length) lastPos = list.length;
            var result = new Array();
            if (firstPos == 0) {
                result = await list.slice(list.length-lastPos).reverse().map(
                    (obj)=>{
                        return {
                            "id" : obj.id,
                            "createAt" : obj.createAt,
                            "subject": obj.subject
                        }
                    }
                );
            }
            else {
                result = await list.slice(0, 3).map(
                    (obj)=>{
                        return {
                            "id" : obj.id,
                            "createAt" : obj.createAt,
                            "subject": obj.subject
                        }
                    }
                );
            }
            
            res.status(200).send({
                'total': list.length,
                'result': result});
        }
    } catch (err) {
        res.status(400).send(err);
    }
});

router.post('/:hid/notification', async (req, res) => {
    try {
        const hostId = req.params.hid;
        var postList = await notificationModel.find({ hostId: hostId });
        if (postList.length == 0) {
            res.status(400).send({message: "Host does not exist"});
        } else {
            const nextId = postList[0].numNotification;
            const time = new Date();
            const newPost = {
                id: nextId,
                createAt: time,
                subject: req.body.subject,
                content: req.body.content 
            };
            postList = await notificationModel.findOneAndUpdate({ hostId: hostId }, 
                                    {numNotification: nextId+1, $push: {notification: newPost}}, 
                                    {new: true});
            res.status(200).send({message: 'successful'});
        }
    } catch (err) {
        res.status(400).send(err);
    }
});

router.get('/:hid/notification/:notiId', async (req, res) => {
    try {
        const hostId = req.params.hid;
        const notiId = req.params.notiId;
        const postList = await notificationModel.find({"hostId": hostId});
        if (postList.length == 0) {
            res.status(400).send("Host does not exist");
        } else {
            const list = postList[0].notification;
            res.status(200).send({'result': list[notiId].content});
        }
    } catch (err) {
        res.status(400).send(err);
    }
});

module.exports = router