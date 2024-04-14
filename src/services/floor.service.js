const { validationResult } = require("express-validator");
const customError = require("../utils/customError");

class FloorService {
    constructor(floorModel) {
        this.floorModel = floorModel;
    }
    create = async (req, res, next) => {
        try {
            const { floorPlan } = req.body;

            const errors = validationResult(req);
            if (!errors.isEmpty()) {
                throw new customError(
                    "addfloorPlan",
                    422,
                    errors.array()[0].msg
                );
            }
            const result = await this.floorModel.add(floorPlan);
            return res.status(201).json({
                msg: "new a floor Plan added",
                data: result,
            });
        } catch (error) {
            next(error);
        }
    };

    find = async (req, res, next) => {
        try {
            const key = req.params.key;
            const errors = validationResult(req);
            if (!errors.isEmpty()) {
                throw new customError(
                    "find Floor plan",
                    422,
                    errors.array()[0].msg
                );
            }
            const result = await this.floorModel.find("_id", key);
            return res.status(200).json({
                msg: "Found floor plan",
                data: result,
            });
        } catch (error) {
            next(error);
        }
    };
    findAll = async (req, res, next) => {
        try {
            const result = await this.floorModel.findAll();
            return res.status(200).json({
                msg: "all floor plans ",
                data: result,
            });
        } catch (error) {
            next(error);
        }
    };

    update = async (req, res, next) => {
        try {
            const { _id, floorPlan } = req.body;
            const errors = validationResult(req);
            if (!errors.isEmpty()) {
                throw new customError("update", 422, errors.array()[0].msg);
            }
            const result = await this.floorModel.update(_id, floorPlan);
            return res.status(201).json({
                msg: "floor plan has been successfully updated",
                data: { status: result.acknowledged },
            });
        } catch (error) {
            next(error);
        }
    };

    remove = async (req, res, next) => {
        try {
            const _id = req.params._id;

            const errors = validationResult(req);
            if (!errors.isEmpty()) {
                return res.status(400).json({ errors: errors.array() });
            }

            const result = await this.floorModel.remove(_id);
            return res.json({
                msg: "floor plan has been deleted",
                data: result,
            });
        } catch (error) {
            next(error);
        }
    };
}

module.exports.FloorService = FloorService;
