const { validationResult } = require("express-validator");
const customError = require("../utils/customError");
const { ObjectId } = require("mongodb");

class AcessPointService {
    constructor(APmodel) {
        this.APmodel = APmodel;
    }

    add = async (req, res, next) => {
        try {
            const { name, coordinates, metaData } = req.body;
            const AP = {
                name,
                coordinates,
                metaData,
                orgId: new ObjectId(req.org.orgId),
            };

            const errors = validationResult(req);
            if (!errors.isEmpty()) {
                throw new customError("createAP", 422, errors.array()[0].msg);
            }
            const result = await this.APmodel.add(AP);
            return res.status(201).json({
                msg: "new access point added",
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
                throw new customError("findAP", 422, errors.array()[0].msg);
            }
            const result = await this.APmodel.find("_id", key);
            return res.status(200).json({
                msg: "Found Access Point",
                data: result,
            });
        } catch (error) {
            next(error);
        }
    };
    findAll = async (req, res, next) => {
        try {
            const orgId = req.org.orgId
            const result = await this.APmodel.findAll(orgId);
            return res.status(200).json({
                msg: "all access points data",
                data: result,
            });
        } catch (error) {
            next(error);
        }
    };

    update = async (req, res, next) => {
        try {
            const { _id, name, coordinates } = req.body;
            const APobj = { name: name, coordinates: coordinates };
            const errors = validationResult(req);
            if (!errors.isEmpty()) {
                throw new customError("update", 422, errors.array()[0].msg);
            }
            const result = await this.APmodel.update(_id, APobj);
            return res.status(201).json({
                msg: "access point has been successfully updated",
                data: result,
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

            const result = await this.APmodel.remove(_id);
            return res.status(204).json({
                msg: "Access point has been deleted",
                data: result,
            });
        } catch (error) {
            next(error);
        }
    };
}

exports.AcessPointService = AcessPointService;
