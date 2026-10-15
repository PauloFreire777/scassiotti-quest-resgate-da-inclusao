<script setup>
import { ref, computed, watch, onBeforeUnmount } from 'vue';
import { Heart } from 'lucide-vue-next';
import SignPrompt from './SignPrompt.vue';

const props = defineProps({
  videoUrl: {
    type: String,
    required: true
  },
  librasGloss: {
    type: String,
    default: ''
  },
  contextSentence: {
    type: String,
    default: ''
  },
  signSteps: {
    type: Array,
    default: () => []
  },
  roundKey: {
    type: String,
    default: ''
  },
  autoOpenVideo: {
    type: Boolean,
    default: false
  },
  enemy: {
    type: Object,
    required: true
  },
  playerHp: {
    type: Number,
    required: true
  },
  maxPlayerHp: {
    type: Number,
    default: 100
  },
  enemyHp: {
    type: Number,
    required: true
  },
  maxEnemyHp: {
    type: Number,
    default: 100
  },
  isAttacking: {
    type: Boolean,
    default: false
  }
});

const MAX_HEARTS = 3;

// A professora tem 3 "corações" (cada erro tira 1) — mais claro do que "65 HP".
const hearts = computed(() => Math.ceil((props.playerHp / props.maxPlayerHp) * MAX_HEARTS));
const enemyPct = computed(() => Math.max(0, Math.min(100, (props.enemyHp / props.maxEnemyHp) * 100)));
const isDefeated = computed(() => props.enemyHp <= 0);

const enemyHit = ref(false);
const playerHit = ref(false);
const timers = [];

const flag = (target) => {
  target.value = false;
  requestAnimationFrame(() => {
    target.value = true;
    timers.push(setTimeout(() => (target.value = false), 600));
  });
};

watch(() => props.enemyHp, (now, before) => {
  if (now < before) flag(enemyHit);
});
watch(() => props.playerHp, (now, before) => {
  if (now < before) flag(playerHit);
});

onBeforeUnmount(() => timers.forEach(clearTimeout));
</script>

<template>
  <section
    class="relative isolate flex flex-col overflow-hidden scene-bg min-h-[300px]"
    aria-label="Cena de batalha"
  >
    <!-- Cenário: janelas da biblioteca + piso -->
    <div class="scene-window" style="left: 5%" aria-hidden="true"></div>
    <div class="scene-window" style="right: 5%" aria-hidden="true"></div>
    <div class="scene-floor" aria-hidden="true"></div>

    <!-- Enunciado em Libras + Botão da Tela de Vídeo da Professora -->
    <div class="relative z-20 px-3 pt-1 sm:pt-2 mx-auto w-full max-w-2xl">
      <SignPrompt
        :video-url="videoUrl"
        :gloss="librasGloss"
        :context-sentence="contextSentence"
        :sign-steps="signSteps"
        :round-key="roundKey"
        :auto-open-active="autoOpenVideo"
      />
    </div>

    <!-- Palco dos personagens: proporção equilibrada entre Professora Scassiotti e o Monstro -->
    <div class="relative z-10 flex-1 min-h-[200px] mx-auto w-full max-w-4xl">
      <div class="absolute inset-0 flex items-end justify-between gap-2 px-3 sm:px-[6%] pb-8 sm:pb-9">

        <!-- Professora (proporção equilibrada — sem estourar o palco) -->
        <div class="relative h-full w-[49%] max-w-[19.5rem] flex flex-col items-center justify-end">
          <div class="relative flex-1 min-h-0 w-full flex items-end justify-center">
            <div
              class="relative h-[94%] sm:h-[96%] max-w-full flex items-end justify-center"
              :class="playerHit ? 'animate-hit' : 'animate-idle-bob'"
            >
              <img
                src="/images/teacher_sprite.webp"
                alt="Professora Scassiotti"
                class="h-full max-h-full w-auto max-w-full object-contain object-bottom fade-edge-right select-none pointer-events-none drop-shadow-[0_12px_20px_rgba(8,5,28,0.55)]"
                draggable="false"
              />
            </div>
            <div class="teacher-desk z-10" aria-hidden="true"></div>
          </div>

          <div class="relative z-20 nameplate w-full rounded-2xl px-3 py-1.5 mt-2 flex flex-col items-start gap-0.5 sm:flex-row sm:items-center sm:justify-between sm:gap-2">
            <span class="text-sm sm:text-base font-black leading-tight">Profª Scassiotti</span>
            <span class="flex gap-0.5 shrink-0" role="img" :aria-label="`${hearts} de ${MAX_HEARTS} vidas`">
              <Heart
                v-for="n in MAX_HEARTS"
                :key="n"
                class="w-6 h-6 transition-all duration-300"
                :class="n <= hearts ? 'fill-rose-500 text-rose-300' : 'fill-transparent text-slate-500 scale-90'"
                aria-hidden="true"
              />
            </span>
          </div>
        </div>

        <!-- Monstro (proporção equivalente à da professora) -->
        <div class="relative h-full w-[49%] max-w-[19.5rem] flex flex-col items-center justify-end">
          <div class="relative flex-1 min-h-0 w-full flex items-end justify-center">
            <div class="ground-shadow" aria-hidden="true"></div>
            <div
              class="relative h-[90%] sm:h-[92%] max-w-full flex items-end justify-center transition-all duration-700"
              :class="[
                enemyHit ? 'animate-hit' : 'animate-idle-float',
                isDefeated ? 'opacity-0 scale-90 grayscale' : ''
              ]"
            >
              <img
                :src="enemy.avatar || '/images/monster_sprite.webp'"
                :alt="enemy.name"
                class="h-full max-h-full w-auto max-w-full object-contain object-bottom select-none pointer-events-none drop-shadow-[0_14px_22px_rgba(8,5,28,0.6)]"
                draggable="false"
              />
            </div>
          </div>

          <div class="nameplate w-full rounded-2xl px-3 py-1.5 mt-2">
            <div class="text-sm sm:text-base font-black leading-tight mb-1 truncate">{{ enemy.name }}</div>
            <div
              class="hp-track"
              role="progressbar"
              :aria-valuenow="Math.max(0, enemyHp)"
              aria-valuemin="0"
              :aria-valuemax="maxEnemyHp"
              :aria-label="`Energia de ${enemy.name}`"
            >
              <div class="hp-ghost" :style="{ width: enemyPct + '%' }"></div>
              <div class="hp-fill" :style="{ width: enemyPct + '%' }"></div>
            </div>
          </div>
        </div>
      </div>

      <!-- Feedback pedagógico (slot): balão da professora no centro da cena -->
      <div class="absolute inset-x-0 bottom-24 sm:bottom-28 z-30 flex justify-center px-3 pointer-events-none">
        <slot />
      </div>
    </div>
  </section>
</template>
