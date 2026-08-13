class apiResponse {
    constructor( success, message, data = []) {
        this.success = success;
        this.message = message;
        this.data = data;
    }
}
module.exports = apiResponse;