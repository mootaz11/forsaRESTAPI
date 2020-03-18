const express=require("express");
const router = express.Router();
const projectController = require("../controllers/projectController");


router.post("/:iduser/createproject",projectController.createProject);
router.patch('/:idproject/updateproject',projectController.updateproject);
router.delete('/:idproject/deleteproject',projectController.deleteproject);
router.get("/:idproject",projectController.showProject);
router.get("/:iduser/getAllprojects",projectController.showprojectsByUSer);
router.post("/:userid/:idproject/addlike",projectController.addLike);
router.post("/:userid/:idproject/dislike",projectController.disLike);
router.get("/:idproject/getLikesByproject",projectController.getLikesByProject);
router.get("/getTopprojects/:top",projectController.getTopProjects);

module.exports=router;