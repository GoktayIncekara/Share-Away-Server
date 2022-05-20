/* 
import '../server.js'
const express = require('express')
// const router = require('express').Router();
const app = express()
const cors = require("cors");
const mongoose = require("mongoose");
const User = require('../models/user.model');
const jwt = require('jsonwebtoken')
const bcrypt = require('bcryptjs')

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
            address: req.body.address,
        })
        res.json({ status: 'ok' })
    } catch (err) {
        res.json({ status: 'error', error: 'Duplicate email or username' })
    }
}) */

/*

router.route('/:id').get((req, res) => {
    User.findById(req.params.id)
      .then(users => res.json(users))
      .catch(err => res.status(400).json('Error: ' + err));
});
  
router.route('/:id').delete((req, res) => {
    User.findByIdAndDelete(req.params.id)
      .then(() => res.json('User deleted.'))
      .catch(err => res.status(400).json('Error: ' + err));
});

router.route('/update/:id').post((req, res) => {
    User.findById(req.params.id)
    .then(user => {
        user.username = req.body.username;
        user.name = req.body.name;
        user.surname = req.body.surname;
        user.email = req.body.email;
        user.password = req.body.password;
        user.address = req.body.address;

    user.save()
        .then(() => res.json('User updated!'))
        .catch(err => res.status(400).json('Error: ' + err));
    })
    .catch(err => res.status(400).json('Error: ' + err));
}); 

*/

//module.exports = router;