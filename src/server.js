const { httpServer } = require("./loaders/app");
const { port } = require("./config/env");
const { logger } = require("./utils/logger");
const { mongoConnect } = require("./loaders/database");

const cluster = require("cluster");
const { client } = require("./loaders/redis");
const numCPUs = require("os").cpus().length;

// if (cluster.isMaster) {
//     logger.log(`Master ${process.pid} is running`);

//     for (let i = 0; i < numCPUs; i++) {
//         cluster.fork();
//     }

//     cluster.on("exit", (worker, code, signal) => {
//         logger.log(`Worker ${worker.process.pid} died`);
//         logger.log("Forking a new worker...");
//         cluster.fork();
//     });
// } else {
mongoConnect();
const server = httpServer.listen(port, async () => {
    logger.info("server on running", { port: port });
});
logger.log(`Worker ${process.pid} started`);
process.on("unhandledRejection", (err) => {
    logger.log(err);
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
    logger.log(err);
    logger.error("Uncaught Exception:");
    server.close(() => {
        logger.error("Server shut down due to uncaught exception", err.message);
        process.exit(1);
    });
});
// }
