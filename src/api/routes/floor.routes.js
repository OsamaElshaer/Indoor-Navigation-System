const express = require("express");
const router = express.Router();
const {
    createFloorValidation,
} = require("../../utils/validations/floor.validation");

const { FloorService } = require("../../services/floor.service");
const { FloorModel } = require("../../models/floor.model");

const floorModelObj = new FloorModel();
const floorServiceObj = new FloorService(floorModelObj);

const { create,findAll,find,remove,update } = floorServiceObj;

router.post("/add", createFloorValidation, create);
router.get("/find/:key", find);
router.get("/findAll", findAll);
router.put("/update", update);
router.delete("/delete/:_id", remove);

module.exports.floorRouter = router;
