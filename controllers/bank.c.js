const accountModel = require('../models/account.m');
const bankModel = require('../models/bank.m');
const historyModel = require('../models/history.m');
const hbsHelper =require('../helper/hbs_helper');
//Deposit for one account
exports.deposit = async (req, res, next) => {
    try {
        let { username, balance } = req.body;
        balance = parseInt(balance);
        balance = balance + 1000000;
        const user = await accountModel.getByUserName(username);
        console.log(user)
        await bankModel.UpdateBalance(user._id, balance);
        res.redirect(`/pay/profile`)
    } catch (error) {
        next(error);
    }
}
exports.Tranfering = async (req, res, next) => {
    try {
        let { username, money } = req.body;
        money = parseInt(money);
        const sender = req.session.user;
        const receiver = await accountModel.getByUserName(username);
        //check exist receiver
        if (!receiver) {
            res.render("tranfer", { isLogin: true, title: "tranfer", username: username, money: money, msg: "Username is not exist !" })
        }
        //check valie money
        if (money <= 0) {
            res.render("tranfer", { isLogin: true, title: "tranfer", username: username, money: money, msgn: "Invalid money !" })
        }
        //update balance of sender and receiver
        //get bank account
        const sendAccount = await bankModel.getById(sender._id);
        const receiveAccount = await bankModel.getById(receiver._id);
        await bankModel.UpdateBalance(sender._id, sendAccount.balance - money);
        await bankModel.UpdateBalance(receiveAccount._id, receiveAccount.balance + money);
        //log information of history tranfer
        const now = new Date();
        await historyModel.insertOne(sender.username, username, money, sendAccount.balance - money, receiveAccount.balance + money, now)
        return res.redirect(`/pay/profile`)
    } catch (error) {
        next(error);
    }
};
exports.TranferingCart = async (req, res, next) => {
    try {
        let { total } = req.body;
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
        await historyModel.insertOne(senderA.username, "admin", total, sender.balance - total, receiveAccount.balance + total, now)
        return res.json("success");
    } catch (error) {
        next(error);
    }
};
exports.History = async (req, res, next) => {
    try {
        
        const username = req.session.user.username;
        const data = await historyModel.getAll();
        let history=[];
        data.forEach(h => {
            //check exists account
            if (h.sender == username) {
                history.push({time: h.time,account: h.sender,money: -1*h.money,remainder: h.endS,otherAccount: h.receiver})
            }
            if (h.receiver == username) {
                history.push({time: h.time,account: h.receiver,money: h.money,remainder: h.endR,otherAccount: h.sender})
            }

        });
         res.render("history", {  helpers: hbsHelper, isLogin: true, title: "History",data: history})
    } catch (error) {
        next(error);
    }
}