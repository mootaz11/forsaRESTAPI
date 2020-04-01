const router = require("express").Router();
const messageController = require("../controllers/messageController");

router.get("/getConversation/:idsender/:idreceiver/:lengthmsgs",messageController.getConversation);
router.get("/getFriendMessages/:iduser/:lengthbox",messageController.getFriendsMessages);
router.get("/getOthersMessages/:iduser",messageController.getMessagesfromOthers);

module.exports = router; 