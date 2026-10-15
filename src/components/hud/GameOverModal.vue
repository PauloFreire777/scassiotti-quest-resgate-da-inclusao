<script setup>
import { HeartCrack, RotateCcw, Map } from 'lucide-vue-next';

defineProps({
  isOpen: {
    type: Boolean,
    required: true
  },
  levelTitle: {
    type: String,
    default: 'Fase'
  }
});

const emit = defineEmits(['retry', 'levelSelect']);
</script>

<template>
  <Teleport to="body">
    <Transition name="gameover-fade">
      <div
        v-if="isOpen"
        class="fixed inset-0 z-[9997] flex items-center justify-center p-4 bg-slate-950/90 backdrop-blur-md select-none"
        role="dialog"
        aria-modal="true"
        aria-labelledby="gameover-title"
      >
        <div class="relative w-full max-w-md bg-slate-900 border-[3px] border-rose-400 rounded-3xl shadow-pop p-6 sm:p-8 text-center text-white flex flex-col items-center gap-4">
          <div class="w-20 h-20 rounded-3xl bg-rose-500/20 border-2 border-rose-400 grid place-items-center text-rose-300">
            <HeartCrack class="w-11 h-11" aria-hidden="true" />
          </div>

          <div>
            <span class="text-xs font-extrabold uppercase tracking-wider text-rose-200 bg-rose-950 border border-rose-500/50 px-3 py-1 rounded-full">
              Vidas Esgotadas
            </span>
            <h2 id="gameover-title" class="text-2xl sm:text-3xl font-black mt-2">
              Vamos tentar de novo?
            </h2>
            <p class="text-sm sm:text-base font-bold text-slate-200 mt-1.5 leading-snug">
              Errar faz parte de aprender! Observe a ordem: <strong class="text-sky-300">1º Quem ➔ 2º Ação ➔ 3º Alvo</strong>.
            </p>
          </div>

          <div class="w-full flex flex-col gap-3 mt-1">
            <button
              type="button"
              class="btn-chunky btn-go w-full !min-h-[56px] text-lg uppercase"
              @click="emit('retry')"
            >
              <RotateCcw class="w-5 h-5" aria-hidden="true" />
              <span>Tentar de novo</span>
            </button>

            <button
              type="button"
              class="btn-chunky btn-ghost w-full"
              @click="emit('levelSelect')"
            >
              <Map class="w-5 h-5 text-amber-300" aria-hidden="true" />
              <span>Escolher outra fase</span>
            </button>
          </div>
        </div>
      </div>
    </Transition>
  </Teleport>
</template>

<style scoped>
.gameover-fade-enter-active,
.gameover-fade-leave-active {
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}
.gameover-fade-enter-from,
.gameover-fade-leave-to {
  opacity: 0;
  transform: scale(0.9);
}
</style>
