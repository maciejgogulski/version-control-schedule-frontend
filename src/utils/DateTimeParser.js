import { format, parse, parseISO } from "date-fns"

export function parseToServerFormat(dateTimeString) {
    const parsedDate = parseISO(dateTimeString)
    return format(parsedDate, "yyyy-MM-dd HH:mm:ss")
}

export function parseFromServerFormat(dateTimeString) {
    if (!dateTimeString) return null;
    const parsedDate = parse(dateTimeString, 'yyyy-MM-dd HH:mm:ss', new Date())
    return format(parsedDate, 'yyyy-MM-dd HH:mm:ss')
}

export function extractTimeFromDateTimeString(dateTimeString) {
    if (!dateTimeString) return null
    const parsedDate = parse(dateTimeString, 'yyyy-MM-dd HH:mm:ss', new Date())

    return format(parsedDate, 'HH:mm')
}

export function extractDateFromDateTimeString(dateTimeString) {
    if (!dateTimeString) return null
    const parsedDate = parse(dateTimeString, 'yyyy-MM-dd HH:mm:ss', new Date())

    return format(parsedDate, 'yyyy-MM-dd')
}
