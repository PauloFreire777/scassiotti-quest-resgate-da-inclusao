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

  // Slots de construção, slot selecionado e Banco de Palavras
  const playerSlots = ref([]);
  const wordBank = ref([]);
  const selectedSlotIndex = ref(null);
  const replaceCursor = ref(0);

  // Estados de Transição, Coreografia de Combate e Feedback
  const isAttacking = ref(false);
  const combatAnimState = ref(null); // 'hero-attack' | 'monster-attack' | null
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
    selectedSlotIndex.value = null;
    replaceCursor.value = 0;
    invalidSlotIndices.value = [];
    activeHint.value = null;
    combatAnimState.value = null;

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
      startLevel(0);
    }
  };

  /**
   * Seleciona/foca um slot específico ("Quem?", "Ação" ou "Alvo") para substituição direta
   */
  const selectSlot = (slotIndex) => {
    if (isAttacking.value || isGameOver.value) return;
    if (slotIndex < 0 || slotIndex >= playerSlots.value.length) return;
    selectedSlotIndex.value = selectedSlotIndex.value === slotIndex ? null : slotIndex;
  };

  /**
   * Coloca ou substitui diretamente uma palavra num slot específico (usado por clique e Drag & Drop)
   */
  const placeTokenInSlot = (slotIndex, token, fromSlotIndex = null) => {
    if (isAttacking.value || isGameOver.value || !token) return;
    if (slotIndex < 0 || slotIndex >= playerSlots.value.length) return;

    const existingSourceIdx =
      fromSlotIndex !== null && fromSlotIndex !== undefined
        ? fromSlotIndex
        : playerSlots.value.findIndex((s) => s && s.id === token.id);

    const currentOccupant = playerSlots.value[slotIndex];

    // Se a palavra veio de outro slot superior, faz a troca (swap) entre os dois slots
    if (existingSourceIdx !== -1) {
      if (existingSourceIdx === slotIndex) return;
      playerSlots.value[existingSourceIdx] = currentOccupant || null;
      playerSlots.value[slotIndex] = token;
    } else {
      // Veio do banco de palavras inferior: se o slot alvo já tinha uma palavra, devolve-a ao banco
      if (currentOccupant && currentOccupant.id !== token.id) {
        wordBank.value.push(currentOccupant);
      }
      wordBank.value = wordBank.value.filter((item) => item.id !== token.id);
      playerSlots.value[slotIndex] = token;
    }

    invalidSlotIndices.value = invalidSlotIndices.value.filter((idx) => idx !== slotIndex);

    // Atualiza o foco para o próximo slot vazio, ou limpa se todos estiverem preenchidos
    const nextEmpty = playerSlots.value.findIndex((s) => s === null);
    selectedSlotIndex.value = nextEmpty !== -1 ? nextEmpty : null;
  };

  /**
   * Ao clicar numa palavra disponível no banco inferior:
   * 1. Se houver um slot selecionado pelo jogador, coloca/substitui diretamente nele;
   * 2. Senão, se houver algum slot vazio, preenche o primeiro vazio;
   * 3. Senão (os 3 slots já estão cheios), substitui diretamente o primeiro slot com erro
   *    ou o slot do cursor de substituição, devolvendo a palavra anterior para a lista de baixo!
   */
  const selectToken = (token) => {
    if (isAttacking.value || isGameOver.value || !token) return;
    if (playerSlots.value.some((slot) => slot && slot.id === token.id)) return;

    let targetIndex = -1;

    if (selectedSlotIndex.value !== null && selectedSlotIndex.value >= 0) {
      targetIndex = selectedSlotIndex.value;
    } else {
      const firstEmptyIndex = playerSlots.value.findIndex((slot) => slot === null);
      if (firstEmptyIndex !== -1) {
        targetIndex = firstEmptyIndex;
      } else if (invalidSlotIndices.value.length > 0) {
        targetIndex = invalidSlotIndices.value[0];
      } else {
        targetIndex = replaceCursor.value % playerSlots.value.length;
        replaceCursor.value = (replaceCursor.value + 1) % playerSlots.value.length;
      }
    }

    placeTokenInSlot(targetIndex, token);
  };

  /**
   * Ao clicar numa palavra já preenchida nos slots superiores ("Quem?", "Ação", "Alvo"),
   * ela volta para a lista de baixo e deixa esse slot focado para fácil substituição.
   */
  const removeTokenFromSlot = (slotIndex) => {
    if (isAttacking.value || isGameOver.value) return;
    const token = playerSlots.value[slotIndex];
    if (!token) {
      selectSlot(slotIndex);
      return;
    }

    playerSlots.value[slotIndex] = null;
    if (!wordBank.value.some((item) => item.id === token.id)) {
      wordBank.value.push(token);
    }
    selectedSlotIndex.value = slotIndex;
    replaceCursor.value = slotIndex;
    invalidSlotIndices.value = invalidSlotIndices.value.filter((idx) => idx !== slotIndex);
  };

  /**
   * Permite arrastar uma palavra de um slot superior de volta para o banco de palavras inferior
   */
  const returnTokenToBank = (token) => {
    if (isAttacking.value || isGameOver.value || !token) return;
    const slotIdx = playerSlots.value.findIndex((s) => s && s.id === token.id);
    if (slotIdx !== -1) {
      removeTokenFromSlot(slotIdx);
    }
  };

  const resetSlots = () => {
    if (isAttacking.value || isGameOver.value) return;
    const filledTokens = playerSlots.value.filter(Boolean);
    filledTokens.forEach((t) => {
      if (!wordBank.value.some((item) => item.id === t.id)) {
        wordBank.value.push(t);
      }
    });
    playerSlots.value = Array(currentRound.value?.syntaxChallenge.slotCount || 3).fill(null);
    selectedSlotIndex.value = null;
    replaceCursor.value = 0;
    invalidSlotIndices.value = [];
  };

  // Coordenadas para os efeitos visuais na arena (heroína à esquerda, monstro à direita)
  const fxAt = (xRatio, yRatio = 0.3) => [window.innerWidth * xRatio, window.innerHeight * yRatio];
  const FX_TEACHER = 0.25;
  const FX_ENEMY = 0.75;
  const FX_CENTER = 0.5;

  /**
   * Exibe a dica pedagógica + a frase contextualizada (que fica oculta durante o combate para não dar spoiler)
   */
  const requestHint = () => {
    if (!currentRound.value || isGameOver.value) return;
    hintsUsedCount.value++;
    const tip = currentRound.value.feedback.tip;
    const contextSentence = currentRound.value.media?.contextSentence || '';
    activeHint.value = tip;

    feedbackMessage.value = {
      type: 'tip',
      title: tip.title,
      text: tip.description,
      contextSentence
    };

    triggerCombatText('DICA', 'alerta', ...fxAt(FX_CENTER));
  };

  /**
   * Executa a checagem sintática do golpe e dispara as animações de combate RPG
   */
  const checkSyntaxAttack = () => {
    if (isAttacking.value || isGameOver.value || !currentRound.value) return;

    const challenge = currentRound.value.syntaxChallenge;

    // 1. Verifica se todos os slots foram preenchidos
    const hasEmptySlot = playerSlots.value.some((slot) => slot === null);
    if (hasEmptySlot) {
      triggerShake(220);
      triggerCombatText('COMPLETE A FRASE', 'alerta', ...fxAt(FX_CENTER));
      feedbackMessage.value = {
        type: 'warning',
        title: 'Atenção',
        text: 'Preencha todos os espaços ("Quem?", "Ação" e "Alvo") antes de atacar!'
      };
      return;
    }

    isAttacking.value = true;
    invalidSlotIndices.value = [];
    selectedSlotIndex.value = null;

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
      // ACERTO: Professora dá impulso para frente e dispara feitiço dourado do livro mágico
      combatAnimState.value = 'hero-attack';
      const damage = currentRound.value.damageOnSuccess || 50;

      // Impacto do feitiço no monstro após o voo da luz dourada (~220ms)
      setTimeout(() => {
        enemyHp.value = Math.max(0, enemyHp.value - damage);
        triggerFlash('emerald');
        triggerShake(460);
        triggerShockwave(...fxAt(FX_ENEMY, 0.34));
        triggerCombatText('ACERTOU!', 'critico', ...fxAt(FX_ENEMY, 0.28));
      }, 220);

      storage.recordSentenceBuilt(true);

      feedbackMessage.value = {
        type: 'success',
        title: 'Golpe Mágico Preciso!',
        text: currentRound.value.feedback.successMessage
      };

      // Se derrotou o monstro da fase
      if (enemyHp.value - damage <= 0) {
        setTimeout(() => {
          combatAnimState.value = null;
          isVictory.value = true;
          triggerConfetti();
          isAttacking.value = false;

          let stars = 3;
          if (levelErrorsCount.value > 0 || hintsUsedCount.value > 0) stars = 2;
          if (levelErrorsCount.value > 2) stars = 1;

          storage.recordVictory(currentLevel.value.id, stars, 100);
        }, 1050);
      } else {
        // Próxima rodada da mesma fase
        setTimeout(() => {
          combatAnimState.value = null;
          currentRoundIndex.value++;
          initRound(false);
          isAttacking.value = false;
        }, 1250);
      }
    } else {
      // ERRO PEDAGÓGICO: Monstro avança levemente, tela treme com flash avermelhado nas bordas e coração parte-se
      combatAnimState.value = 'monster-attack';
      levelErrorsCount.value++;
      invalidSlotIndices.value = errors;
      selectedSlotIndex.value = errors[0] ?? null;

      // Reduz o HP do jogador (35 de dano por erro ➔ Game Over no 3º erro consecutivo)
      playerHp.value = Math.max(0, playerHp.value - 35);

      triggerFlash('crimson', 550);
      triggerShake(480);
      triggerCombatText('-1 ♥', 'erro', ...fxAt(FX_TEACHER, 0.28));

      feedbackMessage.value = {
        type: 'error',
        title: 'Quase lá! Tente de novo',
        text: currentRound.value.feedback.tip.description
      };

      setTimeout(() => {
        combatAnimState.value = null;
      }, 650);

      // GAME OVER se a energia zerar
      if (playerHp.value <= 0) {
        setTimeout(() => {
          isGameOver.value = true;
          storage.recordDefeat();
          isAttacking.value = false;
        }, 780);
      } else {
        setTimeout(() => {
          isAttacking.value = false;
        }, 450);
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
    selectedSlotIndex,
    isAttacking,
    combatAnimState,
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
    selectSlot,
    selectToken,
    placeTokenInSlot,
    removeTokenFromSlot,
    returnTokenToBank,
    resetSlots,
    requestHint,
    checkSyntaxAttack
  };
}
