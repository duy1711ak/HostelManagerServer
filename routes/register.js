const express = require('express')
const router = express.Router()
const usersModel = require('../models/users.js')

router.post('/', async (request, response) => {
    const user = new usersModel({
        name: request.body.name,
        phoneNum: request.body.phoneNum,
        password: request.body.password,
        isClient: request.body.isClient
    });
    try {
        const newUser = await user.save();
        await response.send(newUser);
    } catch (err) {
        response.status(400).send(err);
    }
})

module.exports = router