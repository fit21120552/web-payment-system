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
//create schema for history tranfer
const hisSchema = new mongoose.Schema({
  sender: {
    type: String,
    required: true,
  },
  receiver: {
    type: String,
    required: true,
  },
  money: {
    type: Number,
    required: true,
  },
  endS: {
    type: Number,
    required: true,
  },
  endR: {
    type: Number,
    required: true,
  },
  time:
  {
    type: Date,
    required: true,
  },
});
const accountcollection = new mongoose.model("accounts", userSchema);
const bankCollection = new mongoose.model("banks",bankSchema);
const historyCollection = new mongoose.model("histories",hisSchema);
module.exports = {accountcollection,bankCollection,historyCollection};
