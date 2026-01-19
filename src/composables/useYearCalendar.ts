import { computed } from "vue";

export type Cell = { date: Date; key: string } | null;
export type MonthVM = { month: number; title: string; cells: Cell[] };

const pad2 = (n: number) => String(n).padStart(2, "0");
const ymd = (d: Date) =>
    `${d.getFullYear()}-${pad2(d.getMonth() + 1)}-${pad2(d.getDate())}`;

export function useYearCalendar(
    year: number,
    locale: string,
    weekStartsOn: number
) {
    const today = computed(() => {
        const t = new Date();
        return new Date(t.getFullYear(), t.getMonth(), t.getDate());
    });

    const yearStart = new Date(year, 0, 1);

    const daysInYear = Math.round(
        (new Date(year + 1, 0, 1).getTime() - yearStart.getTime()) / 86400000
    );

    const dayOfYear = (d: Date) =>
        Math.floor((d.getTime() - yearStart.getTime()) / 86400000) + 1;

    const daysLeft = computed(() =>
        today.value.getFullYear() !== year
            ? daysInYear
            : Math.max(0, daysInYear - dayOfYear(today.value))
    );

    const percentDone = computed(() =>
        today.value.getFullYear() !== year
            ? 0
            : Math.round((dayOfYear(today.value) / daysInYear) * 100)
    );

    const startOffset = (date: Date) =>
        (date.getDay() - weekStartsOn + 7) % 7;

    const monthTitleFmt = new Intl.DateTimeFormat(locale, { month: "short" });

    const makeMonth = (month: number): MonthVM => {
        const first = new Date(year, month, 1);
        const next = new Date(year, month + 1, 1);
        const days = Math.round(
            (next.getTime() - first.getTime()) / 86400000
        );

        const offset = startOffset(first);
        const rows = Math.ceil((offset + days) / 7);

        const cells: Cell[] = Array.from({ length: rows * 7 }, (_, i) => {
            const day = i - offset + 1;
            if (day < 1 || day > days) return null;
            const d = new Date(year, month, day);
            return { date: d, key: ymd(d) };
        });

        return { month, title: monthTitleFmt.format(first), cells };
    };

    const months = computed(() =>
        Array.from({ length: 12 }, (_, m) => makeMonth(m))
    );

    return { today, months, daysLeft, percentDone };
}
