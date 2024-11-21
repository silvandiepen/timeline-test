<template>
  <div :class="bemm('')">
    <div v-for="task in tasks" :key="task.id" :class="bemm('task')">
      {{ task.label }}
    </div>
  </div>
</template>

<script lang="ts" setup>
import { PropType } from 'vue';
import { Task } from '../Timeline.model';
import { useBemm } from 'bemm';
const bemm = useBemm('timeline-sidebar-tasks');

defineProps({
  tasks: {
    type: Array as PropType<Task[]>,
    required: true
  }
})


</script>

<style lang="scss">
.timeline-sidebar-tasks {
  position: sticky; top: 0; left: 0;

  width: var(--timeline-taskbar-width);
  transition: width .3s ease-in-out;

  &__task {
    background-color: #ffffff;
    width: 100%;
    box-shadow: 0 -2px 0 0 color-mix(in srgb, var(--timeline-border-color), transparent 75%) inset;
    padding: 1em;
    color: black;
    font-weight: bold;
    overflow: hidden;
    white-space: nowrap;
    text-overflow: ellipsis;
  }

}
</style>
