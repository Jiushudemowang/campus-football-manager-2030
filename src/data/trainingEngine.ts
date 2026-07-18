import {
  CampusPlayer,
  PlayerGrowthState,
  TrainingFocus,
  TrainingIntensity,
  TrainingPlan,
  TrainingResult,
  TrainingWeekResult,
  PlayerStatBoosts,
  applyBoosts,
  addBoosts,
  clampBoosts,
  calculateOverall
} from './playerTypes';
import { TrainingEvent, getRelatedStat } from './trainingEvents';

const INTENSITY_CONFIG: Record<TrainingIntensity, { multiplier: number; riskMultiplier: number; label: string }> = {
  light: { multiplier: 0.7, riskMultiplier: 0.5, label: '轻松' },
  normal: { multiplier: 1.0, riskMultiplier: 1.0, label: '正常' },
  intense: { multiplier: 1.4, riskMultiplier: 2.0, label: '高强度' }
};

const SINGLE_STAT_CAP = 20;

function createEmptyBoosts(): PlayerStatBoosts {
  return { speed: 0, shooting: 0, passing: 0, dribbling: 0, defense: 0, physical: 0 };
}

export function simulateTraining(
  player: CampusPlayer,
  plan: TrainingPlan,
  growthState: PlayerGrowthState,
  events: TrainingEvent[]
): TrainingResult {
  const intensity = INTENSITY_CONFIG[plan.intensity];
  const weekResults: TrainingWeekResult[] = [];
  const totalChanges = createEmptyBoosts();
  let totalGrowthPoints = 0;

  for (let week = 1; week <= plan.weeks; week++) {
    // 基础成长 1-3 点，训练等级每 5 级额外 +1
    const baseGain = Math.floor(Math.random() * 2) + 1 + Math.floor(growthState.trainingLevel / 5);
    const actualGain = Math.round(baseGain * intensity.multiplier);

    // 单项上限控制
    const currentBoost = growthState.statBoosts[plan.focus] + (totalChanges[plan.focus] ?? 0);
    const effectiveGain = Math.max(0, Math.min(actualGain, SINGLE_STAT_CAP - currentBoost));

    // 奇遇事件
    const eventTriggered = Math.random() < 0.3;
    const event = eventTriggered ? events[Math.floor(Math.random() * events.length)] : null;
    const eventBoost = event
      ? Math.round(event.primaryBoost * intensity.multiplier)
      : 0;

    // 风险判定
    const injuryRisk = event ? event.riskChance * intensity.riskMultiplier : 0;
    const injuryOccurred = eventTriggered && Math.random() < injuryRisk;

    const weekStatChange: Partial<PlayerStatBoosts> = {};
    let growthPointsEarned = Math.floor((Math.random() * 20 + 10) * intensity.multiplier);

    if (injuryOccurred) {
      // 伤病：主属性收益减半，甚至可能为负
      const injuryPenalty = Math.max(1, Math.floor(effectiveGain * 0.5));
      weekStatChange[plan.focus] = Math.max(-3, effectiveGain - injuryPenalty);
      totalChanges[plan.focus] += weekStatChange[plan.focus] ?? 0;
      growthPointsEarned = Math.max(5, Math.floor(growthPointsEarned * 0.6));
    } else {
      const focusGain = effectiveGain + eventBoost;
      weekStatChange[plan.focus] = focusGain;
      totalChanges[plan.focus] += focusGain;
    }

    // 副属性附带成长
    const secondaryStat = getRelatedStat(plan.focus);
    const secondaryGain = Math.max(
      0,
      Math.floor(
        ((effectiveGain + (event?.secondaryBoost || 0)) * 0.3) * intensity.multiplier
      )
    );
    if (secondaryGain > 0 && !injuryOccurred) {
      weekStatChange[secondaryStat] = secondaryGain;
      totalChanges[secondaryStat] += secondaryGain;
    }

    totalGrowthPoints += growthPointsEarned;

    weekResults.push({
      week,
      eventTriggered,
      eventTitle: event?.title || '',
      eventDescription: injuryOccurred
        ? `${event?.title || '训练中'}：${event?.riskEffect || '出现疲劳，状态下滑'}`
        : event?.description || '按部就班的训练，稳中有进。',
      statChanges: weekStatChange,
      growthPointsEarned,
      injuryOccurred
    });
  }

  const beforeStats = applyBoosts(player.stats, growthState.statBoosts);
  const clampedChanges = clampBoosts(totalChanges, SINGLE_STAT_CAP);
  const afterBoosts = clampBoosts(
    addBoosts(growthState.statBoosts, clampedChanges),
    SINGLE_STAT_CAP
  );
  const afterStats = applyBoosts(player.stats, afterBoosts);

  return {
    playerId: player.id,
    plan,
    weekResults,
    totalStatChanges: clampedChanges,
    totalGrowthPoints,
    beforeOverall: calculateOverall(beforeStats),
    afterOverall: calculateOverall(afterStats)
  };
}

export function canTrainThisWeek(
  playerId: string,
  growthStates: Record<string, PlayerGrowthState>,
  gameWeek: number
): boolean {
  const state = growthStates[playerId];
  if (!state) return true;
  return state.lastTrainingWeek < gameWeek;
}

export { INTENSITY_CONFIG };
export type { TrainingFocus, TrainingIntensity, TrainingPlan };
