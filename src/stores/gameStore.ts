
import { create } from 'zustand';
import { Character, characters } from '../data/characters';
import { StoryLine, Scene } from '../data/stories';
import { campusPlayers } from '../data/campusPlayers';
import { PlayerGrowthState, TrainingResult, MatchRecord, ActiveSquad, addBoosts } from '../data/playerTypes';
import { QUESTS, Quest, QuestProgress, QuestCondition, getInitialQuestProgress, evaluateCondition, getQuestById } from '../data/quests';

export interface SaveSlot {
  slotIndex: number;
  characterId: string;
  characterName: string;
  sceneId: string;
  dialogIndex: number;
  timestamp: number;
  choices: Record<string, string>;
  endingScore: number;
  dialogHistory: Array<{ speaker: string; text: string }>;
}

export interface GameSettings {
  textSpeed: number;       // 打字速度 (ms/字), default 50
  autoDelay: number;       // 自动模式等待时间 (ms), default 1500
  bgmVolume: number;       // BGM音量 0-100
  sfxVolume: number;       // SFX音量 0-100
  muted: boolean;
}

interface GameState {
  currentCharacter: Character | null;
  currentSceneId: string;
  currentStoryLine: StoryLine | null;
  choices: Record<string, string>;
  completedEndings: string[];
  unlockedCharacters: string[];
  currentDialogIndex: number;
  isTyping: boolean;
  displayedText: string;
  // 多结局相关
  endingScore: number;
  endingType: 'good' | 'normal' | 'bad';
  // 存档系统
  saveSlots: (SaveSlot | null)[];
  // 对话历史
  dialogHistory: Array<{ speaker: string; text: string; emotion?: string }>;
  // 自动/快进
  autoMode: boolean;
  skipMode: boolean;
  // 收集系统
  unlockedCGs: string[];
  unlockedAchievements: string[];
  // 校园球员卡收集
  unlockedCampusPlayerIds: string[];
  favoritePlayerIds: string[];
  // 成长与阵容
  playerGrowthStates: Record<string, PlayerGrowthState>;
  activeSquad: ActiveSquad | null;
  matchHistory: MatchRecord[];
  gameWeek: number;
  // 答题系统
  extraTrainingChances: number;
  lastQuizWeek: number;
  // 设置
  settings: GameSettings;
  // 任务系统
  questProgress: Record<string, QuestProgress>;

  selectCharacter: (character: Character) => void;
  setScene: (sceneId: string) => void;
  makeChoice: (choiceId: string, choice: string) => void;
  addEndingScore: (score: number) => void;
  setEndingType: (type: 'good' | 'normal' | 'bad') => void;
  completeEnding: (endingId: string) => void;
  unlockCharacter: (characterId: string) => void;
  resetGame: () => void;
  loadGame: (savedState: Partial<GameState>) => void;
  setCurrentDialogIndex: (index: number) => void;
  setIsTyping: (typing: boolean) => void;
  setDisplayedText: (text: string) => void;
  saveGame: () => void;
  getCurrentScene: () => Scene | undefined;
  // 存档槽位操作
  saveToSlot: (slotIndex: number) => void;
  loadFromSlot: (slotIndex: number) => void;
  deleteSlot: (slotIndex: number) => void;
  // 对话历史
  addDialogHistory: (dialog: { speaker: string; text: string; emotion?: string }) => void;
  clearDialogHistory: () => void;
  // 自动/快进
  setAutoMode: (auto: boolean) => void;
  setSkipMode: (skip: boolean) => void;
  // 收集系统
  unlockCG: (cgId: string) => void;
  unlockAchievement: (achievementId: string) => void;
  // 校园球员卡收集
  unlockCampusPlayer: (playerId: string) => void;
  toggleFavoritePlayer: (playerId: string) => void;
  // 成长与阵容
  getPlayerGrowthState: (playerId: string) => PlayerGrowthState;
  updatePlayerGrowthState: (playerId: string, updates: Partial<PlayerGrowthState>) => void;
  applyTrainingResult: (result: TrainingResult) => void;
  setActiveSquad: (squad: ActiveSquad) => void;
  addMatchRecord: (record: MatchRecord) => void;
  incrementGameWeek: (weeks: number) => void;
  // 设置
  updateSettings: (settings: Partial<GameSettings>) => void;
  // 任务系统
  trackQuestEvent: (event: { type: QuestCondition['type']; amount?: number }) => void;
  claimQuestReward: (questId: string) => void;
  getActiveQuests: () => Quest[];
  // 答题系统
  addExtraTrainingChance: () => void;
  consumeExtraTrainingChance: () => void;
  setLastQuizWeek: (week: number) => void;
  canQuizThisWeek: () => boolean;
}

