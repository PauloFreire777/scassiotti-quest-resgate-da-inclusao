<script setup>
import { ref, computed, watch, onBeforeUnmount } from 'vue';
import { Heart, HeartCrack } from 'lucide-vue-next';
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
  },
  combatAnimState: {
    type: String,
    default: null
  }
});

const MAX_HEARTS = 3;

// A professora tem 3 "corações" (cada erro tira 1)
const hearts = computed(() => Math.max(0, Math.ceil((props.playerHp / props.maxPlayerHp) * MAX_HEARTS)));
const enemyPct = computed(() => Math.max(0, Math.min(100, (props.enemyHp / props.maxEnemyHp) * 100)));
const isDefeated = computed(() => props.enemyHp <= 0);

const enemyHit = ref(false);
const playerHit = ref(false);
const spellActive = ref(false);
const breakingHeartIndex = ref(null);
const useSolidFrameFallback = ref(false);
const timers = [];

const flag = (target, duration = 680) => {
  target.value = false;
  requestAnimationFrame(() => {
    target.value = true;
    timers.push(setTimeout(() => (target.value = false), duration));
  });
};

watch(
  () => props.combatAnimState,
  (state) => {
    if (state === 'hero-attack') {
      flag(spellActive, 560);
    }
  }
);

watch(
  () => props.enemyHp,
  (now, before) => {
    if (now < before) flag(enemyHit, 700);
  }
);

watch(
  () => props.playerHp,
  (now, before) => {
    if (now < before) {
      const beforeHearts = Math.max(1, Math.ceil((before / props.maxPlayerHp) * MAX_HEARTS));
      breakingHeartIndex.value = beforeHearts;
      flag(playerHit, 620);
      timers.push(
        setTimeout(() => {
          breakingHeartIndex.value = null;
        }, 720)
      );
    } else if (now > before) {
      breakingHeartIndex.value = null;
    }
  }
);

const heroAnimationClass = computed(() => {
  if (props.combatAnimState === 'hero-attack') return 'animate-hero-attack';
  if (playerHit.value) return 'animate-hero-hit';
  return 'animate-idle-bob';
});

const monsterAnimationClass = computed(() => {
  if (enemyHit.value) return 'animate-monster-hit';
  if (props.combatAnimState === 'monster-attack') return 'animate-monster-attack';
  return 'animate-idle-float';
});

onBeforeUnmount(() => timers.forEach(clearTimeout));
</script>

