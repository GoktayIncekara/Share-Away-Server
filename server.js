
const express = require('express')
// const router = require('express').Router();
const app = express()
const cors = require("cors");
const mongoose = require("mongoose");
const User = require('./models/user.model');
const jwt = require('jsonwebtoken')
const bcrypt = require('bcryptjs')

require("dotenv").config();
const port = process.env.PORT || 5000;

app.use(express.json({ extended: true }));
app.use(cors({
    origin: "http://localhost:3000",
}));

/*
app user cors wil allow http request from another source we make calls from 3000 to 5000 and if you do not specify the origin: -->  allow all the calls from all the outer sources

if you try to make calls from :3001 --> will deny it
and should be written after express.json
*/

// set the uri from the URL in .env file
//heroku_uri= process.env.DB_URI;
const uri = process.env.ATLAS_URI || heroku_uri ;
// connect to the mongodb with the uri
mongoose.connect(uri, { useNewUrlParser: true, useUnifiedTopology: true });
// create a connection variable
const connection = mongoose.connection;
// establish the connection
connection.once("open", () => {
    console.log("MongoDB database connection established succesfully");
})


// const userRouter = require('./routes/users');
// app.use('/users', userRouter);


app.post('/user/register', async (req, res) => {
    console.log(req.body)
    try {
        const newPassword = await bcrypt.hash(req.body.password, 10)
        await User.create({
            username: req.body.username,
            name: req.body.name,
            surname: req.body.surname,
            email: req.body.email,
            password: newPassword,
            profilePic: req.body.profilePic,
        })
        res.json({ status: 'ok' })
    } catch (err) {
        console.log(err)
        res.json({ status: 'error', error: 'Duplicate email or username' })
    }
})

app.post('/user/login', async (req, res) => {
    const user = await User.findOne({
        username: req.body.username,
    })

    if (!user) {
        return res.json({ status: 'errorUserNotFound', error: 'Invalid login' })
    }

    const isPasswordValid = await bcrypt.compare(
        req.body.password,
        user.password
    )

    if (isPasswordValid) {
        const token = jwt.sign(
            {
                name: user.name,
                surname: user.surname,
                username: user.username,
                email: user.email,
                profilePic: user.profilePic,
            },
            'mostSecretKeyword123'
        )

        return res.json({ status: 'ok', user: token })
    } else {
        return res.json({ status: 'errorPasswordDoNotMatch', user: false })
    }
})



// to listen all the calls on the port
app.listen(port, function () {
    console.log("Server started on port " + port);
});