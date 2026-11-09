const mongoose = require("mongoose");

// router.param handler: answers with the router's normal "not found" response
// when :id isn't a valid ObjectId, instead of letting Mongoose throw a CastError.
const validateObjectId = (notFoundBody) => (req, res, next, id) => {
    if (mongoose.isObjectIdOrHexString(id)) return next();
    res.status(404).json(notFoundBody);
};

module.exports = validateObjectId;
