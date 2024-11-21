<template>
  <div :class="bemm()">
    <TimelinePageHeader :class="bemm('page-header')">
      <button v-for="type in types" :class="bemm('button', type.active ? 'active' : 'inactive')"
        @click="activeType = type.id">{{ type.label }}</button>
    </TimelinePageHeader>
    <div :class="bemm('container')">

      <template v-if="activeType == 3">
        <TimelineSidebarHeader type="users" :class="bemm('sidebar-header', 'users')" />
        <TimelineSidebarContainer :class="bemm('sidebar', 'users')">
          <TimelineSidebarUsers :entities="users" />
        </TimelineSidebarContainer>
      </template>
      <template v-if="activeType == 2">
        <TimelineSidebarHeader type="tasks" :class="bemm('sidebar-header', 'tasks')" />
        <TimelineSidebarContainer :class="bemm('sidebar', 'tasks')">
          <TimelineSidebarTasks :tasks="tasks" />
        </TimelineSidebarContainer>
      </template>
      <template v-if="activeType == 1">
        <TimelineSidebarHeader type="project" :class="bemm('sidebar-header', 'project')" />
        <TimelineSidebarContainer :class="bemm('sidebar', 'project')">
          <TimelineSidebarProjects :entities="projects" />
        </TimelineSidebarContainer>
      </template>

      <TimelineHeader :days="timeline" :class="bemm('timeline-header')" />
      <div :class="bemm('timeline-container')">
        <Timeline :days="timeline" :class="bemm('timeline')" :hasWorkload="activeType == 3" />
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { useBemm } from 'bemm'
import TimelineSidebarContainer from './TimelineSidebar/TimelineSidebarContainer.vue';
import TimelineHeader from './TimelineHeader.vue';
import Timeline from './Timeline.vue';
import TimelinePageHeader from './TimelinePageHeader.vue';
import TimelineSidebarHeader from './TimelineSidebar/TimelineSidebarHeader.vue';
import { computed, onMounted, ref } from 'vue';
import { Day, Entity, Task } from './Timeline.model';
import TimelineSidebarUsers from './TimelineSidebar/TimelineSidebarUsers.vue';
import TimelineSidebarTasks from './TimelineSidebar/TimelineSidebarTasks.vue';
import TimelineSidebarProjects from './TimelineSidebar/TimelineSidebarProjects.vue';
import { eventBus } from '../eventBus';

const bemm = useBemm('timeline-container', {
  includeBaseClass: true
});

const activeType = ref(1);
const types = computed(() => {
  return [
    {
      label: 'Project',
      id: 1,
      active: activeType.value === 1
    },
    {
      label: 'Task',
      id: 2,
      active: activeType.value === 2
    },
    {
      label: 'User',
      id: 3,
      active: activeType.value === 3
    }
  ]
})

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
  })
})


const generateRandomTasks = (opts: { amount: number }) => {
  let currentStartDay = 0;

  return Array.from({ length: opts.amount }, (_, index) => {
    const lengthInDays = Math.floor(Math.random() * 12) + 1;
    const startDay = currentStartDay;
    currentStartDay += lengthInDays;

    return {
      label: `Task ${index}`,
      id: index.toString(),
      lengthInDays,
      startDay
    } as Task;
  });
};


const collapsedUsers = ref(['Goofy']);

const users = computed<Entity[]>(() => {

  // const tasks = generateRandomTasks({ amount: 5});
  return ['Mickey', 'Minnie', 'Goofy', 'Pluto', 'Donald', 'Aladdin', 'Hercules', 'Ariel', 'Pinocchio', 'Robin Hood'].map((entity, index) => {
    return {
      label: entity,
      id: index.toString(),
      collapsed: collapsedUsers.value.includes(entity),
      lanes: Array.from({ length: entity.length - 4 }, (_, index) => {
        return {
          label: `Lane ${index}`,
          id: index.toString(),
          tasks: []
        }
      })
    }
  }) as Entity[]
})

const projects = computed<Entity[]>(() => {
  const randomNumbers = [3, 3, 2, 6, 3, 2, 5, 4, 3, 2];
  return ['Project 1', 'Project 2', 'Project 3', 'Project 4', 'Project 5', 'Project 6', 'Project 7', 'Project 8', 'Project 9', 'Project 10'].map((entity, index) => {
    return {
      label: entity,
      id: index.toString(),
      lanes: Array.from({ length: randomNumbers[index] }, (_, index) => {
        return {
          label: `Lane ${index}`,
          id: index.toString(),
        }
      })
    }
  }) as Entity[]
})

const tasks = computed<Task[]>(() => {
  return generateRandomTasks({ amount: 20 });
})

const usersTimeline = computed<Day[]>(() => {
  const daysOfTheYear = Array.from({ length: 365 }, (_, index) => index);
  return daysOfTheYear.map((day, index) => {
    return {
      label: `${day}`,
      id: index.toString(),
      entities: users.value
    } as Day;
  }) as Day[]
});

const projectTimeline = computed<Day[]>(() => {
  const daysOfTheYear = Array.from({ length: 365 }, (_, index) => index);
  return daysOfTheYear.map((day, index) => {
    return {
      label: `${day}`,
      id: index.toString(),
      entities: projects.value
    } as Day;
  }) as Day[]
});

const timeline = computed(() => {

  switch (activeType.value) {
    case 1:
      return projectTimeline.value;
    case 2:
      return usersTimeline.value;
    case 3:
      return usersTimeline.value;
    default:
      return projectTimeline.value;
  }
})


</script>

<style lang="scss">
.timeline-container {
  --timeline-day-width: 30px;
  --timeline-header-height: 80px;
  --timeline-width: 400vw;
  --timeline-sidebar-width: 400px;
  --timeline-lane-height: 80px;
  --timeline-workload-height: var(--timeline-lane-height);
  --timeline-border-color: purple;

  background-color: #c2c2c2;
  overflow: auto;

  &__page-header {
    position: sticky;
    top: 0;
    background-color: rgb(255, 255, 255);
  }

  &__container {
    position: relative;
    display: grid;
    grid-template-areas:
      "timeline-sidebar-header timeline-container"
      "timeline-sidebar timeline-header"
      "timeline-sidebar timeline-container";
    overflow: auto;
    height:  calc(100vh - var(--page-header-height) - var(--timeline-header-height));
    z-index: 5;
    padding-top: var(--timeline-header-height);
    align-content: start;
  }

  &__sidebar {
    width: var(--timeline-sidebar-width);
    position: sticky;
    left: 0;

    z-index: 12;
    grid-area: timeline-sidebar;

    min-height: calc(100vh - var(--page-header-height) - (var(--timeline-header-height) * 2));
    background-color: rgba(4, 4, 4, 0.75);

    &--tasks {
      top: 0;
    }
  }

  &__sidebar-header {
    width: var(--timeline-sidebar-width);
    height: var(--timeline-header-height);
    grid-area: timeline-sidebar-header;
    z-index: 50;
    position: sticky;
    left: 0;
    top: 0;
    transform: translateY(calc(var(--timeline-header-height) * -1));
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
  }

  &__timeline-container {
    grid-area: timeline-container;
    position: relative;
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
