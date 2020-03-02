const express=require("express");
const router = express.Router();
const educationController = require("../controllers/educationController");
router.post("/:iduser/createEducation",educationController.createEducation);
router.patch('/:ideducation/updateEducation',educationController.updateEducation);
router.delete('/:ideducation/deleteEducation',educationController.deleteEducation);
router.get("/:ideducation",educationController.showEducation);
router.get("/:iduser/getAllEducations",educationController.showAllEducationsByUser);

module.exports=router;