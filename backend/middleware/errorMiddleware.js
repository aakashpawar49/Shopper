// JSON 404 for routes that don't exist (Express would otherwise send HTML).
const notFound = (req, res) => {
    res.status(404).json({ message: `Not found - ${req.originalUrl}` });
};

// Central error handler. Every error response keeps the { message } shape the
// frontend reads. Express only treats it as error middleware because it takes
// four arguments, so `next` must stay in the signature.
const errorHandler = (err, req, res, next) => {
    if (res.headersSent) return next(err);

    let status = err.status || err.statusCode || 500;
    let message = "Server Error";

    if (err.name === "CastError") {
        // Malformed value for a typed field, e.g. an invalid ObjectId
        status = 400;
        message = `Invalid ${err.path}`;
    } else if (err.name === "ValidationError") {
        status = 400;
        message = Object.values(err.errors)
            .map((error) => error.message)
            .join(", ");
    } else if (err.code === 11000) {
        status = 400;
        const fields = Object.keys(err.keyValue || {}).join(", ");
        message = `Duplicate value for ${fields || "a unique field"}`;
    } else if (err.name === "MulterError") {
        status = err.code === "LIMIT_FILE_SIZE" ? 413 : 400;
        message = err.message;
    } else if (status < 500 && err.expose) {
        // Client errors raised by Express/body-parser, e.g. malformed JSON
        message = err.message;
    }

    if (status >= 500) console.error(err);

    res.status(status).json({ message });
};

module.exports = { notFound, errorHandler };
