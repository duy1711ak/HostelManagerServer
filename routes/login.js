const express = require('express')
const router = express.Router()
const usersModel = require('../models/users.js')

router.post('/', (req, res) => {
    const doc = new usersModel();
    const reqBody = req.body
})

module.exports = router