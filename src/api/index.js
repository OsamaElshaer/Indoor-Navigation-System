const { userRouter } = require("./routes/auth.routes");
const { navigateRouter } = require("./routes/navigate.routes");
const { accessPointRouter } = require("./routes/accesspoint.routes");
const router = require("express").Router();

router.use("/users", userRouter);
router.use("/navigate", navigateRouter);
router.use("/accessPoints", accessPointRouter);

module.exports.router = router;
