const { floorRouter } = require("./routes/floor.routes");
const { accessPointRouter } = require("./routes/accesspoint.routes");
const { userRouter } = require("./routes/auth.routes");
const { navigateRouter } = require("./routes/navigate.routes");
const router = require("express").Router();

router.use("/users", userRouter);
router.use("/navigate", navigateRouter);
router.use("/accessPoints", accessPointRouter);
router.use("/floors", floorRouter);

module.exports.router = router;
