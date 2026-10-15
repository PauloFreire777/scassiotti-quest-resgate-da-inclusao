<script setup>
import { X, Lock, Play, Star, Map, Unlock } from 'lucide-vue-next';

const props = defineProps({
  isOpen: {
    type: Boolean,
    required: true
  },
  levels: {
    type: Array,
    required: true
  },
  unlockedLevelIds: {
    type: Array,
    default: () => [1]
  },
  completedLevels: {
    type: Object,
    default: () => ({})
  },
  currentLevelId: {
    type: Number,
    default: 1
  }
});

const emit = defineEmits(['close', 'selectLevel', 'unlockAll']);

const isUnlocked = (levelId) => {
  return props.unlockedLevelIds.includes(levelId);
};

const getLevelStars = (levelId) => {
  return props.completedLevels[levelId]?.stars || 0;
};
</script>

<template>
  <Teleport to="body">
    <Transition name="modal-fade">
      <div
        v-if="isOpen"
        class="fixed inset-0 z-[9990] flex items-center justify-center p-3 sm:p-4 bg-slate-950/85 backdrop-blur-md overflow-y-auto select-none"
        role="dialog"
        aria-modal="true"
        aria-labelledby="map-title"
        @click.self="emit('close')"
      >
        <div class="relative w-full max-w-3xl bg-slate-900 border-[3px] border-sky-400/60 rounded-3xl shadow-pop p-4 sm:p-6 max-h-[90vh] overflow-y-auto text-white flex flex-col gap-4">
          <!-- Cabeçalho do Mapa -->
          <div class="flex flex-wrap items-center justify-between gap-2 pb-3 border-b-2 border-white/10">
            <div class="flex items-center gap-3">
              <div class="grid place-items-center w-11 h-11 rounded-2xl bg-amber-400/20 border-2 border-amber-300/50 text-amber-300">
                <Map class="w-6 h-6" aria-hidden="true" />
              </div>
              <div>
                <h2 id="map-title" class="text-lg sm:text-xl font-black tracking-wide uppercase">
                  Mapa de Fases (6 Chefes)
                </h2>
                <p class="text-xs sm:text-sm font-bold text-slate-300">Escolha uma fase para enfrentar o monstro da barreira</p>
              </div>
            </div>

            <div class="flex items-center gap-2">
              <button
                v-if="unlockedLevelIds.length < levels.length"
                type="button"
                class="inline-flex items-center gap-1.5 rounded-xl bg-amber-400/15 hover:bg-amber-400/25 border border-amber-300/40 px-3 py-2 text-xs font-extrabold text-amber-200 transition-colors"
                title="Liberar todas as 6 fases para demonstração/apresentação"
                @click="emit('unlockAll')"
              >
                <Unlock class="w-3.5 h-3.5" aria-hidden="true" />
                <span>Liberar Todas (Demo)</span>
              </button>

              <button
                type="button"
                class="btn-chunky btn-ghost !min-h-[44px] !px-3"
                aria-label="Fechar mapa"
                @click="emit('close')"
              >
                <X class="w-5 h-5" aria-hidden="true" />
              </button>
            </div>
          </div>

          <!-- Grade de Fases do Jogo com Miniatura de cada Monstro -->
          <div class="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
            <div
              v-for="level in levels"
              :key="level.id"
              class="rounded-2xl p-3.5 sm:p-4 border-[3px] transition-all flex flex-col justify-between gap-3 relative overflow-hidden"
              :class="[
                isUnlocked(level.id)
                  ? level.id === currentLevelId
                    ? 'border-emerald-400 bg-emerald-950/35 shadow-pop'
                    : 'border-slate-700 hover:border-sky-400 bg-slate-950/70'
                  : 'border-slate-800 bg-slate-950/40 opacity-65'
              ]"
            >
              <div class="flex items-start justify-between gap-3">
                <div class="min-w-0 flex-1">
                  <div class="text-[11px] font-extrabold uppercase tracking-wider text-sky-300 mb-0.5 truncate">
                    {{ level.tierName }}
                  </div>
                  <h3 class="font-black text-base sm:text-lg text-white leading-snug">
                    {{ level.title }}
                  </h3>
                  <p class="text-xs font-semibold text-slate-300 mt-0.5">
                    {{ level.subtitle }}
                  </p>
                  <p v-if="level.enemy" class="text-[11px] font-extrabold text-rose-300 mt-1.5">
                    Chefe: {{ level.enemy.name }}
                  </p>
                </div>

                <!-- Avatar do Monstro da Fase -->
                <div
                  v-if="level.enemy"
                  class="shrink-0 w-16 h-16 sm:w-20 sm:h-20 rounded-2xl bg-slate-900/90 border border-white/15 p-1 flex items-center justify-center"
                >
                  <img
                    :src="level.enemy.avatar"
                    :alt="level.enemy.name"
                    class="h-full w-full object-contain"
                    :class="!isUnlocked(level.id) ? 'grayscale opacity-60' : ''"
                    draggable="false"
                  />
                </div>
              </div>

              <!-- Estrelas e Ação -->
              <div class="flex items-center justify-between pt-2.5 border-t border-white/10">
                <div class="flex items-center gap-1" role="img" :aria-label="`${getLevelStars(level.id)} de 3 estrelas`">
                  <Star
                    v-for="s in 3"
                    :key="s"
                    class="w-5 h-5"
                    :class="s <= getLevelStars(level.id) ? 'fill-amber-300 text-amber-300' : 'text-slate-600'"
                    aria-hidden="true"
                  />
                </div>

                <button
                  v-if="isUnlocked(level.id)"
                  type="button"
                  class="btn-chunky btn-go !min-h-[42px] !px-4 !py-1.5 text-sm uppercase"
                  @click="emit('selectLevel', level.id - 1)"
                >
                  <Play class="w-4 h-4 fill-current" aria-hidden="true" />
                  <span>{{ level.id === currentLevelId ? 'Jogando' : 'Jogar' }}</span>
                </button>
                <div v-else class="flex items-center gap-1.5 text-xs font-extrabold text-slate-400">
                  <Lock class="w-4 h-4" aria-hidden="true" />
                  <span>Bloqueada</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Transition>
  </Teleport>
</template>

<style scoped>
.modal-fade-enter-active,
.modal-fade-leave-active {
  transition: opacity 0.25s ease;
}
.modal-fade-enter-from,
.modal-fade-leave-to {
  opacity: 0;
}
</style>
