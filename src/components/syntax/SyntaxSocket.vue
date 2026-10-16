<script setup>
import { ref, computed } from 'vue';
import { User, Zap, Target, Plus } from 'lucide-vue-next';
import WordTile from './WordTile.vue';

const props = defineProps({
  index: {
    type: Number,
    required: true
  },
  token: {
    type: Object,
    default: null
  },
  isSelected: {
    type: Boolean,
    default: false
  },
  isInvalid: {
    type: Boolean,
    default: false
  },
  disabled: {
    type: Boolean,
    default: false
  }
});

const emit = defineEmits(['remove', 'selectSlot', 'dropToken']);

const isDragOver = ref(false);

/**
 * Cada papel sintático tem COR + ÍCONE + RÓTULO (pergunta simples + termo gramatical).
 */
const slotMeta = computed(() => {
  switch (props.index) {
    case 0:
      return {
        icon: User,
        title: 'Quem?',
        sub: 'Sujeito',
        rgb: 'var(--role-sujeito)',
        ink: 'text-sky-200',
        badge: 'bg-role-sujeito text-white'
      };
    case 1:
      return {
        icon: Zap,
        title: 'Ação',
        sub: 'Verbo',
        rgb: 'var(--role-verbo)',
        ink: 'text-emerald-200',
        badge: 'bg-role-verbo text-emerald-950'
      };
    default:
      return {
        icon: Target,
        title: 'Alvo',
        sub: 'Objeto',
        rgb: 'var(--role-objeto)',
        ink: 'text-amber-200',
        badge: 'bg-role-objeto text-amber-950'
      };
  }
});

const handleDragOver = (e) => {
  if (props.disabled) return;
  e.preventDefault();
  e.dataTransfer.dropEffect = 'move';
  isDragOver.value = true;
};

const handleDragLeave = () => {
  isDragOver.value = false;
};

const handleDrop = (e) => {
  if (props.disabled) return;
  e.preventDefault();
  isDragOver.value = false;
  try {
    const raw = e.dataTransfer.getData('text/plain');
    if (!raw) return;
    const parsed = JSON.parse(raw);
    const token = parsed.token || parsed;
    const fromSlotIndex = parsed.fromSlotIndex ?? null;
    emit('dropToken', { index: props.index, token, fromSlotIndex });
  } catch (err) {
    console.warn('Erro ao processar drop no slot:', err);
  }
};

const handleSocketClick = () => {
  if (props.disabled) return;
  emit('selectSlot', props.index);
};
</script>

<template>
  <div
    class="socket"
    :class="{
      'socket--filled': token && !isInvalid,
      'socket--selected': isSelected,
      'socket--over': isDragOver,
      'socket--invalid': isInvalid
    }"
    :style="{ '--sock': slotMeta.rgb }"
    role="group"
    :aria-label="`${slotMeta.title} (${slotMeta.sub}): ${token ? token.text : 'vazio'}`"
    @click="handleSocketClick"
    @dragover="handleDragOver"
    @dragleave="handleDragLeave"
    @drop="handleDrop"
  >
    <!-- Cabeçalho do papel: ícone (forma) + pergunta + termo gramatical -->
    <div class="flex items-center justify-between gap-1.5 sm:gap-2">
      <div class="flex items-center gap-1.5 sm:gap-2 min-w-0">
        <span
          class="grid place-items-center w-7 h-7 sm:w-8 sm:h-8 rounded-full shrink-0 shadow-md"
          :class="slotMeta.badge"
          aria-hidden="true"
        >
          <component :is="slotMeta.icon" class="w-4 h-4 sm:w-[18px] sm:h-[18px]" stroke-width="3" />
        </span>
        <div class="min-w-0 leading-tight">
          <div class="text-base sm:text-lg font-black whitespace-nowrap" :class="slotMeta.ink">
            {{ slotMeta.title }}
          </div>
          <div class="text-xs font-bold text-slate-300 whitespace-nowrap">
            {{ slotMeta.sub }}
          </div>
        </div>
      </div>

      <!-- Indicador visual quando o slot está selecionado para substituição direta -->
      <span
        v-if="isSelected"
        class="hidden sm:inline-flex items-center rounded-full bg-white/15 border border-white/30 px-2 py-0.5 text-[10px] font-extrabold uppercase tracking-wider text-white"
      >
        Selecionado
      </span>
    </div>

    <!-- Conteúdo: carta encaixada (clique para devolver à lista) ou espaço vazio -->
    <div class="flex-1 flex items-center justify-center">
      <WordTile
        v-if="token"
        class="animate-pop-in"
        :token="token"
        :is-slotted="true"
        :slot-index="index"
        :is-invalid="isInvalid"
        :disabled="disabled"
        @click="emit('remove', index)"
      />
      <div
        v-else
        class="flex flex-col items-center justify-center gap-0.5 opacity-55 group-hover:opacity-90 transition-opacity"
      >
        <Plus class="w-7 h-7 sm:w-8 sm:h-8" :class="slotMeta.ink" stroke-width="3" aria-hidden="true" />
        <span v-if="isSelected" class="text-[10px] font-extrabold uppercase tracking-wider" :class="slotMeta.ink">
          Escolha abaixo
        </span>
      </div>
    </div>
  </div>
</template>
