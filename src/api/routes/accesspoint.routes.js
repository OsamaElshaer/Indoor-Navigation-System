const express = require("express");
const router = express.Router();

const {
    addAPvalidation,
    findAPvalidation,
    UpdateAPvalidation,
    deleteValidator,
} = require("../../utils/validations/accessPoint.validation");


const { AcessPointService } = require("../../services/accessPoint.service");
const { AccessPointModel } = require("../../models/accessPoints.model");

const APmodelObj = new AccessPointModel();
const APserviseObj = new AcessPointService(APmodelObj);

const { add, find, update, remove, findAll } = APserviseObj;

router.post("/add", addAPvalidation, add);
router.get("/find/:key", findAPvalidation, find);
router.get("/findAll", findAll);
router.put("/update", UpdateAPvalidation, update);
router.delete("/delete/:_id", deleteValidator, remove);

module.exports.accessPointRouter = router;
