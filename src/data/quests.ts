import { PlayerStatBoosts } from './playerTypes';

export type QuestType = 'main' | 'training' | 'match' | 'collection';

export type QuestCondition =
  | { type: 'match_count'; target: number }
  | { type: 'win_count'; target: number }
  | { type: 'score_goals'; target: number }
  | { type: 'train_count'; target: number }
  | { type: 'unlock_players'; target: number }
  | { type: 'reach_week'; target: number };

export interface QuestReward {
  type: 'growth_points' | 'unlock_player' | 'stat_boost';
  playerId?: string;
  growthPoints?: number;
  statBoosts?: Partial<PlayerStatBoosts>;
}

export interface Quest {
  id: string;
  type: QuestType;
  title: string;
  description: string;
  condition: QuestCondition;
  rewards: QuestReward[];
  prerequisiteQuestId?: string;
  order: number;
}

export interface QuestProgress {
  questId: string;
  current: number;
  completed: boolean;
  claimed: boolean;
}

export const QUESTS: Quest[] = [
  {
    id: 'first_match',
    type: 'main',
    title: '初出茅庐',
    description: '完成首场与 AI 传奇队的棋盘对战。',
    condition: { type: 'match_count', target: 1 },
    rewards: [{ type: 'growth_points', growthPoints: 100 }],
    order: 1
  },
  {
    id: 'first_victory',
    type: 'main',
    title: '首胜纪念',
    description: '在棋盘对战中首次击败 AI 传奇队。',
    condition: { type: 'win_count', target: 1 },
    rewards: [{ type: 'growth_points', growthPoints: 200 }],
    prerequisiteQuestId: 'first_match',
    order: 2
  },
  {
    id: 'first_training',
    type: 'training',
    title: '磨刀不误砍柴工',
    description: '完成首次 4 周训练计划。',
    condition: { type: 'train_count', target: 1 },
    rewards: [{ type: 'growth_points', growthPoints: 100 }],
    order: 3
  },
  {
    id: 'collect_3_players',
    type: 'collection',
    title: '聚沙成塔',
    description: '累计解锁 3 张校园球员卡。',
    condition: { type: 'unlock_players', target: 3 },
    rewards: [{ type: 'growth_points', growthPoints: 150 }],
    order: 4
  },
  {
    id: 'score_5_goals',
    type: 'match',
    title: '锋线杀手',
    description: '累计在棋盘对战中攻入 5 球。',
    condition: { type: 'score_goals', target: 5 },
    rewards: [{ type: 'growth_points', growthPoints: 200 }],
    order: 5
  },
  {
    id: 'veteran_manager',
    type: 'main',
    title: '资深经理',
    description: '带队打到第 10 周，见证球队成长。',
    condition: { type: 'reach_week', target: 10 },
    rewards: [{ type: 'growth_points', growthPoints: 300 }],
    order: 6
  }
];

export function getQuestById(id: string): Quest | undefined {
  return QUESTS.find((q) => q.id === id);
}

export function getInitialQuestProgress(questId: string): QuestProgress {
  return {
    questId,
    current: 0,
    completed: false,
    claimed: false
  };
}

export function evaluateCondition(condition: QuestCondition, current: number): boolean {
  return current >= condition.target;
}

export function getConditionLabel(condition: QuestCondition): string {
  switch (condition.type) {
    case 'match_count':
      return `完成 ${condition.target} 场比赛`;
    case 'win_count':
      return `获胜 ${condition.target} 场`;
    case 'score_goals':
      return `累计进球 ${condition.target} 个`;
    case 'train_count':
      return `完成 ${condition.target} 次训练`;
    case 'unlock_players':
      return `解锁 ${condition.target} 张球员卡`;
    case 'reach_week':
      return `达到第 ${condition.target} 周`;
    default:
      return '未知条件';
  }
}
