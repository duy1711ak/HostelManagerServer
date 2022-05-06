const express = require('express')
const dotenv = require('dotenv')
const mongoose = require('mongoose')
dotenv.config()

const app = express()
app.use(express.json())

port = process.env.PORT || 3000;
app.listen(port, ()=>{
    console.log("Server is lisening on port 3000")
});

//connect db
mongoose.connect(
    process.env.DB_CONNECT,
    { useUnifiedTopology: true, useNewUrlParser: true },
    () => console.log('DB Connected')
);

//route
const registerRoute = require('./routes/register.js')

app.use('/register', registerRoute);