const STORAGE_KEY = 'news_football_game_save';

const DEFAULT_UNLOCKED_CHARACTERS = characters.map((c) => c.id);

const DEFAULT_UNLOCKED_CAMPUS_PLAYERS = campusPlayers.map((p) => p.id);

const DEFAULT_GROWTH_STATE = (playerId: string): PlayerGrowthState => ({
  playerId,
  trainingLevel: 0,
  growthPoints: 0,
  matchesPlayed: 0,
  goalsScored: 0,
  statBoosts: { speed: 0, shooting: 0, passing: 0, dribbling: 0, defense: 0, physical: 0 },
  lastTrainingWeek: -1,
  totalTrainingWeeks: 0
});

const DEFAULT_SETTINGS: GameSettings = {
  textSpeed: 50,
  autoDelay: 1500,
  bgmVolume: 70,
  sfxVolume: 80,
  muted: false,
};

const initializeQuestProgress = (
  existing: Record<string, QuestProgress> | undefined,
  matchHistory: MatchRecord[],
  unlockedPlayerIds: string[],
  gameWeek: number,
  playerGrowthStates: Record<string, PlayerGrowthState>
): Record<string, QuestProgress> => {
  const progress: Record<string, QuestProgress> = {};

  const trainCount = Object.values(playerGrowthStates).reduce((sum, s) => sum + (s.trainingLevel || 0), 0);
  const matchCount = matchHistory.length;
  const winCount = matchHistory.filter((r) => r.result === 'win').length;
  const goalCount = matchHistory.reduce((sum, r) => sum + (r.goalScorerIds?.length || 0), 0);

  QUESTS.forEach((quest) => {
    const saved = existing?.[quest.id];
    if (saved) {
      progress[quest.id] = saved;
      return;
    }
    let current = 0;
    switch (quest.condition.type) {
      case 'match_count':
        current = matchCount;
        break;
      case 'win_count':
        current = winCount;
        break;
      case 'score_goals':
        current = goalCount;
        break;
      case 'train_count':
        current = trainCount;
        break;
      case 'unlock_players':
        current = unlockedPlayerIds.length;
        break;
      case 'reach_week':
        current = gameWeek;
        break;
    }
    progress[quest.id] = {
      questId: quest.id,
      current,
      completed: evaluateCondition(quest.condition, current),
      claimed: false,
    };
  });
  return progress;
};

const loadFromStorage = (): Partial<GameState> => {
  try {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      const parsed = JSON.parse(saved);
      return {
        completedEndings: parsed.completedEndings || [],
        unlockedCharacters: [...new Set([...(parsed.unlockedCharacters || []), ...DEFAULT_UNLOCKED_CHARACTERS])],
        saveSlots: parsed.saveSlots || [null, null, null],
        choices: parsed.choices || {},
        unlockedCGs: parsed.unlockedCGs || [],
        unlockedAchievements: parsed.unlockedAchievements || [],
        unlockedCampusPlayerIds: parsed.unlockedCampusPlayerIds || DEFAULT_UNLOCKED_CAMPUS_PLAYERS,
        favoritePlayerIds: parsed.favoritePlayerIds || [],
        playerGrowthStates: parsed.playerGrowthStates || {},
        activeSquad: parsed.activeSquad || null,
        matchHistory: parsed.matchHistory || [],
        gameWeek: parsed.gameWeek || 1,
        extraTrainingChances: parsed.extraTrainingChances || 0,
        lastQuizWeek: parsed.lastQuizWeek || 0,
        settings: parsed.settings || DEFAULT_SETTINGS,
        questProgress: parsed.questProgress || {},
      };
    }
  } catch (e) {
    console.error('Failed to load game:', e);
  }
  return {
    unlockedCharacters: DEFAULT_UNLOCKED_CHARACTERS,
    saveSlots: [null, null, null],
    unlockedCampusPlayerIds: DEFAULT_UNLOCKED_CAMPUS_PLAYERS,
    favoritePlayerIds: [],
    playerGrowthStates: {},
    activeSquad: null,
    matchHistory: [],
    gameWeek: 1,
    extraTrainingChances: 0,
    lastQuizWeek: 0,
    settings: DEFAULT_SETTINGS,
    questProgress: {},
  };
};

