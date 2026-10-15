import { ref, computed } from 'vue';
import levelsData from '@/data/levels.json';
import { useVisualEffects } from '@/composables/useVisualEffects';
import { useStorage } from '@/composables/useStorage';

export function useBattle() {
  const {
    triggerShake,
    triggerFlash,
    triggerCombatText,
    triggerShockwave,
    triggerConfetti
  } = useVisualEffects();

  const storage = useStorage();

  // Estado do Jogo
  const currentLevelIndex = ref(0);
  const currentRoundIndex = ref(0);
  const playerHp = ref(100);
  const maxPlayerHp = ref(100);
  const enemyHp = ref(100);
  const maxEnemyHp = ref(100);

  // Controle de Erros para Cálculo de Estrelas
  const levelErrorsCount = ref(0);
  const hintsUsedCount = ref(0);

  // Slots de construção e Banco de Palavras
  const playerSlots = ref([]);
  const wordBank = ref([]);

  // Estados de Transição e Feedback
  const isAttacking = ref(false);
  const feedbackMessage = ref(null);
  const activeHint = ref(null);
  const invalidSlotIndices = ref([]);
  const isVictory = ref(false);
  const isGameOver = ref(false);

  // Getters computados
  const allLevels = computed(() => levelsData.levels || []);
  const currentLevel = computed(() => levelsData.levels[currentLevelIndex.value] || null);
  const currentRound = computed(() => {
    if (!currentLevel.value) return null;
    return currentLevel.value.rounds[currentRoundIndex.value] || null;
  });
  const currentEnemy = computed(() => currentLevel.value?.enemy || null);

  const shuffleArray = (array) => {
    const arr = [...array];
    for (let i = arr.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [arr[i], arr[j]] = [arr[j], arr[i]];
    }
    return arr;
  };

  /**
   * Inicializa uma rodada de combate
   */
  const initRound = (resetEnemyHp = false) => {
    if (!currentRound.value) return;

    if (resetEnemyHp && currentEnemy.value) {
      enemyHp.value = currentEnemy.value.maxHp;
      maxEnemyHp.value = currentEnemy.value.maxHp;
    }

    const challenge = currentRound.value.syntaxChallenge;
    playerSlots.value = Array(challenge.slotCount || 3).fill(null);
    invalidSlotIndices.value = [];
    activeHint.value = null;

    const allTokens = [
      ...challenge.correctTokens,
      ...challenge.distractors
    ];
    wordBank.value = shuffleArray(allTokens);

    feedbackMessage.value = null;
  };

  /**
   * Inicia ou reinicia o combate na fase selecionada
   */
  const startLevel = (levelIndex = 0) => {
    currentLevelIndex.value = Math.max(0, Math.min(levelIndex, levelsData.levels.length - 1));
    currentRoundIndex.value = 0;
    playerHp.value = maxPlayerHp.value;
    levelErrorsCount.value = 0;
    hintsUsedCount.value = 0;
    isVictory.value = false;
    isGameOver.value = false;
    initRound(true);
  };

  /**
   * Tenta novamente após Game Over (Restaura vida e reinicia a fase)
   */
  const retryCurrentLevel = () => {
    playerHp.value = maxPlayerHp.value;
    isGameOver.value = false;
    isVictory.value = false;
    currentRoundIndex.value = 0;
    levelErrorsCount.value = 0;
    initRound(true);
  };

  /**
   * Avança para a próxima fase desbloqueada
   */
  const advanceToNextLevel = () => {
    if (currentLevelIndex.value < levelsData.levels.length - 1) {
      startLevel(currentLevelIndex.value + 1);
    } else {
      // Zerou o jogo!
      startLevel(0);
    }
  };

  const selectToken = (token) => {
    if (isAttacking.value || isGameOver.value) return;
    // Proteção contra toque duplo: a carta já está num encaixe
    if (playerSlots.value.some((slot) => slot && slot.id === token.id)) return;
    const firstEmptyIndex = playerSlots.value.findIndex((slot) => slot === null);
    if (firstEmptyIndex === -1) return;

    playerSlots.value[firstEmptyIndex] = token;
    wordBank.value = wordBank.value.filter((item) => item.id !== token.id);
    invalidSlotIndices.value = [];
  };

  const placeTokenInSlot = (slotIndex, token) => {
    if (isAttacking.value || isGameOver.value) return;
    if (slotIndex < 0 || slotIndex >= playerSlots.value.length) return;

    const currentOccupant = playerSlots.value[slotIndex];
    if (currentOccupant) {
      wordBank.value.push(currentOccupant);
    }

    playerSlots.value.forEach((s, idx) => {
      if (s && s.id === token.id) {
        playerSlots.value[idx] = null;
      }
    });

    wordBank.value = wordBank.value.filter((item) => item.id !== token.id);
    playerSlots.value[slotIndex] = token;
    invalidSlotIndices.value = [];
  };

  const removeTokenFromSlot = (slotIndex) => {
    if (isAttacking.value || isGameOver.value) return;
    const token = playerSlots.value[slotIndex];
    if (!token) return;

    playerSlots.value[slotIndex] = null;
    wordBank.value.push(token);
    invalidSlotIndices.value = [];
  };

  const resetSlots = () => {
    if (isAttacking.value || isGameOver.value) return;
    const filledTokens = playerSlots.value.filter(Boolean);
    wordBank.value.push(...filledTokens);
    playerSlots.value = Array(currentRound.value?.syntaxChallenge.slotCount || 3).fill(null);
    invalidSlotIndices.value = [];
  };

  // Onde o texto de impacto aparece: sobre a professora (esq.), o monstro (dir.) ou o centro.
  // Fica acima do balão de feedback para nunca cobrir a explicação pedagógica.
  const fxAt = (xRatio) => [window.innerWidth * xRatio, window.innerHeight * 0.3];
  const FX_TEACHER = 0.28;
  const FX_ENEMY = 0.72;
  const FX_CENTER = 0.5;

  const requestHint = () => {
    if (!currentRound.value || isGameOver.value) return;
    hintsUsedCount.value++;
    const tip = currentRound.value.feedback.tip;
    activeHint.value = tip;

    feedbackMessage.value = {
      type: 'tip',
      title: tip.title,
      text: tip.description
    };

    triggerCombatText('DICA', 'alerta', ...fxAt(FX_CENTER));
  };

  /**
   * Executa a checagem sintática do golpe
   */
  const checkSyntaxAttack = () => {
    if (isAttacking.value || isGameOver.value || !currentRound.value) return;

    const challenge = currentRound.value.syntaxChallenge;

    // 1. Verifica se todos os slots foram preenchidos
    const hasEmptySlot = playerSlots.value.some((slot) => slot === null);
    if (hasEmptySlot) {
      triggerShake(200);
      triggerCombatText('COMPLETE A FRASE', 'alerta', ...fxAt(FX_CENTER));
      feedbackMessage.value = {
        type: 'warning',
        title: 'Atenção',
        text: 'Preencha todos os espaços da ordem sintática antes de atacar!'
      };
      return;
    }

    isAttacking.value = true;
    invalidSlotIndices.value = [];

    // 2. Compara com a ordem canônica esperada
    const correctOrder = challenge.correctTokens;
    let isCorrect = true;
    const errors = [];

    playerSlots.value.forEach((placedToken, index) => {
      const expectedToken = correctOrder[index];
      if (!placedToken || placedToken.id !== expectedToken.id) {
        isCorrect = false;
        errors.push(index);
      }
    });

    if (isCorrect) {
      // ACERTO: Golpe no Monstro
      const damage = currentRound.value.damageOnSuccess || 50;
      enemyHp.value = Math.max(0, enemyHp.value - damage);

      triggerFlash('emerald');
      triggerShake(450);
      triggerShockwave(...fxAt(FX_ENEMY));
      triggerCombatText('ACERTOU!', 'critico', ...fxAt(FX_ENEMY));

      storage.recordSentenceBuilt(true);

      feedbackMessage.value = {
        type: 'success',
        title: 'Golpe Preciso!',
        text: currentRound.value.feedback.successMessage
      };

      // Se derrotou o monstro da fase
      if (enemyHp.value <= 0) {
        setTimeout(() => {
          isVictory.value = true;
          triggerConfetti();
          isAttacking.value = false;

          // Cálculo de Estrelas (3 estrelas = 0 erros/0 dicas; 2 estrelas = até 2 erros; 1 estrela = concluído)
          let stars = 3;
          if (levelErrorsCount.value > 0 || hintsUsedCount.value > 0) stars = 2;
          if (levelErrorsCount.value > 2) stars = 1;

          storage.recordVictory(currentLevel.value.id, stars, 100);
        }, 800);
      } else {
        // Próxima rodada da mesma fase
        setTimeout(() => {
          currentRoundIndex.value++;
          initRound(false);
          isAttacking.value = false;
        }, 1100);
      }
    } else {
      // ERRO PEDAGÓGICO: Dano na Professora e Alerta Visual
      levelErrorsCount.value++;
      invalidSlotIndices.value = errors;

      // Reduz o HP do jogador (35 de dano por erro ➔ Game Over no 3º erro consecutivo)
      playerHp.value = Math.max(0, playerHp.value - 35);

      triggerFlash('crimson');
      triggerShake(400);
      triggerCombatText('-1 ♥', 'erro', ...fxAt(FX_TEACHER));

      feedbackMessage.value = {
        type: 'error',
        title: 'Quase lá! Tente de novo',
        text: currentRound.value.feedback.tip.description
      };

      // GAME OVER se a energia zerar
      if (playerHp.value <= 0) {
        setTimeout(() => {
          isGameOver.value = true;
          storage.recordDefeat();
          isAttacking.value = false;
        }, 700);
      } else {
        isAttacking.value = false;
      }
    }
  };

  return {
    allLevels,
    currentLevelIndex,
    currentRoundIndex,
    currentLevel,
    currentRound,
    currentEnemy,
    playerHp,
    maxPlayerHp,
    enemyHp,
    maxEnemyHp,
    playerSlots,
    wordBank,
    isAttacking,
    feedbackMessage,
    activeHint,
    invalidSlotIndices,
    isVictory,
    isGameOver,
    storage,
    startBattle: () => startLevel(0),
    startLevel,
    retryCurrentLevel,
    advanceToNextLevel,
    selectToken,
    placeTokenInSlot,
    removeTokenFromSlot,
    resetSlots,
    requestHint,
    checkSyntaxAttack
  };
}
