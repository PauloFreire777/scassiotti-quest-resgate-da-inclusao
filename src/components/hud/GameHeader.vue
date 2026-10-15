<script setup>
import { HelpCircle, RotateCcw, Map, Menu } from 'lucide-vue-next';

defineProps({
  levelTitle: {
    type: String,
    default: 'Fase 1'
  },
  roundNumber: {
    type: Number,
    default: 1
  },
  totalRounds: {
    type: Number,
    default: 2
  }
});

const emit = defineEmits(['openMenu', 'openMap', 'openTheory', 'restartGame']);
</script>

<template>
  <header class="shrink-0 bg-slate-950 pt-[max(0.5rem,env(safe-area-inset-top))]">
   <div class="mx-auto w-full max-w-5xl flex items-center gap-2 sm:gap-3 px-3 sm:px-6 py-2">
    <button
      type="button"
      class="btn-chunky btn-ghost !min-h-[44px] !px-3"
      aria-label="Abrir menu"
      @click="emit('openMenu')"
    >
      <Menu class="w-6 h-6" aria-hidden="true" />
    </button>

    <!-- Fase atual + progresso das rodadas (segmentos: feito / atual / futuro) -->
    <div class="min-w-0 flex-1">
      <p class="truncate text-sm sm:text-base font-extrabold leading-tight text-slate-100">{{ levelTitle }}</p>
      <div
        class="mt-1.5 flex gap-1.5"
        role="img"
        :aria-label="`Rodada ${roundNumber} de ${totalRounds}`"
      >
        <span
          v-for="n in totalRounds"
          :key="n"
          class="h-2.5 flex-1 max-w-14 rounded-full transition-colors duration-300"
          :class="n < roundNumber ? 'bg-emerald-400' : n === roundNumber ? 'bg-amber-300' : 'bg-slate-700'"
        ></span>
      </div>
    </div>

    <div class="flex items-center gap-2">
      <button
        type="button"
        class="btn-chunky btn-ghost !min-h-[44px] !px-3"
        aria-label="Escolher fase"
        @click="emit('openMap')"
      >
        <Map class="w-5 h-5 text-amber-300" aria-hidden="true" />
        <span class="hidden sm:inline">Fases</span>
      </button>
      <button
        type="button"
        class="btn-chunky btn-ghost !min-h-[44px] !px-3"
        aria-label="Ajuda e metodologia"
        @click="emit('openTheory')"
      >
        <HelpCircle class="w-5 h-5 text-sky-300" aria-hidden="true" />
      </button>
      <button
        type="button"
        class="btn-chunky btn-ghost !min-h-[44px] !px-3"
        aria-label="Reiniciar fase"
        @click="emit('restartGame')"
      >
        <RotateCcw class="w-5 h-5" aria-hidden="true" />
      </button>
    </div>
   </div>
  </header>
</template>
