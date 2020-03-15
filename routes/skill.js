const express=require("express");
const router = express.Router();
const skillController = require("../controllers/skillController");

router.post("/:iduser/createskill",skillController.createskill);
router.patch('/:idskill/updateskill',skillController.updateskill);
router.delete('/:idskill/deleteskill',skillController.deleteskill);
router.get("/:idskill",skillController.showskill);
router.get("/:iduser/getallskills",skillController.showskillsByUser);

module.exports=router;