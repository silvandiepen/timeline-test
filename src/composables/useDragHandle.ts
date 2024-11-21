// useDragHandle.ts
import { ref, onMounted, onBeforeUnmount } from 'vue';
import { eventBus } from '../eventBus';

export const useDragHandle = (elementId: string) => {
  const current = ref(0);
  const initialX = ref(0);
  const deltaX = ref(0);

  const handleDragStart = (event: MouseEvent) => {
    initialX.value = event.clientX;
    document.addEventListener('mousemove', handleDragging);
    document.addEventListener('mouseup', handleDragEnd);
  };

  const handleDragging = (event: MouseEvent) => {
    deltaX.value = event.clientX - initialX.value;
    current.value += deltaX.value;
    initialX.value = event.clientX;
    // Emit the event with the current value and element ID
    eventBus.emit('drag-handle', { elementId, value: current.value });
  };

  const handleDragEnd = () => {
    document.removeEventListener('mousemove', handleDragging);
    document.removeEventListener('mouseup', handleDragEnd);
  };

  onMounted(() => {
    document.addEventListener('mouseup', handleDragEnd);
  });

  onBeforeUnmount(() => {
    document.removeEventListener('mouseup', handleDragEnd);
  });

  return {
    handleDragStart
  };
};
