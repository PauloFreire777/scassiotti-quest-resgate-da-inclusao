<script setup>
import { onMounted, onUnmounted } from 'vue';
import { X, BookOpen, GraduationCap, Hand, User, Zap, Target } from 'lucide-vue-next';

const props = defineProps({
  isOpen: {
    type: Boolean,
    required: true
  }
});

const emit = defineEmits(['close']);

const handleKeyDown = (e) => {
  if (e.key === 'Escape' && props.isOpen) {
    emit('close');
  }
};

onMounted(() => {
  window.addEventListener('keydown', handleKeyDown);
});

onUnmounted(() => {
  window.removeEventListener('keydown', handleKeyDown);
});
</script>

<template>
  <Teleport to="body">
    <Transition name="modal-fade">
      <div
        v-if="isOpen"
        class="fixed inset-0 z-[9990] flex items-center justify-center p-3 sm:p-4 bg-slate-950/85 backdrop-blur-md overflow-y-auto select-none"
        role="dialog"
        aria-modal="true"
        aria-labelledby="theory-title"
        @click.self="emit('close')"
      >
        <div class="relative w-full max-w-2xl bg-slate-900 border-[3px] border-sky-400/60 rounded-3xl shadow-pop p-5 sm:p-6 max-h-[90vh] overflow-y-auto text-white flex flex-col gap-4">
          <!-- Cabeçalho -->
          <div class="flex items-center justify-between pb-3 border-b-2 border-white/10">
            <div class="flex items-center gap-3">
              <div class="grid place-items-center w-11 h-11 rounded-2xl bg-sky-400/20 border-2 border-sky-300/50 text-sky-300">
                <BookOpen class="w-6 h-6" aria-hidden="true" />
              </div>
              <div>
                <h2 id="theory-title" class="text-lg sm:text-xl font-black uppercase">
                  Como Jogar & Metodologia
                </h2>
                <p class="text-xs sm:text-sm font-bold text-slate-300">Seminários III • Acessibilidade Surda (Libras L1 ➔ Português L2)</p>
              </div>
            </div>

            <button
              type="button"
              class="btn-chunky btn-ghost !min-h-[44px] !px-3"
              aria-label="Fechar"
              @click="emit('close')"
            >
              <X class="w-5 h-5" aria-hidden="true" />
            </button>
          </div>

          <!-- Guia Visual Rápido (Deaf-First: ícones + cores + exemplos curtos) -->
          <div class="bg-paper text-paper-ink rounded-2xl p-4 border-2 border-paper-400 space-y-3">
            <div class="flex items-center gap-2 text-base font-black">
              <Hand class="w-5 h-5 text-sky-700" aria-hidden="true" />
              <span>Passo a passo da partida</span>
            </div>
            <p class="text-sm font-bold leading-snug">
              Veja o sinal em <strong>Libras</strong> no topo da tela e toque nas cartas para montar a frase em <strong>Português</strong> na ordem dos 3 espaços:
            </p>
            <div class="grid grid-cols-3 gap-2 pt-1 text-center">
              <div class="rounded-xl bg-blue-600/15 border-2 border-blue-600 p-2">
                <User class="w-5 h-5 mx-auto text-blue-700" aria-hidden="true" />
                <div class="text-sm font-black text-blue-900">1º Quem?</div>
                <div class="text-xs font-bold text-blue-800">Sujeito</div>
              </div>
              <div class="rounded-xl bg-emerald-600/15 border-2 border-emerald-600 p-2">
                <Zap class="w-5 h-5 mx-auto text-emerald-700" aria-hidden="true" />
                <div class="text-sm font-black text-emerald-900">2º Ação</div>
                <div class="text-xs font-bold text-emerald-800">Verbo</div>
              </div>
              <div class="rounded-xl bg-amber-500/20 border-2 border-amber-600 p-2">
                <Target class="w-5 h-5 mx-auto text-amber-800" aria-hidden="true" />
                <div class="text-sm font-black text-amber-950">3º Alvo</div>
                <div class="text-xs font-bold text-amber-900">Objeto</div>
              </div>
            </div>
          </div>

          <!-- Fundamentação Acadêmica (para avaliação da banca / professora) -->
          <div class="space-y-3 text-xs sm:text-sm text-slate-200 leading-relaxed">
            <div class="p-3.5 rounded-2xl bg-slate-950/70 border border-white/15 flex items-start gap-3">
              <GraduationCap class="w-5 h-5 text-amber-300 shrink-0 mt-0.5" aria-hidden="true" />
              <div>
                <strong class="font-black text-amber-200">Fundamentação (Seminários III):</strong>
                A <strong>Libras (L1)</strong> é visual-espacial e usa estrutura tópico-comentário, enquanto o <strong>Português Escrito (L2)</strong> exige linearidade canônica <strong>SVO</strong>. O jogo reduz o <em>Filtro Afetivo</em> (Krashen) com feedback visual imediato, redundância cromática + iconográfica (WCAG AAA) e zero dependência sonora.
              </div>
            </div>
          </div>

          <!-- Rodapé -->
          <div class="pt-2 border-t-2 border-white/10 flex justify-end">
            <button
              type="button"
              class="btn-chunky btn-go !min-h-[48px] !px-6 uppercase"
              @click="emit('close')"
            >
              <span>Entendi, vamos jogar!</span>
            </button>
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
