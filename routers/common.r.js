const app = require("express");
const router = app.Router();
const authController = require('../controllers/account.c');

router.post("/login", authController.login);
router.get("/", authController.getLogin);
router.get("/login", authController.getLogin);
router.get("/logout", authController.getLogout);
router.post("/register", authController.register);

module.exports = router;