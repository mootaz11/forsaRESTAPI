const express=require("express");
const router = express.Router();
const userController=require("../controllers/UserController");
const uploadImage = require("../config/multer");

router.get("/users",userController.getAllusers);
router.post('/signup',uploadImage.single("image"),userController.signup);
router.post("/login",userController.login);
router.get('/:iduser/getProfile',userController.getProfile)
router.post('/:iduser/updatecover',uploadImage.single("cover"),userController.updateCover)
router.post('/:iduser/updateImage',uploadImage.single("image"),userController.updateImage);
router.post('/:iduser/updateEmail',userController.updateEmail);
router.post('/:iduser/updatepassword',userController.updatepassword);
router.post('/:iduser/updateinfo',userController.updateInfo);
router.post('/:iduser/desactivateAccount',userController.DesactivateAccount);
router.post('/:iduser/updateStatus',userController.updateStatus);
router.get('/loginWithgoogle',userController.loginGoogle);
module.exports=router;

