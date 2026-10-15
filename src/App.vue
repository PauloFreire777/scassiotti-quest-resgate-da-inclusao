<script setup>
import { ref, onMounted } from 'vue';
import { useBattle } from './composables/useBattle';
import { useVisualEffects } from './composables/useVisualEffects';
import GameHeader from './components/hud/GameHeader.vue';
import BattleStage from './components/battle/BattleStage.vue';
import FeedbackBanner from './components/feedback/FeedbackBanner.vue';
import SyntaxArena from './components/syntax/SyntaxArena.vue';
import MainMenu from './components/hud/MainMenu.vue';
import LevelSelectModal from './components/hud/LevelSelectModal.vue';
import GameOverModal from './components/hud/GameOverModal.vue';
import TheoryModal from './components/hud/TheoryModal.vue';
import VictoryModal from './components/hud/VictoryModal.vue';

const battle = useBattle();
const { isShaking, activeFlash, floatingTexts, shockwaves } = useVisualEffects();

// Modais e Telas — o jogo agora abre na tela inicial (antes caía direto na batalha)
const isMenuOpen = ref(true);
const isMapOpen = ref(false);
const isTheoryOpen = ref(false);

const handleOpenMenu = () => {
  isMenuOpen.value = true;
};

const handleCloseMenu = () => {
  isMenuOpen.value = false;
};

const handleOpenMap = () => {
  isMapOpen.value = true;
};

const handleCloseMap = () => {
  isMapOpen.value = false;
};

const handleSelectLevel = (levelIndex) => {
  battle.startLevel(levelIndex);
  isMapOpen.value = false;
  isMenuOpen.value = false;
};

const handleOpenTheory = () => {
  isTheoryOpen.value = true;
};

const handleCloseTheory = () => {
  isTheoryOpen.value = false;
};

const handleResetProgress = () => {
  if (confirm('Deseja realmente resetar todo o progresso do jogo?')) {
    battle.storage.resetAllProgress();
    battle.startLevel(0);
    isMenuOpen.value = false;
  }
};

const handleRetryGameOver = () => {
  battle.retryCurrentLevel();
};

const handleNextLevel = () => {
  battle.advanceToNextLevel();
};

const handleRestartGame = () => {
  battle.startLevel(battle.currentLevelIndex.value);
};

onMounted(() => {
  // Retoma da fase mais avançada já desbloqueada (antes sempre recomeçava na Fase 1)
  const unlocked = battle.storage.saveState.value.unlockedLevelIds;
  const furthestId = unlocked?.length ? Math.max(...unlocked) : 1;
  const index = battle.allLevels.value.findIndex((l) => l.id === furthestId);
  battle.startLevel(index >= 0 ? index : 0);
});
</script>

