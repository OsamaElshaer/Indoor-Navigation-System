const { userRouter } = require("./routes/auth.routes");
const router = require("express").Router();

router.use("/users", userRouter);

module.exports.router = router;
