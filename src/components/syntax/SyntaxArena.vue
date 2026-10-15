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
  'removeToken',
  'dropToken',
  'attack',
  'hint',
  'reset'
]);

const isReadyToAttack = computed(() => {
  return props.slots.length > 0 && props.slots.every((s) => s !== null);
});
</script>

<template>
  <!-- "Gaveta" inferior que sobe sobre a cena: separa claramente palco (olhar) e controles (tocar) -->
  <section
    class="panel-console relative z-30 -mt-6 rounded-t-[2rem]"
    aria-label="Monte a frase"
  >
   <div class="mx-auto w-full max-w-4xl px-3 pt-4 sm:px-8 sm:pt-5 pb-[max(0.75rem,env(safe-area-inset-bottom))] flex flex-col gap-3 sm:gap-4">
    <p class="sr-only">Toque nas palavras para montar a frase na ordem: quem, ação, alvo. Toque numa palavra encaixada para removê-la.</p>

    <!-- Fileira dos 3 encaixes SVO — sempre lado a lado, lidos da esquerda para a direita -->
    <div class="grid grid-cols-3 gap-2 sm:gap-4">
      <SyntaxSocket
        v-for="(_, idx) in 3"
        :key="idx"
        :index="idx"
        :token="slots[idx]"
        :is-invalid="invalidSlotIndices.includes(idx)"
        :disabled="isAttacking"
        @remove="emit('removeToken', idx)"
        @drop-token="(payload) => emit('dropToken', payload)"
      />
    </div>

    <!-- Banco de cartas -->
    <WordBank
      :tokens="wordBank"
      :hinted-token-id="hintedTokenId"
      :disabled="isAttacking"
      @select="(t) => emit('selectToken', t)"
    />

    <!-- Ações: ícone + rótulo sempre visíveis (não dependem de tooltip) -->
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
