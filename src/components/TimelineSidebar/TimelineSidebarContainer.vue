<template>
  <div :class="bemm()">

    <div :class="bemm('container')">
      <slot></slot>
    </div>

  </div>
</template>

<script lang="ts" setup>
import { useBemm } from 'bemm'

const bemm = useBemm('timeline-sidebar');


</script>

<style lang="scss">
.timeline-sidebar {

  height: fit-content;
  z-index: 10;


  &__container {
    background-color: #ebdea5;
    display: flex;
    flex-direction: column;
  }
}
</style>
