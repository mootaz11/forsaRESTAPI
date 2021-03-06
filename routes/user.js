const express=require("express");
const router = express.Router();
const userController=require("../controllers/UserController");
const uploadImage = require("../config/multer");

router.get("/users",userController.getAllusers);
router.post('/signup',uploadImage.single("image"),userController.signup);
router.post("/login",userController.login);
router.post('/:iduser/updatetitle',userController.updateTitle);
router.post('/:iduser/updateoverview',userController.updateOverview);
router.post('/:iduser/updatecountry',userController.updateCountry);
router.post('/:iduser/updatelocation',userController.updateLocation);
router.get('/:iduser/getProfile',userController.getProfile);
router.post('/:iduser/updatecover',uploadImage.single("cover"),userController.updateCover)
router.post('/:iduser/updateImage',uploadImage.single("image"),userController.updateImage);
router.post('/:iduser/updateEmail',userController.updateEmail);
router.post('/:iduser/updatepassword',userController.updatepassword);
router.post('/:iduser/updateinfo',userController.updateInfo);
router.post('/:iduser/desactivateAccount',userController.DesactivateAccount);
router.post('/:iduser/updateStatus',userController.updateStatus);
router.get('/loginWithgoogle',userController.loginGoogle);
router.get('/:iduser/getLatestFeeds',userController.getLatestFeeds);
router.get('/:iduser/getfeedsProfile',userController.getProfileFeeds)
router.get('/:iduser/getFriendlist',userController.getFriendList);
router.get('/:iduser/getOnlinefriends',userController.getOnlinefriends);
router.get('/:iduser/:top/getTopprofiles',userController.getTopprofiles);
router.get('/:iduser/:Nbsug/getsuggestions',userController.getSuggestions);
router.post("/updateFoundationDate/:iduser",userController.updateEstablishedSince);
router.post("/updateNumberofEmployees/:iduser",userController.updateTotalEmployees);
router.get("/getOtherProfiles/:iduser",userController.getOtherProfiles);
router.post("/logout/:iduser",userController.logout);




module.exports=router;

