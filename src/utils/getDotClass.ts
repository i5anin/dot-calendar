import type { Cell } from "@/composables/useYearCalendar";
import { isBefore, isSameDay } from "date-fns";

export type DotKind = "muted" | "white" | "accent" | "bday";
export type DotsMap = Record<string, DotKind | undefined>;

export function getDotClass(cell: Cell, year: number, today: Date, dots: DotsMap) {
    if (!cell) return "is-empty";

    const d = cell.date;

    // 🎂 15 ноября (month=10)
    if (d.getMonth() === 10 && d.getDate() === 15) return "is-bday";

    const forced = dots[cell.key];
    if (forced) return `is-${forced}`;

    if (d.getFullYear() !== year) return "is-muted";
    if (isSameDay(d, today)) return "is-accent";
    if (isBefore(d, today)) return "is-white";

    return "is-muted";
}
