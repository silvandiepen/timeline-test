<template>
  <div :class="bemm()">
    <div v-for="entity in entities" :key="entity.id" :class="bemm('entity')">
      <div :class="bemm('header')">
        {{ entity.label }}
      </div>
      <div :class="bemm('lane')" v-for="lane in entity.lanes">
        {{ lane.label }}
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
  position: relative;

  &__header {
    background-color: rgba(255, 255, 255, .25);
    padding: 0 1em;

    font-size: .66em;
    font-weight: bold;
    color: black;
    position: absolute;
    top: 0;
    transform: translateY(-50%);
    background-color: white;

  }

  &__entity {
    position: relative;
    background-color: #ffffff;
    width: 100%;
    box-shadow: 0 -2px 0 0 var(--timeline-border-color) inset;

    &:nth-child(1) .timeline-sidebar-projects__header {
      padding-block: .5em;
      transform: translateY(0%);
    }
  }

  &__lane-spacer {
    height: calc(var(--timeline-lane-height) * var(--entity-lanes));
  }

  &__lane {
    height: var(--timeline-lane-height);
    color: black;
    padding: 1em;
    display: flex;
    align-items: center;
  }

}
</style>
