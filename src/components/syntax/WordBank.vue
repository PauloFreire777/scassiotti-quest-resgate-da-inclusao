<script setup>
import WordTile from './WordTile.vue';

defineProps({
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

const emit = defineEmits(['select', 'dragstart', 'dragend']);
</script>

<template>
  <div class="w-full" role="group" aria-label="Palavras disponíveis">
    <!-- Grade dinâmica de cartas disponíveis -->
    <TransitionGroup
      name="tokens-list"
      tag="div"
      class="relative flex flex-wrap items-center justify-center gap-3 sm:gap-4 min-h-[68px]"
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
