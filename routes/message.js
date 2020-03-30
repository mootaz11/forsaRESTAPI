const router = require("express").Router();
const messageController = require("../controllers/messageController");


router.get("/getConversation/:idsender/:idreceiver",messageController.getConversation);
router.get("/getFriendMessages/:iduser/:lengthbox",messageController.getFriendsMessages);
router.post("/createofflinemessage/:idsender/:idreceiver",messageController.createMessageOffline);
router.get("/getOthersMessages/:iduser",messageController.getMessagesfromOthers);

module.exports = router; 