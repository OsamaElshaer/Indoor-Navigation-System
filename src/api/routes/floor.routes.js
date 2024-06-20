const express = require("express");
const router = express.Router();

const { FloorService } = require("../../services/floor.service");
const { FloorModel } = require("../../models/floor.model");
const { isAuth } = require("../../middlewares/isAuth");

const floorModelObj = new FloorModel();
const floorServiceObj = new FloorService(floorModelObj);

const { create, findAll, find, remove, update } = floorServiceObj;

router.post("/add", isAuth, create);
router.get("/find/:key", find);
router.get("/findAll", isAuth, findAll);
router.put("/update", isAuth, update);
router.delete("/delete/:_id", isAuth, remove);

module.exports.floorRouter = router;
