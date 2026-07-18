export interface TrainingEvent {
  id: string;
  title: string;
  description: string;
  eraFlavor: string;
  primaryBoost: number;
  secondaryBoost: number;
  riskChance: number;
  riskEffect: string;
}

export const trainingEvents: TrainingEvent[] = [
  {
    id: 'first_goal',
    title: '队史首球的激励',
    description: '肖潇在2016年打入队史第一粒正式比赛进球，这一刻提醒你：哪怕身处黑暗，也要敢于射门。',
    eraFlavor: '拓荒时代',
    primaryBoost: 3,
    secondaryBoost: 1,
    riskChance: 0,
    riskEffect: ''
  },
  {
    id: 'ten_to_zero',
    title: '0:10的警醒',
    description: '2017年第一次华工杯0:10惨败法学院，那种痛感让你明白防守不是选项，而是底线。',
    eraFlavor: '拓荒时代',
    primaryBoost: 2,
    secondaryBoost: 2,
    riskChance: 0.1,
    riskEffect: '过度加练导致肌肉疲劳，体能暂时下降'
  },
  {
    id: 'afu_support',
    title: '阿负的物资支援',
    description: '在最困难的年月，阿负带着足球、标志牌和球衣出现。有人愿意相信这支球队，你就更不能放弃。',
    eraFlavor: '拓荒时代',
    primaryBoost: 2,
    secondaryBoost: 1,
    riskChance: 0,
    riskEffect: ''
  },
  {
    id: 'first_hustcup_goal',
    title: '第一粒华工杯进球',
    description: '2018年对阵船海，肖潇打入队史第一粒华工杯进球。新闻男足开始学会在正式赛场上得分。',
    eraFlavor: '拓荒时代',
    primaryBoost: 3,
    secondaryBoost: 0,
    riskChance: 0,
    riskEffect: ''
  },
  {
    id: 'first_victory',
    title: '历史首胜',
    description: '2018年新生杯1:0战胜外国语，新闻男足迎来第一场正式比赛胜利。胜利的味道是最好的催化剂。',
    eraFlavor: '拓荒时代',
    primaryBoost: 2,
    secondaryBoost: 2,
    riskChance: 0,
    riskEffect: ''
  },
  {
    id: 'golden_generation_rise',
    title: '黄金一代崛起',
    description: '刘俊哲、吾尔肯等人逐渐成为球队脊梁，训练场上开始有人主动加练，氛围完全不同。',
    eraFlavor: '黄金一代',
    primaryBoost: 3,
    secondaryBoost: 1,
    riskChance: 0.05,
    riskEffect: '老将伤病，本周训练收益减半'
  },
  {
    id: 'coach_zhao',
    title: '赵凌冬的战术板',
    description: '2020年赵凌冬成为第一任真正意义的教练，散兵游勇开始有战术、有体系。',
    eraFlavor: '黄金一代',
    primaryBoost: 2,
    secondaryBoost: 2,
    riskChance: 0,
    riskEffect: ''
  },
  {
    id: 'first_knockout',
    title: '首次小组出线',
    description: '2021年2:1战胜网安，新闻男足第一次从华工杯小组赛突围。你意识到这支球队可以走得更远。',
    eraFlavor: '黄金一代',
    primaryBoost: 3,
    secondaryBoost: 1,
    riskChance: 0,
    riskEffect: ''
  },
  {
    id: '2022_fourth',
    title: '2022年殿军',
    description: '黄金一代三战全胜出线，半决赛点球大战失利，最终获得殿军。那是第一次真正接近巅峰。',
    eraFlavor: '黄金一代',
    primaryBoost: 2,
    secondaryBoost: 2,
    riskChance: 0.1,
    riskEffect: '心理压力过大，状态起伏'
  },
  {
    id: 'wuerken_hat_trick',
    title: '任意球帽子戏法',
    description: '吾尔肯在2022年华工杯完成任意球帽子戏法。核心球员的存在，让训练有了标杆。',
    eraFlavor: '黄金一代',
    primaryBoost: 4,
    secondaryBoost: 1,
    riskChance: 0,
    riskEffect: ''
  },
  {
    id: 'rebuild_2023',
    title: '2023级自发组队',
    description: '黄金一代退役后，杨云帆带着2023级新生自发组队。重建没有捷径，唯有从基本功开始。',
    eraFlavor: '重建时代',
    primaryBoost: 2,
    secondaryBoost: 2,
    riskChance: 0.05,
    riskEffect: '新人磨合不足，训练效率降低'
  },
  {
    id: 'yang_injury_return',
    title: '伤病后坚持回归',
    description: '杨云帆训练受伤后坚持康复，最终回到球场。身体的极限，往往也是意志的起点。',
    eraFlavor: '重建时代',
    primaryBoost: 1,
    secondaryBoost: 3,
    riskChance: 0.15,
    riskEffect: '带伤训练，旧伤复发'
  },
  {
    id: 'revenge_foreign',
    title: '复仇外国语',
    description: '2025年王楷硕打入制胜球，完成对外国语的复仇。那粒进球证明了重建没有白费。',
    eraFlavor: '重建时代',
    primaryBoost: 3,
    secondaryBoost: 1,
    riskChance: 0,
    riskEffect: ''
  },
  {
    id: 'goalkeeper_switch',
    title: '临时门将速成',
    description: '2026年门将骨折，伍彦名临危受命改踢门将并屡献扑救。位置可以变，责任心不能变。',
    eraFlavor: '十周年',
    primaryBoost: 2,
    secondaryBoost: 2,
    riskChance: 0.1,
    riskEffect: '扑救过猛，手腕不适'
  },
  {
    id: 'ten_year_bronze',
    title: '十年圆梦季军',
    description: '2026年华工杯，新闻男足3:1化学杀入四强，最终5:2中欧夺得季军，创造队史最佳。',
    eraFlavor: '十周年',
    primaryBoost: 3,
    secondaryBoost: 2,
    riskChance: 0,
    riskEffect: ''
  },
  {
    id: 'team_culture',
    title: '经理文化与凝聚力',
    description: '场下经理、宣传、运营共同运转，让球队不再是11个人的事。团队感让每个人都想再多跑一步。',
    eraFlavor: '十周年',
    primaryBoost: 2,
    secondaryBoost: 2,
    riskChance: 0,
    riskEffect: ''
  }
];

export const getRandomTrainingEvent = (): TrainingEvent =>
  trainingEvents[Math.floor(Math.random() * trainingEvents.length)];

export const getRelatedStat = (focus: keyof import('./playerTypes').PlayerStats): keyof import('./playerTypes').PlayerStats => {
  const map: Record<keyof import('./playerTypes').PlayerStats, keyof import('./playerTypes').PlayerStats> = {
    speed: 'dribbling',
    shooting: 'physical',
    passing: 'dribbling',
    dribbling: 'speed',
    defense: 'physical',
    physical: 'defense'
  };
  return map[focus];
};
