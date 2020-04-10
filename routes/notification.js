const router = require("express").Router();
const notificationController = require("../controllers/notificationController");

router.get("/getNotifications/:iduser/:lengthbox",notificationController.getAllnotifs);

module.exports = router; 