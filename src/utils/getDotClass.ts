import type { Cell } from "@/composables/useYearCalendar";

export type DotKind = "muted" | "white" | "accent" | "bday";
export type DotsMap = Record<string, DotKind | undefined>;

export function getDotClass(
    cell: Cell,
    year: number,
    today: Date,
    dots: DotsMap
) {
    if (!cell) return "is-empty";

    const d = cell.date;
    const time = d.getTime();

    // 🎂 15 ноября (month=10)
    if (d.getMonth() === 10 && d.getDate() === 15) return "is-bday";

    const forced = dots[cell.key];
    if (forced) return `is-${forced}`;

    if (d.getFullYear() !== year) return "is-muted";
    if (
        d.getFullYear() === today.getFullYear() &&
        d.getMonth() === today.getMonth() &&
        d.getDate() === today.getDate()
    )
        return "is-accent";

    if (time < today.getTime()) return "is-white";
    return "is-muted";
}
