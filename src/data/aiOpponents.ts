import { PlayerStats, PlayerPosition, PlayerSkill } from './playerTypes';

export type AIOpponentDifficulty = 'easy' | 'normal' | 'hard' | 'legendary';

export interface AIOpponentPlayer {
  id: string;
  name: string;
  position: PlayerPosition;
  positionCN: string;
  stats: PlayerStats;
  pieceType: 'king' | 'queen' | 'rook' | 'bishop' | 'knight' | 'pawn';
  role: 'GK' | 'CB' | 'ST' | 'LB' | 'RB' | 'CM' | 'LW' | 'RW';
  uniqueSkill?: PlayerSkill;
}

export interface AIOpponentTeam {
  id: string;
  name: string;
  description: string;
  difficulty: AIOpponentDifficulty;
  difficultyLabel: string;
  icon: string;
  players: AIOpponentPlayer[];
  rewardGrowthPoints: number;
  unlockCondition?: string;
}

export const aiOpponentTeams: AIOpponentTeam[] = [
  {
    id: 'team_rookie',
    name: '校队新秀队',
    description: '一支年轻的校园足球队，适合新手热身',
    difficulty: 'easy',
    difficultyLabel: '入门',
    icon: '⚽',
    rewardGrowthPoints: 25,
    players: [
      {
        id: 'rookie_gk',
        name: '李明',
        position: 'GK',
        positionCN: '门将',
        stats: { speed: 50, shooting: 25, passing: 50, dribbling: 40, defense: 75, physical: 70 },
        pieceType: 'king',
        role: 'GK'
      },
      {
        id: 'rookie_def',
        name: '王强',
        position: 'DEF',
        positionCN: '后卫',
        stats: { speed: 60, shooting: 40, passing: 55, dribbling: 50, defense: 70, physical: 75 },
        pieceType: 'rook',
        role: 'CB'
      },
      {
        id: 'rookie_fwd',
        name: '张伟',
        position: 'FWD',
        positionCN: '前锋',
        stats: { speed: 70, shooting: 65, passing: 50, dribbling: 60, defense: 35, physical: 65 },
        pieceType: 'queen',
        role: 'ST'
      }
    ]
  },
  {
    id: 'team_europe',
    name: '欧洲传奇队',
    description: '汇聚欧洲足坛顶级巨星的梦幻阵容',
    difficulty: 'normal',
    difficultyLabel: '普通',
    icon: '🌍',
    rewardGrowthPoints: 50,
    players: [
      {
        id: 'neuer',
        name: '诺伊尔',
        position: 'GK',
        positionCN: '门将',
        stats: { speed: 58, shooting: 35, passing: 75, dribbling: 50, defense: 92, physical: 82 },
        pieceType: 'king',
        role: 'GK',
        uniqueSkill: {
          id: 'neuer_save',
          name: '清道夫',
          description: '出击范围扩大，防守能力提升20%',
          effectType: 'goalkeeper_save',
          effectValue: 20,
          cooldown: 4,
          currentCooldown: 0,
          staminaCost: 25,
          icon: '🧤'
        }
      },
      {
        id: 'ramos',
        name: '拉莫斯',
        position: 'DEF',
        positionCN: '中卫',
        stats: { speed: 72, shooting: 75, passing: 75, dribbling: 68, defense: 92, physical: 90 },
        pieceType: 'rook',
        role: 'CB',
        uniqueSkill: {
          id: 'ramos_defense',
          name: '铁血防守',
          description: '防守能力提升25%',
          effectType: 'defense_boost',
          effectValue: 25,
          cooldown: 3,
          currentCooldown: 0,
          staminaCost: 18,
          icon: '🛡️'
        }
      },
      {
        id: 'messi',
        name: '梅西',
        position: 'FWD',
        positionCN: '前锋',
        stats: { speed: 86, shooting: 95, passing: 93, dribbling: 98, defense: 40, physical: 78 },
        pieceType: 'queen',
        role: 'ST',
        uniqueSkill: {
          id: 'messi_dribble',
          name: '盘带大师',
          description: '盘带时被抢断概率降低35%',
          effectType: 'dribble_protect',
          effectValue: 35,
          cooldown: 3,
          currentCooldown: 0,
          staminaCost: 15,
          icon: '⚽'
        }
      }
    ]
  },
  {
    id: 'team_south_america',
    name: '南美风暴队',
    description: '以技术和激情著称的南美球星组合',
    difficulty: 'normal',
    difficultyLabel: '普通',
    icon: '☀️',
    rewardGrowthPoints: 50,
    players: [
      {
        id: 'alisson',
        name: '阿利松',
        position: 'GK',
        positionCN: '门将',
        stats: { speed: 65, shooting: 35, passing: 70, dribbling: 55, defense: 90, physical: 84 },
        pieceType: 'king',
        role: 'GK',
        uniqueSkill: {
          id: 'alisson_save',
          name: '神级扑救',
          description: '扑救成功率提升25%',
          effectType: 'goalkeeper_save',
          effectValue: 25,
          cooldown: 4,
          currentCooldown: 0,
          staminaCost: 20,
          icon: '🧤'
        }
      },
      {
        id: 'cafu',
        name: '卡福',
        position: 'DEF',
        positionCN: '右后卫',
        stats: { speed: 88, shooting: 65, passing: 78, dribbling: 82, defense: 86, physical: 88 },
        pieceType: 'rook',
        role: 'RB',
        uniqueSkill: {
          id: 'cafu_attack',
          name: '助攻插上',
          description: '助攻时传球距离增加2格',
          effectType: 'pass_range',
          effectValue: 2,
          cooldown: 3,
          currentCooldown: 0,
          staminaCost: 15,
          icon: '🚀'
        }
      },
      {
        id: 'ronaldo9',
        name: '罗纳尔多',
        position: 'FWD',
        positionCN: '前锋',
        stats: { speed: 94, shooting: 93, passing: 78, dribbling: 96, defense: 38, physical: 86 },
        pieceType: 'queen',
        role: 'ST',
        uniqueSkill: {
          id: 'ronaldo_speed',
          name: '闪电突破',
          description: '激活后移动速度提升50%',
          effectType: 'speed_boost',
          effectValue: 50,
          cooldown: 4,
          currentCooldown: 0,
          staminaCost: 20,
          icon: '⚡'
        }
      }
    ]
  },
  {
    id: 'team_legend',
    name: '传奇巨星队',
    description: '足球历史上最伟大的球星组成的梦幻阵容',
    difficulty: 'hard',
    difficultyLabel: '困难',
    icon: '⭐',
    rewardGrowthPoints: 100,
    players: [
      {
        id: 'courtois',
        name: '库尔图瓦',
        position: 'GK',
        positionCN: '门将',
        stats: { speed: 62, shooting: 30, passing: 60, dribbling: 45, defense: 93, physical: 88 },
        pieceType: 'king',
        role: 'GK',
        uniqueSkill: {
          id: 'courtois_save',
          name: '门神降临',
          description: '扑救成功率提升30%',
          effectType: 'goalkeeper_save',
          effectValue: 30,
          cooldown: 4,
          currentCooldown: 0,
          staminaCost: 25,
          icon: '🧤'
        }
      },
      {
        id: 'vandijk',
        name: '范戴克',
        position: 'DEF',
        positionCN: '中卫',
        stats: { speed: 78, shooting: 60, passing: 78, dribbling: 70, defense: 95, physical: 92 },
        pieceType: 'rook',
        role: 'CB',
        uniqueSkill: {
          id: 'vandijk_wall',
          name: '铁壁防守',
          description: '防守能力提升30%',
          effectType: 'defense_boost',
          effectValue: 30,
          cooldown: 3,
          currentCooldown: 0,
          staminaCost: 20,
          icon: '🧱'
        }
      },
      {
        id: 'zidane',
        name: '齐达内',
        position: 'MID',
        positionCN: '前腰',
        stats: { speed: 76, shooting: 85, passing: 94, dribbling: 94, defense: 68, physical: 84 },
        pieceType: 'queen',
        role: 'ST',
        uniqueSkill: {
          id: 'zidane_master',
          name: '艺术大师',
          description: '传球成功率提升25%',
          effectType: 'pass_power',
          effectValue: 25,
          cooldown: 3,
          currentCooldown: 0,
          staminaCost: 15,
          icon: '🎨'
        }
      }
    ]
  },
  {
    id: 'team_french',
    name: '高卢雄鸡队',
    description: '法国国家队黄金一代的核心成员',
    difficulty: 'hard',
    difficultyLabel: '困难',
    icon: '🐓',
    rewardGrowthPoints: 100,
    players: [
      {
        id: 'lloris',
        name: '洛里',
        position: 'GK',
        positionCN: '门将',
        stats: { speed: 60, shooting: 30, passing: 65, dribbling: 50, defense: 88, physical: 80 },
        pieceType: 'king',
        role: 'GK',
        uniqueSkill: {
          id: 'lloris_save',
          name: '稳健扑救',
          description: '扑救成功率提升20%',
          effectType: 'goalkeeper_save',
          effectValue: 20,
          cooldown: 4,
          currentCooldown: 0,
          staminaCost: 20,
          icon: '🧤'
        }
      },
      {
        id: 'kante',
        name: '坎特',
        position: 'MID',
        positionCN: '后腰',
        stats: { speed: 82, shooting: 55, passing: 78, dribbling: 78, defense: 92, physical: 88 },
        pieceType: 'rook',
        role: 'CM',
        uniqueSkill: {
          id: 'kante_tackle',
          name: '拦截大师',
          description: '抢断成功率提升30%',
          effectType: 'tackle_power',
          effectValue: 30,
          cooldown: 3,
          currentCooldown: 0,
          staminaCost: 18,
          icon: '💥'
        }
      },
      {
        id: 'mbappe',
        name: '姆巴佩',
        position: 'FWD',
        positionCN: '前锋',
        stats: { speed: 98, shooting: 88, passing: 80, dribbling: 92, defense: 40, physical: 84 },
        pieceType: 'queen',
        role: 'ST',
        uniqueSkill: {
          id: 'mbappe_speed',
          name: '闪电冲刺',
          description: '激活后移动速度提升60%',
          effectType: 'speed_boost',
          effectValue: 60,
          cooldown: 4,
          currentCooldown: 0,
          staminaCost: 20,
          icon: '⚡'
        }
      }
    ]
  },
  {
    id: 'team_brazil',
    name: '桑巴军团队',
    description: '巴西足球艺术的代表人物',
    difficulty: 'legendary',
    difficultyLabel: '传奇',
    icon: '🇧🇷',
    rewardGrowthPoints: 150,
    players: [
      {
        id: 'dida',
        name: '迪达',
        position: 'GK',
        positionCN: '门将',
        stats: { speed: 65, shooting: 25, passing: 60, dribbling: 50, defense: 90, physical: 82 },
        pieceType: 'king',
        role: 'GK',
        uniqueSkill: {
          id: 'dida_save',
          name: '神级反应',
          description: '扑救成功率提升35%',
          effectType: 'goalkeeper_save',
          effectValue: 35,
          cooldown: 4,
          currentCooldown: 0,
          staminaCost: 25,
          icon: '🧤'
        }
      },
      {
        id: 'carlos',
        name: '卡洛斯',
        position: 'DEF',
        positionCN: '左后卫',
        stats: { speed: 92, shooting: 88, passing: 80, dribbling: 85, defense: 80, physical: 88 },
        pieceType: 'rook',
        role: 'LB',
        uniqueSkill: {
          id: 'carlos_shoot',
          name: '重炮轰门',
          description: '远射命中率提升30%',
          effectType: 'shoot_power',
          effectValue: 30,
          cooldown: 4,
          currentCooldown: 0,
          staminaCost: 25,
          icon: '💥'
        }
      },
      {
        id: 'pele',
        name: '贝利',
        position: 'FWD',
        positionCN: '前锋',
        stats: { speed: 88, shooting: 95, passing: 85, dribbling: 95, defense: 45, physical: 80 },
        pieceType: 'queen',
        role: 'ST',
        uniqueSkill: {
          id: 'pele_master',
          name: '球王降临',
          description: '射门命中率提升35%',
          effectType: 'shoot_power',
          effectValue: 35,
          cooldown: 3,
          currentCooldown: 0,
          staminaCost: 25,
          icon: '👑'
        }
      }
    ]
  },
  {
    id: 'team_germany',
    name: '日耳曼战车队',
    description: '德国足球严谨与实力的象征',
    difficulty: 'legendary',
    difficultyLabel: '传奇',
    icon: '⚙️',
    rewardGrowthPoints: 150,
    players: [
      {
        id: 'kahn',
        name: '卡恩',
        position: 'GK',
        positionCN: '门将',
        stats: { speed: 60, shooting: 25, passing: 55, dribbling: 45, defense: 95, physical: 85 },
        pieceType: 'king',
        role: 'GK',
        uniqueSkill: {
          id: 'kahn_wall',
          name: '狮王怒吼',
          description: '扑救成功率提升40%',
          effectType: 'goalkeeper_save',
          effectValue: 40,
          cooldown: 4,
          currentCooldown: 0,
          staminaCost: 30,
          icon: '🦁'
        }
      },
      {
        id: 'beckenbauer',
        name: '贝肯鲍尔',
        position: 'DEF',
        positionCN: '自由人',
        stats: { speed: 80, shooting: 78, passing: 92, dribbling: 85, defense: 94, physical: 86 },
        pieceType: 'rook',
        role: 'CB',
        uniqueSkill: {
          id: 'beckenbauer_lead',
          name: '足球皇帝',
          description: '提升全队防守能力15%',
          effectType: 'defense_boost',
          effectValue: 15,
          cooldown: 5,
          currentCooldown: 0,
          staminaCost: 25,
          icon: '👑'
        }
      },
      {
        id: 'klose',
        name: '克洛泽',
        position: 'FWD',
        positionCN: '前锋',
        stats: { speed: 78, shooting: 88, passing: 72, dribbling: 76, defense: 50, physical: 86 },
        pieceType: 'queen',
        role: 'ST',
        uniqueSkill: {
          id: 'klose_header',
          name: '空霸',
          description: '近距离射门命中率提升30%',
          effectType: 'shoot_power',
          effectValue: 30,
          cooldown: 3,
          currentCooldown: 0,
          staminaCost: 20,
          icon: '🎯'
        }
      }
    ]
  },
  {
    id: 'team_argentina',
    name: '潘帕斯雄鹰队',
    description: '阿根廷足球的传奇球星阵容',
    difficulty: 'hard',
    difficultyLabel: '困难',
    icon: '🇦🇷',
    rewardGrowthPoints: 100,
    players: [
      {
        id: 'martinez',
        name: '马丁内斯',
        position: 'GK',
        positionCN: '门将',
        stats: { speed: 68, shooting: 30, passing: 72, dribbling: 58, defense: 92, physical: 82 },
        pieceType: 'king',
        role: 'GK',
        uniqueSkill: {
          id: 'martinez_save',
          name: '神级扑救',
          description: '扑救成功率提升35%',
          effectType: 'goalkeeper_save',
          effectValue: 35,
          cooldown: 4,
          currentCooldown: 0,
          staminaCost: 25,
          icon: '🧤'
        }
      },
      {
        id: 'maradona',
        name: '马拉多纳',
        position: 'MID',
        positionCN: '中场',
        stats: { speed: 82, shooting: 90, passing: 92, dribbling: 96, defense: 55, physical: 78 },
        pieceType: 'rook',
        role: 'CM',
        uniqueSkill: {
          id: 'maradona_dribble',
          name: '上帝之手',
          description: '盘带时被抢断概率降低40%',
          effectType: 'dribble_protect',
          effectValue: 40,
          cooldown: 3,
          currentCooldown: 0,
          staminaCost: 20,
          icon: '👐'
        }
      },
      {
        id: 'messi_argo',
        name: '梅西',
        position: 'FWD',
        positionCN: '前锋',
        stats: { speed: 88, shooting: 96, passing: 95, dribbling: 99, defense: 42, physical: 80 },
        pieceType: 'queen',
        role: 'ST',
        uniqueSkill: {
        id: 'messi_argo_magic',
        name: '梅球王',
        description: '射门命中率提升40%',
        effectType: 'shoot_power',
        effectValue: 40,
        cooldown: 3,
        currentCooldown: 0,
        staminaCost: 25,
        icon: '👑'
      }
    }
  ]
  },
  {
    id: 'team_spain',
    name: '斗牛士军团',
    description: '西班牙传控足球的代表',
    difficulty: 'hard',
    difficultyLabel: '困难',
    icon: '🇪🇸',
    rewardGrowthPoints: 100,
    players: [
      {
        id: 'casillas',
        name: '卡西利亚斯',
        position: 'GK',
        positionCN: '门将',
        stats: { speed: 65, shooting: 25, passing: 65, dribbling: 50, defense: 94, physical: 82 },
        pieceType: 'king',
        role: 'GK',
        uniqueSkill: {
          id: 'casillas_save',
          name: '圣卡西',
          description: '扑救成功率提升30%',
          effectType: 'goalkeeper_save',
          effectValue: 30,
          cooldown: 4,
          currentCooldown: 0,
          staminaCost: 25,
          icon: '🧤'
        }
      },
      {
        id: 'puyol',
        name: '普约尔',
        position: 'DEF',
        positionCN: '中卫',
        stats: { speed: 78, shooting: 55, passing: 72, dribbling: 70, defense: 94, physical: 90 },
        pieceType: 'rook',
        role: 'CB',
        uniqueSkill: {
          id: 'puyol_defense',
          name: '铁血队长',
          description: '防守能力提升30%',
          effectType: 'defense_boost',
          effectValue: 30,
          cooldown: 3,
          currentCooldown: 0,
          staminaCost: 20,
          icon: '🛡️'
        }
      },
      {
        id: 'iniesta',
        name: '伊涅斯塔',
        position: 'MID',
        positionCN: '中场',
        stats: { speed: 82, shooting: 80, passing: 96, dribbling: 94, defense: 65, physical: 78 },
        pieceType: 'queen',
        role: 'ST',
        uniqueSkill: {
          id: 'iniesta_pass',
          name: '小白',
          description: '传球成功率提升35%',
          effectType: 'pass_power',
          effectValue: 35,
          cooldown: 3,
          currentCooldown: 0,
          staminaCost: 15,
          icon: '🎯'
        }
      }
    ]
  }
];

export function getAIOpponentTeamById(id: string): AIOpponentTeam | undefined {
  return aiOpponentTeams.find((t) => t.id === id);
}

export function getAIOpponentTeamsByDifficulty(difficulty: AIOpponentDifficulty): AIOpponentTeam[] {
  return aiOpponentTeams.filter((t) => t.difficulty === difficulty);
}

export function getAvailableAIOpponentTeams(progress: { completedMatches: number; completedWins: number }): AIOpponentTeam[] {
  return aiOpponentTeams.filter((team) => {
    switch (team.difficulty) {
      case 'easy':
        return true;
      case 'normal':
        return true;
      case 'hard':
        return progress.completedMatches >= 3;
      case 'legendary':
        return progress.completedWins >= 3;
      default:
        return true;
    }
  });
}

export function getAIOpponentStats(team: AIOpponentTeam): Record<string, PlayerStats> {
  const stats: Record<string, PlayerStats> = {};
  team.players.forEach((player) => {
    stats[player.id] = player.stats;
  });
  return stats;
}