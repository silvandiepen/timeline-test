<template>
  <div :class="bemm()">
    <div v-for="day in days" :key="day.id" :class="bemm('day')">
      <div :class="bemm('day-label')">
        {{ day.label }}
        </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { useBemm } from 'bemm'
import { PropType } from 'vue';
import { Day } from './Timeline.model';
const bemm = useBemm('timeline-header');

defineProps({
  days: {
    type: Array as PropType<Day[]>,
    required: true
  }
})
</script>

<style lang="scss">
.timeline-header {

  background-color: #4fbff7;
  @include global.days();
  display: flex;

  &__day {
    width: var(--timeline-day-width, 100px);
    position: relative;
    display: flex; align-items: center; justify-content: center;
  }
  &__day-label{
    width: 2em;
    height: 2em; text-align: center; font-size: .66em;
    background-color: rgb(255, 255, 255);
    color: black;
    font-weight: bold;
    border-radius: 2px;
    line-height: 2em;
  }
}
</style>
