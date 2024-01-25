const app = require("express");
const router = app.Router();
const authController = require('../controllers/account.c');
const bankController = require('../controllers/bank.c');

router.post("/login", authController.login);
router.post("/deposit", bankController.deposit);
router.get("/profile", authController.profile);
router.get("/", authController.getLogin);
router.get("/login", authController.getLogin);
router.get("/tranfer", authController.getTranfer);
router.post("/tranfer", bankController.Tranfering);

module.exports = router;