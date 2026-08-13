exports.errorhandler = (err, req, res, next) => {
    //default values for normal API errors.
    let statusCode = err.statusCode || 500;
    let message = err.message || "Internal Server Error";
    let error = err.errors || [];

    if (err.code) {
        switch (err.code) {
            case "42501":
                statusCode = 404;
                message = "Access Denied You are not permitted";
                break;
            case "23505":
                statusCode = 409;
                message = "Data Already Exists";
                break;
            case "PGRST116":
                statusCode = 404;
                message = "Requested Item Not found";
                break;
            case "22P02":
                statusCode = 400;
                message = "Invalid Format";
                break;
            default:
                statusCode = 500;
                message = "Internal Server Error";
                break;
        }
    }
    res.status(statusCode).json({
        success: false,
        message: message || "Internal Server Error",
        ...(err.errors?.length && {
            errors: err.errors,
        }),
    });
};
