const express = require("express");
const router = express.Router();

const { positioning, routing } = require("../../services/navigate.service");

router.post("/positioning", positioning);
router.post("/routing", routing);

module.exports.navigateRouter = router;
