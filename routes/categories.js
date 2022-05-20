/* const router = require("express").Router();
const res = require("express/lib/response");
let Item = require("../models/item.model");
let Category = require("../models/category.model"); */

/* router.route("/:category").get((req,res) => {
    
}) */

 /* router.route("/").get((req,res) => {
    Item.find()
    .then(items => res.json(items))
    .catch(err => res.status(400).json("Error: "+ err));
 });

 router.route("/:categoryName").get((req,res) => {
    Category.findOne({name: req.params.categoryName}, function() {
        console.log(req.params.categoryName);
        //RENDER CATEGORY PAGE
    })
 });

 router.route("/add").post((req,res) => {
     const category = req.body.category;
     const name = req.body.name;
     const desc = req.body.desc;
     const city = req.body.city;
     const byPost = req.body.byPost;
     const taken = req.body.taken;

     const newItem = new Item({category,name,desc,city,byPost,taken});

     newItem.save()
     .then(() => res.json("Item added!"))
     .catch(err => res.status(400).json("Error: "+err));
 });
 */
 