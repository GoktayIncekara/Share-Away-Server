const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const userSchema = new Schema({
    username: {
        type: String, required: true, unique: true, trim: true, minlength : 5,
    },
    name: {
        type: String, required: true, trim: true, minlength : 2,
    },
    surname: {
        type: String, required: true, trim: true, minlength : 2,
    },
    email: {
        type: String, required: true, trim: true, 
    },
    password:{
        type: String, required: true, trim: true, minlength : 6,
    },
    address:{
        type: String,
    }
},  {
    timestamps: true,
});

const User = mongoose.model("User", userSchema);

module.exports = User;