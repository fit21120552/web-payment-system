const historyCollection = require('../collections/collections').historyCollection;
module.exports = {
    getAll: async () => {
       const data = await accountcollection.findOne({username: username});
       return data;
    }
}