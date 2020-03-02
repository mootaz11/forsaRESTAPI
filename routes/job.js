const express=require("express");
const router = express.Router();
const jobController = require("../controllers/jobController");


router.post("/:iduser/createjob",jobController.createJob);
router.patch('/:idjob/updateJob',jobController.updateJob);
router.delete('/:idjob/deletejob',jobController.deleteJob);
router.get("/:idjob",jobController.showJob);
router.get("/:iduser/getAllJobs",jobController.showJobsByUser);
module.exports=router;