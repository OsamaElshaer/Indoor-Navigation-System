exports.errorHandlerGlobal = (err, req, res, next) => {
    err.httpStatusCode = err.httpStatusCode || 500;
    let response = {
        name: err.name,
        message: err.message,
        httpStatusCode: err.httpStatusCode,
    };
    if (process.env.NODE_ENV === "development") {
        response.stack = err.stack;
    }
    return res.status(err.httpStatusCode).json(response);
};
