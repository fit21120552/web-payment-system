const bcrypt = require('bcrypt');
const saltRounds = 10;
const userModel = require('../models/user.m');
const passport = require('passport');
const accountModel = require('../models/account.m');
const bankModel = require('../models/bank.m');

exports.register = async (req, res, next) => {
    try {
        const { fullname, username, password } = req.body;
        //check exist username
        const userE = await userModel.getByUserName(username);
        if (userE != "null") {
            return res.json({ success: false });
        }
        //encode password
        const hash = bcrypt.hashSync(password, saltRounds);

        const id = await userModel.getIdMax();

        const user = {
            id: id + 1, fullname: fullname, username: username, password: hash, avatar: "default.jpg"
        }
        await userModel.addUser(user);

        return res.json({ success: true });

    } catch (error) {
        next(error);
    }
}
exports.profile = async (req, res, next) => {
    try {
        const Id = req.params.Id;
        const user = await accountModel.getById(Id);
        const bank = await bankModel.getById(Id);
        res.render("profile",{isLogin: true, title: "profile", username: user.username,balance: bank.balance});
    } catch (error) {
        next(error);
    }
}
exports.getRegister = async (req, res, next) => {
    try {
        res.render("register", { title: "register" });
    } catch (error) {
        next(error);
    }
};
exports.getLogin = async (req, res, next) => {
    try {
        res.render("login", { title: "login" });
    } catch (error) {
        next(error);
    }
};
exports.getLoginGame = async (req, res, next) => {
    try {
        res.render("loginGame", { title: "login", game: true });
    } catch (error) {
        next(error);
    }
};

exports.login = async (req, res, next) => {
    try {
        const { username, password } = req.body;
        const user = await accountModel.getByUserName(username)

        if (user != undefined) {
            const check = bcrypt.compareSync(password, user.password)
            if (check) {
                res.redirect(`/pay/profile/${user._id}`)
            }
            else {
                res.render("login", { title: "login", username: username, password: password, msg: "Password is not correct !" })
            }
        }
        else {
            res.render("login", { title: "login", username: username, password: password, msgn: "User name is not correct !" })
        }

    } catch (error) {
        next(error);
    }
}

exports.updateInf = async (req, res, next) => {
    try {
        const { ID, username, fullname } = req.body
        const avatar = `avatar_${ID}.jpg`
        const user = { id: ID, fullname: fullname, username: username, avatar: avatar };
        await userModel.updateUser(user);
        res.render("profile", { isLogin: true, title: "profile", id: user.id, username: username, fullname: user.fullname, avatar: avatar });
    } catch (error) {
        next(error);
    }
}