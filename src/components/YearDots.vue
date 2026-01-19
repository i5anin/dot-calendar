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

<script setup lang="ts">
import { withDefaults, defineProps } from "vue";
import { useYearCalendar } from "@/composables/useYearCalendar";
import { getDotClass, type DotsMap } from "@/utils/getDotClass";

const props = withDefaults(
    defineProps<{
      year?: number;
      locale?: string;
      weekStartsOn?: number;
      dots?: DotsMap;
    }>(),
    {
      year: () => new Date().getFullYear(),
      locale: () => navigator.language || "en-US",
      weekStartsOn: 1,
      dots: () => ({}),
    }
);

const { today, months, daysLeft, percentDone } =
    useYearCalendar(props.year, props.locale, props.weekStartsOn);

const dotClass = (cell: any) =>
    getDotClass(cell, props.year, today.value, props.dots);
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
  box-shadow: 0 0 0 2px rgba(255, 106, 0, 0.25), inset 0 0 0 1px rgba(255, 255, 255, 0.05);
}

.yd-dot.is-bday {
  background: #ff4fd8;
  box-shadow: 0 0 0 2px rgba(255, 79, 216, 0.25), inset 0 0 0 1px rgba(255, 255, 255, 0.05);
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
</style>
