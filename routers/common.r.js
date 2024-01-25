const app = require("express");
const router = app.Router();
const authController = require('../controllers/account.c');
const bankController = require('../controllers/bank.c');

router.post("/login", authController.login);
router.get("/", authController.getLogin);
router.get("/login", authController.getLogin);

module.exports = router;