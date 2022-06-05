const express = require('express')
const app = express()
const cors = require("cors");
const mongoose = require("mongoose");
const User = require('./models/user.model');
const Product = require('./models/product.model');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const multer = require('multer');
const { v4: uuidv4 } = require('uuid');
let path = require('path');

require("dotenv").config();
const port = process.env.PORT || 5000;

app.use(express.json({ extended: true }));
app.use(cors({
    origin: "http://localhost:3000",
}));

/*
app user cors wil allow http request from another source we make calls from 3000 to 5000
and if you do not specify the origin: -->  allow all the calls from all the outer sources
if you try to make calls from :3001 --> will deny it
and should be written after express.json
*/

// set the uri from the URL in .env file
const uri = process.env.ATLAS_URI || heroku_uri;

// connect to the mongodb with the uri
mongoose.connect(uri, { useNewUrlParser: true, useUnifiedTopology: true });

// create a connection variable
const connection = mongoose.connection;

// establish the connection
connection.once("open", () => {
    console.log("MongoDB database connection established succesfully");
})

// ----------------------------------------------
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, '../Share-Away/src/pictures');
    },
    filename: function (req, file, cb) {
        cb(null, uuidv4() + '-' + Date.now() + path.extname(file.originalname));
    }
});

let upload = multer({ storage: storage });
//----------------------------------

app.post('/user/register', upload.single('profilePic'), async (req, res) => {
    console.log("body:", req.body)
    console.log("filename:", req.file.filename)
    try {
        const newPassword = await bcrypt.hash(req.body.password, 10)
        await User.create({
            username: req.body.username,
            name: req.body.name,
            surname: req.body.surname,
            email: req.body.email,
            password: newPassword,
            profilePic: req.file.filename,
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

app.get("/user/:username", async (req, res) => {
    try {
        const user = await User.findOne({ username: req.params.username });
        res.status(200).json(user);
    } catch (err) {
        res.status(500).json(err);
    }
});

app.post('/user/updateProfilePicture', upload.single('profilePic'), async (req, res) => {

    try {
        await User.updateOne(
            { username: req.body.username },
            { $set: { profilePic: req.file.filename } }
        )
        const user = await User.findOne({
            username: req.body.username,
        })
        const token = jwt.sign(
            {
                name: user.name,
                surname: user.surname,
                username: user.username,
                email: user.email,
                profilePic: req.file.filename,
            },
            'mostSecretKeyword123'
        )

        res.json({ status: 'ok', user: token })
    } catch (err) {
        console.log(err)
        res.json({ status: 'errorPPupdae', error: 'Could not update profile picture!' })
    }

})

/* 
app.get("/user/:username", async (req, res) => {
    try {
        const user = await User.findOne({ username: req.params.username });
        const newName = user.name + 'new';
        console.log(user)
/*         await User.updateOne(
            { $set: { name: newName } }
        )    
        res.status(200).json(user);
        console.log(user)
    } catch (err) {
        res.status(500).json(err);
    }
}); 

*/

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
        if (isPasswordValid) {
            const newPassword = await bcrypt.hash(req.body.newPass, 10)
            await User.updateOne(
                { username: username },
                { $set: { password: newPassword } }
            )
            return res.json({ status: 'ok' })
        }
        else {
            return res.json({ status: 'errorPassword', error: 'Old Password is wrong.' })
        }

    } catch (error) {
        console.log(error)
        res.json({ status: 'error', error: 'invalid token' })
    }
})

app.post('/user/addProduct', upload.single('productPicture'), async (req, res) => {
    //const token = req.headers['x-access-token']
    const token = req.body.token
    try {
        const decoded = jwt.verify(token, 'mostSecretKeyword123')
        await Product.create({
            username: decoded.username,
            email: decoded.email,
            title: req.body.title,
            description: req.body.description,
            category: req.body.category,
            shipping: req.body.shipping,
            city: req.body.city,
            district: req.body.district,
            productPicture: req.file.filename,
        })

        res.json({ status: 'ok' })
    } catch (error) {
        console.log(error)
        res.json({ status: 'error', error: 'invalid value or token' })
    }
})

/* 
app.put('/user/products/:id', async (req, res) => {

    try {
        await Product.findByIdAndUpdate(
            req.params.id,
            {
              $set: req.body,
            },
            { new: true })
    
        res.json({ status: 'ok' })
        
    } catch (error) {
        console.log(error)
        res.json({ status: 'error', error: 'invalid value or token' })
    }
}) 
*/

/* 
app.delete("/user/products/:id", async (req, res) => {
    try {
      await Product.findByIdAndDelete(req.params.id);
      res.json({ status: 'ok' })
    } catch (err) {
        res.json({ status: 'error', error: 'invalid' })
    }
}); 
*/

app.get("/products/:id", async (req, res) => {
    try {
        const product = await Product.findById(req.params.id);
        res.status(200).json(product);
    } catch (err) {
        res.status(500).json(err);
    }
});

//Get all products with selected filters
app.get("/products", async (req, res) => {
    const qUsername = req.query.username;
    const qCategory = req.query.category;
    try {
        let products;

        if (qUsername) {
            products = await Product.find({ username: qUsername });
        } else if (qCategory) {
            products = await Product.find({ category: qCategory });
        } else {
            products = await Product.find();
        }

        res.status(200).json(products);
    } catch (err) {
        res.status(500).json(err);
    }
});

// to listen all the calls on the port
app.listen(port, function () {
    console.log("Server started on port " + port);
});