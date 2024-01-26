const dotenv = require("dotenv");
const mongoose = require("mongoose");
dotenv.config({ path: "./config.env" });
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
    type: String,
    required: true,
  },
  message:
  {
    type: String,
    required: true,
  },
});
const bankCollection = new mongoose.model("banks",bankSchema);
const historyCollection = new mongoose.model("histories",hisSchema);
module.exports = {bankCollection,historyCollection};
