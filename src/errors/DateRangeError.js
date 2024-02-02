export default class DateRangeError extends Error {
    constructor(message) {
        super(message);
        this.name = 'DateRangeError';
    }
}
