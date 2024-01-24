const app = require("express");
const multer = require('multer');
const fs = require('fs');
const path = require('path');


const storage = multer.diskStorage({
    destination:  function (req, file, cb) {
        const { ID } = req.body;
        const imagePath = `Auth/public/images/avatar${ID}.jpg`
        if (fs.existsSync(imagePath)) {
            fs.unlinkSync(imagePath);
        }
        const destinationFolder = `Auth/public/images`;
        cb(null, destinationFolder);
    },

    filename:  function (req, file, cb) {
        const { ID } = req.body;
        cb(null, `avatar_${ID}.jpg`)
    }
})
const router = app.Router();
const upload = multer({ storage: storage })
const authController = require('../controllers/auth.c');
router.post("/register", authController.register)
router.post("/login", authController.login2);
router.post("/userU",upload.single("avatar"),authController.updateInf)

router.get("/", authController.profile);
router.get("/register", authController.getRegister);
router.get("/login", authController.getLogin);
//Game login
router.get("/loginGame",authController.getLoginGame)
router.post("/loginGame",authController.login)
module.exports = router;