const express=require("express");
const router = express.Router();
const experienceController = require("../controllers/experienceController");

router.post("/:iduser/createExperience",experienceController.createExperience);
router.patch('/:idexperience/updateExperience',experienceController.updateExperience);
router.delete('/:idexperience/deleteExperience',experienceController.deleteExperience);
router.get("/:idexperience",experienceController.showExperience);
router.get("/:iduser/getAllexperiences",experienceController.showAllexperiencesByuser);

module.exports=router;