<template>
  <section
    class="relative isolate flex flex-col overflow-hidden min-h-[300px]"
    aria-label="Arena de batalha"
  >
    <!-- Enunciado em Libras (Glosa em maiúsculas + Botão Ver Vídeo) -->
    <div class="relative z-20 px-3 pt-1.5 sm:pt-2.5 mx-auto w-full max-w-2xl">
      <SignPrompt
        :video-url="videoUrl"
        :gloss="librasGloss"
        :context-sentence="contextSentence"
        :sign-steps="signSteps"
        :round-key="roundKey"
        :auto-open-active="autoOpenVideo"
      />
    </div>

    <!-- Feitiço dourado saindo do livro mágico da Profª Scassiotti em direção ao monstro -->
    <div v-if="spellActive" class="spell-projectile-track" aria-hidden="true">
      <div class="spell-beam"></div>
      <div class="spell-orb"></div>
    </div>

    <!-- Palco dos personagens: alinhados sobre o altar iluminado (esquerda) e o altar sombrio (direita) -->
    <div class="relative z-10 flex-1 min-h-[210px] mx-auto w-full max-w-6xl">
      <div class="absolute inset-0 flex items-end justify-between gap-3 px-3 sm:px-[7%] lg:px-[9%] pb-7 sm:pb-9">

        <!-- HEROÍNA: Profª Scassiotti sobre o pedestal iluminado dourado/azul da esquerda -->
        <div class="relative h-full w-[48%] max-w-[20.5rem] flex flex-col items-center justify-end">
          <div class="relative flex-1 min-h-0 w-full flex items-end justify-center">
            <div class="pedestal-aura-hero" aria-hidden="true"></div>
            <div class="ground-shadow" aria-hidden="true"></div>

            <div
              class="relative z-10 h-[95%] sm:h-[98%] max-w-full flex items-end justify-center"
              :class="heroAnimationClass"
            >
              <img
                :src="useSolidFrameFallback ? '/images/scassiotti_rpg.jpg' : '/images/scassiotti_rpg.png'"
                alt="Professora Scassiotti com livro mágico"
                class="h-full max-h-full w-auto max-w-full object-contain object-bottom select-none pointer-events-none"
                :class="useSolidFrameFallback ? 'rpg-portrait-frame' : 'hero-sprite'"
                draggable="false"
                @error="useSolidFrameFallback = true"
              />
            </div>
          </div>

          <!-- Placa de identificação e Corações de Vida (com animação de coração partindo ao errar) -->
          <div class="relative z-20 nameplate w-full rounded-2xl px-3 py-1.5 mt-2 flex flex-col items-start gap-0.5 sm:flex-row sm:items-center sm:justify-between sm:gap-2">
            <span class="text-sm sm:text-base font-black leading-tight text-amber-100 drop-shadow">
              Profª Scassiotti
            </span>
            <span class="flex items-center gap-1 shrink-0" role="img" :aria-label="`${hearts} de ${MAX_HEARTS} vidas`">
              <span
                v-for="n in MAX_HEARTS"
                :key="n"
                class="relative inline-flex items-center justify-center w-6 h-6"
              >
                <!-- Coração partindo-se antes de apagar -->
                <HeartCrack
                  v-if="breakingHeartIndex === n"
                  class="w-6 h-6 text-rose-400 fill-rose-500/80 animate-heart-break drop-shadow-[0_0_10px_rgba(244,63,94,0.9)]"
                  aria-hidden="true"
                />
                <!-- Coração ativo ou apagado -->
                <Heart
                  v-else
                  class="w-6 h-6 transition-all duration-300"
                  :class="
                    n <= hearts
                      ? 'fill-rose-500 text-rose-300 drop-shadow-[0_0_8px_rgba(244,63,94,0.6)]'
                      : 'fill-transparent text-slate-500/70 scale-90'
                  "
                  aria-hidden="true"
                />
              </span>
            </span>
          </div>
        </div>

        <!-- MONSTRO / CHEFE: Alinhado sobre o pedestal sombrio roxo da direita -->
        <div class="relative h-full w-[48%] max-w-[20.5rem] flex flex-col items-center justify-end">
          <div class="relative flex-1 min-h-0 w-full flex items-end justify-center">
            <div class="pedestal-aura-monster" aria-hidden="true"></div>
            <div class="ground-shadow" aria-hidden="true"></div>

            <div
              class="relative z-10 h-[92%] sm:h-[95%] max-w-full flex items-end justify-center transition-all duration-500"
              :class="[
                monsterAnimationClass,
                isDefeated ? 'opacity-0 scale-90 grayscale' : ''
              ]"
            >
              <img
                :src="enemy.avatar || '/images/monster_sprite.webp'"
                :alt="enemy.name"
                class="monster-sprite h-full max-h-full w-auto max-w-full object-contain object-bottom select-none pointer-events-none"
                draggable="false"
              />
            </div>
          </div>

          <div class="relative z-20 nameplate w-full rounded-2xl px-3 py-1.5 mt-2">
            <div class="flex items-center justify-between gap-2 mb-1">
              <span class="text-sm sm:text-base font-black leading-tight text-purple-100 truncate">
                {{ enemy.name }}
              </span>
              <span class="text-xs font-extrabold text-rose-300 shrink-0">
                {{ Math.max(0, enemyHp) }}/{{ maxEnemyHp }}
              </span>
            </div>
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