<template>
  <!-- Casca do jogo: ocupa exatamente a tela (100dvh). Em telas muito baixas, rola em vez de cortar. -->
  <div class="h-dvh w-full overflow-y-auto overflow-x-hidden bg-slate-950 text-white">
    <div
      :class="{ 'animate-screen-shake': isShaking }"
      class="min-h-full w-full flex flex-col select-none"
    >
      <!-- Overlay de flash cromático (suave; desligado com prefers-reduced-motion) -->
      <div
        v-if="activeFlash"
        class="flash-overlay"
        :class="activeFlash === 'emerald' ? 'flash-emerald' : 'flash-crimson'"
        aria-hidden="true"
      ></div>

      <!-- Onda de choque de impacto -->
      <div
        v-for="sw in shockwaves"
        :key="sw.id"
        class="shockwave-element"
        :style="{ left: sw.x + 'px', top: sw.y + 'px' }"
        aria-hidden="true"
      ></div>

      <!-- Números flutuantes de dano -->
      <div
        v-for="ct in floatingTexts"
        :key="ct.id"
        class="combat-text"
        :class="ct.type"
        :style="{ left: ct.x + 'px', top: ct.y + 'px' }"
        aria-hidden="true"
      >
        {{ ct.text }}
      </div>

      <!-- 1. Barra superior: menu, fase, progresso das rodadas -->
      <GameHeader
        :level-title="battle.currentLevel.value?.title || 'Fase 1'"
        :round-number="battle.currentRoundIndex.value + 1"
        :total-rounds="battle.currentLevel.value?.rounds?.length || 2"
        @open-menu="handleOpenMenu"
        @open-map="handleOpenMap"
        @open-theory="handleOpenTheory"
        @restart-game="handleRestartGame"
      />

      <main class="flex-1 min-h-0 flex flex-col">
        <!-- 2. Cena: sinal em Libras + professora vs. barreira (o feedback aparece como balão dentro da cena) -->
        <BattleStage
          v-if="battle.currentRound.value && battle.currentEnemy.value"
          class="flex-1"
          :video-url="battle.currentRound.value.media.videoUrl"
          :libras-gloss="battle.currentRound.value.media.librasGloss"
          :context-sentence="battle.currentRound.value.media.contextSentence"
          :sign-steps="battle.currentRound.value.media.signSteps"
          :round-key="`${battle.currentLevel.value?.id}-${battle.currentRound.value?.roundId}`"
          :auto-open-video="!isMenuOpen && !isMapOpen && !isTheoryOpen && !battle.isVictory.value && !battle.isGameOver.value"
          :enemy="battle.currentEnemy.value"
          :player-hp="battle.playerHp.value"
          :max-player-hp="battle.maxPlayerHp.value"
          :enemy-hp="battle.enemyHp.value"
          :max-enemy-hp="battle.maxEnemyHp.value"
          :is-attacking="battle.isAttacking.value"
        >
          <FeedbackBanner :feedback="battle.feedbackMessage.value" />
        </BattleStage>

        <!-- 3. Console de montagem: encaixes SVO + cartas + ações -->
        <SyntaxArena
          v-if="battle.currentRound.value"
          :slots="battle.playerSlots.value"
          :word-bank="battle.wordBank.value"
          :invalid-slot-indices="battle.invalidSlotIndices.value"
          :hinted-token-id="battle.activeHint.value?.recommendedFirstTokenId"
          :is-attacking="battle.isAttacking.value"
          @select-token="battle.selectToken"
          @remove-token="battle.removeTokenFromSlot"
          @drop-token="({ index, token }) => battle.placeTokenInSlot(index, token)"
          @attack="battle.checkSyntaxAttack"
          @hint="battle.requestHint"
          @reset="battle.resetSlots"
        />
      </main>
    </div>

    <!-- Menu principal / tela inicial -->
    <MainMenu
      :is-open="isMenuOpen"
      :storage="battle.storage"
      :current-level-title="battle.currentLevel.value?.title || 'Fase 1'"
      @start-play="handleCloseMenu"
      @open-map="() => { isMenuOpen = false; isMapOpen = true; }"
      @open-theory="() => { isMenuOpen = false; isTheoryOpen = true; }"
      @reset-progress="handleResetProgress"
      @close="handleCloseMenu"
    />

    <!-- Mapa de seleção de fases com estrelas -->
    <LevelSelectModal
      :is-open="isMapOpen"
      :levels="battle.allLevels.value"
      :unlocked-level-ids="battle.storage.saveState.value.unlockedLevelIds"
      :completed-levels="battle.storage.saveState.value.completedLevels"
      :current-level-id="battle.currentLevel.value?.id || 1"
      @select-level="handleSelectLevel"
      @unlock-all="() => battle.storage.unlockAllLevels(battle.allLevels.value.length)"
      @close="handleCloseMap"
    />

    <!-- Modal de Game Over pedagógico (energia esgotada) -->
    <GameOverModal
      :is-open="battle.isGameOver.value"
      :level-title="battle.currentLevel.value?.title || 'Fase 1'"
      @retry="handleRetryGameOver"
      @level-select="() => { battle.isGameOver.value = false; isMapOpen = true; }"
    />

    <!-- Modal de fundamentação teórica (Seminários III) -->
    <TheoryModal
      :is-open="isTheoryOpen"
      @close="handleCloseTheory"
    />

    <!-- Modal de vitória com próxima fase -->
    <VictoryModal
      :is-open="battle.isVictory.value"
      :level-title="battle.currentLevel.value?.title || 'Fase 1'"
      :enemy-name="battle.currentEnemy.value?.name || 'Barreira da Insegurança'"
      :has-next-level="battle.currentLevelIndex.value < battle.allLevels.value.length - 1"
      @next-level="handleNextLevel"
      @restart="handleRestartGame"
    />
  </div>
</template>
