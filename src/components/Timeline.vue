<template>
  <div :class="bemm()">
    <div v-for="entity in entities" :key="entity.id" :class="bemm('entity')">
      <div :class="bemm('workload')" v-if="hasWorkload">
        <div :class="bemm('workload-day')" v-for="(day, index) in days" :key="day.id"
          :style="`--workload: ${getWorkload(index, entity.id)}`">
        </div>
      </div>
      <div :class="bemm('lanes', {
        collapsed: collapsedEntities.includes(entity.label)
      })" :style="`--entity-lanes-length: ${entity.lanes.length}`">
        <div v-for="lane in entity.lanes" :key="lane.id" :class="bemm('lane')" v-if="!entity.collapsed">
          <div :class="bemm('days')">
            <div v-for="day in days" :key="day.id" :class="bemm('day')">
              <template v-for="task in getLaneTasksForDay(lane, day)" :key="task.id">
                <div :class="bemm('task')" :style="getTaskStyle(task)" v-if="isTaskStartDay(task, day)">
                  {{ task.label }}
                </div>
              </template>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { defineProps, PropType } from 'vue'
import * as b from 'bemm'
import { Day, Entity, Task } from './Timeline.model';

const bemm = b.useBemm('timeline');

defineProps({
  days: {
    type: Array as PropType<Day[]>,
    required: true
  },
  entities: {
    type: Array as PropType<Entity[]>,
    required: true
  },
  hasWorkload: {
    type: Boolean,
    default: false
  },
  collapsedEntities: {
    type: Array as PropType<string[]>,
    default: () => []
  }
});
import { useCache } from '../composables/useCache';

const { getCachedValue } = useCache();

const getWorkload = (index: number,id:string) => {
  return getCachedValue(`workload-${index}-${id}`,index % 7 === 5 || index % 7 === 6 ? 0 : randomNumberBetween(10, 90));
};

const randomNumberBetween = (min: number, max: number) => {
  return Math.floor(Math.random() * (max - min + 1) + min)
}

const getLaneTasksForDay = (lane: any, day: Day) => {
  return lane.tasks?.filter((task: Task) => {
    const taskEndDay = task.startDay + task.lengthInDays;
    return task.startDay <= parseInt(day.label) && taskEndDay > parseInt(day.label);
  }) || [];
};

const isTaskStartDay = (task: Task, day: Day) => {
  return task.startDay === parseInt(day.label);
};

const getTaskStyle = (task: Task) => {
  return {
    '--task-length': `${task.lengthInDays}`,
    '--task-start': `${task.startDay}`
  };
};
</script>

<style lang="scss">
.timeline {
  background-color: white;
  display: flex;
  flex-direction: column;
  height: fit-content;
  width: fit-content;

  &__workload {
    background-color: rgba(255, 255, 255, .5);
    width: fit-content;
    display: flex;
    @include global.days();
  }

  &__workload-day {
    width: var(--timeline-day-width, 100px);
    height: var(--timeline-workload-height, 100px);
    background-image: linear-gradient(to top,
        var(--timeline-workload-color-1),
        var(--timeline-workload-color-2) calc(var(--workload, 50) * 1%),
        var(--timeline-workload-background-color) calc(var(--workload, 50) * 1%),
        var(--timeline-workload-background-color));
  }

  &__entity {
    display: flex;
    flex-direction: column;
    box-shadow: 0 -2px 0 0 var(--timeline-border-color) inset;
  }

  &__lane {
    position: relative;
    height: var(--timeline-lane-height, 80px);
    box-shadow: 0 -1px 0 0 color-mix(in srgb, var(--timeline-border-color), transparent 75%) inset;
  }

  &__lanes {
    display: flex;
    flex-direction: column;
    height: calc(var(--timeline-lane-height) * var(--entity-lanes-length));
    transition: all .3s ease-in-out;
    clip-path: inset(0 0 0 0);
    &--collapsed {
      height: 0px;
      transition: all .3s ease-in-out;

      clip-path: inset(0 0 100% 0);
    }
  }

  &__days {
    display: flex;
    flex-direction: row;
    height: 100%;
    @include global.days();
  }

  &__day {
    width: var(--timeline-day-width, 100px);
    height: 100%;
    position: relative;
  }

  &__task {
    position: absolute;
    height: calc(var(--timeline-lane-height) - 1em);
    background-color: rgba(204, 115, 204, 0.5);
    box-shadow: 0 0 0 2px rgba(204, 115, 204, 1) inset;
    border-radius: 1em;
    padding: 1em;
    margin: .5em .1em;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
    width: calc(var(--task-length, 1) * var(--timeline-day-width, 100px) - .2em);
  }
}
</style>
