const historyCollection = require('../collections/collections').historyCollection;
module.exports = {
    getAll: async () => {
       const data = await historyCollection.find();
       return data;
    },
    insertOne: async(sender,receiver,money,endS,endR,time,message)=>
    {
        const data = await historyCollection.insertMany({sender: sender,receiver: receiver,money: money,endS:endS,endR:endR,time:time,message:message});
        return data;
    }
}