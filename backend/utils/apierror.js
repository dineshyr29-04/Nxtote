class Apierror extends Error{
    constructor(statusCode, message,errors=[]) {
        super(message);
        this.statusCode = statusCode;
        this.success = false;
        this.error = this.errors;
    }
}
export default Apierror;