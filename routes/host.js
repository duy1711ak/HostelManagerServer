const express = require("express");
const clientModel = require("../models/clients");
const usersModel = require("../models/users");
const roomModel = require("../models/roomList");
const notificationModel = require("../models/notification");
const router = express.Router();

router.get('/users', async (req, res) => {
    try {
        const host = await usersModel.find( {UId: req.body.hostId} );
        if (host.length == 0) {
            res.status(400).send("Host id does not exist");
        } else if (host[0].isClient) {
            res.status(400).send("Invalid host id");
        } else {
            clientList = await clientModel.find({ hostId: req.body.hostId });
            res.status(200).send(clientList);
        }
    } catch (err) {
        res.status(400).send(err);
    }
});

router.post('/users', async (req, res) => {
    try {
        const client = await usersModel.find({$and:[{"UId": req.body.clientId},{"isClient": true}]});
        const host = await usersModel.find({$and:[{"UId": req.body.hostId},{"isClient": false}]});
        var roomList = await roomModel.find({ hostId: req.body.hostId });
        if (client.length == 0) res.status(400).send("Client does not exist");
        else if (host.length == 0) res.status(400).send("Host does not exist");
        else if (roomList.length == 0) res.status(400).send("Room does not exist");
        else {
            roomList = (roomList[0].roomList).filter((x) => x.roomId == req.body.roomId);
            if (roomList.length == 0) {
                res.status(400).send("Room does not exist");
            } else {
                const existClient = await clientModel.find({ clientId: req.body.clientId });
                if (existClient.length != 0) {
                    res.status(400).send("Client already exists in a room");
                } else {
                    const client = new clientModel({
                        clientId: req.body.clientId,
                        hostId: req.body.hostId,
                        roomId: req.body.roomId
                    });
                    client.save();
                    res.status(200).send(client);
                }
            }
        }
    } catch (err) {
        res.status(400).send(err);
    }
});

router.put('/users', async (req, res) => {
    try {
        const updateUser = await usersModel.findOneAndUpdate({ UId: req.body.UId }, 
            {  
                name: req.body.name,
                phoneNum: req.body.phoneNum,
                password: req.body.password
            }, { new: true });
        res.status(200).send(updateUser);
    } catch (err) {
        res.status(400).send(err);
    }
});

router.delete('/users', async (req, res) => {
    try {
        await usersModel.findOneAndDelete({ UId: req.body.clientId });
        await clientModel.findOneAndDelete({ clientId: req.body.clientId });
        res.status(200).send("User is successfully deleted");
    } catch (err) {
        res.status(400).send(err);
    }
});

router.get('/rooms', async (req, res) => {
    try {
        var roomList = await roomModel.find({ hostId: req.body.hostId });
        const host = await usersModel.find({$and:[{"UId": req.body.hostId},{"isClient": false}]});
        if (host.length == 0) {
            res.status(400).send("Host does not exist");
        } else {
            if (roomList.length == 0) {
                res.status(200).send([]);
            } else {
                roomList = roomList[0].roomList;
                res.status(200).send(roomList);            
            }
        }
    } catch (err) {
        res.status(400).send(err);
    }
});

router.post('/rooms', async (req, res) => {
    try {
        var roomList = await roomModel.find({ hostId: req.body.hostId });
        const host = await usersModel.find({$and:[{"UId": req.body.hostId},{"isClient": false}]});
        if (host.length == 0) {
            res.status(400).send("Host does not exist");
        } else {
            if (roomList.length == 0) {
                var newRoomList = new roomModel({
                    hostId: req.body.hostId,
                    address: req.body.address,
                    hostelName: req.body.roomName,
                    roomList: [{roomId: req.body.roomId, roomName: req.body.roomName}]
                });
                newRoomList.save();
                res.status(200).send(newRoomList);
            } else {
                roomList = roomList[0].roomList;
                const existRoom = roomList.filter((x) => x.roomId == req.body.roomId);
                if (existRoom.length != 0) {
                    res.status(400).send("Room already exists in hostel");
                } else {
                    const newRoom = {
                        roomId: req.body.roomId,
                        roomName: req.body.roomName
                    };
                    roomList.push(newRoom);
                    roomList = await roomModel.findOneAndUpdate({ hostId: req.body.hostId }, {roomList: roomList} , {new: true});
                    res.status(200).send(roomList);
                }
            }
        }
    } catch (err) {
        res.status(400).send(err);
    }
});

router.put('/rooms', async (req, res) => {
    try {
        var roomList = await roomModel.find({ hostId: req.body.hostId });
        const host = await usersModel.find({$and:[{"UId": req.body.hostId},{"isClient": false}]});
        if (host.length == 0) {
            res.status(400).send("Host does not exist");
        } else {
            if (roomList.length == 0) {
                res.status(400).send("Room does not exist");
            } else {
                roomList = roomList[0].roomList;
                var existRoom = roomList.filter((x) => x.roomId == req.body.roomId);
                if (existRoom.length == 0) {
                    res.status(400).send("Room does not exist");
                } else {
                    existRoom = existRoom[0];
                    existRoom.roomName = req.body.roomName;
                    var newRoomList = await roomModel.findOneAndUpdate({ hostId: req.body.hostId }, { roomList: roomList } , { new: true })
                    res.status(200).send(newRoomList);
                }
            }
        }
    } catch (err) {
        res.status(400).send(err);
    }
});

router.delete('/rooms', async (req, res) => {
    try {
        var roomList = await roomModel.find({ hostId: req.body.hostId });
        await clientModel.findOneAndDelete({ roomId: req.body.roomId });
        const host = await usersModel.find({$and:[{"UId": req.body.hostId},{"isClient": false}]});
        if (host.length == 0) {
            res.status(400).send("Host does not exist");
        } else {
            if (roomList.length == 0) {
                res.status(400).send("Room does not exist");
            } else {
                roomList = roomList[0].roomList;
                var existRoom = roomList.filter((x) => x.roomId == req.body.roomId);
                if (existRoom.length == 0) {
                    res.status(400).send("Room does not exist");
                } else {
                    var newRoomList = roomList.filter((x) => x.roomId != req.body.roomId);
                    newRoomList = await roomModel.findOneAndUpdate({ hostId: req.body.hostId }, { roomList: newRoomList } , { new: true })
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