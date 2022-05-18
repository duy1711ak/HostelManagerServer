const express = require('express')
const router = express.Router()
const usersModel = require('../models/users.js')

router.post('/', async (req, res) => {
    const existUser = await usersModel.find();
    const currentLength = existUser.length;
    var currentMaxId = await usersModel.find().sort({UId: -1}).limit(1);
    if (currentMaxId.length == 0) {
        currentMaxId = 0
    } else {
        currentMaxId = currentMaxId[0].UId;
    }
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
            res.send(newUser);
        }
    } catch (err) {
        res.status(400).send(err);
    }
})

module.exports = router