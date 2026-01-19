<template>
  <div class="yd-root">
    <div class="yd-grid">
      <section v-for="m in months" :key="m.month" class="yd-month">
        <div class="yd-month-title">{{ m.title }}</div>

        <div class="yd-dots">
          <div
              v-for="(cell, i) in m.cells"
              :key="i"
              class="yd-dot"
              :class="dotClass(cell)"
          />
        </div>
      </section>
    </div>

    <div class="yd-footer">
      <span class="yd-accent">{{ daysLeft }} д ост.</span>
      <span class="yd-dim">&nbsp;·&nbsp;</span>
      <span class="yd-dim">{{ percentDone }}%</span>
    </div>
  </div>
</template>

<script setup>
import { computed } from "vue";

const props = defineProps({
  year: { type: Number, default: () => new Date().getFullYear() },
  locale: { type: String, default: () => navigator.language || "en-US" },
  weekStartsOn: { type: Number, default: 1 }, // 0 Sun, 1 Mon...
  // optional override map: "YYYY-MM-DD" -> "muted"|"white"|"accent"
  dots: { type: Object, default: () => ({}) },
});

const pad2 = (n) => String(n).padStart(2, "0");
const ymd = (d) =>
    `${d.getFullYear()}-${pad2(d.getMonth() + 1)}-${pad2(d.getDate())}`;

const today = computed(() => {
  const t = new Date();
  return new Date(t.getFullYear(), t.getMonth(), t.getDate());
});

const yearStart = computed(() => new Date(props.year, 0, 1));

const daysInYear = computed(() => {
  const a = yearStart.value;
  const b = new Date(props.year + 1, 0, 1);
  return Math.round((b - a) / 86400000);
});

const dayOfYear = (d) => Math.floor((d - yearStart.value) / 86400000) + 1;

const daysLeft = computed(() => {
  if (today.value.getFullYear() !== props.year) return daysInYear.value;
  return Math.max(0, daysInYear.value - dayOfYear(today.value));
});

const percentDone = computed(() => {
  if (today.value.getFullYear() !== props.year) return 0;
  const done = Math.min(daysInYear.value, Math.max(0, dayOfYear(today.value)));
  return Math.round((done / daysInYear.value) * 100);
});

const startOffset = (date) => {
  const js = date.getDay(); // 0..6
  return (js - props.weekStartsOn + 7) % 7;
};

const monthTitleFmt = computed(
    () => new Intl.DateTimeFormat(props.locale, { month: "short" })
);

const makeMonth = (month) => {
  const first = new Date(props.year, month, 1);
  const next = new Date(props.year, month + 1, 1);
  const days = Math.round((next - first) / 86400000);
  const offset = startOffset(first);

  const total = offset + days;
  const rows = Math.ceil(total / 7);

  const cells = Array.from({ length: rows * 7 }, (_, i) => {
    const day = i - offset + 1;
    if (day < 1 || day > days) return null;
    const d = new Date(props.year, month, day);
    return { date: d, key: ymd(d) };
  });

  return { month, title: monthTitleFmt.value.format(first), cells };
};

const months = computed(() =>
    Array.from({ length: 12 }, (_, m) => makeMonth(m))
);

const dotClass = (cell) => {
  if (!cell) return "is-empty";

  const t = today.value;
  const time = cell.date.getTime();
  const isToday =
      cell.date.getFullYear() === t.getFullYear() &&
      cell.date.getMonth() === t.getMonth() &&
      cell.date.getDate() === t.getDate();

  // 🎂 15 ноября — розовый (каждый год)
  if (cell.date.getMonth() === 10 && cell.date.getDate() === 15) return "is-bday";

  const forced = props.dots[cell.key];
  if (forced) return `is-${forced}`;

  if (cell.date.getFullYear() !== props.year) return "is-muted";
  if (isToday) return "is-accent";
  if (time < t.getTime()) return "is-white";
  return "is-muted";
};

</script>

<style scoped>
.yd-root {
  --bg: #0f1012;
  --text: #cfcfd1;
  --dim: #8a8a8f;
  --dot: #2a2b2f;
  --white: #e9e9ee;
  --accent: #ff6a00;

  background: var(--bg);
  color: var(--text);
  padding: 18px 18px 14px;
  border-radius: 18px;
  width: fit-content;
  user-select: none;
}

.yd-grid {
  display: grid;
  grid-template-columns: repeat(3, auto);
  gap: 18px 34px;
}

.yd-month-title {
  color: var(--dim);
  font-size: 14px;
  margin: 0 0 8px;
  letter-spacing: 0.2px;
  text-transform: capitalize;
}

.yd-dots {
  display: grid;
  grid-template-columns: repeat(7, 10px);
  gap: 6px;
}

.yd-dot {
  width: 10px;
  height: 10px;
  border-radius: 999px;
  background: var(--dot);
  box-shadow: inset 0 0 0 1px rgba(255, 255, 255, 0.03);
}

.yd-dot.is-empty {
  background: transparent;
  box-shadow: none;
}

.yd-dot.is-muted {
  background: var(--dot);
}

.yd-dot.is-white {
  background: var(--white);
}

.yd-dot.is-accent {
  background: var(--accent);
  box-shadow:
      0 0 0 2px rgba(255, 106, 0, 0.25),
      inset 0 0 0 1px rgba(255, 255, 255, 0.05);
}

.yd-footer {
  margin-top: 14px;
  display: flex;
  justify-content: center;
  font-size: 18px;
  letter-spacing: 0.2px;
}

.yd-accent {
  color: var(--accent);
  font-weight: 600;
}

.yd-dim {
  color: var(--dim);
}
.yd-dot.is-bday {
  background: #ff4fd8;
  box-shadow:
      0 0 0 2px rgba(255, 79, 216, 0.25),
      inset 0 0 0 1px rgba(255, 255, 255, 0.05);
}

</style>
