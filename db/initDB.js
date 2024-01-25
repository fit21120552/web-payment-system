const mongoose = require("mongoose");
const userModel = mongoose.connection.collection("users");
const bankCollection = require('../collections/collections').bankCollection;

module.exports =
{
    Init: async () => {

        try {
            //create default account receiver money from user
            const check = await userModel.findOne({ username: "admin" })
            if (!check) {
                const data = { username: "admin", password: "$2a$10$xCCD108Zwg8MKO3HqDPWTOhqw8pSq0s5VL/pK5jYNtg1WlThY4rve",role:"admin" };
                const receiver = await userModel.insertOne(data);
                const mainAccount = await bankCollection.insertMany({ balance: 0, _id: receiver.insertedId });
            }
            //create bank account for user in main system
            const users = await userModel.find({ role: "user" });
            users.forEach(async user => {
                //check exists account
                const existAccount = await bankCollection.findOne({ _id: user._id });
                if (!existAccount) {
                    await bankCollection.insertMany({ balance: 0, _id: user._id });
                }
            });
        }
        catch (error) {
            throw error
        }

    },
}