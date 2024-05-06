// import express into this file
const { kStringMaxLength } = require('buffer');
const express = require('express');
const mongoose = require('mongoose');


// initialize an instance of express
const app = express();
const path = require("path");

// define the port that the web server should run on
const port = 3000;
app.use(express.urlencoded({ extended: true }));
const mongoURI
= "mongodb+srv://test_paul:test_paul_password@atlascluster.gpospvj.mongodb.net/?retryWrites=true&w=majority"
const mongoOptions = {
    useNewUrlParser: true,
    useUnifiedTopology: true,
 };
 
app.set("view engine", "ejs");

// Connect to MongoDB
const connectToDatabase = async () => {
    try {
      await mongoose.connect(mongoURI, mongoOptions);
      console.log('Connected to MongoDB');
    } catch (error) {
      console.error('Error connecting to the database:', error);
    }
  };
 
//   example data
//   "customer_name": "Walter White",
//   "address": "308 Negra Arroyo Lane",
//   "item": "Kung Pao Chicken, Mongolian Pork",
//   "price": "24.9",
//   "orderTime": "10:30",
//   "orderDate": "2/14/2002",
//   "driverName": "Jesse Pinkman",
//   "driverLicense": "148390276", 
//   "orderStatus": "In Transit", 
//   "deliveredimg": ""

const CustomerSchema = new mongoose.Schema ({
    customer_name: String,
    address: String,
    item: String,
    price: Number,
    orderTime: String,
    orderDate: String,
    driverName: String,
    driverLicense: String, 
    orderStatus: String,
    deliveredimg: String
})

const Customerdata = mongoose.model("CustomerList" , CustomerSchema);

app.get('/', async (req, res) => {
    console.log("Request received at the / endpoint")
    try {
     const results = await Customerdata.find();
     const searchterm = req.body.searchcustomer
     const resultsofsearch = await Customerdata.find({customer_name: searchterm})
     return res.render("orders.ejs", {CustomerList:results, SearchList:""})
    } catch (err) {
     console.log("Error")
     return res.send ("Error")
    }
 })

 app.post("/search", async (req, res) => {
    console.log("Request received, searching for orders from customer:")
    try {
        const results = await Customerdata.find();
        const searchterm = req.body.searchcustomer
        const resultsofsearch = await Customerdata.find({customer_name:searchterm})
        console.log(resultsofsearch) 
        if (resultsofsearch.length === 0) { 
            return res.render("orders.ejs", {CustomerList:results, SearchList:resultsofsearch})
        } else {
        return res.render("orders.ejs", {CustomerList:results, SearchList:resultsofsearch})
        }
    } catch (err) {
        console.log(err)
    }
 })

 app.post("/modify/:orderID", async (req, res) => {
    console.log("Request received, Updating Order Status")
    try { 
        const neworderstatus = req.body.neworderstatus
        const IDofOrder= req.params.orderID
        const modifyorderstatus ={
            orderStatus: neworderstatus
        }
        const updateorderstatus = await Customerdata.findByIdAndUpdate(IDofOrder,modifyorderstatus)
        console.log("Updating Order Status:")
        console.log(updateorderstatus)
        const results = await Customerdata.find(); 
        const searchterm = req.body.searchcustomer
        const resultsofsearch = await Customerdata.find({customer_name:searchterm})
        return res.render("orders.ejs", {CustomerList:results, SearchList:resultsofsearch})
       } catch (err) {
        console.log(err)
        return res.send ("Error")
    }
 })

  // Start the server
app.listen(port, () => {
    console.log(`Server is running on port ${port}`)
    console.log("I am running forever until you manually stop me")  
    console.log("To manually stop me, press CTRL + C in the terminal")
     // after server starts, attempt to connect to database   
     connectToDatabase()
 });