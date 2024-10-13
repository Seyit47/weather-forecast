import { format } from "date-fns";

export function formatDate(value: string | number) {
    const date = new Date(value);
    if (!date.valueOf()) {
        return "";
    }

    return format(date, "dd LLLL, EEEE | HH:mm");
}

export function formatDayOfWeek(value: string | number) {
    const date = new Date(value);
    if (!date.valueOf()) {
        return "";
    }

    return format(date, "EEEE");
}
