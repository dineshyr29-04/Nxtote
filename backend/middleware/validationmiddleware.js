const Apierror = require("../utils/apierror");

exports.validate = (schema) => {
    return (req, res, next) => {
        const result = schema.safeParse(req.body);
        if (!result.success) {
            const errors = result.error.issues.map((issue) => ({
                field: issue.path.join("."),
                message: issue.message,
            }));

            return next(new Apierror(400, "Internal Server Error", errors));
        }
        req.body = result.data;
        next();
    };
};
