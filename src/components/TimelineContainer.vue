<template>

  <div :class="bemm()" :style="{ '--sidebar-width': sidebarWidth + 'px', '--taskbar-width': taskbarWidth + 'px' }">

    <TimelinePageHeader :class="bemm('page-header')">
      <button v-for="type in types" :key="type.id" :class="bemm('button', type.active ? 'active' : 'inactive')"
        @click="activeType = type.id">
        {{ type.label }}
      </button>
    </TimelinePageHeader>

    <div :class="bemm('wrapper')">

      <TimelineTaskBar :class="bemm('taskbar')" :active="activeType == 2" :collapsed="activeTaskbar">
        <TimelineSidebarTasks :tasks="tasks" />
      </TimelineTaskBar>

      <div :class="bemm('container', {
        'has-active-taskbar': !activeTaskbar && activeType === 2,
        'has-inactive-taskbar': activeTaskbar && activeType === 2
      })">
        <template v-if="activeType === 2">
          <TimelineSidebarHeader type="users" :class="bemm('sidebar-header', 'users')" />
          <TimelineSidebarContainer :class="bemm('sidebar', 'users')">
            <TimelineSidebarUsers :entities="users" :collapsedEntities="collapsedUsers" />
          </TimelineSidebarContainer>
        </template>
        <template v-if="activeType === 1">
          <TimelineSidebarHeader type="project" :class="bemm('sidebar-header', 'project')" />
          <TimelineSidebarContainer :class="bemm('sidebar', 'project')">
            <TimelineSidebarProjects :entities="projects" />
          </TimelineSidebarContainer>
        </template>

        <TimelineHeader :days="timelineDays" :class="bemm('timeline-header')" />
        <div :class="bemm('timeline-container')">
          <Timeline :days="timelineDays" :entities="activeEntities" :class="bemm('timeline')"
            :hasWorkload="activeType === 2" :collapsedEntities="collapsedUsers" />
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { useBemm } from 'bemm'
import { computed, onMounted, ref } from 'vue';
import { Day, Entity, Task } from './Timeline.model';
import TimelineSidebarContainer from './TimelineSidebar/TimelineSidebarContainer.vue';
import TimelineHeader from './TimelineHeader.vue';
import Timeline from './Timeline.vue';
import TimelinePageHeader from './TimelinePageHeader.vue';
import TimelineSidebarHeader from './TimelineSidebar/TimelineSidebarHeader.vue';
import TimelineSidebarUsers from './TimelineSidebar/TimelineSidebarUsers.vue';
import TimelineSidebarTasks from './TimelineSidebar/TimelineSidebarTasks.vue';
import TimelineSidebarProjects from './TimelineSidebar/TimelineSidebarProjects.vue';
import TimelineTaskBar from './TimelineTaskBar.vue';
import { eventBus } from '../eventBus';

import { useCache } from '../composables/useCache';


const bemm = useBemm('timeline-container', {
  includeBaseClass: true
});
const { getCachedValue } = useCache();



const taskbarWidth = ref(400);
const sidebarWidth = ref(400);



const activeType = ref(1);
const activeTaskbar = ref(false);
const collapsedUsers = ref(['Goofy']);

const types = computed(() => [
  { label: 'Projects', id: 1, active: activeType.value === 1 },
  { label: 'Users', id: 2, active: activeType.value === 2 }
]);

// Generate timeline days
const timelineDays = computed<Day[]>(() => {
  return Array.from({ length: 365 }, (_, index) => ({
    label: index.toString(),
    id: index.toString()
  }));
});

// Generate random tasks helper
const generateRandomTasks = (opts: { amount: number, noOverlap?: boolean }) => {
  const tasks = [];
  let currentStartDay = 0;

  for (let i = 1; i < opts.amount + 1; i++) {
    const lengthInDays = Math.floor(Math.random() * 12) + 1;
    const maxStartDay = 365 - lengthInDays;

    if (opts.noOverlap) {
      if (currentStartDay > maxStartDay) {
        break; // No more tasks can fit within the remaining days
      }
      const startDay = currentStartDay;
      tasks.push({
        label: `Task ${i}`,
        id: i.toString(),
        lengthInDays,
        startDay
      });
      currentStartDay = startDay + lengthInDays;
    } else {
      const startDay = Math.floor(Math.random() * (maxStartDay + 1));
      tasks.push({
        label: `Task ${i}`,
        id: i.toString(),
        lengthInDays,
        startDay
      });
    }
  }

  return tasks;
};
// Generate tasks for lanes
const generateLaneTasks = (laneCount: number, id: string) => {
  return Array.from({ length: laneCount }, (_, index) =>
    getCachedValue(`randomTasks-${laneCount}-${id}-${index}`, generateRandomTasks({ amount: Math.floor(Math.random() * 3) + 1 }))
  );
};

// Users with tasks
const users = computed<Entity[]>(() => {
  const userNames = getCachedValue('users', ['Mickey', 'Minnie', 'Goofy', 'Pluto', 'Donald', 'Aladdin', 'Hercules', 'Ariel', 'Pinocchio', 'Robin Hood']);

  return userNames.map((name, index) => {
    const laneCount = name.length - 4;
    const laneTasks = generateLaneTasks(5, `user-${index}`);

    return {
      label: name,
      id: index.toString(),
      lanes: Array.from({ length: laneCount }, (_, laneIndex) => ({
        label: `Lane ${laneIndex}`,
        id: `${index}-${laneIndex}`,
        tasks: laneTasks[laneIndex]
      }))
    };
  });
});

