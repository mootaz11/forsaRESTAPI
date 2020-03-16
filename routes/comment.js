const express=require("express");
const router = express.Router();
const commentController = require("../controllers/commentController");


router.post("/:userid/:jobid/createCommentOnJob",commentController.CreateCommentOnJob);
router.post("/:userid/:projectid/createCommentOnproject",commentController.CreateCommentOnProject);
router.get("/:projectid/getCommentsByproject",commentController.getCommentsByproject);
router.get("/:jobid/getCommentsByjob",commentController.getCommentsByJob);
router.patch('/:idcomment/updatecomment',commentController.updateComment);
router.delete('/:idcomment/:idproject/:iduser/deleteCommentFromProject',commentController.deleteCommentFromProject);
router.delete('/:idcomment/:idjob/:iduser/deleteCommentFromJob',commentController.deleteCommentFromJob);


//router.delete("/:iduser/:jobid/deleteCommentFromJob",experienceController.createExperience);
//router.get("/:iduser/getAllexperiences",experienceController.showAllexperiencesByuser);

module.exports=router;