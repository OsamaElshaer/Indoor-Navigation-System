class CustomError extends Error {
    constructor(name, httpStatusCode, message, status) {
        super(message);
        this.name = name;
        this.httpStatusCode = httpStatusCode;
        this.status = `${httpStatusCode}`.startsWith(4)
            ? "Server Error "
            : "Client Error";
    }
}

module.exports = CustomError;
