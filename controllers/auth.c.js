const bcrypt = require('bcrypt');
const saltRounds = 10;
const userModel = require('../models/user.m');
const passport = require('passport');

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
exports.login = async (req, res, next) => {
    try {
        const { username, password } = req.body;
        const user = await userModel.getByUserName(username);

        if (user != "null") {
            const check = bcrypt.compareSync(password, user.password)
            if (check) {
                return res.json({
                    msg: "Login success",
                    success: true,
                    user: user
                })
            }
            else {
                return res.json({
                    msg: "Password is not correct !",
                    pw: false,
                    success: false

                })
            }

        }
        else {
            return res.json({
                msg: "User name is not correct !",
                pw: true,
                success: false
            })
        }

    } catch (error) {
        next(error);
    }
}
exports.profile = async (req, res, next) => {
    try {
        res.render("profile");
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

exports.login2 = async (req, res, next) => {
    try {
        const { username, password } = req.body;
        const user = await userModel.getByUserName(username);

        if (user != "null") {
            const check = bcrypt.compareSync(password, user.password)
            if (check) {
                res.render("profile", { isLogin: true, title: "profile", id: user.id, username: username, fullname: user.fullname, avatar: user.avatar });
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