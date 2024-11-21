<template>
  <div :class="bemm('', {
    active: isActive,
    inactive: !isActive
  })">

    <div :class="bemm('header')">
      Tasks
      <button @click="toggleTaskBar()">{{isActive ? 'collapse' : 'open'}}</button>
    </div>
    <div :class="bemm('container')">
      <template v-if="isActive">
        <slot></slot>
      </template>
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
  }
})
const isActive = ref(props.active)

watch(() => props.active, (newVal: boolean) => {
  isActive.value = newVal
})

const toggleTaskBar = () => {
  eventBus.emit('toggle-taskbar');
}



</script>

<style lang="scss">
.timeline-taskbar {

  height: fit-content;
  z-index: 10;
  background-color: blue;

  width: var(--timeline-taskbar-width);

  transition: width .3s ease-in-out;
  &--inactive {
    width: var(--timeline-taskbar-width--collapsed);
  }

  &__header{
    padding: 1em;
  }

  &__container {
    background-color: #ebdea5;
    display: flex;
    flex-direction: column;
  }
}
</style>
