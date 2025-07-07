
/**
 * Represents an HTTP error with a status code and message.
 *
 * @remarks
 * Used to signal HTTP errors in API handlers and services.
 *
 * @example
 * ```ts
 * throw new HttpError(404, 'Resource not found');
 * ```
 */
export class HttpError extends Error {
    /** HTTP status code for the error. */
    public status: number;

    /**
     * Constructs a new HttpError instance.
     * @param status - The HTTP status code.
     * @param message - The error message.
     */
    constructor(status: number, message: string) {
        super(message);
        this.status = status;
        this.name = 'HttpError';
        Object.setPrototypeOf(this, HttpError.prototype);
    }
}
