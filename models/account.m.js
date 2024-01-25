// const accountcollection = require('../collections/collections').accountcollection;
const mongoose = require("mongoose");
const accountcollection = mongoose.connection.collection("users");
module.exports = {
    getByUserName: async (username) => {
       const data = await accountcollection.findOne({username: username});
       return data;
    },
    getById: async (Id) => {
        const data = await accountcollection.findOne({_id: Id});
        return data;
     },
}