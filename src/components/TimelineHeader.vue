<template>
  <div :class="bemm()">
    <div v-for="day in days" :key="day.id" :class="bemm('day',{
      'first-day': day.label == '1'
    })">
      <div :class="bemm('month-label')" v-if="day.label == '1'">
        {{ getMonthName(day.month) }}
      </div>
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
const bemm = useBemm('timeline-header',{
  includeBaseClass: true
});

defineProps({
  days: {
    type: Array as PropType<Day[]>,
    required: true
  }
})

const getMonthName = (month: number) => {
  const months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
  return months[month - 1];
}
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

    &--first-day{
      box-shadow: 2px 0 0 rgba(0,0,0,.25) inset;
    }
  }
  &__day-label{
    width: 3em;
    height: 3em; text-align: center; font-size: .5em;
    // background-color: rgb(255, 255, 255,.25);
    color: black;
    font-weight: bold;
    border-radius: 50%;
    line-height: 3em;
  }
  &__month-label{
    position: absolute;left: 0; top: 0;
    padding: 1em;
    color: black;
    font-size: .5em;
    font-weight: bold; text-transform: uppercase;
  }
}
</style>
