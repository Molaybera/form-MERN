// import mongoose from 'mongoose';
const mongoose  = require('mongoose');

// create a schema for user data
const userDatasSchema = new mongoose.Schema({
    name: {
        type:String, //this field will store a string
        required:true,  // This field is required
        trim:true  // This will remove any extra spaces before or after the name
    },
    email: {
        type: String,
        required: true,
        trim: true,
        unique: true, // This ensures that no two users can have the same email
        lowercase: true, // This will convert the email to lowercase before saving
        validate: { // This will validate the email format
            validator: function(v) {
              return /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(v);
            },
            message: props => `${props.value} is not a valid email address!`
    }
    },
    message: {
        type: String,
        required: true,
        maxlength: 500, // This limits the message to a maximum of 500 characters
    },
    createdAt :{
        type:Date,  // Will store when the data was created
        default:Date.now    // Automatically sets to current date/time
    }
});

const UserData = mongoose.model('UserData', userDatasSchema);
module.exports = UserData;