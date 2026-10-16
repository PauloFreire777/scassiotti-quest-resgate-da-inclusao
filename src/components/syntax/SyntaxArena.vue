<script setup>
import { computed } from 'vue';
import { Swords, Lightbulb, Eraser } from 'lucide-vue-next';
import SyntaxSocket from './SyntaxSocket.vue';
import WordBank from './WordBank.vue';

const props = defineProps({
  slots: {
    type: Array,
    required: true
  },
  wordBank: {
    type: Array,
    required: true
  },
  selectedSlotIndex: {
    type: Number,
    default: null
  },
  invalidSlotIndices: {
    type: Array,
    default: () => []
  },
  hintedTokenId: {
    type: String,
    default: null
  },
  isAttacking: {
    type: Boolean,
    default: false
  }
});

const emit = defineEmits([
  'selectToken',
  'selectSlot',
  'removeToken',
  'dropToken',
  'returnToken',
  'attack',
  'hint',
  'reset'
]);

const isReadyToAttack = computed(() => {
  return props.slots.length > 0 && props.slots.every((s) => s !== null);
});
</script>

<template>
  <!-- Console inferior flutuante com efeito Glassmorphism sobre o chão iluminado da arena -->
  <section
    class="panel-console relative z-30 -mt-5 rounded-t-[2rem]"
    aria-label="Monte a frase"
  >
    <div class="mx-auto w-full max-w-4xl px-3 pt-3.5 sm:px-8 sm:pt-4 pb-[max(0.75rem,env(safe-area-inset-bottom))] flex flex-col gap-3 sm:gap-3.5">
      <p class="sr-only">
        Clique ou arraste as palavras para montar a frase na ordem: quem, ação, alvo. Clique numa palavra já preenchida para devolvê-la à lista de baixo ou selecione um espaço para substituí-la diretamente.
      </p>

      <!-- Fileira dos 3 cards SVO ("Quem?", "Ação", "Alvo") com Glassmorphism -->
      <div class="grid grid-cols-3 gap-2 sm:gap-4">
        <SyntaxSocket
          v-for="(_, idx) in 3"
          :key="idx"
          :index="idx"
          :token="slots[idx]"
          :is-selected="selectedSlotIndex === idx"
          :is-invalid="invalidSlotIndices.includes(idx)"
          :disabled="isAttacking"
          @remove="emit('removeToken', idx)"
          @select-slot="emit('selectSlot', idx)"
          @drop-token="(payload) => emit('dropToken', payload)"
        />
      </div>

      <!-- Banco de palavras disponíveis (suporta clique e Drag & Drop) -->
      <WordBank
        :tokens="wordBank"
        :hinted-token-id="hintedTokenId"
        :disabled="isAttacking"
        @select="(t) => emit('selectToken', t)"
        @return-token="(t) => emit('returnToken', t)"
      />

      <!-- Ações: Dica, Atacar! e Limpar -->
      <div class="flex items-stretch justify-center gap-2 sm:gap-4">
        <button
          type="button"
          class="btn-chunky btn-amber !px-3 sm:!px-5 flex-col sm:flex-row !gap-1 sm:!gap-2 text-sm sm:text-base"
          :disabled="isAttacking"
          @click="emit('hint')"
        >
          <Lightbulb class="w-6 h-6" aria-hidden="true" />
          <span>Dica</span>
        </button>

        <button
          type="button"
          class="btn-chunky btn-go flex-1 max-w-xs !min-h-[60px] text-xl sm:text-2xl uppercase tracking-wide"
          :disabled="isAttacking || !isReadyToAttack"
          @click="emit('attack')"
        >
          <Swords class="w-7 h-7" aria-hidden="true" />
          <span>Atacar!</span>
        </button>

        <button
          type="button"
          class="btn-chunky btn-ghost !px-3 sm:!px-5 flex-col sm:flex-row !gap-1 sm:!gap-2 text-sm sm:text-base"
          :disabled="isAttacking"
          @click="emit('reset')"
        >
          <Eraser class="w-6 h-6" aria-hidden="true" />
          <span>Limpar</span>
        </button>
      </div>
    </div>
  </section>
</template>
