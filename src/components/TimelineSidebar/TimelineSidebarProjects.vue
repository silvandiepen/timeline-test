<template>
  <div :class="bemm()">
    <div v-for="entity in entities" :key="entity.id" :class="bemm('entity')">
      <div :class="bemm('header')">
        {{ entity.label }}
      </div>
      <div :class="bemm('lane-spacer')" :style="`--entity-lanes: ${entity.lanes.length - 1}`">

      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { PropType } from 'vue';
import { Entity } from '../Timeline.model';
import { useBemm } from 'bemm';
const bemm = useBemm('timeline-sidebar-projects');

defineProps({
  entities: {
    type: Array as PropType<Entity[]>,
    required: true
  }
})

</script>

<style lang="scss">
.timeline-sidebar-projects {

  &__header{
    background-color: rgba(255,255,255,.25);
    height: var(--timeline-workload-height);
    padding: 1em;font-size: 1.5em;
    font-weight: bold;
    color: black;
  }
  &__entity {
    background-color: #ffffff;
    width: 100%;
    box-shadow: 0 -2px 0 0 var(--timeline-border-color) inset;
  }
  &__lane-spacer {
    height: calc(var(--timeline-lane-height) * var(--entity-lanes));
  }


}
</style>
