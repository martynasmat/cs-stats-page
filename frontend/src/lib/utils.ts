export function round(value: number, digits = 0): number {
    return Math.round(value * 10 ** digits) / 10 ** digits;
}

export function formatDate(date: string | number): string {
    return new Date(date).toLocaleString(undefined, {
        dateStyle: "medium",
    });
}
