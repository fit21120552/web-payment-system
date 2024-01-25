const dotenv = require("dotenv");
const mongoose = require("mongoose");
dotenv.config({ path: "./config.env" });

//create schema for user
const userSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true,
  },
  password: {
    type: String,
    required: true,
    //minlength: 8,
  },
});
//create schema for bank account
const bankSchema = new mongoose.Schema({
  balance: {
    type: Number,
    required: true,
  },
});
const accountcollection = new mongoose.model("accounts", userSchema);
const bankCollection = new mongoose.model("banks",bankSchema);
module.exports = {accountcollection,bankCollection};
