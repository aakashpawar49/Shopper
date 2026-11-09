// Wraps an async route handler so rejected promises reach the error middleware
// instead of every route repeating its own try/catch.
const asyncHandler = (handler) => (req, res, next) =>
    Promise.resolve(handler(req, res, next)).catch(next);

module.exports = asyncHandler;
