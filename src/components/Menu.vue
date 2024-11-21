<template>
  <div :class="bemm()"></div>
</template>

<script lang="ts" setup>
import * as b from 'bemm'
const bemm = b.useBemm('menu');
</script>

<style lang="scss">
.menu {
  background-color: #110b28;
}
</style>
