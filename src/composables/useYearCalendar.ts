import { computed } from "vue";
import { format, getDay, getDayOfYear, getDaysInMonth, getDaysInYear, startOfToday } from "date-fns";

export type Cell = { date: Date; key: string } | null;
export type MonthVM = { month: number; title: string; cells: Cell[] };

const ymd = (d: Date) => format(d, "yyyy-MM-dd");

export function useYearCalendar(year: number, locale: string, weekStartsOn: number) {
    const today = computed(() => startOfToday());

    const yearStart = new Date(year, 0, 1);
    const daysInYear = getDaysInYear(yearStart);

    const dayOfYear = (d: Date) => getDayOfYear(d);

    const daysLeft = computed(() =>
        today.value.getFullYear() !== year ? daysInYear : Math.max(0, daysInYear - dayOfYear(today.value))
    );

    const percentDone = computed(() =>
        today.value.getFullYear() !== year ? 0 : Math.round((dayOfYear(today.value) / daysInYear) * 100)
    );

    const startOffset = (date: Date) => (getDay(date) - weekStartsOn + 7) % 7;

    const monthTitleFmt = new Intl.DateTimeFormat(locale, { month: "short" });

    const makeMonth = (month: number): MonthVM => {
        const first = new Date(year, month, 1);
        const days = getDaysInMonth(first);

        const offset = startOffset(first);
        const rows = Math.ceil((offset + days) / 7);

        const cells: Cell[] = new Array(rows * 7);
        for (let i = 0; i < cells.length; i++) {
            const day = i - offset + 1;
            if (day < 1 || day > days) {
                cells[i] = null;
                continue;
            }
            const d = new Date(year, month, day);
            cells[i] = { date: d, key: ymd(d) };
        }

        return { month, title: monthTitleFmt.format(first), cells };
    };

    const months = computed(() => {
        const res: MonthVM[] = new Array(12);
        for (let m = 0; m < 12; m++) res[m] = makeMonth(m);
        return res;
    });

    return { today, months, daysLeft, percentDone };
}
