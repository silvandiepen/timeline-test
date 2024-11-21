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


  &::before{
    pointer-events: none;
    position: absolute;
    content: "";
    top: 0;
    width: 2em; height: 100%;  left: 100%;
    background-image: linear-gradient(to right, rgba(0,0,0,.2), rgba(0,0,0,0));
  }



  &__container {
    background-color: #ebdea5;
    display: flex;
    flex-direction: column;

  }
}
</style>
