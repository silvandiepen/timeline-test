<template>
  <header :class="bemm()">
    <div :class="bemm('container')">

      <strong>{{ type }}</strong> Timeline Sidebar header

    </div>
  </header>
</template>

<script lang="ts" setup>
import { useBemm } from 'bemm'
const bemm = useBemm('timeline-sidebar-header');

defineProps({
  type: {
    type: String,
    required: true
  }
})
</script>

<style lang="scss">
.timeline-sidebar-header {

  position: sticky;
  top: 0;

  height: var(--timeline-header-height);

  &__container {
    display: flex;
    align-items: center;
    justify-content: center;
    background-color: #4fbff7;
    height: 100%;
  }
}
</style>
