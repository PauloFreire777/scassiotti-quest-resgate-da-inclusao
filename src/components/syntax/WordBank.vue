<script setup>
import { ref } from 'vue';
import WordTile from './WordTile.vue';

const props = defineProps({
  tokens: {
    type: Array,
    required: true,
    default: () => []
  },
  hintedTokenId: {
    type: String,
    default: null
  },
  disabled: {
    type: Boolean,
    default: false
  }
});

const emit = defineEmits(['select', 'returnToken', 'dragstart', 'dragend']);

const isBankDragOver = ref(false);

const handleDragOver = (e) => {
  if (props.disabled) return;
  e.preventDefault();
  e.dataTransfer.dropEffect = 'move';
  isBankDragOver.value = true;
};

const handleDragLeave = () => {
  isBankDragOver.value = false;
};

const handleDrop = (e) => {
  if (props.disabled) return;
  e.preventDefault();
  isBankDragOver.value = false;
  try {
    const raw = e.dataTransfer.getData('text/plain');
    if (!raw) return;
    const parsed = JSON.parse(raw);
    const token = parsed.token || parsed;
    if (token) {
      emit('returnToken', token);
    }
  } catch (err) {
    console.warn('Erro ao devolver carta para o banco:', err);
  }
};
</script>

<template>
  <div
    class="w-full rounded-2xl p-1.5 transition-all duration-150"
    :class="isBankDragOver ? 'bg-white/10 ring-2 ring-amber-300/60' : ''"
    role="group"
    aria-label="Palavras disponíveis"
    @dragover="handleDragOver"
    @dragleave="handleDragLeave"
    @drop="handleDrop"
  >
    <!-- Grade dinâmica de cartas disponíveis -->
    <TransitionGroup
      name="tokens-list"
      tag="div"
      class="relative flex flex-wrap items-center justify-center gap-2.5 sm:gap-3.5 min-h-[60px]"
    >
      <WordTile
        v-for="token in tokens"
        :key="token.id"
        :token="token"
        :is-slotted="false"
        :is-hinted="hintedTokenId === token.id"
        :disabled="disabled"
        @click="emit('select', token)"
        @dragstart="emit('dragstart', token)"
        @dragend="emit('dragend')"
      />
    </TransitionGroup>
  </div>
</template>

<style scoped>
.tokens-list-move,
.tokens-list-enter-active,
.tokens-list-leave-active {
  transition: all 0.22s cubic-bezier(0.34, 1.3, 0.64, 1);
}
.tokens-list-enter-from,
.tokens-list-leave-to {
  opacity: 0;
  transform: scale(0.7);
}
.tokens-list-leave-active {
  position: absolute;
}
</style>
