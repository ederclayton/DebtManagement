class AppError extends Error {
    constructor(message, status = 400) {
        super(message);
        this.status = status;
        console.log(`Error: ${message}`);
    }
}

module.exports = AppError;