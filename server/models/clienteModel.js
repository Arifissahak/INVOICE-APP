const mongoose = require('mongoose'); // Erase if already required

// Declare the Schema of the Mongo model
var clientSchema = new mongoose.Schema({
    username:{
        type: String,
        required: true
    },
    email:{
        type:String,
        required:true,
    },
    mobile:{
        type:String,
        required:true,
    },
    tax:{
        type: String
    },
    address: {
        type: String,
    },
    city: {
        type: String
    },
    country: {
        type: String
    },
    postelcode: {
        type: String
    },
    aboutme: {
        type: String
    },
    author: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User"
    }
},{
    timestamps: true,
    
});


//Export the model
module.exports = mongoose.model('Client', clientSchema);