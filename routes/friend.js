const express=require("express");
const router = express.Router();
const jobController = require("../controllers/jobController");
const friendController = require("../controllers/friendController");



router.post("/sendrequest/:friendid/:myid",friendController.sendRequest);
router.post("/rejectrequest/:friendid/:myid",friendController.rejectRequest);
router.post("/acceptrequest/:friendid/:myid",friendController.acceptRequest);
router.post("/deletefriend/:friendid/:myid",friendController.deleteFriend);

module.exports=router;
