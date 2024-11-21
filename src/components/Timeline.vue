<template>
  <div :class="bemm()">


    <div v-for="day in days" :key="day.id" :class="bemm('day')">

      <div v-for="entity in day.entities" :key="entity.id" :class="bemm('entity')">
        <div :class="bemm('workload')" :style="`--workload: ${randomNumberBetween(10, 90)}`" v-if="hasWorkload"></div>
        <div v-for="lane in entity.lanes" :key="lane.id" :class="bemm('lane')" v-if="!entity.collapsed">
            <div v-for="task in lane.tasks" :key="task.id" :class="bemm('task')" :style="`--task-length: ${task.lengthInDays}; --task-start: ${task.startDay}`">
              {{ task.label }}
            </div>
        </div>
      </div>
    </div>

  </div>
</template>

<script lang="ts" setup>
import {  defineProps, PropType } from 'vue'

import * as b from 'bemm'
import { Day } from './Timeline.model';
const bemm = b.useBemm('timeline');
defineProps({
  days: {
    type: Array as PropType<Day[]>,
    required: true
  },
  hasWorkload: {
    type: Boolean,
    default: false
  },
  isCollapsed: {
    type: Boolean,
    default: false
  }
})


// const tasks = computed(() => {
//   const allTasks = props.days.flatMap(day =>
//     day.entities.flatMap(entity =>
//       entity.lanes.flatMap(lane =>
//         lane.tasks.map(task => ({
//           ...task,
//           laneId: lane.id
//         }))
//       )
//     )
//   );

//   return allTasks;
// });

const randomNumberBetween = (min: number, max: number) => {
  return Math.floor(Math.random() * (max - min + 1) + min)
}

</script>

<style lang="scss">
.timeline {
  background-color: white;
  display: flex;
  flex-direction: column;
  height: fit-content;
  width: fit-content;
  @include global.days();

  overflow: none;
  display: flex;
  flex-direction: row;

  &__workload {
    background-color: rgba(255, 255, 255, .5);
    height: var(--timeline-workload-height, 100px);
    display: flex;
    flex-direction: row;
    background-image: linear-gradient(to bottom, transparent, transparent calc(var(--workload, 50) * 1%), rgb(204, 115, 204) calc(var(--workload, 50) * 1%), rgb(204, 115, 204));
  }


  &__day {
    width: var(--timeline-day-width, 100px);
    display: flex;
    flex-direction: column;
  }


  &__lane {
    height: var(--timeline-lane-height, 80px);
    box-shadow: 0 -1px 0 0 color-mix(in srgb, var(--timeline-border-color), transparent 75%) inset;
    width: var(--timeline-day-width);
  }

  &__entity {
    height: var(--timeline-entity-lane-height);
    box-shadow: 0 -2px 0 0 var(--timeline-border-color) inset;
    width: var(--timeline-day-width);
  }
}
</style>
