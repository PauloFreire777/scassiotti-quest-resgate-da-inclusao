<script setup>
import { Trophy, RotateCcw, ArrowRight, Award } from 'lucide-vue-next';

defineProps({
  isOpen: {
    type: Boolean,
    required: true
  },
  levelTitle: {
    type: String,
    default: 'Fase'
  },
  enemyName: {
    type: String,
    default: 'Barreira'
  },
  hasNextLevel: {
    type: Boolean,
    default: true
  }
});

const emit = defineEmits(['restart', 'nextLevel', 'close']);
</script>

<template>
  <Teleport to="body">
    <Transition name="victory-fade">
      <div
        v-if="isOpen"
        class="fixed inset-0 z-[9995] flex items-center justify-center p-4 bg-slate-950/85 backdrop-blur-md overflow-y-auto select-none"
        role="dialog"
        aria-modal="true"
        aria-labelledby="victory-title"
      >
        <div class="relative w-full max-w-lg bg-slate-900 border-[3px] border-emerald-400 rounded-3xl shadow-pop p-6 sm:p-8 text-center text-white flex flex-col items-center gap-4">
          <div class="w-20 h-20 rounded-3xl bg-amber-300 text-amber-950 border-4 border-white/40 shadow-pop grid place-items-center">
            <Trophy class="w-11 h-11" aria-hidden="true" />
          </div>

          <div>
            <span class="text-xs font-extrabold uppercase tracking-wider text-emerald-300 bg-emerald-950 border border-emerald-500/50 px-3 py-1 rounded-full">
              Fase Concluída!
            </span>
            <h2 id="victory-title" class="text-2xl sm:text-3xl font-black mt-2">
              {{ levelTitle }}
            </h2>
            <p class="text-sm sm:text-base font-bold text-slate-200 mt-1">
              Você superou <strong class="text-amber-300">{{ enemyName }}</strong>!
            </p>
          </div>

          <div class="w-full bg-paper text-paper-ink rounded-2xl p-4 text-left border-2 border-paper-400">
            <div class="flex items-center gap-2 text-sm font-black text-emerald-800">
              <Award class="w-5 h-5" aria-hidden="true" />
              <span>Ordem do Português dominada</span>
            </div>
            <p class="text-sm font-bold mt-1 leading-snug">
              Você organizou a frase na sequência <strong>Quem (Sujeito) ➔ Ação (Verbo) ➔ Alvo (Objeto)</strong>.
            </p>
          </div>

          <div class="w-full flex flex-col sm:flex-row items-stretch justify-center gap-3 mt-1">
            <button
              v-if="hasNextLevel"
              type="button"
              class="btn-chunky btn-go flex-1 !min-h-[56px] text-lg uppercase"
              @click="emit('nextLevel')"
            >
              <span>Próxima Fase</span>
              <ArrowRight class="w-5 h-5" aria-hidden="true" />
            </button>

            <button
              type="button"
              class="btn-chunky btn-ghost !min-h-[56px] text-base"
              @click="emit('restart')"
            >
              <RotateCcw class="w-5 h-5" aria-hidden="true" />
              <span>Jogar de novo</span>
            </button>
          </div>
        </div>
      </div>
    </Transition>
  </Teleport>
</template>

<style scoped>
.victory-fade-enter-active,
.victory-fade-leave-active {
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}
.victory-fade-enter-from,
.victory-fade-leave-to {
  opacity: 0;
  transform: scale(0.9);
}
</style>
