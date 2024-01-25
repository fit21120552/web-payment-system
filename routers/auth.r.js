const app = require("express");
const router = app.Router();
const authController = require('../controllers/account.c');
router.post("/register", authController.register)
router.post("/login", authController.login);

router.get("/profile/:Id", authController.profile);
router.get("/", authController.getLogin);
router.get("/register", authController.getRegister);
router.get("/login", authController.getLogin);

module.exports = router;