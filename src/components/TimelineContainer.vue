<template>

  <div :class="bemm()"
    :style="{ '--sidebar-width': sidebarWidth + 'px', '--taskbar-width': taskbarWidth + 'px', '--zoom': zoom }">

    <TimelinePageHeader :class="bemm('page-header')">
      <div></div>
      <div :class="bemm('type-group')">
        <button v-for="type in types" :key="type.id" :class="bemm('button', type.active ? 'active' : 'inactive')"
          @click="activeType = type.id">
          {{ type.label }}
        </button>

      </div>
      <div :class="bemm('actions')">
        <button :disabled="!canZoomIn" @click="zoomIn">zoom in</button>
        <button :disabled="!canZoomOut" @click="zoomOut">zoom out</button>
      </div>
    </TimelinePageHeader>

    <div :class="bemm('wrapper')">

      <TimelineTaskBar :class="bemm('taskbar')" :active="activeType == 2" :collapsed="activeTaskbar"
        :width="taskbarWidth">
        <TimelineSidebarTasks :tasks="tasks" />
      </TimelineTaskBar>

      <div ref="scrollContainer" :class="bemm('container', {
        'has-active-taskbar': !activeTaskbar && activeType === 2,
        'has-inactive-taskbar': activeTaskbar && activeType === 2
      })">
        <template v-if="activeType === 2">
          <TimelineSidebarHeader type="users" :class="bemm('sidebar-header', 'users')" :width="sidebarWidth" />
          <TimelineSidebarContainer :class="bemm('sidebar', 'users')">
            <TimelineSidebarUsers :entities="users" :collapsedEntities="collapsedUsers" />
          </TimelineSidebarContainer>
        </template>
        <template v-if="activeType === 1">
          <TimelineSidebarHeader type="project" :class="bemm('sidebar-header', 'project')" :width="sidebarWidth" />
          <TimelineSidebarContainer :class="bemm('sidebar', 'project')">
            <TimelineSidebarProjects :entities="projects" />
          </TimelineSidebarContainer>
        </template>

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
import { computed, onMounted, ref, nextTick } from 'vue';
import { Day, Entity, Task, taskNames, exampleUserNames, clientNames, projectNames } from './Timeline.model';

import TimelineSidebarContainer from './TimelineSidebar/TimelineSidebarContainer.vue';
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

const scrollContainer = ref<HTMLElement | null>(null);
const taskbarWidth = ref(400);
const sidebarWidth = ref(400);

const activeType = ref(1);
const activeTaskbar = ref(false);
const collapsedUsers = ref(['Goofy']);


// Zoom
const zoom = ref(1);
const zoomIn = () => {
  const centerDay = getCenterDay();

  console.log(centerDay)

  if (centerDay) {
    zoom.value += 0.5;
    setTimeout(() => {
      scrollToDay(centerDay);
    }, 100);
  }
};
const zoomOut = () => {
  const centerDay = getCenterDay();

  if (centerDay) {
    zoom.value -= 0.5;
    setTimeout(() => {
      scrollToDay(centerDay);
    }, 100);
  }
};
const canZoomIn = computed(() => zoom.value < 3);
const canZoomOut = computed(() => zoom.value > 0.5);

// Types
const types = computed(() => [
  { label: 'Projects', id: 1, active: activeType.value === 1 },
  { label: 'Users', id: 2, active: activeType.value === 2 }
]);

// Generate timeline days
const timelineDays = computed<Day[]>(() => {
  const days = [];
  const today = new Date();
  const startDate = new Date(today);
  startDate.setFullYear(today.getFullYear() - 1);
  const endDate = new Date(today);
  endDate.setFullYear(today.getFullYear() + 1);

  const isToday = (date: Date) => {
    return date.getDate() === today.getDate() &&
      date.getMonth() === today.getMonth() &&
      date.getFullYear() === today.getFullYear();
  };

  let currentDate = new Date(startDate);
  let dayIndex = 0;

  while (currentDate <= endDate) {
    days.push({
      label: currentDate.getDate().toString(),
      id: dayIndex.toString(),
      month: currentDate.getMonth() + 1,
      year: currentDate.getFullYear(),
      isToday: isToday(currentDate),
      date: new Date(currentDate)
    });

    currentDate.setDate(currentDate.getDate() + 1);
    dayIndex++;
  }

  return days;
});

// Generate random tasks helper
const generateRandomTasks = (opts: { amount: number, noOverlap?: boolean, timelineDays: Day[] }): Task[] => {
  const getRandomTaskName = (index: number) => {
    if (index < taskNames.length) return taskNames[index];
    return `${taskNames[index % taskNames.length]} ${Math.floor(index / taskNames.length) + 1}`;
  };

  const tasks: Task[] = [];
  const usedDays = new Set<number>();

  for (let i = 1; i < opts.amount + 1; i++) {
    const lengthInDays = Math.floor(Math.random() * 12) + 1;
    const maxStartIndex = opts.timelineDays.length - lengthInDays;

    if (maxStartIndex < 0) break;

    let startDayIndex = Math.floor(Math.random() * (maxStartIndex + 1));

    if (opts.noOverlap) {
      let overlap = true;
      let attempts = 0;
      const maxAttempts = 100;

      while (overlap && attempts < maxAttempts) {
        overlap = false;
        for (let j = 0; j < lengthInDays; j++) {
          if (usedDays.has(startDayIndex + j)) {
            overlap = true;
            startDayIndex = Math.floor(Math.random() * (maxStartIndex + 1));
            break;
          }
        }
        attempts++;
      }

      if (attempts === maxAttempts) continue;

      for (let j = 0; j < lengthInDays; j++) {
        usedDays.add(startDayIndex + j);
      }
    }

    const startDay = new Date(opts.timelineDays[startDayIndex].date);
    tasks.push({
      label: getRandomTaskName(i - 1),
      id: i.toString(),
      lengthInDays,
      startDay,
    });
  }

  return tasks;
};
// Generate tasks for lanes
const generateLaneTasks = (laneCount: number, id: string): Task[] => {
  return getCachedValue(`randomTasks-${laneCount}-${id}`, generateRandomTasks({ amount: Math.floor(Math.random() * 3) + 1, noOverlap: true, timelineDays: timelineDays.value }));
};