// Projects structure
const projects = computed<Entity[]>(() => {
  const randomNumbers = getCachedValue('project-lanes', [3, 3, 2, 6, 3, 2, 5, 4, 3, 2]);

  return Array.from({ length: 10 }, (_, index) => {
    const laneCount = randomNumbers[index];
    const laneTasks = generateLaneTasks(10, `project-${index + 1}`);

    return {
      label: `Client ${index + 1}`,
      id: index.toString(),
      lanes: Array.from({ length: laneCount }, (_, laneIndex) => ({
        label: `Project ${index + 1}-${laneIndex + 1}`,
        id: `${index}-${laneIndex}`,
        tasks: laneTasks[laneIndex]
      }))
    };
  });
});

// Tasks list
const tasks = computed<Task[]>(() => {
  return getCachedValue('random-tasks', generateRandomTasks({ amount: 20 }));
});

// Active entities based on selected type
const activeEntities = computed(() => {
  switch (activeType.value) {
    case 1:
      return projects.value;
    case 2:
    case 3:
      return users.value;
    default:
      return projects.value;
  }
});

// Event handling
onMounted(() => {
  eventBus.on('collapseEntity', (data: any) => {
    if (data.entity) {
      const index = collapsedUsers.value.indexOf(data.entity);
      if (index > -1) {
        collapsedUsers.value.splice(index, 1);
      } else {
        collapsedUsers.value.push(data.entity);
      }
    }
  });

  eventBus.on('toggle-taskbar', () => {
    activeTaskbar.value = !activeTaskbar.value;
  });

  eventBus.on('drag-handle',(d:any)=>{
    console.log(d)
  })
});
</script>

<style lang="scss">
.timeline-container {
  --timeline-day-width: 30px;
  --timeline-header-height: 80px;
  --timeline-sidebar-width: var(--sidebar-width);
  --timeline-lane-height: 80px;
  --timeline-workload-height: var(--timeline-lane-height);
  --timeline-border-color: purple;

  --day-color-odd: rgba(150, 14, 14, 0);
  --day-color-even: rgba(0, 0, 0, .025);
  --day-color-weekend-odd: rgba(0, 0, 0, .06);
  --day-color-weekend-even: rgba(0, 0, 0, .075);

  --timeline-workload-color-1: rgba(204, 115, 204, .25);
  --timeline-workload-color-2: rgba(204, 115, 204, .5);
  --timeline-workload-background-color: rgb(255, 255, 255, .75);

  --timeline-taskbar-width: var(--taskbar-width);
  --timeline-taskbar-width--collapsed: 80px;

  background-color: #c2c2c2;
  display: flex;
  flex-direction: column;

  &__page-header {
    position: sticky;
    top: 0;
    background-color: rgb(255, 255, 255);
    z-index: 15;
  }

  &__wrapper {
    flex-direction: row;
    display: flex;
    width: calc(100vw - var(--page-sidebar-width));

  }

  &__container {
    position: relative;
    display: grid;
    z-index: 1;
    grid-template-areas:
      "timeline-sidebar-header timeline-container"
      "timeline-sidebar timeline-header"
      "timeline-sidebar timeline-container";
    overflow: auto;
    height: calc(100vh - var(--page-header-height) - var(--timeline-header-height));
    z-index: 5;
    padding-top: var(--timeline-header-height);
    align-content: start;
    transition: width .3s ease-in-out;
    width: calc(100vw - var(--page-sidebar-width));

    &--has-active-taskbar {
      width: calc(100vw - var(--page-sidebar-width) - var(--timeline-taskbar-width));
    }

    &--has-inactive-taskbar {
      width: calc(100vw - var(--page-sidebar-width) - var(--timeline-taskbar-width--collapsed));
    }
  }

  &__taskbar {
    position: relative;
  }

  &__sidebar {
    width: var(--timeline-sidebar-width);
    position: sticky;
    left: 0;
    z-index: 12;
    grid-area: timeline-sidebar;
    min-height: calc(100vh - var(--page-header-height) - (var(--timeline-header-height) * 2));
    background-color: rgba(4, 4, 4, 0.75);
    z-index: 20;

    &--tasks {
      top: 0;
    }
  }

  &__sidebar-header {
    width: var(--timeline-sidebar-width);
    height: var(--timeline-header-height);
    grid-area: timeline-sidebar-header;
    position: sticky;
    left: 0;
    top: 0;
    transform: translateY(calc(var(--timeline-header-height) * -1));
    z-index: 40;
  }

  &__timeline {
    grid-area: timeline-timeline;
  }

  &__timeline-header {
    height: var(--timeline-header-height);
    grid-area: timeline-header;
    z-index: 10;
    transform: translateY(calc(var(--timeline-header-height) * -1));
    position: sticky;
    top: 0;
    z-index: 30;
  }

  &__timeline-container {
    grid-area: timeline-container;
    position: relative;
    z-index: 10;

  }

  &__button {
    border: none;
    padding: .5em;
    font-size: 1em;
    background-color: black;
    color: white;
    border-radius: 4px;
    opacity: .5;

    &:hover {
      opacity: .75;
    }

    &--active {
      opacity: 1;
    }
  }
}
</style>
