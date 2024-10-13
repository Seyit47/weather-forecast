const HTTP_CODE_UNAUTHORIZED = 401;
const HTTP_CODE_FORBIDDEN = 403;
const HTTP_CODE_NOT_FOUND = 404;
const HTTP_CODE_REQUEST_ABORTED = 497;
const HTTP_CODE_REQUEST_RETRY = 498;
const HTTP_CODE_CUSTOM_ERROR = 499;

export function createUnauthorizedError() {
    return createError({
        name: "unauthorized",
        statusCode: HTTP_CODE_UNAUTHORIZED,
        statusMessage: "Unauthorized",
    });
}

export function createForbiddenError() {
    return createError({
        name: "forbidden",
        statusCode: HTTP_CODE_FORBIDDEN,
        statusMessage: "Forbidden",
    });
}

export function createNotFoundError() {
    return createError({
        name: "not-found",
        statusCode: HTTP_CODE_NOT_FOUND,
        statusMessage: "Not found",
    });
}

export function createRequestRetryError() {
    return createError({
        name: "request-retry",
        statusCode: HTTP_CODE_REQUEST_RETRY,
        statusMessage: "Request retry",
    });
}

export function createRequestAbortedError() {
    return createError({
        name: "request-aborted",
        statusCode: HTTP_CODE_REQUEST_ABORTED,
        statusMessage: "Request aborted",
    });
}

export function createCustomError(messages: string[]) {
    return createError({
        name: "custom-error",
        statusCode: HTTP_CODE_CUSTOM_ERROR,
        statusMessage: "Custom error",
        message: messages[0],
        data: {
            messages,
        },
    });
}

export function isUnauthorizedError(error: any) {
    return (
        error?.statusCode === HTTP_CODE_UNAUTHORIZED ||
        error?.response?.status === HTTP_CODE_UNAUTHORIZED
    );
}

export function isForbiddenError(error: any) {
    return (
        error?.statusCode === HTTP_CODE_FORBIDDEN || error?.response?.status === HTTP_CODE_FORBIDDEN
    );
}

export function isNotFoundError(error: any) {
    return (
        error?.statusCode === HTTP_CODE_NOT_FOUND || error?.response?.status === HTTP_CODE_NOT_FOUND
    );
}

export function isCustomError(error: any) {
    return error?.statusCode === HTTP_CODE_CUSTOM_ERROR;
}

export function isRequestAbortedError(error: any) {
    return error?.statusCode === HTTP_CODE_REQUEST_ABORTED;
}

export function isRequestRetryError(error: any) {
    return error?.statusCode === HTTP_CODE_REQUEST_RETRY;
}
