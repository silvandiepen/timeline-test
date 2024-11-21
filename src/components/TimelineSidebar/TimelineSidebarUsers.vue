<template>
  <div :class="bemm()">
    <div v-for="entity in entities" :key="entity.id" :class="bemm('entity')">
      <div :class="bemm('header')">
        <h3> {{ entity.label }}</h3>
        <button @click="collapseEntity(entity.label)">{{ entity.collapsed ? 'Show' : 'Collapse' }}</button>
      </div>
      <div :class="bemm('lane-spacer', entity.collapsed ? 'is-collapsed' : '')"
        :style="`--entity-lanes: ${entity.lanes.length}`">

      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { PropType } from 'vue';
import { Entity } from '../Timeline.model';
import { useBemm } from 'bemm';
import { eventBus } from '../../eventBus';
const bemm = useBemm('timeline-sidebar-users');

defineProps({
  entities: {
    type: Array as PropType<Entity[]>,
    required: true
  }
})


const collapseEntity = (value: string) => {

  eventBus.emit('collapseEntity', { entity: value })
}

</script>

<style lang="scss">
.timeline-sidebar-users {

  &__header {
    background-color: rgba(255, 255, 255, .25);
    height: var(--timeline-workload-height);
    padding: 1em;
    font-size: 1.5em;
    font-weight: bold;
    color: black;
    display: flex;
    justify-content: space-between;

    h3 {
      margin: 0;
      font-size: 1em;
    }
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
