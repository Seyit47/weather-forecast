export function getMessage(message: object | string | number) {
    if (typeof message === "string") {
        return [message];
    }
    if (typeof message === "number") {
        return [getMessageByCode(message)];
    }
    if (typeof message === "object") {
        return [getMessageByCode((message as any)?.response?.status)];
    }

    return ["An unknown error occured"];
}

export function getMessageByCode(code: number) {
    switch (code) {
        case 400:
            return "Bad Request.";

        case 401:
            return "Unauthorized.";

        case 403:
            return "Forbidden.";

        case 404:
            return "Not found.";

        case 409:
            return "Too many requests.";

        case 413:
            return "File is too large.";

        default:
            return "Error occured";
    }
}
