import { ref } from 'vue';

const STORAGE_KEY = 'scassiotti_quest_save_v2';

const defaultData = {
  unlockedLevelIds: [1],
  completedLevels: {}, // { [levelId]: { stars: 3, bestScore: 100, completedAt: '...' } }
  stats: {
    totalVictories: 0,
    totalCriticalHits: 0,
    totalSentencesBuilt: 0,
    timesDefeated: 0
  },
  settings: {
    defaultPlaybackRate: 1,
    highContrast: false,
    particlesEnabled: true
  }
};

export function useStorage() {
  const saveState = ref(loadData());

  function loadData() {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (!raw) return { ...defaultData };
      return { ...defaultData, ...JSON.parse(raw) };
    } catch (e) {
      console.warn('Erro ao carregar dados do localStorage:', e);
      return { ...defaultData };
    }
  }

  function persist() {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(saveState.value));
    } catch (e) {
      console.warn('Erro ao salvar no localStorage:', e);
    }
  }

  function unlockNextLevel(currentLevelId) {
    const nextId = currentLevelId + 1;
    if (!saveState.value.unlockedLevelIds.includes(nextId)) {
      saveState.value.unlockedLevelIds.push(nextId);
    }
    persist();
  }

  function recordVictory(levelId, stars = 3, score = 100) {
    const prev = saveState.value.completedLevels[levelId] || { stars: 0, bestScore: 0 };
    saveState.value.completedLevels[levelId] = {
      stars: Math.max(prev.stars, stars),
      bestScore: Math.max(prev.bestScore, score),
      completedAt: new Date().toISOString()
    };
    saveState.value.stats.totalVictories++;
    unlockNextLevel(levelId);
    persist();
  }

  function recordSentenceBuilt(isCritical = true) {
    saveState.value.stats.totalSentencesBuilt++;
    if (isCritical) saveState.value.stats.totalCriticalHits++;
    persist();
  }

  function recordDefeat() {
    saveState.value.stats.timesDefeated++;
    persist();
  }

  function updateSettings(newSettings) {
    saveState.value.settings = { ...saveState.value.settings, ...newSettings };
    persist();
  }

  function resetAllProgress() {
    saveState.value = {
      ...defaultData,
      unlockedLevelIds: [1],
      completedLevels: {}
    };
    persist();
  }

  function unlockAllLevels(totalCount = 6) {
    saveState.value.unlockedLevelIds = Array.from({ length: totalCount }, (_, i) => i + 1);
    persist();
  }

  return {
    saveState,
    recordVictory,
    recordSentenceBuilt,
    recordDefeat,
    updateSettings,
    resetAllProgress,
    unlockNextLevel,
    unlockAllLevels
  };
}
