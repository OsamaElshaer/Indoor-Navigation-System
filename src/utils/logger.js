const { createLogger, format, transports } = require("winston");
const { combine, timestamp, printf, colorize, metadata, errors, json } = format;

class Logger {
    constructor(name) {
        this.name = name;
        this.logger = createLogger({
            level: "info",
            defaultMeta: { service: this.name },
            transports: [
                process.env.NODE_ENV === "development"
                    ? new transports.Console({
                          format: combine(
                              timestamp(),
                              format.metadata({
                                  fillExcept: [
                                      "timestamp",
                                      "service",
                                      "level",
                                      "message",
                                  ],
                              }),
                              colorize(),
                              this.winstonConsoleFormat()
                          ),
                      })
                    : new transports.File({
                          filename: `./logs/${this.name}.log`,
                          format: combine(
                              timestamp(),
                              format.metadata({
                                  fillExcept: [
                                      "timestamp",
                                      "service",
                                      "level",
                                      "message",
                                  ],
                              }),
                              errors({ stack: true }),
                              json(),
                              this.winstonConsoleFormat()
                          ),
                      }),
            ],
        });
    }

    winstonConsoleFormat() {
        return printf(({ timestamp, level, message, metadata }) => {
            const metadataString = metadata ? JSON.stringify(metadata) : "";
            return `[${timestamp}][${level}] ${message} ${metadataString}`;
        });
    }

    debug(log, metadata) {
        this.logger.debug(log, metadata);
    }

    info(log, metadata) {
        this.logger.info(log, metadata);
    }

    warn(log, metadata) {
        this.logger.warn(log, metadata);
    }

    error(log, metadata) {
        this.logger.error(log, metadata);
    }

    // if want to make custom log level
    log(level, message, metadata) {
        this.logger.log(level, message, metadata);
    }
}

module.exports.logger = new Logger("Chatty");
