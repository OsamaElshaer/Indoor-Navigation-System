const { EventEmitter } = require("events");
const { logger } = require("./logger");
const emitter = new EventEmitter();

emitter.on("audit", (e) => {
    logger.info(JSON.stringify(e));
});

exports.audit = (model, action, by, method, statusCode) => {
    const auditData = {
        model,
        action,
        by,
        date: new Date(),
        method,
        statusCode,
    };
    emitter.emit("audit", auditData);
};
