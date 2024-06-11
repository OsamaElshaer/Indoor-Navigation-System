const { floorRouter } = require("./routes/floor.routes");
const { accessPointRouter } = require("./routes/accesspoint.routes");
const { organizationRouter } = require("./routes/auth.routes");
const { navigateRouter } = require("./routes/navigate.routes");
const router = require("express").Router();
const { isAuth } = require("../middlewares/isAuth");




router.use("/organizations", organizationRouter);
router.use("/navigate", isAuth, navigateRouter);
router.use("/accessPoints", isAuth, accessPointRouter);
router.use("/floors", isAuth, floorRouter);

module.exports.router = router;
