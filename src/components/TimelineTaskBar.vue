<template>
  <div :class="bemm('', {
    active: isActive,
    inactive: !isActive,
    collapsed: isCollapsed,
    open: !isCollapsed
  })">

    <div :class="bemm('header')" @click="toggleTaskBar()">
      Tasks
    </div>
    <div :class="bemm('container', {
      open: !isCollapsed
    })">
      <slot></slot>
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
  overflow: scroll;

  &--active.timeline-taskbar--collapsed {
    width: var(--timeline-taskbar-width--collapsed);
    overflow: hidden;
  }

  &--active.timeline-taskbar--open {
    width: var(--timeline-taskbar-width);
  }

  &--inactive {
    width: 0;
    overflow: hidden;
  }

  &__header {
    padding: 1em;
    position: sticky;
    top: 0;
    z-index: 2;
    background-color: black;
  }

  &__container {
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
