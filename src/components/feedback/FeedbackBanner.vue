<script setup>
import { ref, computed, watch, onBeforeUnmount } from 'vue';
import { CheckCircle2, XCircle, Lightbulb, AlertTriangle, X } from 'lucide-vue-next';

const props = defineProps({
  feedback: {
    type: Object,
    default: null
  }
});

const visible = ref(false);
let timer = null;

// Cada `feedbackMessage` novo é um objeto novo → o balão reaparece e some sozinho.
// Erros e dicas ficam mais tempo, pois o leitor L2 precisa de tempo para ler.
watch(() => props.feedback, (fb) => {
  clearTimeout(timer);
  if (!fb) {
    visible.value = false;
    return;
  }
  visible.value = true;
  const ms = fb.type === 'success' ? 4500 : 9000;
  timer = setTimeout(() => (visible.value = false), ms);
}, { immediate: true });

onBeforeUnmount(() => clearTimeout(timer));

// Cada tipo tem cor + ÍCONE DIFERENTE (✓, ✕, lâmpada, alerta): nunca depende só de cor.
const style = computed(() => {
  switch (props.feedback?.type) {
    case 'success':
      return { icon: CheckCircle2, ring: 'border-emerald-500', badge: 'bg-emerald-500 text-emerald-950', title: 'text-emerald-800' };
    case 'error':
      return { icon: XCircle, ring: 'border-rose-500', badge: 'bg-rose-500 text-white', title: 'text-rose-800' };
    case 'tip':
      return { icon: Lightbulb, ring: 'border-amber-500', badge: 'bg-amber-400 text-amber-950', title: 'text-amber-800' };
    case 'warning':
      return { icon: AlertTriangle, ring: 'border-amber-500', badge: 'bg-amber-400 text-amber-950', title: 'text-amber-800' };
    default:
      return null;
  }
});
</script>

<template>
  <Transition name="bubble">
    <div
      v-if="visible && feedback && style"
      class="pointer-events-auto relative w-full max-w-md flex items-start gap-3 rounded-3xl border-[4px] bg-paper p-3 pr-12 text-paper-ink shadow-pop"
      :class="[style.ring, feedback.type === 'error' ? 'animate-subtle-shake' : '']"
      role="status"
      aria-live="polite"
    >
      <!-- Avatar da professora com selo do tipo de mensagem -->
      <div class="relative shrink-0">
        <img
          src="/images/teacher_sprite.webp"
          alt=""
          class="w-14 h-14 rounded-full object-cover object-top bg-slate-800 border-2 border-paper-400"
        />
        <span class="absolute -bottom-1 -right-1 grid place-items-center w-7 h-7 rounded-full border-2 border-paper" :class="style.badge">
          <component :is="style.icon" class="w-4 h-4" stroke-width="3" aria-hidden="true" />
        </span>
      </div>

      <div class="min-w-0 pt-0.5">
        <p v-if="feedback.title" class="text-base font-black leading-tight" :class="style.title">{{ feedback.title }}</p>
        <p class="text-base sm:text-lg font-bold leading-snug">{{ feedback.text }}</p>
      </div>

      <button
        type="button"
        class="absolute top-1.5 right-1.5 grid place-items-center w-10 h-10 rounded-full text-paper-ink/70 hover:bg-black/10"
        aria-label="Fechar mensagem"
        @click="visible = false"
      >
        <X class="w-5 h-5" aria-hidden="true" />
      </button>
    </div>
  </Transition>
</template>

<style scoped>
.bubble-enter-active {
  transition: all 0.3s cubic-bezier(0.34, 1.56, 0.64, 1);
}
.bubble-leave-active {
  transition: all 0.2s ease-in;
}
.bubble-enter-from,
.bubble-leave-to {
  opacity: 0;
  transform: translateY(16px) scale(0.92);
}
</style>
