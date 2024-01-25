const accountcollection = require('../collections/collections').accountcollection;
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