import { ref } from 'vue';
import confetti from 'canvas-confetti';

const isShaking = ref(false);
const activeFlash = ref(null);
const floatingTexts = ref([]);
const shockwaves = ref([]);

export function useVisualEffects() {
  /**
   * Aciona tremor de tela (Screen Shake)
   */
  const triggerShake = (duration = 450) => {
    isShaking.value = true;
    setTimeout(() => {
      isShaking.value = false;
    }, duration);
  };

  /**
   * Dispara flash de tela cheia semântico (verde esmeralda ou carmesim)
   */
  const triggerFlash = (type = 'emerald', duration = 420) => {
    activeFlash.value = type;
    setTimeout(() => {
      activeFlash.value = null;
    }, duration);
  };

  /**
   * Cria texto flutuante de dano/alerta nas coordenadas informadas
   */
  const triggerCombatText = (text, type = 'critico', x = window.innerWidth / 2, y = window.innerHeight * 0.4) => {
    const id = Date.now() + Math.random();
    floatingTexts.value.push({ id, text, type, x, y });
    setTimeout(() => {
      floatingTexts.value = floatingTexts.value.filter((item) => item.id !== id);
    }, 1100);
  };

  /**
   * Dispara efeito de onda de choque radial
   */
  const triggerShockwave = (x = window.innerWidth / 2, y = window.innerHeight * 0.35) => {
    const id = Date.now() + Math.random();
    shockwaves.value.push({ id, x, y });
    setTimeout(() => {
      shockwaves.value = shockwaves.value.filter((item) => item.id !== id);
    }, 650);
  };

  /**
   * Dispara chuva de confetes comemorativos (vitória da fase)
   */
  const triggerConfetti = () => {
    try {
      confetti({
        particleCount: 120,
        spread: 80,
        origin: { y: 0.6 },
        colors: ['#10b981', '#38bdf8', '#fbbf24', '#a855f7']
      });
    } catch (e) {
      console.warn('Canvas confetti não disponível no momento:', e);
    }
  };

  return {
    isShaking,
    activeFlash,
    floatingTexts,
    shockwaves,
    triggerShake,
    triggerFlash,
    triggerCombatText,
    triggerShockwave,
    triggerConfetti
  };
}
