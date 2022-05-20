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
        const host = await usersModel.find({$and:[{UId: hostId},{isClient: false}]});
        var roomList = await roomModel.find({ hostId: hostId });
        if (client.length == 0) res.status(400).send({message: "Client does not exist"});
        else if (host.length == 0) res.status(400).send({message: "Host does not exist"});
        else if (roomList.length == 0) res.status(400).send("Room does not exist");
        else {
            roomList = (roomList[0].roomList).filter((x) => x.roomName == req.body.roomName);
            if (roomList.length == 0) {
                res.status(400).send({message: "Room does not exist"});
            } else {
                const checkPhone = await usersModel.find({$and:[{"UId": req.body.clientId},{"phoneNum" : req.body.phoneNum}]})
                if (checkPhone.length == 0) {
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
                        phoneNum: req.body.phoneNum,
                        clientName: checkPhone.name
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
        const hId = req.params.id;
        const uid = parseInt(req.params.uid);
        await usersModel.findOneAndDelete({ UId: req.params.uid });
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
            res.status(400).send("Host does not exist");
        } else {
            roomList = roomList[0].roomList;
            const size = roomList.length;
            const existRoom = roomList.filter((x) => x.roomName == req.body.roomName);
            if (existRoom.length != 0) {
                res.status(400).send("Room already exists in hostel");
            } else {
                const newRoom = {
                    roomId: roomList[size-1].roomId + 1,
                    roomName: req.body.roomName
                };
                roomList.push(newRoom);
                roomList = await roomModel.findOneAndUpdate({ hostId: hId }, {roomList: roomList} , {new: true});
                res.status(200).send();
            }
        }
    } catch (err) {
        res.status(400).send(err);
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
        await clientModel.findOneAndDelete({ roomId: roomId});
        const host = await usersModel.find({$and:[{"UId": hId},{"isClient": false}]});
        if (host.length == 0) {
            res.status(400).send("Host does not exist");
        } else {
            if (roomList.length == 0) {
                res.status(400).send("Room does not exist");
            } else {
                roomList = roomList[0].roomList;
                var existRoom = roomList.filter((x) => x.roomId == roomId);
                if (existRoom.length == 0) {
                    res.status(400).send("Room does not exist");
                } else {
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

router.get('/notification', async (req, res) => {
    try {
        const host = await usersModel.find({$and:[{"UId": req.body.hostId},{"isClient": false}]});
        if (host.length == 0) {
            res.status(400).send("Host does not exist");
        } else {
            var postList = await notificationModel.find({ hostId: req.body.hostId });
            if (postList.length == 0) {
                res.status(200).send([]);
            } else {
                postList = postList[0].notification;
                res.status(200).send(postList);
            }
        }
    } catch (err) {
        res.status(400).send(err);
    }
});

router.post('/notification', async (req, res) => {
    try {
        const host = await usersModel.find({$and:[{"UId": req.body.hostId},{"isClient": false}]});
        if (host.length == 0) {
            res.status(400).send("Host does not exist");
        } else {
            var postList = await notificationModel.find({ hostId: req.body.hostId });
            if (postList.length == 0) {
                var newPostList = new notificationModel({
                    hostId: req.body.hostId,
                    notification: [{ 
                        createAt: req.body.createAt,
                        subject: req.body.subject,
                        content: req.body.content 
                    }]
                });
                await newPostList.save();
                res.status(200).send(newPostList);
            } else {
                postList = postList[0].notification;
                const newPost = {
                    createAt: req.body.createAt,
                    subject: req.body.subject,
                    content: req.body.content 
                };
                postList.push(newPost);
                postList = await notificationModel.findOneAndUpdate({ hostId: req.body.hostId }, {notification: postList} , {new: true});
                res.status(200).send(postList);
            }
        }
    } catch (err) {
        res.status(400).send(err);
    }
});

module.exports = router