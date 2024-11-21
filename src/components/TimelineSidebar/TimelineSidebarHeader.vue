<template>
  <header :class="bemm()">

    <div :class="bemm('container')">

      <strong>{{ type }}</strong> Timeline Sidebar header

    </div>
    <div :class="[bemm('drag-handle'),'drag-handle']"></div>
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

  &::before{
    pointer-events: none;
    content: "";
    width: 2em; height: 100%; position: absolute; left: 100%;
    background-image: linear-gradient(to right, rgba(0,0,0,.2), rgba(0,0,0,0));
  }


  &__drag-handle{position: fixed;
   z-index: 100;   right: .5em; top: 50%;
    transform: translateY(-50%);
  }


  &__container {
    display: flex;
    align-items: center;
    justify-content: center;
    background-color: #4fbff7;
    height: 100%;
  }
}
</style>
