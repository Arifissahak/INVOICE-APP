const mongoose = require('mongoose'); // Erase if already required
const bcrypt = require("bcrypt");
const crypto = require("crypto");

// Declare the Schema of the Mongo model
var userSchema = new mongoose.Schema({
    firstname:{
        type:String,
        required:true,
    },
    lastname:{
        type:String,
        required:true,
    },
    email:{
        type:String,
        required:true,
        unique:true,
    },
    mobile:{
        type:String,
        required:true,
        unique:true,
    },
    tax:{
        type: String
    },
    address: {
        type: String
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
    password:{
        type:String,
        required:true,
    },
    clients:[{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Client' // Assuming Client is the name of the related model
      }],
    refreshToken: {
        type:String
    },
},{
    timestamps: true,
});

userSchema.pre("save", async function (next) {
    if (!this.isModified("password")){
        next();
    }
    const salt = await bcrypt.genSaltSync(10);
    this.password = await bcrypt.hash(this.password, salt);
});

userSchema.methods.isPasswordMatched = async function (enterdPassword){
    return await bcrypt.compare(enterdPassword, this.password);
};


//Export the model
module.exports = mongoose.model('User', userSchema);