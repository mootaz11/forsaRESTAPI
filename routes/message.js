const router = require("express").Router();
const messageController = require("../controllers/messageController");

router.get("/getConversation/:idsender/:idreceiver/:lengthmsgs",messageController.getConversation);
router.get("/getOthersMessages/:iduser/:lengthbox",messageController.getMessagesfromOthers);

module.exports = router; 