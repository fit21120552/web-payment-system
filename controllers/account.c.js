const bcrypt = require('bcrypt');
const accountModel = require('../models/account.m');
const bankModel = require('../models/bank.m');
exports.profile = async (req, res, next) => {
    try {

        const user = await accountModel.getByUserName(req.session.user.username);
        const bank = await bankModel.getById(user._id);
        res.render("profile", { isLogin: true, title: "Profile", username: user.username, balance: bank.balance.toLocaleString('en-US') });
    } catch (error) {
        next(error);
    }
}

exports.register = async (req, res, next) => {
    try {
        const { username } = req.body;
        const user = await accountModel.getByUserName(username)
        const account = await bankModel.getById(user._id)
        if (!account) {//create bank account
            const data = await bankModel.insertOne(user._id);
        }
        return res.json("success");
    } catch (error) {
        next(error);
    }
};
exports.getLogin = async (req, res, next) => {
    try {
        res.render("login", { title: "Login" });
    } catch (error) {
        next(error);
    }
};
exports.getLogout = async (req, res, next) => {
    try {
        req.session.destroy();
        return res.redirect("/login")
    } catch (error) {
        next(error);
    }
};
exports.getTranfer = async (req, res, next) => {
    try {
        res.render("tranfer", { isLogin: true, title: "Tranfer" });
    } catch (error) {
        next(error);
    }
};

exports.login = async (req, res, next) => {
    try {
        const { username, password } = req.body;
        const user = await accountModel.getByUserName(username)
        req.session.user = user;
        req.session.isAuthenticated = true;
        req.session.cookie.maxAge = 10 * 60 * 60 * 1000;
        if (user != undefined) {
            const check = bcrypt.compareSync(password, user.password)
            if (check) {
                res.redirect(`/pay/profile`)
            }
            else {
                res.render("login", { title: "Login", username: username, password: password, msg: "Password is not correct !" })
            }
        }
        else {
            res.render("login", { title: "Login", username: username, password: password, msgn: "User name is not correct !" })
        }

    } catch (error) {
        next(error);
    }
}
