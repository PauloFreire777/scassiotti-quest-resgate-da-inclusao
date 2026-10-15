<script setup>
import { computed, ref, watch, nextTick, onBeforeUnmount } from 'vue';
import { Play, Map, BookOpen, RotateCcw, Trophy, Star } from 'lucide-vue-next';

const props = defineProps({
  isOpen: {
    type: Boolean,
    required: true
  },
  storage: {
    type: Object,
    required: true
  },
  currentLevelTitle: {
    type: String,
    default: 'Fase 1'
  }
});

const emit = defineEmits([
  'startPlay',
  'openMap',
  'openTheory',
  'resetProgress',
  'close'
]);

const totalStars = computed(() => {
  const completed = props.storage.saveState.value.completedLevels || {};
  return Object.values(completed).reduce((acc, curr) => acc + (curr.stars || 0), 0);
});

const unlockedCount = computed(() => {
  return props.storage.saveState.value.unlockedLevelIds?.length || 1;
});

const hasProgress = computed(() => totalStars.value > 0 || unlockedCount.value > 1);

// Acessibilidade de diálogo: foco no botão principal ao abrir e Esc fecha.
const playBtn = ref(null);
const onKey = (e) => {
  if (e.key === 'Escape') emit('close');
};

watch(() => props.isOpen, async (open) => {
  if (open) {
    window.addEventListener('keydown', onKey);
    await nextTick();
    playBtn.value?.focus();
  } else {
    window.removeEventListener('keydown', onKey);
  }
}, { immediate: true });

onBeforeUnmount(() => window.removeEventListener('keydown', onKey));
</script>

<template>
  <Teleport to="body">
    <Transition name="menu-fade">
      <div
        v-if="isOpen"
        class="fixed inset-0 z-[9998] overflow-y-auto scene-bg select-none"
        role="dialog"
        aria-modal="true"
        aria-labelledby="menu-title"
      >
        <!-- Cenário da tela inicial -->
        <div class="scene-window" style="left: 5%" aria-hidden="true"></div>
        <div class="scene-window" style="right: 5%" aria-hidden="true"></div>
        <div class="scene-floor" aria-hidden="true"></div>

        <div class="relative min-h-full flex flex-col items-center justify-center gap-5 px-5 py-8">
          <!-- Logotipo -->
          <div class="text-center">
            <p class="inline-flex items-center gap-2 rounded-full bg-black/25 border-2 border-white/20 px-4 py-1 text-sm sm:text-base font-extrabold text-amber-200">
              <span aria-hidden="true">🤟</span> Libras ➔ Português
            </p>
            <h1 id="menu-title" class="mt-3 text-5xl sm:text-7xl font-black leading-[0.95] tracking-tight drop-shadow-[0_6px_0_rgba(8,5,28,0.55)]">
              Scassiotti
              <span class="block text-amber-300">Quest</span>
            </h1>
            <p class="mt-3 text-base sm:text-xl font-bold text-sky-100">O Resgate da Inclusão</p>
          </div>

          <!-- Elenco: proporção equilibrada entre Professora e Monstro -->
          <div class="relative flex items-end justify-center gap-3 sm:gap-8 w-full max-w-md h-[22dvh] min-h-[135px] max-h-[240px]" aria-hidden="true">
            <img src="/images/teacher_sprite.webp" alt="" class="h-[96%] max-w-[48%] w-auto object-contain object-bottom fade-edge-right animate-idle-bob drop-shadow-[0_12px_18px_rgba(8,5,28,0.55)]" draggable="false" />
            <img src="/images/monster_sprite.webp" alt="" class="h-[92%] max-w-[48%] w-auto object-contain object-bottom animate-idle-float drop-shadow-[0_12px_18px_rgba(8,5,28,0.55)]" draggable="false" />
          </div>

          <!-- Placar -->
          <div class="flex items-center gap-3" role="group" aria-label="Seu progresso">
            <div class="nameplate flex items-center gap-2 rounded-2xl px-4 py-2 text-lg font-black">
              <Star class="w-6 h-6 fill-amber-300 text-amber-300" aria-hidden="true" />
              <span>{{ totalStars }}/18<span class="sr-only"> estrelas</span></span>
            </div>
            <div class="nameplate flex items-center gap-2 rounded-2xl px-4 py-2 text-lg font-black">
              <Trophy class="w-6 h-6 text-emerald-300" aria-hidden="true" />
              <span>{{ unlockedCount }}/6<span class="sr-only"> fases</span></span>
            </div>
          </div>

          <!-- Ações: 1 botão dominante + secundários claros -->
          <div class="w-full max-w-sm flex flex-col gap-3">
            <button
              ref="playBtn"
              type="button"
              class="btn-chunky btn-go !min-h-[68px] text-2xl uppercase tracking-wide"
              @click="emit('startPlay')"
            >
              <Play class="w-7 h-7 fill-current" aria-hidden="true" />
              <span>{{ hasProgress ? 'Continuar' : 'Jogar' }}</span>
            </button>

            <div class="grid grid-cols-2 gap-3">
              <button type="button" class="btn-chunky btn-ghost" @click="emit('openMap')">
                <Map class="w-5 h-5 text-amber-300" aria-hidden="true" />
                <span>Fases</span>
              </button>
              <button type="button" class="btn-chunky btn-ghost" @click="emit('openTheory')">
                <BookOpen class="w-5 h-5 text-sky-300" aria-hidden="true" />
                <span>Como jogar</span>
              </button>
            </div>

            <button
              type="button"
              class="mx-auto flex items-center gap-1.5 min-h-[44px] px-3 text-sm font-bold text-slate-300 hover:text-rose-300"
              @click="emit('resetProgress')"
            >
              <RotateCcw class="w-4 h-4" aria-hidden="true" />
              <span>Apagar progresso</span>
            </button>
          </div>
        </div>
      </div>
    </Transition>
  </Teleport>
</template>

<style scoped>
.menu-fade-enter-active,
.menu-fade-leave-active {
  transition: opacity 0.35s ease, transform 0.35s ease;
}
.menu-fade-enter-from,
.menu-fade-leave-to {
  opacity: 0;
  transform: scale(1.03);
}
</style>
