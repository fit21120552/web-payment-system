const bankCollection = require('../collections/collections').bankCollection;
module.exports = {
    getById: async (Id) => {
       const data = await bankCollection.findOne({_id: Id});
       return data;
    },
   UpdateBalance: async(ID,newBalance)=>
   {
    await bankCollection.updateOne({ _id: ID },
        {
            $set:
            {
                ["balance"]: newBalance
            },
        })
   }
}