<script setup>
import { ref, computed, watch, nextTick, onBeforeUnmount } from 'vue';
import {
  Hand,
  Video,
  Play,
  Pause,
  RotateCcw,
  Gauge,
  Upload,
  Sparkles,
  ArrowRight,
  CheckCircle2
} from 'lucide-vue-next';

// Modo Produção: oculta utilitários de programador ("Testar arquivo .mp4" e aviso técnico de rodapé)
const IS_DEV_MODE = false;

const props = defineProps({
  videoUrl: {
    type: String,
    required: true
  },
  gloss: {
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
  autoOpenActive: {
    type: Boolean,
    default: false
  },
  roundKey: {
    type: String,
    default: ''
  }
});

const videoOk = ref(true);
const customVideoBlobUrl = ref(null);
const isOpen = ref(false);
const bigVideo = ref(null);
const startChallengeBtn = ref(null);
const fileInput = ref(null);
const isPlaying = ref(true);
const rate = ref(1);
const activeStepIndex = ref(0);
let stepInterval = null;

const effectiveVideoSrc = computed(() => customVideoBlobUrl.value || props.videoUrl);
const uppercaseGloss = computed(() => (props.gloss || '').toUpperCase());

const roleStyles = {
  SUJEITO: {
    badge: 'bg-sky-500/25 text-sky-200 border-sky-400/60',
    card: 'border-sky-400/60 bg-sky-950/40',
    stepLabel: '1º Sinal • QUEM'
  },
  VERBO: {
    badge: 'bg-amber-500/25 text-amber-200 border-amber-400/60',
    card: 'border-amber-400/60 bg-amber-950/40',
    stepLabel: '2º Sinal • AÇÃO'
  },
  OBJETO: {
    badge: 'bg-violet-500/25 text-violet-200 border-violet-400/60',
    card: 'border-violet-400/60 bg-violet-950/40',
    stepLabel: '3º Sinal • ALVO'
  }
};

const startStepCycle = () => {
  stopStepCycle();
  activeStepIndex.value = 0;
  if (props.signSteps?.length > 1) {
    stepInterval = setInterval(() => {
      if (isPlaying.value) {
        activeStepIndex.value = (activeStepIndex.value + 1) % props.signSteps.length;
      }
    }, rate.value === 0.5 ? 3200 : 1800);
  }
};

const stopStepCycle = () => {
  if (stepInterval) {
    clearInterval(stepInterval);
    stepInterval = null;
  }
};

const open = async () => {
  isOpen.value = true;
  isPlaying.value = true;
  startStepCycle();
  await nextTick();
  startChallengeBtn.value?.focus();
  window.addEventListener('keydown', onKey);
};

const close = () => {
  isOpen.value = false;
  stopStepCycle();
  window.removeEventListener('keydown', onKey);
};

const onKey = (e) => {
  if (e.key === 'Escape') close();
};

watch(
  [() => props.roundKey, () => props.autoOpenActive],
  ([newRoundKey, canAutoOpen], [oldRoundKey, wasAutoOpen]) => {
    if (newRoundKey !== oldRoundKey) {
      if (customVideoBlobUrl.value) {
        URL.revokeObjectURL(customVideoBlobUrl.value);
        customVideoBlobUrl.value = null;
      }
      videoOk.value = true;
      rate.value = 1;
    }
    if (canAutoOpen && (newRoundKey !== oldRoundKey || !wasAutoOpen)) {
      open();
    }
  },
  { immediate: true }
);

const toggleRate = () => {
  rate.value = rate.value === 1 ? 0.5 : 1;
  if (bigVideo.value) bigVideo.value.playbackRate = rate.value;
  if (!videoOk.value) startStepCycle();
};

const togglePlay = () => {
  const v = bigVideo.value;
  if (v && videoOk.value) {
    if (v.paused) {
      v.play();
      isPlaying.value = true;
    } else {
      v.pause();
      isPlaying.value = false;
    }
  } else {
    isPlaying.value = !isPlaying.value;
  }
};

const restartVideo = () => {
  const v = bigVideo.value;
  if (v && videoOk.value) {
    v.currentTime = 0;
    v.play();
    isPlaying.value = true;
  } else {
    activeStepIndex.value = 0;
    isPlaying.value = true;
    startStepCycle();
  }
};

const handleLocalVideoUpload = (event) => {
  const file = event.target.files?.[0];
  if (!file) return;
  if (customVideoBlobUrl.value) {
    URL.revokeObjectURL(customVideoBlobUrl.value);
  }
  customVideoBlobUrl.value = URL.createObjectURL(file);
  videoOk.value = true;
  isPlaying.value = true;
};

onBeforeUnmount(() => {
  stopStepCycle();
  window.removeEventListener('keydown', onKey);
  if (customVideoBlobUrl.value) {
    URL.revokeObjectURL(customVideoBlobUrl.value);
  }
});
</script>

<template>
  <!-- Banner superior no ecrã de combate (Glassmorphism):
       Mantém APENAS a glosa em maiúsculas e o botão "Ver Vídeo" (sem spoiler da frase conjugada) -->
  <section
    class="sign-card flex items-center justify-between gap-2.5 sm:gap-3.5 rounded-3xl p-2 sm:p-3"
    aria-label="Enunciado em Libras da Professora"
  >
    <!-- Miniatura do Vídeo / Ilustração RPG da Professora clicável -->
    <button
      type="button"
      class="group relative shrink-0 w-20 sm:w-28 aspect-[16/10] rounded-2xl overflow-hidden bg-slate-900/90 ring-2 ring-amber-300/70 hover:ring-amber-300 transition-all focus:outline-none"
      aria-label="Abrir tela de vídeo da Professora Scassiotti"
      @click="open"
    >
      <video
        v-if="videoOk"
        :src="effectiveVideoSrc"
        autoplay
        loop
        muted
        playsinline
        class="absolute inset-0 h-full w-full object-cover"
        aria-hidden="true"
        @error="videoOk = false"
      ></video>
      <div
        v-else
        class="absolute inset-0 flex items-end justify-center bg-gradient-to-b from-indigo-900/90 to-slate-950"
      >
        <img
          src="/images/scassiotti_rpg.png"
          alt=""
          class="h-[95%] w-auto object-contain object-bottom group-hover:scale-105 transition-transform"
          draggable="false"
        />
      </div>

      <!-- Badge de Play sobreposto -->
      <span
        class="absolute inset-0 flex items-center justify-center bg-slate-950/35 group-hover:bg-slate-950/15 transition-colors"
      >
        <span
          class="grid place-items-center w-8 h-8 sm:w-9 sm:h-9 rounded-full bg-amber-400 text-slate-950 shadow-md group-hover:scale-110 transition-transform"
        >
          <Play class="w-4 h-4 fill-current ml-0.5" aria-hidden="true" />
        </span>
      </span>
    </button>

    <!-- APENAS Glosa em Letras Maiúsculas (sem frase traduzida que entregava o verbo conjugado) -->
    <div class="min-w-0 flex-1">
      <p class="flex items-center gap-1.5 text-[11px] sm:text-xs font-extrabold uppercase tracking-wider text-sky-200">
        <Hand class="w-3.5 h-3.5 text-amber-300 shrink-0" aria-hidden="true" />
        <span>SINAL EM LIBRAS (GLOSA)</span>
      </p>
      <p class="mt-0.5 text-base sm:text-2xl font-black uppercase leading-tight tracking-wider text-amber-100 truncate drop-shadow">
        {{ uppercaseGloss }}
      </p>
    </div>

    <!-- Botão explícito para abrir a Tela de Vídeo da Professora -->
    <button
      type="button"
      class="btn-chunky btn-amber !min-h-[44px] !px-3 sm:!px-4 text-xs sm:text-sm shrink-0"
      @click="open"
    >
      <Video class="w-4 h-4 sm:w-5 sm:h-5 shrink-0" aria-hidden="true" />
      <span>Ver Vídeo</span>
    </button>
  </section>

  <!-- =========================================================================
       MODAL DE VÍDEO DA PROFESSORA (Abre antes da rodada e ao clicar em "Ver Vídeo")
       ========================================================================= -->
  <Teleport to="body">
    <Transition name="modal-pop">
      <div
        v-if="isOpen"
        class="fixed inset-0 z-[9995] flex items-center justify-center p-3 sm:p-5 bg-slate-950/90 backdrop-blur-md overflow-y-auto"
        role="dialog"
        aria-modal="true"
        aria-labelledby="video-modal-title"
        @click.self="close"
      >
        <div
          class="w-full max-w-3xl rounded-3xl bg-slate-900 border-[3px] border-sky-400/70 p-4 sm:p-6 shadow-pop my-auto text-white"
        >
          <!-- Cabeçalho da Tela de Vídeo -->
          <div class="flex flex-wrap items-center justify-between gap-2 pb-3 border-b-2 border-white/10">
            <div>
              <span
                class="inline-flex items-center gap-1.5 rounded-full bg-amber-400/20 border border-amber-300/50 px-3 py-0.5 text-xs font-extrabold uppercase tracking-wider text-amber-200"
              >
                <Sparkles class="w-3.5 h-3.5" aria-hidden="true" />
                Passo 1 • Observe a explicação em Libras
              </span>
              <h2 id="video-modal-title" class="mt-1 text-xl sm:text-2xl font-black text-white">
                Vídeo da Profª Scassiotti
              </h2>
            </div>

            <!-- Utilitário de programador controlado por IS_DEV_MODE -->
            <div v-if="IS_DEV_MODE" class="flex items-center gap-2">
              <input
                ref="fileInput"
                type="file"
                accept="video/mp4,video/webm,video/*"
                class="hidden"
                @change="handleLocalVideoUpload"
              />
              <button
                type="button"
                class="inline-flex items-center gap-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 border border-white/20 px-3 py-2 text-xs font-bold text-sky-200 transition-colors"
                title="Testar com um arquivo de vídeo .mp4 do seu computador"
                @click="fileInput?.click()"
              >
                <Upload class="w-3.5 h-3.5" aria-hidden="true" />
                <span>Testar arquivo .mp4</span>
              </button>
            </div>
          </div>

          <!-- Palco de Vídeo 16:9 -->
          <div
            class="relative mt-3 rounded-2xl overflow-hidden bg-slate-950 border-2 border-sky-300/40 shadow-inner"
          >
            <!-- MODO 1: Arquivo de vídeo .mp4 disponível -->
            <div v-if="videoOk" class="relative aspect-video w-full bg-black">
              <video
                ref="bigVideo"
                :src="effectiveVideoSrc"
                autoplay
                loop
                muted
                playsinline
                class="h-full w-full object-contain"
                aria-label="Professora Scassiotti sinalizando a frase em Libras"
                @error="videoOk = false"
              ></video>

              <!-- Legenda de apoio em glosa sobre o vídeo -->
              <div
                class="absolute bottom-3 inset-x-3 flex items-center justify-between gap-2 rounded-xl bg-slate-950/85 border border-white/15 px-3.5 py-2 backdrop-blur-sm"
              >
                <div class="flex items-center gap-2 min-w-0">
                  <Hand class="w-5 h-5 text-amber-300 shrink-0" aria-hidden="true" />
                  <span class="text-sm sm:text-lg font-black uppercase tracking-wide text-white truncate">
                    {{ uppercaseGloss }}
                  </span>
                </div>
                <span class="text-xs font-bold text-emerald-300 shrink-0">Libras</span>
              </div>
            </div>

            <!-- MODO 2: Palco Visual da Professora Scassiotti -->
            <div
              v-else
              class="relative grid grid-cols-1 md:grid-cols-12 min-h-[270px] sm:min-h-[310px] bg-gradient-to-br from-indigo-950 via-slate-900 to-slate-950 p-4 sm:p-5 gap-4 items-center"
            >
              <!-- Coluna da Professora em destaque com a nova arte RPG -->
              <div class="md:col-span-5 relative flex flex-col items-center justify-end h-48 sm:h-64">
                <div
                  class="absolute inset-0 rounded-2xl bg-gradient-to-t from-amber-500/15 via-sky-500/10 to-transparent pointer-events-none"
                ></div>
                <img
                  src="/images/scassiotti_rpg.png"
                  alt="Professora Scassiotti sinalizando"
                  class="hero-sprite relative z-10 h-full w-auto max-w-full object-contain object-bottom"
                  :class="isPlaying ? 'animate-idle-bob' : ''"
                  draggable="false"
                />
                <span
                  class="relative z-20 -mt-2 inline-flex items-center gap-1.5 rounded-full bg-amber-400 text-slate-950 px-3 py-1 text-xs font-black uppercase shadow-md"
                >
                  <Hand class="w-3.5 h-3.5" aria-hidden="true" />
                  Profª Scassiotti • Libras
                </span>
              </div>

              <!-- Coluna do Roteiro Visual e Sequência de Sinais -->
              <div class="md:col-span-7 flex flex-col justify-between gap-3">
                <!-- Explicação contextual da professora (visível no modal antes da batalha) -->
                <div class="rounded-2xl bg-slate-950/75 border border-white/15 p-3.5">
                  <p class="text-[11px] font-extrabold uppercase tracking-wider text-amber-300">
                    Contexto da Situação:
                  </p>
                  <p class="mt-1 text-sm sm:text-base font-bold text-white leading-snug">
                    “{{ contextSentence || 'Observe os sinais em Libras abaixo para montar a frase em português.' }}”
                  </p>
                  <p class="mt-2 text-xs font-extrabold text-sky-300">
                    Glosa em Libras: <span class="text-amber-200 font-black uppercase tracking-wide">{{ uppercaseGloss }}</span>
                  </p>
                </div>

                <!-- Passos da Sinalização (1º Sujeito, 2º Verbo, 3º Objeto) -->
                <div v-if="signSteps && signSteps.length" class="grid grid-cols-1 sm:grid-cols-3 gap-2">
                  <div
                    v-for="(step, idx) in signSteps"
                    :key="idx"
                    class="rounded-xl border-2 p-2.5 transition-all duration-300 cursor-pointer"
                    :class="[
                      roleStyles[step.role]?.card || 'border-white/20 bg-slate-800/60',
                      activeStepIndex === idx
                        ? 'ring-2 ring-amber-300 scale-[1.03] shadow-lg'
                        : 'opacity-80 hover:opacity-100'
                    ]"
                    @click="activeStepIndex = idx"
                  >
                    <span
                      class="inline-block rounded-md border px-1.5 py-0.5 text-[10px] font-black uppercase"
                      :class="roleStyles[step.role]?.badge"
                    >
                      {{ roleStyles[step.role]?.stepLabel || `${idx + 1}º Sinal` }}
                    </span>
                    <p class="mt-1 text-sm sm:text-base font-black text-white">
                      {{ step.sign }}
                    </p>
                    <p class="mt-0.5 text-[11px] font-semibold text-slate-200 leading-tight">
                      {{ step.cue }}
                    </p>
                  </div>
                </div>

                <!-- Aviso técnico controlado por IS_DEV_MODE -->
                <div
                  v-if="IS_DEV_MODE"
                  class="flex items-center justify-between gap-2 rounded-xl bg-slate-950/60 border border-dashed border-sky-400/40 px-3 py-1.5 text-[11px] text-slate-300"
                >
                  <span class="truncate">
                    📁 Pronto para vídeo: basta salvar em <strong class="text-sky-300">public{{ videoUrl }}</strong>
                  </span>
                  <span class="shrink-0 font-bold text-amber-300">Simulação Ativa</span>
                </div>
              </div>
            </div>
          </div>

          <!-- Contexto de apoio quando o vídeo .mp4 real estiver ativo no modal -->
          <div
            v-if="videoOk && contextSentence"
            class="mt-3 rounded-2xl bg-slate-950/75 border border-white/15 px-4 py-2.5"
          >
            <p class="text-[11px] font-extrabold uppercase tracking-wider text-amber-300">
              Contexto explicado pela Professora:
            </p>
            <p class="mt-0.5 text-xs sm:text-sm font-bold text-slate-100 leading-snug">
              “{{ contextSentence }}”
            </p>
          </div>

          <!-- Controles de Reprodução + Botão Principal para ir ao Jogo -->
          <div class="mt-4 flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
            <!-- Controles do Player (Velocidade 0.5x, Pausar, Repetir) -->
            <div class="flex items-center gap-2 justify-center sm:justify-start">
              <button
                type="button"
                class="btn-chunky btn-ghost !min-h-[46px] !px-3 text-xs sm:text-sm"
                :aria-pressed="rate === 0.5"
                @click="toggleRate"
              >
                <Gauge class="w-4 h-4 sm:w-5 sm:h-5 text-sky-300" aria-hidden="true" />
                <span>{{ rate === 0.5 ? '0.5x Lento' : '1x Normal' }}</span>
              </button>

              <button
                type="button"
                class="btn-chunky btn-ghost !min-h-[46px] !px-3 text-xs sm:text-sm"
                :aria-label="isPlaying ? 'Pausar explicação' : 'Reproduzir explicação'"
                @click="togglePlay"
              >
                <Pause v-if="isPlaying" class="w-4 h-4 sm:w-5 sm:h-5 text-amber-300" aria-hidden="true" />
                <Play v-else class="w-4 h-4 sm:w-5 sm:h-5 text-emerald-300" aria-hidden="true" />
                <span>{{ isPlaying ? 'Pausar' : 'Reproduzir' }}</span>
              </button>

              <button
                type="button"
                class="btn-chunky btn-ghost !min-h-[46px] !px-3 text-xs sm:text-sm"
                aria-label="Repetir desde o início"
                @click="restartVideo"
              >
                <RotateCcw class="w-4 h-4 sm:w-5 sm:h-5 text-sky-200" aria-hidden="true" />
                <span class="hidden sm:inline">Repetir</span>
              </button>
            </div>

            <!-- CTA Dominante: Ir para a montagem da frase no jogo -->
            <button
              ref="startChallengeBtn"
              type="button"
              class="btn-chunky btn-go !min-h-[52px] !px-6 text-base sm:text-lg"
              @click="close"
            >
              <CheckCircle2 class="w-5 h-5 sm:w-6 sm:h-6 shrink-0" aria-hidden="true" />
              <span>Montar a Frase no Jogo</span>
              <ArrowRight class="w-5 h-5 shrink-0" aria-hidden="true" />
            </button>
          </div>
        </div>
      </div>
    </Transition>
  </Teleport>
</template>

<style scoped>
.modal-pop-enter-active,
.modal-pop-leave-active {
  transition: opacity 0.25s ease, transform 0.25s ease;
}
.modal-pop-enter-from,
.modal-pop-leave-to {
  opacity: 0;
  transform: scale(0.96);
}
</style>
