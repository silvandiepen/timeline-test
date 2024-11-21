<template>
  <div :class="bemm()">
    <TimelineHeader :class="bemm('header')" :days="days"></TimelineHeader>

    <div v-for="entity in entities" :key="entity.id" :class="bemm('entity')">
      <div :class="bemm('workload')" v-if="hasWorkload">
        <div :class="bemm('workload-days')" :style="getDaysGridStyle()">
          <div v-for="(day, index) in days" :key="day.id" :class="bemm('workload-day', { 'today': day.isToday })"
            :style="`--workload: ${getWorkload(index, entity.id)}`">
          </div>
        </div>
      </div>

      <div :class="bemm('lanes', {
        collapsed: collapsedEntities.includes(entity.label)
      })" :style="`--entity-lanes-length: ${entity.lanes.length}`">
        <div v-for="lane in entity.lanes" :key="lane.id" :class="bemm('lane')" v-if="!entity.collapsed">
          <div :class="bemm('days')" :style="getDaysGridStyle()">
            <div v-for="task in lane.tasks" :key="task.id" :class="bemm('task')" :style="getTaskStyle(task)">
              {{ task.label }}
            </div>
            <div v-for="day in days" :key="day.id" :class="bemm('day', { 'today': day.isToday })"
              :data-day="day.id"
              :style="getDayStyle(day)">
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { defineProps, PropType, computed, ref, onMounted } from 'vue'
import { useBemm } from 'bemm'
import { Day, Entity, Task } from './Timeline.model';
import { useCache } from '../composables/useCache';
import TimelineHeader from './TimelineHeader.vue';

const bemm = useBemm('timeline', {
  includeBaseClass: true
});

const props = defineProps({
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

const { getCachedValue } = useCache();

const totalDays = computed(() => props.days.length);

const getDayStyle = (day: Day) => {
  const column = props.days.findIndex(d => d.id === day.id) + 1;
  return {
    'grid-column': column,
    'grid-row': '1 / -1'
  };
};

const getDaysGridStyle = () => ({
  '--total-days': totalDays.value,
  'grid-template-columns': `repeat(${totalDays.value}, var(--timeline-day-width))`,
});

const getWorkload = (index: number, id: string) => {
  return getCachedValue(
    `workload-${index}-${id}`,
    index % 7 === 5 || index % 7 === 6 ? 0 : randomNumberBetween(10, 90)
  );
};

const randomNumberBetween = (min: number, max: number) => {
  return Math.floor(Math.random() * (max - min + 1) + min)
}

const timelineStartDate = ref(new Date());

onMounted(() => {
  timelineStartDate.value = new Date(props.days[0].date);
});

const getTaskStyle = (task: Task) => {

  console.log('task:', task);
  const taskStartDate = new Date(task.startDay); // Assuming task.startDate is a string in 'YYYY-MM-DD' format
  const daysFromStart = Math.floor((taskStartDate.getTime() - timelineStartDate.value.getTime()) / (1000 * 60 * 60 * 24));

  console.log('taskStartDate:', taskStartDate);
  console.log('timelineStartDate:', timelineStartDate.value);


  return {
    '--task-length': task.lengthInDays,
    'left':  `calc(${daysFromStart} * var(--timeline-day-width))`,
    'width': `calc(${task.lengthInDays} * var(--timeline-day-width) - 0.2em)`
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

  &__header{
    position: sticky;
    top: 0;
    height: var(--timeline-header-height);
    z-index: 2;
  }

  &__workload {
    background-color: rgba(255, 255, 255, .5);
    width: 100%;
  }

  &__workload-days {
    display: grid;
    width: fit-content;
  }

  &__workload-day {
    position: relative;
    width: var(--timeline-day-width);
    height: var(--timeline-workload-height);
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
    display: grid;
    position: relative;
    height: 100%;
    width: calc(var(--total-days) * var(--timeline-day-width));
    grid-template-columns: repeat(var(--total-days), var(--timeline-day-width));

    @include global.days();
  }

  &__day {
    position: relative;
    width: var(--timeline-day-width);
    height: 100%;
    grid-row: 1 / -1;

  }

  &__day,
  &__workload-day {

    &--today {
      --today-color: #FFC107;
      --today-line-width: 2px;
      --timeline-workload-color-1: rgb(130, 184, 117,.25);
      --timeline-workload-color-2: rgb(130, 184, 117,.75);

      &::before {
        position: absolute;
        left: 50%;
        top: 0;
        bottom: 0;
        width: var(--today-line-width);
        background-color: var(--today-color);
        z-index: 1;
        content: "";
        display: block;
      }
    }
  }

  &__task {
    position: absolute;
    height: calc(var(--timeline-lane-height) - 1em);
    background-color: rgba(204, 115, 204, 0.5);
    box-shadow: 0 0 0 2px rgba(204, 115, 204, 1) inset;
    border-radius: 1em;
    padding: 1em;
    margin: .5em 0;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
    z-index: 2;
  }
}
</style>
