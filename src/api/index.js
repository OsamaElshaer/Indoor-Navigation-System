const { userRouter } = require("./routes/auth.routes");
const { navigateRouter } = require("./routes/navigate.routes");
const router = require("express").Router();

router.use("/users", userRouter);
router.use("/navigate", navigateRouter);

module.exports.router = router;
