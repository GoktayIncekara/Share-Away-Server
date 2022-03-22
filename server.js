const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");

require("dotenv").config();

const app = express();
const port = process.env.PORT || 5000;

app.use(express.json({extended:true}));

const uri = process.env.ATLAS_URI;
mongoose.connect(uri, {useNewUrlParser: true, useUnifiedTopology: true});

const connection = mongoose.connection;
connection.once("open", () => {
    console.log("MongoDB database connection established succesfully");
})

let Category = require("./models/category.model");

//const name = "Technology";
//const photo = " ";
//const items = [];
//const newCategory = new Category({name, photo, items});

//newCategory.save();

const categoriesRouter = require("./routes/categories");

app.get("/",function(req, res) {
    //Render HOME page
});

app.use("/categories", categoriesRouter);

app.listen(port, function(){
    console.log("Server started on port "+ port);
});