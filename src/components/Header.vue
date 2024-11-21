<template>
  <div :class="bemm()"></div>
</template>

<script lang="ts" setup>
import * as b from 'bemm'
const bemm = b.useBemm('header');
</script>

<style lang="scss">
.header{
background-color: #110b28;
}
</style>
