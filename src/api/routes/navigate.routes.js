const express = require("express");
const router = express.Router();

const { positioning } = require("../../services/navigate.service");

router.post("/positioning", positioning);

module.exports.navigateRouter = router;
