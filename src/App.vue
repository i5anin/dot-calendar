<script setup>
import YearDots from "./components/YearDots.vue";

const dots = {
  // "2026-01-03": "white",
  // "2026-01-04": "orange",
};
</script>

<template>
  <YearDots :year="2026" :dots="dots" />
</template>
