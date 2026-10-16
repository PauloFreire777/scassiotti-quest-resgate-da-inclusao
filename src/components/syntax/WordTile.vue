<script setup>
import { ref } from 'vue';
import { Sparkles, AlertCircle, X } from 'lucide-vue-next';

const props = defineProps({
  token: {
    type: Object,
    required: true
  },
  isSlotted: {
    type: Boolean,
    default: false
  },
  slotIndex: {
    type: Number,
    default: null
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

const onDragStart = (event) => {
  if (props.disabled) {
    event.preventDefault();
    return;
  }
  const payload = {
    token: props.token,
    fromSlotIndex: props.isSlotted ? props.slotIndex : null
  };
  event.dataTransfer.setData('text/plain', JSON.stringify(payload));
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
    class="tile group"
    :class="{
      'tile--placed': isSlotted,
      'tile--dragging': isDragging,
      'tile--hint': isHinted && !isInvalid,
      'tile--invalid': isInvalid
    }"
    :title="isSlotted ? 'Clique para devolver à lista ou arraste para outro espaço' : 'Clique ou arraste para encaixar na frase'"
    :aria-label="isSlotted ? `${token.text} (clique para devolver à lista)` : token.text"
    @click.stop="emit('click', token)"
    @dragstart="onDragStart"
    @dragend="onDragEnd"
  >
    <span class="min-w-0 break-normal leading-tight">{{ token.text }}</span>

    <!-- Indicador discreto de remoção no hover quando a palavra está num slot superior -->
    <span
      v-if="isSlotted && !isInvalid"
      class="absolute -top-2 -right-2 grid place-items-center w-6 h-6 rounded-full bg-slate-900 text-amber-200 border-2 border-amber-300/80 shadow-md opacity-85 group-hover:opacity-100 group-hover:scale-110 transition-all"
      aria-hidden="true"
    >
      <X class="w-3.5 h-3.5" stroke-width="3" />
    </span>

    <!-- Selos de estado no canto da carta -->
    <span
      v-if="isHinted && !isInvalid && !isSlotted"
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