const getRandomUsers = (users: string[], min: number, max: number) => {
  const numberOfUsers = Math.floor(Math.random() * (max - min + 1)) + min;
  const shuffledUsers = users.sort(() => 0.5 - Math.random());
  return shuffledUsers.slice(0, numberOfUsers);
};

const getRandomProjectName = () => {
  return projectNames[Math.floor(Math.random() * projectNames.length)];
};
const getRandomClientName = () => {
  return clientNames[Math.floor(Math.random() * clientNames.length)];
};


// Users with tasks
const users = computed<Entity[]>(() => {
  const userNames = getCachedValue('users', getRandomUsers(exampleUserNames, 5, 10));

  return userNames.map((name, index) => {
    const laneCount = name.length - 4;

    return {
      label: name,
      id: index.toString(),
      lanes: Array.from({ length: laneCount }, (_, laneIndex) => ({
        label: `Lane ${laneIndex}`,
        id: `${index}-${laneIndex}`,
        tasks: generateLaneTasks(20, `user-${index}-${laneIndex}`)
      }))
    };
  });
});



// Projects structure
const projects = computed<Entity[]>(() => {
  const randomNumbers = getCachedValue('project-lanes', [3, 3, 2, 6, 3, 2, 5, 4, 3, 2]);

  return Array.from({ length: 10 }, (_, index) => {
    const laneCount = randomNumbers[index];

    return {
      label: getCachedValue(`client-${index}`, getRandomClientName()),
      id: index.toString(),
      lanes: Array.from({ length: laneCount }, (_, laneIndex) => ({
        label: getCachedValue(`project-${index}-${laneIndex}`, getRandomProjectName()),
        id: `${index}-${laneIndex}`,
        tasks: generateLaneTasks(20, `project-${index + 1}-${laneIndex}`)
      }))
    };
  });
});

// Tasks list
const tasks = computed<Task[]>(() => {
  return getCachedValue('random-tasks', generateRandomTasks({ amount: 20, noOverlap: true, timelineDays: timelineDays.value }));
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

const getCenterDay = () => {
  const container = scrollContainer.value;
  if (!container) return 0;

  const rect = container.getBoundingClientRect();

  // Find today position relative to scroll container
  const timelineElement = container.querySelector('.timeline__days');
  if (!timelineElement) return 0;

  const dayWidth = parseFloat(getComputedStyle(document.documentElement)
    .getPropertyValue('--timeline-day-width')
    .replace('rem', '')) * 16;

  const scrollLeft = container.scrollLeft;

  // Calculate which day is in the center
  const centerDay = Math.round((scrollLeft + (rect.width / 2) - sidebarWidth.value) / dayWidth);

  return Math.max(0, Math.min(centerDay, timelineDays.value.length - 1));
};

const scrollToDay = (day: number) => {
  if (!scrollContainer.value) return;

  const dayWidth = parseFloat(getComputedStyle(document.documentElement)
    .getPropertyValue('--timeline-day-width')
    .replace('px', ''));

  const targetPosition = (day * dayWidth) + sidebarWidth.value;
  const containerWidth = scrollContainer.value.clientWidth;
  const scrollPosition = targetPosition - (containerWidth / 2);

  scrollContainer.value.scrollTo({
    left: scrollPosition,
    behavior: 'instant'
  });
};

const scrollToToday = () => {
  const container = scrollContainer.value;
  const todayElement = container?.querySelector('.timeline__day--today');

  if (!container || !todayElement) return;

  const containerRect = container.getBoundingClientRect();
  const todayRect = todayElement.getBoundingClientRect();

  // Calculate scroll position that will center today
  const scrollPosition = todayRect.left + container.scrollLeft - containerRect.left - (containerRect.width / 2);

  container.scrollTo({
    left: scrollPosition,
    behavior: 'instant'
  });
};


// Event handling
onMounted(() => {

  nextTick(() => {
    scrollToToday();
  });

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

  eventBus.on('drag-handle', (d: any) => {
    switch (d.elementId) {
      case 'timeline-sidebar':
        sidebarWidth.value = Math.round(d.value);
        console.log('sidebar', d);
        break;
      case 'timeline-taskbar':
        taskbarWidth.value = Math.round(d.value);
        break;
    }
  })
});
</script>

<style lang="scss">
.timeline-container {
  --timeline-day-width: calc(2rem * var(--zoom, 1));
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
      "timeline-sidebar timeline-container";
    overflow: auto;
    height: calc(100vh - var(--page-header-height) - var(--timeline-header-height));
    z-index: 5;
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
    // transform: translateY(calc(var(--timeline-header-height) * -1));
    z-index: 40;
  }

  &__timeline {
    grid-area: timeline-timeline;
  }

  &__timeline-header {
    height: var(--timeline-header-height);
    grid-area: timeline-header;
    z-index: 10;
    // transform: translateY(calc(var(--timeline-header-height) * -1));
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
