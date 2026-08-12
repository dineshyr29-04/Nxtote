exports.errorhandler = (err, req, res, next) => {
    const statusCode = err.statusCode || 500;
    res.status(statusCode).json({
        success: false,
        message: err.message || "Internal Server Error",
        ...(err.errors?.length && {
            errors: err.errors,
        }),
    });
};
