<template>
  <div :class="bemm()">
    <slot></slot>
  </div>
</template>

<script lang="ts" setup>
import { useBemm } from 'bemm'
const bemm = useBemm('timeline-page-header');
</script>

<style lang="scss">
.timeline-page-header {

  background-color: #96d8db;

  height: var(--timeline-header-height);
  display: flex;
  flex-direction: row;
  justify-content: center;
  gap: .5em;
  padding: 1em;
  align-items: center;

}
</style>
