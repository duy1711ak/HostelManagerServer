const express = require('express');
const dotenv = require('dotenv');
const mongoose = require('mongoose');


dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;
const URI = process.env.DB_CONNECT;

app.use(express.json())

//connect db
mongoose
    .connect(URI, { useNewUrlParser: true, useUnifiedTopology: true})
    .then(() => {
        console.log('Connected to DB');
        app.listen(PORT, () => {
            console.log(`Server is running on port ${PORT}`);
        });
    })
    .catch(err => {
        console.log('err', err);
    });

//route
const registerRoute = require('./routes/register.js');
const clientRoute = require('./routes/client.js');
const loginRoute = require('./routes/login.js');
const hostRoute = require('./routes/host.js');

app.use('/register', registerRoute);
app.use('/client', clientRoute);
app.use('/host', hostRoute);
app.use('/login', loginRoute);