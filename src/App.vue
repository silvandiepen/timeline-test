<template>
  <div :class="bemm()">
    <Header :class="bemm('header')"></Header>
    <Menu :class="bemm('menu')"></Menu>
    <TimelineContainer :class="bemm('timeline')"></TimelineContainer>

  </div>
</template>

<script lang="ts" setup>
import * as b from 'bemm'
const bemm = b.useBemm('app');

import Header from './components/Header.vue'
import Menu from './components/Menu.vue'
import TimelineContainer from './components/TimelineContainer.vue'
</script>

<style lang="scss">
.app {

  --page-header-height: 80px;
  --page-sidebar-width: 200px;

  display: grid;
  width: 100vw; height: 100vh;

  grid-template-columns: var(--page-sidebar-width) auto auto auto;
  grid-template-rows: var(--page-header-height) auto;

  grid-template-areas:
    "menu header header header"
    "menu timeline timeline timeline";

  &__timeline {
    grid-area: timeline;
  }

  &__header {
    height: var(--page-header-height);
    grid-area: header;
  }

  &__menu {
    grid-area: menu;

  }
}
</style>
