const express = require('express')
const router = express.Router()
const usersModel = require('../models/users.js')
const jwt = require('jsonwebtoken')

router.post('/', async (req, res) => {
    const existUser = await usersModel.find({$and:[{"username": req.body.username},{"password": req.body.password}]});
    if (existUser.length == 0) {
        res.status(400).send("Username or password is incorrect");
    } else {
        try {
            const data = existUser[0].username;
            const acccessToken = jwt.sign({data}, process.env.ACCESS_TOKEN_SECRET, {
                expiresIn: "86400s",
            });
            res.status(200).send({user: existUser[0]});
        } catch (err) {
            res.status(400).send("Error");
        }
        
    }
})

module.exports = router