// Explanation:
// We imported the required packages
// Created an Express app
// Added middleware to parse form data (bodyParser)
// Set up a static files folder (public)
// Configured EJS as our view engine
// Created a basic route that responds with "Hello World"
// Started the server on port 3000
const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');

const dataRoute = require('./routes/DataRoutes');

const app = express();

// middleware
// This lets your app read form data sent by users (like from an HTML form).
app.use(bodyParser.urlencoded({extended: true}));
// This makes files in the "public" folder (like images, CSS, or JavaScript) available to ejs.
app.use(express.static('public'));

// Set up EJS as the view engine using from view folder
app.set('view engine','ejs');

// connect to MongoDB
mongoose.connect('mongodb://localhost:27017/DataDisplayAppTesting')
// this is a success message
.then(() => {
    console.log("Connected to MongoDB successfully");
})
// this will catch any error that occurs during the connection
.catch((err) => {
    console.error("Error connecting to MongoDB:", err);
});

// routes
app.get('/',(req,res) => {
// Pass an empty array for errors so that the form can be displayed without errors    
    res.render('form');
});


// This line tells Express to use the routes defined in DataRoutes.js for any requests that start with "/".
// For example, if you have a route in DataRoutes.js that handles "/add", it will be accessible at "http://localhost:3000/add".
app.use('/',dataRoute);

// start the server
const PORT = 3000;
app.listen(3000, () => {
    console.log(`server is running on port ${PORT}`);
});