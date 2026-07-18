export type PlayerPosition = 'GK' | 'DEF' | 'MID' | 'FWD';
export type Rarity = 'N' | 'R' | 'SR' | 'SSR';

export interface PlayerStats {
  speed: number;
  shooting: number;
  passing: number;
  dribbling: number;
  defense: number;
  physical: number;
}

export interface PlayerStamina {
  maxStamina: number;
  currentStamina: number;
  staminaRegen: number;
}

export type SkillEffectType =
  | 'shoot_power'
  | 'shoot_range'
  | 'pass_power'
  | 'pass_range'
  | 'tackle_power'
  | 'dribble_protect'
  | 'speed_boost'
  | 'defense_boost'
  | 'goalkeeper_save'
  | 'free_kick_master'
  | 'long_pass_master'
  | 'counter_attack'
  | 'shooting_boost'
  | 'passing_boost'
  | 'defensive_boost'
  | 'dribbling_boost';

export interface PlayerSkill {
  id: string;
  name: string;
  description: string;
  effectType: SkillEffectType;
  effectValue: number;
  cooldown: number;
  currentCooldown: number;
  staminaCost: number;
  icon: string;
}

// 棋盘战术判定用到的完整六维属性
export type PlayerStatsSlice = PlayerStats;

export interface BasePlayer {
  id: string;
  name: string;
  position: PlayerPosition;
  positionCN: string;
  era: string;
  stats: PlayerStats;
  overall: number;
  style: string;
  description: string;
}

export interface CampusPlayer extends BasePlayer {
  grade: string;
  major: string;
  number?: string;
  rarity: Rarity;
  // 棋盘棋子类型：king门将, queen核心, rook后卫/边锋, bishop中场, knight边锋, pawn前锋
  chessPiece: 'king' | 'queen' | 'rook' | 'bishop' | 'knight' | 'pawn';
  highlights: string[];
  // 专属技能（参考王者绿茵争锋英雄技能设计）
  uniqueSkill?: PlayerSkill;
  // 体力属性
  stamina: PlayerStamina;
  // 成长系统字段
  trainingLevel: number;
  growthPoints: number;
  matchesPlayed: number;
  goalsScored: number;
  isUnlocked: boolean;
}

export interface StarPlayer extends BasePlayer {
  country: string;
}

export type PlayerStatBoosts = PlayerStats;

export interface PlayerGrowthState {
  playerId: string;
  trainingLevel: number;
  growthPoints: number;
  matchesPlayed: number;
  goalsScored: number;
  statBoosts: PlayerStatBoosts;
  lastTrainingWeek: number;
  totalTrainingWeeks: number;
}

export type TrainingFocus = keyof PlayerStats;
export type TrainingIntensity = 'light' | 'normal' | 'intense';

export interface TrainingPlan {
  focus: TrainingFocus;
  intensity: TrainingIntensity;
  weeks: number;
}

export interface TrainingWeekResult {
  week: number;
  eventTriggered: boolean;
  eventTitle: string;
  eventDescription: string;
  statChanges: Partial<PlayerStatBoosts>;
  growthPointsEarned: number;
  injuryOccurred: boolean;
}

export interface TrainingResult {
  playerId: string;
  plan: TrainingPlan;
  weekResults: TrainingWeekResult[];
  totalStatChanges: PlayerStatBoosts;
  totalGrowthPoints: number;
  beforeOverall: number;
  afterOverall: number;
}

export interface MatchRecord {
  id: string;
  timestamp: number;
  opponent: string;
  whiteScore: number;
  blackScore: number;
  result: 'win' | 'lose' | 'draw';
  activeSquadIds: string[];
  goalScorerIds: string[];
  turnCount: number;
  rewards: string[];
}

export interface ActiveSquad {
  playerIds: string[];
  formationName: string;
}

export function applyBoosts(stats: PlayerStats, boosts: Partial<PlayerStatBoosts>): PlayerStats {
  const result = { ...stats };
  (Object.keys(boosts) as (keyof PlayerStats)[]).forEach((key) => {
    const boost = boosts[key] ?? 0;
    result[key] = Math.min(99, Math.max(1, stats[key] + boost));
  });
  return result;
}

export function addBoosts(a: PlayerStatBoosts, b: Partial<PlayerStatBoosts>): PlayerStatBoosts {
  const result = { ...a };
  (Object.keys(b) as (keyof PlayerStats)[]).forEach((key) => {
    result[key] = (result[key] ?? 0) + (b[key] ?? 0);
  });
  return result;
}

export function clampBoosts(boosts: Partial<PlayerStatBoosts>, max = 20): PlayerStatBoosts {
  const result: PlayerStatBoosts = { speed: 0, shooting: 0, passing: 0, dribbling: 0, defense: 0, physical: 0 };
  (Object.keys(boosts) as (keyof PlayerStats)[]).forEach((key) => {
    result[key] = Math.max(-max, Math.min(max, boosts[key] ?? 0));
  });
  return result;
}

export function calculateOverall(stats: PlayerStats): number {
  const values = Object.values(stats);
  return Math.round(values.reduce((a, b) => a + b, 0) / values.length);
}
