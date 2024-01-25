const mongoose = require("mongoose");
const userModel = mongoose.connection.collection("users");
const accountcollection = require('../collections/collections').accountcollection;
const bankCollection = require('../collections/collections').bankCollection;

module.exports =
{
    Init: async () => {

        try {
            //create default account receiver money from user
            const check = await accountcollection.findOne({ username: "admin" })
            if (!check) {
                const data = { username: "admin", password: "12345" };
                const receiver = await accountcollection.insertMany(data);
                const mainAccount = await bankCollection.insertMany({ balance: 0, _id: receiver[0]._id });
            }
            //create bank account for user in main system
            const users = await userModel.find({role:"user"});
            users.forEach(async user => {
                const existAccount = await accountcollection.findOne({username: user.username});
                if (!existAccount) {
                    const data = { username: user.username, password: user.password };
                    const receiver = await accountcollection.insertMany(data);
                    const mainAccount = await bankCollection.insertMany({ balance: 0, _id: receiver[0]._id });
                }
            });
        } catch (error) {
            throw error
        }

    },
}