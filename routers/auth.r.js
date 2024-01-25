const app = require("express");
const router = app.Router();
const authController = require('../controllers/account.c');
const bankController = require('../controllers/bank.c');

router.post("/login", authController.login);
router.post("/deposit", bankController.deposit);
router.get("/profile", authController.profile);
router.get("/", authController.profile);
router.get("/history", bankController.History);
router.get("/login", authController.getLogin);
router.get("/tranfer", authController.getTranfer);
router.post("/tranfer", bankController.TranferingCart);
router.post("/tranferr", bankController.Tranfering);

module.exports = router;