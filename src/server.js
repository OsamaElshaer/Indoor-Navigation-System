const { httpServer } = require("./loaders/app");
const { port } = require("./config/env");
const { logger } = require("./utils/logger");
const { mongoConnect } = require("./loaders/database");
mongoConnect();
const server = httpServer.listen(port, async () => {
    logger.info("server on running", { port: port });
});
process.on("unhandledRejection", (err) => {
    console.log(err);
    logger.error("Unhandled Promise Rejection:", err.message);
    server.close((error) => {
        if (error) {
            logger.error(
                "Error occurred while closing the server:",
                error.message
            );
            process.exit(1);
        }
        logger.error("Server gracefully shut down");
        process.exit(1);
    });
});
process.on("uncaughtException", (err) => {
    console.log(err);
    logger.error("Uncaught Exception:");
    server.close(() => {
        logger.error("Server shut down due to uncaught exception", err.message);
        process.exit(1);
    });
});
