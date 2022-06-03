const express = require('express')
const app = express()
const cors = require("cors");
const mongoose = require("mongoose");
const User = require('./models/user.model');
const Product = require('./models/product.model');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');

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

//responde to call from user profile page to change password
app.post('/user/changePassword', async (req, res) => {
	const token = req.headers['x-access-token']

	try {
		const decoded = jwt.verify(token, 'mostSecretKeyword123')
		const username = decoded.username
        const user = await User.findOne({ username: username })

        if (!user) {
            return res.json({ status: 'errorUserNotFound', error: 'Invalid login' })
        }

        //compare password and entered password
        const isPasswordValid = await bcrypt.compare(
            req.body.oldPass,
            user.password
        )

        //if password is entered correctly, encode the new password and save it
        if(isPasswordValid){
            const newPassword = await bcrypt.hash(req.body.newPass, 10)
            await User.updateOne(
                { username: username },
                { $set: { password: newPassword } }
            )
            return res.json({ status: 'ok' })
        }
        else{
            return res.json({ status: 'errorPassword', error: 'Old Password is wrong.' })
        }
        
	} catch (error) {
		console.log(error)
		res.json({ status: 'error', error: 'invalid token' })
	}
})

app.post('/user/addProduct', async (req, res) => {
	const token = req.headers['x-access-token']

	try {
		const decoded = jwt.verify(token, 'mostSecretKeyword123')
		console.log(decoded.username)

        await Product.create({
            username: decoded.username,
            title: req.body.title,
            description: req.body.description,
            category: req.body.category,
            shipping: req.body.shipping,
            city: req.body.city,
            district: req.body.district,
            productPicture: ''
        })
    
        res.json({ status: 'ok' })
        
	} catch (error) {
		console.log(error)
		res.json({ status: 'error', error: 'invalid value or token' })
	}
})

// to listen all the calls on the port
app.listen(port, function () {
    console.log("Server started on port " + port);
});