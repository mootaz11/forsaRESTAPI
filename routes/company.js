const express=require("express");
const router = express.Router();
const companyController=require("../controllers/companyController");
const uploadImage = require("../config/multer");

router.get("/companys",companyController.getAllcompanies);
router.post('/signup',uploadImage.single("image"),companyController.signup);
router.post("/login",companyController.login);
router.get('/:idcompany/getProfile',companyController.getProfile)
router.post('/:idcompany/updatecover',uploadImage.single("cover"),companyController.updateCover)
router.post('/:idcompany/updateImage',uploadImage.single("image"),companyController.updateImage);
router.post('/:idcompany/updateEmail',companyController.updateEmail);
router.post('/:idcompany/updatepassword',companyController.updatepassword);
router.post('/:idcompany/updateinfo',companyController.updateInfo);
router.post('/:idcompany/desactivateAccount',companyController.DesactivateAccount);
router.post('/:idcompany/updateStatus',companyController.updateStatus);
router.get('/loginWithgoogle',companyController.loginGoogle);
router.post("/updatelocation/:idcompany",companyController.updateLocation);
router.post("/updateFoundationDate/:idcompany",companyController.updateEstablishedSince);
router.post("/updateNumberofEmployees/:idcompany",companyController.updateTotalEmployees);
module.exports=router;

