<script setup>
import { ref } from 'vue';
import { Sparkles, AlertCircle } from 'lucide-vue-next';

const props = defineProps({
  token: {
    type: Object,
    required: true
  },
  isSlotted: {
    type: Boolean,
    default: false
  },
  isInvalid: {
    type: Boolean,
    default: false
  },
  isHinted: {
    type: Boolean,
    default: false
  },
  disabled: {
    type: Boolean,
    default: false
  }
});

const emit = defineEmits(['click', 'dragstart', 'dragend']);

const isDragging = ref(false);

/**
 * CORREÇÃO: o original marcava `draggable="true"` mas nunca gravava o token em
 * `dataTransfer`, então o `drop` do socket recebia vazio e nada acontecia.
 * Em telas de toque o HTML5 DnD não existe — por isso o toque (click) continua
 * sendo o caminho principal e o arrastar é um complemento para desktop.
 */
const onDragStart = (event) => {
  if (props.disabled) {
    event.preventDefault();
    return;
  }
  event.dataTransfer.setData('text/plain', JSON.stringify(props.token));
  event.dataTransfer.effectAllowed = 'move';
  isDragging.value = true;
  emit('dragstart', props.token);
};

const onDragEnd = () => {
  isDragging.value = false;
  emit('dragend');
};
</script>

<template>
  <button
    type="button"
    draggable="true"
    :disabled="disabled"
    class="tile"
    :class="{
      'tile--placed': isSlotted,
      'tile--dragging': isDragging,
      'tile--hint': isHinted && !isInvalid,
      'tile--invalid': isInvalid
    }"
    :aria-label="isSlotted ? `${token.text} (toque para remover)` : token.text"
    @click="emit('click', token)"
    @dragstart="onDragStart"
    @dragend="onDragEnd"
  >
    <span class="min-w-0 break-normal leading-tight">{{ token.text }}</span>

    <!-- Selos de estado no canto da carta: não ocupam espaço do texto e não dependem só de cor -->
    <span
      v-if="isHinted && !isInvalid"
      class="absolute -top-2 -right-2 grid place-items-center w-7 h-7 rounded-full bg-sky-400 text-sky-950 border-2 border-paper shadow-md"
      aria-hidden="true"
    >
      <Sparkles class="w-4 h-4" stroke-width="3" />
    </span>
    <span
      v-if="isInvalid"
      class="absolute -top-2 -right-2 grid place-items-center w-7 h-7 rounded-full bg-rose-500 text-white border-2 border-paper shadow-md"
      aria-hidden="true"
    >
      <AlertCircle class="w-4 h-4" stroke-width="3" />
    </span>
  </button>
</template>
