const { floorRouter } = require("./routes/floor.routes");
const { accessPointRouter } = require("./routes/accesspoint.routes");
const { organizationRouter } = require("./routes/auth.routes");
const { navigateRouter } = require("./routes/navigate.routes");
const router = require("express").Router();

router.use("/organizations", organizationRouter);
router.use("/navigate", navigateRouter);
router.use("/accessPoints", accessPointRouter);
router.use("/floors", floorRouter);

module.exports.router = router;
