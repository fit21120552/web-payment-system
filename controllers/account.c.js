const bcrypt = require('bcrypt');
const accountModel = require('../models/account.m');
const bankModel = require('../models/bank.m');
exports.profile = async (req, res, next) => {
    try {
        const Id = req.session.user._id;
        const user = await accountModel.getById(Id);
        const bank = await bankModel.getById(Id);
        res.render("profile",{isLogin: true, title: "profile", username: user.username,balance: bank.balance});
    } catch (error) {
        next(error);
    }
}

exports.getLogin = async (req, res, next) => {
    try {
        res.render("login", { title: "login" });
    } catch (error) {
        next(error);
    }
};
exports.getTranfer = async (req, res, next) => {
    try {
        res.render("tranfer", {isLogin:true, title: "login" });
    } catch (error) {
        next(error);
    }
};

exports.login = async (req, res, next) => {
    try {
        const { username, password } = req.body;
        const user = await accountModel.getByUserName(username)
        req.session.user=user;
        req.session.isAuthenticated=true;
        req.session.cookie.maxAge = 10*60*60*1000;
        if (user != undefined) {
            const check = bcrypt.compareSync(password, user.password)
            if (check) {
                res.redirect(`/pay`)
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
