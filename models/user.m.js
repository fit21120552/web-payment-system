//write method get data from file data.json and add data to file data.json
const fs = require('fs');
const path = require('path');
const filePath = path.join(__dirname, '..', "data", "data.json");
const loadData = () => {
    const data = fs.readFileSync(filePath, "utf8");
    return JSON.parse(data);

}
const saveData = (data) => {
    fs.writeFileSync(filePath, JSON.stringify(data, null, 2), 'utf8');
}
module.exports = {
    test: async () => {
        const data = loadData();
        return data;
    }
}

module.exports = {
    getByUserName: async (username) => {
        const data = loadData();
        for (let i = 0; i < data.users.length; i++) {
            if (data.users[i].username == username) {
                return data.users[i];
            }
        }
        return "null";
    },
    addUser: async (user) => {
        const data = loadData();
        data.users.push(user);
        saveData(data);
    },
    getIdMax: async () => {
        const data = loadData();
        return data.users.length;
    },
    updateUser: async (user) => {
        const data = loadData();
        const index = user.id - 1;
        data.users[index].fullname = user.fullname;
        data.users[index].username = user.username;
        data.users[index].avatar = user.avatar;
        saveData(data);
    }

}