export const useGameStore = create<GameState>((set, get) => {
  const saved = loadFromStorage();
  const matchHistory = saved.matchHistory || [];
  const unlockedCampusPlayerIds = saved.unlockedCampusPlayerIds || DEFAULT_UNLOCKED_CAMPUS_PLAYERS;
  const gameWeek = saved.gameWeek || 1;
  const playerGrowthStates = saved.playerGrowthStates || {};
  const questProgress = initializeQuestProgress(
    saved.questProgress,
    matchHistory,
    unlockedCampusPlayerIds,
    gameWeek,
    playerGrowthStates
  );
  return {
    currentCharacter: null,
    currentSceneId: '',
    currentStoryLine: null,
    choices: saved.choices || {},
    completedEndings: saved.completedEndings || [],
    unlockedCharacters: saved.unlockedCharacters || DEFAULT_UNLOCKED_CHARACTERS,
    currentDialogIndex: 0,
    isTyping: false,
    displayedText: '',
    endingScore: 0,
    endingType: 'normal',
    saveSlots: saved.saveSlots || [null, null, null],
    dialogHistory: [],
    autoMode: false,
    skipMode: false,
    unlockedCGs: saved.unlockedCGs || [],
    unlockedAchievements: saved.unlockedAchievements || [],
    unlockedCampusPlayerIds,
    favoritePlayerIds: saved.favoritePlayerIds || [],
    playerGrowthStates,
    activeSquad: saved.activeSquad || null,
    matchHistory,
    gameWeek,
    extraTrainingChances: saved.extraTrainingChances || 0,
    lastQuizWeek: saved.lastQuizWeek || 0,
    settings: saved.settings || DEFAULT_SETTINGS,
    questProgress,

    selectCharacter: (character: Character) => {
      set({
        currentCharacter: character,
        currentSceneId: '',
        currentDialogIndex: 0,
        displayedText: '',
        endingScore: 0,
        endingType: 'normal',
        dialogHistory: [],
        autoMode: false,
        skipMode: false,
      });
    },

    setScene: (sceneId: string) => {
      set({ currentSceneId: sceneId, currentDialogIndex: 0, displayedText: '' });
    },

    makeChoice: (choiceId: string, choice: string) => {
      set((state) => ({
        choices: { ...state.choices, [choiceId]: choice }
      }));
    },

    addEndingScore: (score: number) => {
      set((state) => ({
        endingScore: state.endingScore + score
      }));
    },

    setEndingType: (endingType: 'good' | 'normal' | 'bad') => {
      set({ endingType });
    },

    completeEnding: (endingId: string) => {
      set((state) => ({
        completedEndings: [...new Set([...state.completedEndings, endingId])]
      }));
    },

    unlockCharacter: (characterId: string) => {
      set((state) => ({
        unlockedCharacters: [...new Set([...state.unlockedCharacters, characterId])]
      }));
    },

    resetGame: () => {
      set({
        currentCharacter: null,
        currentSceneId: '',
        currentStoryLine: null,
        choices: {},
        currentDialogIndex: 0,
        displayedText: '',
        isTyping: false,
        endingScore: 0,
        endingType: 'normal',
        dialogHistory: [],
        autoMode: false,
        skipMode: false,
      });
    },

    loadGame: (savedState: Partial<GameState>) => {
      set(savedState);
    },

    setCurrentDialogIndex: (index: number) => {
      set({ currentDialogIndex: index });
    },

    setIsTyping: (typing: boolean) => {
      set({ isTyping: typing });
    },

    setDisplayedText: (text: string) => {
      set({ displayedText: text });
    },

    saveGame: () => {
      const state = get();
      const saveData = {
        completedEndings: state.completedEndings,
        unlockedCharacters: state.unlockedCharacters,
        choices: state.choices,
        saveSlots: state.saveSlots,
        unlockedCGs: state.unlockedCGs,
        unlockedAchievements: state.unlockedAchievements,
        unlockedCampusPlayerIds: state.unlockedCampusPlayerIds,
        favoritePlayerIds: state.favoritePlayerIds,
        playerGrowthStates: state.playerGrowthStates,
        activeSquad: state.activeSquad,
        matchHistory: state.matchHistory,
        gameWeek: state.gameWeek,
        extraTrainingChances: state.extraTrainingChances,
        lastQuizWeek: state.lastQuizWeek,
        settings: state.settings,
        questProgress: state.questProgress,
      };
      localStorage.setItem(STORAGE_KEY, JSON.stringify(saveData));
    },

    getCurrentScene: (): Scene | undefined => {
      const { currentStoryLine, currentSceneId } = get();
      if (!currentStoryLine) return undefined;
      return currentStoryLine.scenes.find(s => s.id === currentSceneId);
    },

    // 存档槽位操作
    saveToSlot: (slotIndex: number) => {
      const state = get();
      if (!state.currentCharacter || !state.currentSceneId) return;
      const slot: SaveSlot = {
        slotIndex,
        characterId: state.currentCharacter.id,
        characterName: state.currentCharacter.name,
        sceneId: state.currentSceneId,
        dialogIndex: state.currentDialogIndex,
        timestamp: Date.now(),
        choices: { ...state.choices },
        endingScore: state.endingScore,
        dialogHistory: [...state.dialogHistory],
      };
      set((s) => {
        const newSlots = [...s.saveSlots];
        newSlots[slotIndex] = slot;
        return { saveSlots: newSlots };
      });
      // 立即持久化
      const newSlots = [...get().saveSlots];
      const saveData = {
        completedEndings: get().completedEndings,
        unlockedCharacters: get().unlockedCharacters,
        choices: get().choices,
        saveSlots: newSlots,
        unlockedCGs: get().unlockedCGs,
        unlockedAchievements: get().unlockedAchievements,
        unlockedCampusPlayerIds: get().unlockedCampusPlayerIds,
        favoritePlayerIds: get().favoritePlayerIds,
        playerGrowthStates: get().playerGrowthStates,
        activeSquad: get().activeSquad,
        matchHistory: get().matchHistory,
        gameWeek: get().gameWeek,
        settings: get().settings,
      };
      localStorage.setItem(STORAGE_KEY, JSON.stringify(saveData));
    },

    loadFromSlot: (slotIndex: number) => {
      const slot = get().saveSlots[slotIndex];
      if (!slot) return;
      set({
        currentSceneId: slot.sceneId,
        currentDialogIndex: slot.dialogIndex,
        choices: slot.choices,
        endingScore: slot.endingScore,
        dialogHistory: slot.dialogHistory,
      });
    },

    deleteSlot: (slotIndex: number) => {
      set((s) => {
        const newSlots = [...s.saveSlots];
        newSlots[slotIndex] = null;
        return { saveSlots: newSlots };
      });
      // 立即持久化
      const state = get();
      const saveData = {
        completedEndings: state.completedEndings,
        unlockedCharacters: state.unlockedCharacters,
        choices: state.choices,
        saveSlots: state.saveSlots,
        unlockedCGs: state.unlockedCGs,
        unlockedAchievements: state.unlockedAchievements,
        unlockedCampusPlayerIds: state.unlockedCampusPlayerIds,
        favoritePlayerIds: state.favoritePlayerIds,
        playerGrowthStates: state.playerGrowthStates,
        activeSquad: state.activeSquad,
        matchHistory: state.matchHistory,
        gameWeek: state.gameWeek,
        settings: state.settings,
        questProgress: state.questProgress,
      };
      localStorage.setItem(STORAGE_KEY, JSON.stringify(saveData));
    },

    // 对话历史
    addDialogHistory: (dialog) => {
      set((state) => ({
        dialogHistory: [...state.dialogHistory, dialog]
      }));
    },

    clearDialogHistory: () => {
      set({ dialogHistory: [] });
    },

    // 自动/快进
    setAutoMode: (auto: boolean) => {
      set({ autoMode: auto, skipMode: auto ? false : get().skipMode });
    },

    setSkipMode: (skip: boolean) => {
      set({ skipMode: skip, autoMode: skip ? false : get().autoMode });
    },

    // 收集系统
    unlockCG: (cgId: string) => {
      set((state) => {
        const alreadyUnlocked = state.unlockedCGs.includes(cgId);
        if (alreadyUnlocked) return state;
        return { unlockedCGs: [...state.unlockedCGs, cgId] };
      });
    },

    unlockAchievement: (achievementId: string) => {
      set((state) => {
        const alreadyUnlocked = state.unlockedAchievements.includes(achievementId);
        if (alreadyUnlocked) return state;
        return { unlockedAchievements: [...state.unlockedAchievements, achievementId] };
      });
    },

    // 校园球员卡收集
    unlockCampusPlayer: (playerId: string) => {
      set((state) => {
        if (state.unlockedCampusPlayerIds.includes(playerId)) return state;
        return {
          unlockedCampusPlayerIds: [...state.unlockedCampusPlayerIds, playerId]
        };
      });
      get().trackQuestEvent({ type: 'unlock_players', amount: 1 });
      get().saveGame();
    },

    toggleFavoritePlayer: (playerId: string) => {
      set((state) => {
        if (state.favoritePlayerIds.includes(playerId)) {
          return {
            favoritePlayerIds: state.favoritePlayerIds.filter((id) => id !== playerId)
          };
        }
        return {
          favoritePlayerIds: [...state.favoritePlayerIds, playerId]
        };
      });
    },

    // 成长与阵容
    getPlayerGrowthState: (playerId: string) => {
      const state = get();
      return state.playerGrowthStates[playerId] || DEFAULT_GROWTH_STATE(playerId);
    },

    updatePlayerGrowthState: (playerId: string, updates: Partial<PlayerGrowthState>) => {
      set((state) => ({
        playerGrowthStates: {
          ...state.playerGrowthStates,
          [playerId]: {
            ...DEFAULT_GROWTH_STATE(playerId),
            ...state.playerGrowthStates[playerId],
            ...updates,
            playerId
          }
        }
      }));
    },

    applyTrainingResult: (result: TrainingResult) => {
      set((state) => {
        const current = state.playerGrowthStates[result.playerId] || DEFAULT_GROWTH_STATE(result.playerId);
        const newStatBoosts = addBoosts(current.statBoosts, result.totalStatChanges);
        return {
          playerGrowthStates: {
            ...state.playerGrowthStates,
            [result.playerId]: {
              ...current,
              playerId: result.playerId,
              trainingLevel: current.trainingLevel + 1,
              growthPoints: current.growthPoints + result.totalGrowthPoints,
              statBoosts: newStatBoosts,
              lastTrainingWeek: state.gameWeek,
              totalTrainingWeeks: current.totalTrainingWeeks + result.plan.weeks
            }
          }
        };
      });
      get().incrementGameWeek(result.plan.weeks);
      get().trackQuestEvent({ type: 'train_count', amount: 1 });
      get().saveGame();
    },

    setActiveSquad: (squad: ActiveSquad) => {
      set({ activeSquad: squad });
      get().saveGame();
    },

    addMatchRecord: (record: MatchRecord) => {
      set((state) => ({
        matchHistory: [record, ...state.matchHistory]
      }));
      get().trackQuestEvent({ type: 'match_count', amount: 1 });
      if (record.result === 'win') {
        get().trackQuestEvent({ type: 'win_count', amount: 1 });
      }
      if (record.goalScorerIds.length > 0) {
        get().trackQuestEvent({ type: 'score_goals', amount: record.goalScorerIds.length });
      }
      get().saveGame();
    },

    incrementGameWeek: (weeks: number) => {
      set((state) => ({ gameWeek: state.gameWeek + weeks }));
      get().trackQuestEvent({ type: 'reach_week', amount: weeks });
    },

    // 答题系统
    addExtraTrainingChance: () => {
      set((state) => ({ extraTrainingChances: state.extraTrainingChances + 1 }));
      get().saveGame();
    },

    consumeExtraTrainingChance: () => {
      set((state) => ({
        extraTrainingChances: Math.max(0, state.extraTrainingChances - 1)
      }));
      get().saveGame();
    },

    setLastQuizWeek: (week: number) => {
      set({ lastQuizWeek: week });
      get().saveGame();
    },

    canQuizThisWeek: () => {
      const { gameWeek, lastQuizWeek } = get();
      return gameWeek > lastQuizWeek;
    },

    // 设置
    updateSettings: (newSettings: Partial<GameSettings>) => {
      set((state) => ({
        settings: { ...state.settings, ...newSettings }
      }));
    },

    // 任务系统
    trackQuestEvent: (event: { type: QuestCondition['type']; amount?: number }) => {
      set((state) => {
        const progress: Record<string, QuestProgress> = { ...state.questProgress };
        let changed = false;
        QUESTS.forEach((quest) => {
          if (quest.condition.type !== event.type) return;
          const saved = progress[quest.id] || getInitialQuestProgress(quest.id);
          if (saved.claimed) return;
          const prerequisite = quest.prerequisiteQuestId
            ? progress[quest.prerequisiteQuestId]
            : undefined;
          if (quest.prerequisiteQuestId && (!prerequisite || !prerequisite.completed)) return;
          const current = saved.current + (event.amount ?? 1);
          const completed = evaluateCondition(quest.condition, current);
          progress[quest.id] = { ...saved, current, completed };
          changed = true;
        });
        return changed ? { questProgress: progress } : state;
      });
      get().saveGame();
    },

    claimQuestReward: (questId: string) => {
      const quest = getQuestById(questId);
      if (!quest) return;
      const progress = get().questProgress[questId];
      if (!progress || !progress.completed || progress.claimed) return;

      set((state) => {
        const playerGrowthStates = { ...state.playerGrowthStates };
        const unlockedCampusPlayerIds = [...state.unlockedCampusPlayerIds];

        quest.rewards.forEach((reward) => {
          if (reward.type === 'growth_points' && reward.growthPoints) {
            const targetIds = reward.playerId
              ? [reward.playerId]
              : (state.activeSquad?.playerIds.length
                  ? state.activeSquad.playerIds
                  : Object.keys(state.playerGrowthStates));
            if (targetIds.length === 0) return;
            const perPlayer = Math.floor(reward.growthPoints / targetIds.length);
            targetIds.forEach((pid) => {
              const current = playerGrowthStates[pid] || DEFAULT_GROWTH_STATE(pid);
              playerGrowthStates[pid] = {
                ...current,
                playerId: pid,
                growthPoints: current.growthPoints + perPlayer
              };
            });
          } else if (reward.type === 'unlock_player' && reward.playerId) {
            if (!unlockedCampusPlayerIds.includes(reward.playerId)) {
              unlockedCampusPlayerIds.push(reward.playerId);
            }
          }
        });

        return {
          playerGrowthStates,
          unlockedCampusPlayerIds,
          questProgress: {
            ...state.questProgress,
            [questId]: { ...progress, claimed: true }
          }
        };
      });
      get().saveGame();
    },

    getActiveQuests: () => {
      const state = get();
      return QUESTS.filter((quest) => {
        const progress = state.questProgress[quest.id] || getInitialQuestProgress(quest.id);
        if (progress.claimed) return false;
        if (quest.prerequisiteQuestId) {
          const pre = state.questProgress[quest.prerequisiteQuestId];
          return !!pre?.completed;
        }
        return true;
      });
    },
  };
});
