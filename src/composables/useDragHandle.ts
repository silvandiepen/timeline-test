// useDragHandle.ts
import { ref, onMounted, onBeforeUnmount } from 'vue';
import { eventBus } from '../eventBus';


export const useDragHandle = (elementId: string) => {
  const current = ref(0);
  const startWidth = ref(0);
  const initialX = ref(0);
  const deltaX = ref(0);

  const handleDragStart = (event: PointerEvent, start: number = 0) => {
    console.log(`start`, start)
    initialX.value = event.clientX;
    startWidth.value = start;
    document.addEventListener('pointermove', handleDragging);
    document.addEventListener('pointerup', handleDragEnd);
  };

  const handleDragging = (event: PointerEvent) => {
    deltaX.value = event.clientX - initialX.value;
    current.value += deltaX.value;
    initialX.value = event.clientX;
    // Emit the event with the current value and element ID
    eventBus.emit('drag-handle', { elementId, value: startWidth.value + current.value });
  };

  const handleDragEnd = () => {
    current.value = 0;
    startWidth.value = 0;
    initialX.value = 0;
    deltaX.value = 0;
    document.removeEventListener('pointermove', handleDragging);
    document.removeEventListener('pointerup', handleDragEnd);
  };

  onMounted(() => {
    document.addEventListener('pointerup', handleDragEnd);
  });

  onBeforeUnmount(() => {
    document.removeEventListener('pointerup', handleDragEnd);
  });

  return {
    handleDragStart
  };
};
