const express=require("express");
const router = express.Router();
const projectController = require("../controllers/projectController");


router.post("/:iduser/createproject",projectController.createProject);
router.patch('/:idproject/updateproject',projectController.updateproject);
router.delete('/:idproject/deleteproject',projectController.deleteproject);
router.get("/:idproject",projectController.showProject);
router.get("/:iduser/getAllprojects",projectController.showprojectsByUSer);
module.exports=router;