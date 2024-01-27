const accountModel = require('../models/account.m');
const bankModel = require('../models/bank.m');
const historyModel = require('../models/history.m');
const hbsHelper = require('../helper/hbs_helper');
//Deposit for one account
exports.deposit = async (req, res, next) => {
    try {
        const { money } = req.body;
        const username = req.session.user.username;
        const user = await accountModel.getByUserName(username);
        const bankAccount = await bankModel.getById(user._id);
        let balance = bankAccount.balance;
        balance = parseInt(balance);
        balance = balance + parseInt(money);
        await bankModel.UpdateBalance(user._id, balance);
        res.redirect(`/pay/profile`)
    } catch (error) {
        next(error);
    }
}
exports.Tranfering = async (req, res, next) => {
    try {
        let { username, money, message } = req.body;

        money = parseInt(money);
        const sender = req.session.user;
        const receiver = await accountModel.getByUserName(username);
        //check exist receiver
        if (!receiver) {
            return res.render("tranfer", { isLogin: true, title: "tranfer", username: username, money: money,message:message, msg: "Username is not exist !" })
        }
        //check not send to yourself
        if (username == sender.username) {
            return res.render("tranfer", { isLogin: true, title: "tranfer", username: username, money: money,message:message, msg: "You can't send to yourself!" })

        }
        //check valie money
        if (money <= 0) {
            return res.render("tranfer", { isLogin: true, title: "tranfer", username: username, money: money,message:message, msgn: "Invalid money !" })
        }
        //update balance of sender and receiver
        if (message == '') { message = `${sender.username} send to ${receiver.username}` }
        //get bank account
        const sendAccount = await bankModel.getById(sender._id);
        const receiveAccount = await bankModel.getById(receiver._id);
        if (sendAccount.balance - money < 0) {
            return res.render("tranfer", { isLogin: true, title: "tranfer", username: username, money: money,message:message, msgn: "Your balance is't enough!" })
        }
        await bankModel.UpdateBalance(sender._id, sendAccount.balance - money);
        await bankModel.UpdateBalance(receiveAccount._id, receiveAccount.balance + money);
        //log information of history tranfer
        const now = new Date();
        const options = {
            weekday: 'short',
            day: '2-digit',
            month: '2-digit',
            year: 'numeric',
            hour: '2-digit',
            minute: '2-digit',
            second: '2-digit',
            hour12: false,
        };

        const formattedDate = new Intl.DateTimeFormat('en-GB', options).format(now);
        await historyModel.insertOne(sender.username, username, money, sendAccount.balance - money, receiveAccount.balance + money, formattedDate, message)
        return res.render("profile",{tranfer:true, isLogin: true, title: "Profile", username: sender.username,balance:(sendAccount.balance - money).toLocaleString('en-US')});
    } catch (error) {
        next(error);
    }
};
exports.TranferingCart = async (req, res, next) => {
    try {
        console.log(req.session)
        let { total,orderId } = req.body;
        total = parseInt(total);
        const senderA = await accountModel.getByUserName(req.session.username);
        const sender = await bankModel.getById(senderA._id);
        const receiver = await accountModel.getByUserName("admin");
        //update balance of sender and receiver
        //get bank account
        const receiveAccount = await bankModel.getById(receiver._id);
        if (sender.balance - total < 0) {
            return res.json("Số dư không đủ để thanh toán !");
        }
        await bankModel.UpdateBalance(sender._id, sender.balance - total);
        await bankModel.UpdateBalance(receiveAccount._id, receiveAccount.balance + total);
        //log information of history tranfer
        const now = new Date();
        const options = {
            weekday: 'short',
            day: '2-digit',
            month: '2-digit',
            year: 'numeric',
            hour: '2-digit',
            minute: '2-digit',
            second: '2-digit',
            hour12: false,
        };
        const message = `${req.session.username} check out for order ${orderId}`
        const formattedDate = new Intl.DateTimeFormat('en-GB', options).format(now);
        await historyModel.insertOne(senderA.username, "admin", total, sender.balance - total, receiveAccount.balance + total, formattedDate,message)
        return res.json("success");
    } catch (error) {
        next(error);
    }
};
exports.History = async (req, res, next) => {
    try {
        const username = req.session.user.username;
        const data = await historyModel.getAll();
        let history = [];
        data.forEach(h => {
            //check exists account
            if (h.sender == username) {
                history.push({ time: h.time, account: h.sender, money: "-" + h.money.toLocaleString('en-US'), remainder: h.endS.toLocaleString('en-US'), otherAccount: h.receiver, message: h.message })
            }
            if (h.receiver == username) {
                history.push({ time: h.time, account: h.receiver, money: h.money.toLocaleString('en-US'), remainder: h.endR.toLocaleString('en-US'), otherAccount: h.sender, message: h.message })
            }

        });
        res.render("history", { helpers: hbsHelper, isLogin: true, title: "History", data: history })
    } catch (error) {
        next(error);
    }
}