const express = require("express");
const app = express();
const mongoose = require("mongoose");
const Listing = require("./models/listing.js");
const path = require("path");
const methodOverride = require("method-override");
const ejsMate = require("ejs-mate");

main()
    .then(() => {
        console.log("connected to DB");
    })
    .catch((err) => {
        console.log(err)
    });

async function main() {
  await mongoose.connect('mongodb://127.0.0.1:27017/wanderlust');
}

app.set("view engine","ejs");
app.set("views",path.join(__dirname,"views"));
app.use(express.urlencoded({extended: true}));
app.use(methodOverride("_method"));
app.engine("ejs",ejsMate);
app.use(express.static(path.join(__dirname,"/public")));

app.get("/",(req,res) => {
    console.log("connection is successful");
    res.send("hello i am root");
})

//Index Route
app.get("/listings",async (req,res) => {
    let allListings = await Listing.find({});
    res.render("listings/index.ejs",{ allListings });
})

//New Route
app.get("/listings/new",(req,res) => {
    res.render("listings/new.ejs");
})

//Show Route
app.get("/listings/:id",async (req,res) => {
    let { id } = req.params;
    const listing = await Listing.findById(id);
    res.render("listings/show.ejs",{ listing });
})

//Create Route
app.post("/listings",async (req,res,next) => {
    try {
        const newListing = new Listing(req.body.listing);
        await newListing.save();
        res.redirect("/listings");
    } catch(err) {
        next(err);
    }
})

//Edit Route
app.get("/listings/:id/edit",async (req,res) => {
    let { id } = req.params;
    const listing = await Listing.findById(id);
    res.render("listings/edit.ejs",{ listing });
})

//Update Route
app.put("/listings/:id",async (req,res) => {
    let { id } = req.params;
    await Listing.findByIdAndUpdate(id,{...req.body.listing});
    res.redirect(`/listings/${id}`);
})

//Delete Route
app.delete("/listings/:id",async (req,res) => {
    let { id } = req.params;
    await Listing.findByIdAndDelete(id);
    res.redirect("/listings");
})

// //Error handling middleware
// app.use((err,req,res,next) => {
//     res.send("Something went wrong");
// })

app.listen(8080,() => {
    console.log("server is listening to port 8080");
})

// app.get("/testlisting",async (req,res) => {
//     let newListing = new Listing({
//         title: "My new Villa",
//         description: "Fully furnished 3BHK",
//         price: 1200,
//         location: "Hisar,Haryana",
//         country: "India"
//     })

//     await newListing.save()
//         .then((res) => {
//             console.log(res);
//         })
//         .catch((err) => {
//             console.log(err);
//         })
    
//     res.send("new listing added");
// })