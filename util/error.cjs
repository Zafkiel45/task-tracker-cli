class GenericErrors extends Error {
    constructor(message, type) {
        super(message);

        this.name = this.constructor.name;
        this.type = type;

        Error.captureStackTrace(this, this.constructor);
    }
}

module.exports = {
    GenericErrors
}