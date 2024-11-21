<template>
  <div :class="bemm('', {
    active: isActive,
    inactive: !isActive,
    collapsed: isCollapsed,
    open: !isCollapsed
  })">
    <div :class="bemm('container')">

      <div :class="bemm('header')" @click="toggleTaskBar()">
        Tasks

    <div :class="[bemm('drag-handle'),'drag-handle']"></div>
      </div>
      <div :class="bemm('tasks-container', {
        open: !isCollapsed
      })">
        <slot></slot>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { useBemm } from 'bemm'
import { ref, watch } from 'vue';
import { eventBus } from '../eventBus';

const bemm = useBemm('timeline-taskbar');

const props = defineProps({
  active: {
    type: Boolean,
    default: false
  },
  collapsed: {
    type: Boolean,
    default: false
  }
})
const isActive = ref(props.active);
const isCollapsed = ref(props.collapsed);

watch(() => props.collapsed, (newVal: boolean) => {
  isCollapsed.value = newVal
})
watch(() => props.active, (newVal: boolean) => {
  isActive.value = newVal
})

const toggleTaskBar = () => {
  eventBus.emit('toggle-taskbar');
}



</script>

<style lang="scss">
.timeline-taskbar {
  height: calc(100vh - var(--page-header-height) - var(--timeline-header-height));
  z-index: 10;
  width: var(--timeline-taskbar-width);
  transition: width .3s ease-in-out;
  position: relative;


  &::before {
    pointer-events: none;
    content: "";
    top: 0;
    width: var(--timeline-taskbar-shadow-width, 2em);
    opacity: var(--timeline-taskbar-shadow-opacity, 1);
    height: 100%;
    position: absolute;
    left: 100%;
    background-image: linear-gradient(to right, rgba(0, 0, 0, .2), rgba(0, 0, 0, 0));
    transition: all .3s ease-in-out;

  }

  &__drag-handle{
    position: absolute; top: 50%; right: 1em;
    transform: translateY(-50%);
  }


  &__container {
    overflow: scroll;
  }

  &--active.timeline-taskbar--collapsed {
    width: var(--timeline-taskbar-width--collapsed);

    --timeline-taskbar-shadow-width: 1em;
    --timeline-taskbar-shadow-opacity: .5;

  }

  &--active.timeline-taskbar--open {
    width: var(--timeline-taskbar-width);
  }

  &--inactive {
    width: 0;

    --timeline-taskbar-shadow-width: 1em;
    --timeline-taskbar-shadow-opacity: 0;

    .timeline-taskbar__container {
      overflow: hidden;

    }
  }

  &__header {
    padding: 1em;
    position: sticky;
    top: 0;
    height: var(--timeline-header-height);
    z-index: 2;
    background-color: rgb(123, 64, 159);
  }

  &__tasks-container {
    background-color: #ebdea5;
    display: flex;
    flex-direction: column;
    clip-path: inset(0 0 100% 0%);
    transition: clip-path .3s ease-in-out;

    &--open {
      transition: clip-path .3s ease-in-out;
      clip-path: inset(0 0 0 0);
    }
  }
}
</style>
