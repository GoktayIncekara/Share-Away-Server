const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");

require("dotenv").config();




const app = express();
const port = process.env.PORT || 5000;

app.use(express.json({ extended: true }));
// this wil allow http request from another source --> we make calls from 3000 to 5000
// if you do not specify the origin: --> it would allow all the calls from all the outer sources which we do not want that
// if you try to make calls from :3001 --> it would deny it
// also --> it should be written after the use express json as above
app.use(cors({
    origin: "http://localhost:3000",
}));

const uri = process.env.ATLAS_URI;
mongoose.connect(uri, { useNewUrlParser: true, useUnifiedTopology: true });

const connection = mongoose.connection;
connection.once("open", () => {
    console.log("MongoDB database connection established succesfully");
})

/* let Category = require("./models/category.model");
 */
//const name = "Technology";
//const photo = " ";
//const items = [];
//const newCategory = new Category({name, photo, items});

//newCategory.save();

/* const categoriesRouter = require("./routes/categories"); */

/* app.get("/",function(req, res) {
    //Render HOME page
}); */


/* app.use("/categories", categoriesRouter); */

const userRouter = require('./routes/users');
app.use('/users', userRouter);

app.listen(port, function () {
    console.log("Server started on port " + port);
});