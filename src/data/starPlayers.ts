import { BasePlayer, PlayerStats, PlayerPosition } from './playerTypes';

export type { PlayerStats, PlayerPosition };
export interface StarPlayer extends BasePlayer {
  country: string;
}

export const starPlayers: StarPlayer[] = [
  // 门将
  {
    id: 'neuer',
    name: '曼努埃尔·诺伊尔',
    country: '德国',
    position: 'GK',
    positionCN: '门将',
    era: '2010-2022',
    stats: { speed: 58, shooting: 35, passing: 75, dribbling: 50, defense: 92, physical: 82 },
    overall: 90,
    style: '清道夫门将',
    description: '重新定义门将位置，出击范围大，传球精准'
  },
  {
    id: 'courtois',
    name: '蒂博·库尔图瓦',
    country: '比利时',
    position: 'GK',
    positionCN: '门将',
    era: '2014-2022',
    stats: { speed: 62, shooting: 30, passing: 60, dribbling: 45, defense: 93, physical: 88 },
    overall: 90,
    style: '门线守护神',
    description: '身高臂长，反应神速，门线技术顶级'
  },
  {
    id: 'alisson',
    name: '阿利松·贝克尔',
    country: '巴西',
    position: 'GK',
    positionCN: '门将',
    era: '2018-2022',
    stats: { speed: 65, shooting: 35, passing: 70, dribbling: 55, defense: 90, physical: 84 },
    overall: 89,
    style: '全面型门将',
    description: '脚下技术出色，出击果断，综合能力均衡'
  },
  // 后卫
  {
    id: 'vandijk',
    name: '维吉尔·范戴克',
    country: '荷兰',
    position: 'DEF',
    positionCN: '中后卫',
    era: '2018-2022',
    stats: { speed: 78, shooting: 60, passing: 78, dribbling: 70, defense: 95, physical: 92 },
    overall: 92,
    style: '现代中卫',
    description: '速度、身体、出球兼备的顶级中后卫'
  },
  {
    id: 'ramos',
    name: '塞尔吉奥·拉莫斯',
    country: '西班牙',
    position: 'DEF',
    positionCN: '中后卫',
    era: '2010-2022',
    stats: { speed: 72, shooting: 75, passing: 75, dribbling: 68, defense: 92, physical: 90 },
    overall: 91,
    style: '铁血队长',
    description: '防守凶悍，头球能力出众，关键时刻可进球'
  },
  {
    id: 'maldini',
    name: '保罗·马尔蒂尼',
    country: '意大利',
    position: 'DEF',
    positionCN: '左后卫/中卫',
    era: '1990-2002',
    stats: { speed: 78, shooting: 58, passing: 78, dribbling: 75, defense: 95, physical: 86 },
    overall: 93,
    style: '优雅后卫',
    description: '防守位置感极佳，铲球干净，足坛常青树'
  },
  {
    id: 'cafu',
    name: '卡福',
    country: '巴西',
    position: 'DEF',
    positionCN: '右后卫',
    era: '1998-2006',
    stats: { speed: 88, shooting: 65, passing: 78, dribbling: 82, defense: 86, physical: 88 },
    overall: 90,
    style: '进攻型边后卫',
    description: '体能充沛，往返能力强，边路进攻利器'
  },
  {
    id: 'carlos',
    name: '罗伯托·卡洛斯',
    country: '巴西',
    position: 'DEF',
    positionCN: '左后卫',
    era: '1998-2006',
    stats: { speed: 92, shooting: 88, passing: 80, dribbling: 85, defense: 80, physical: 88 },
    overall: 90,
    style: '重炮边后卫',
    description: '任意球势大力沉，速度惊人，进攻属性极强'
  },
  // 中场
  {
    id: 'modric',
    name: '卢卡·莫德里奇',
    country: '克罗地亚',
    position: 'MID',
    positionCN: '中场',
    era: '2014-2022',
    stats: { speed: 75, shooting: 76, passing: 95, dribbling: 90, defense: 72, physical: 78 },
    overall: 92,
    style: '中场大师',
    description: '传球视野开阔，控球稳定，节奏掌控者'
  },
  {
    id: 'kroos',
    name: '托尼·克罗斯',
    country: '德国',
    position: 'MID',
    positionCN: '中场',
    era: '2014-2022',
    stats: { speed: 65, shooting: 82, passing: 95, dribbling: 78, defense: 70, physical: 75 },
    overall: 91,
    style: '节拍器',
    description: '长传精准，调度能力顶级，控制比赛节奏'
  },
  {
    id: 'xavi',
    name: '哈维',
    country: '西班牙',
    position: 'MID',
    positionCN: '中场',
    era: '2008-2014',
    stats: { speed: 68, shooting: 70, passing: 98, dribbling: 88, defense: 68, physical: 72 },
    overall: 93,
    style: '传控核心',
    description: '短传精准，控球出色，传控足球的代表'
  },
  {
    id: 'iniesta',
    name: '伊涅斯塔',
    country: '西班牙',
    position: 'MID',
    positionCN: '中场',
    era: '2008-2014',
    stats: { speed: 76, shooting: 78, passing: 94, dribbling: 95, defense: 62, physical: 72 },
    overall: 92,
    style: '进攻组织者',
    description: '盘带过人犀利，关键传球和进球能力出众'
  },
  {
    id: 'zidane',
    name: '齐达内',
    country: '法国',
    position: 'MID',
    positionCN: '前腰',
    era: '1998-2006',
    stats: { speed: 76, shooting: 85, passing: 94, dribbling: 94, defense: 68, physical: 84 },
    overall: 94,
    style: '艺术大师',
    description: '技术华丽，视野开阔，大场面先生'
  },
  {
    id: 'beckenbauer',
    name: '贝肯鲍尔',
    country: '德国',
    position: 'DEF',
    positionCN: '自由人',
    era: '1970-1974',
    stats: { speed: 80, shooting: 78, passing: 92, dribbling: 85, defense: 94, physical: 86 },
    overall: 94,
    style: '足球皇帝',
    description: '攻防俱佳，开创自由人位置，领袖气质卓越'
  },
  {
    id: 'pogba',
    name: '保罗·博格巴',
    country: '法国',
    position: 'MID',
    positionCN: '中场',
    era: '2014-2022',
    stats: { speed: 76, shooting: 82, passing: 88, dribbling: 86, defense: 72, physical: 88 },
    overall: 89,
    style: 'B2B中场',
    description: '身体素质出色，长传精准，攻防全面'
  },
  {
    id: 'kante',
    name: '恩戈洛·坎特',
    country: '法国',
    position: 'MID',
    positionCN: '后腰',
    era: '2016-2022',
    stats: { speed: 82, shooting: 55, passing: 78, dribbling: 78, defense: 92, physical: 88 },
    overall: 90,
    style: '拦截型后腰',
    description: '覆盖面积大，抢断能力顶级，球队节拍器'
  },
  // 前锋
  {
    id: 'messi',
    name: '里奥内尔·梅西',
    country: '阿根廷',
    position: 'FWD',
    positionCN: '前锋',
    era: '2006-2022',
    stats: { speed: 86, shooting: 95, passing: 93, dribbling: 98, defense: 40, physical: 78 },
    overall: 96,
    style: '全能攻击手',
    description: '历史级盘带和射门，传射俱佳'
  },
  {
    id: 'ronaldo',
    name: '克里斯蒂亚诺·罗纳尔多',
    country: '葡萄牙',
    position: 'FWD',
    positionCN: '前锋',
    era: '2006-2022',
    stats: { speed: 88, shooting: 95, passing: 82, dribbling: 88, defense: 45, physical: 90 },
    overall: 95,
    style: '得分机器',
    description: '头球、远射、点球无所不能，职业典范'
  },
  {
    id: 'mbappe',
    name: '基利安·姆巴佩',
    country: '法国',
    position: 'FWD',
    positionCN: '前锋',
    era: '2018-2022',
    stats: { speed: 98, shooting: 88, passing: 80, dribbling: 92, defense: 40, physical: 84 },
    overall: 93,
    style: '速度型边锋',
    description: '爆发力惊人，反击利器，射门冷静'
  },
  {
    id: 'haaland',
    name: '埃尔林·哈兰德',
    country: '挪威',
    position: 'FWD',
    positionCN: '前锋',
    era: '2022-',
    stats: { speed: 88, shooting: 92, passing: 72, dribbling: 80, defense: 42, physical: 94 },
    overall: 92,
    style: '现代中锋',
    description: '身体强壮，跑位犀利，进球效率极高'
  },
  {
    id: 'ronaldo9',
    name: '罗纳尔多',
    country: '巴西',
    position: 'FWD',
    positionCN: '前锋',
    era: '1998-2006',
    stats: { speed: 94, shooting: 93, passing: 78, dribbling: 96, defense: 38, physical: 86 },
    overall: 94,
    style: '外星人',
    description: '速度、力量、技术完美结合的九号半'
  },
  {
    id: 'henry',
    name: '蒂埃里·亨利',
    country: '法国',
    position: 'FWD',
    positionCN: '前锋',
    era: '1998-2006',
    stats: { speed: 94, shooting: 88, passing: 82, dribbling: 90, defense: 42, physical: 82 },
    overall: 91,
    style: '速度型射手',
    description: '边路速度快，内切射门精准'
  },
  {
    id: 'klose',
    name: '米罗斯拉夫·克洛泽',
    country: '德国',
    position: 'FWD',
    positionCN: '前锋',
    era: '2002-2014',
    stats: { speed: 78, shooting: 88, passing: 72, dribbling: 76, defense: 50, physical: 86 },
    overall: 89,
    style: '空霸中锋',
    description: '世界杯历史射手王，头球和抢点能力顶级'
  },
  {
    id: 'baggio',
    name: '罗伯特·巴乔',
    country: '意大利',
    position: 'FWD',
    positionCN: '前锋/前腰',
    era: '1990-1998',
    stats: { speed: 82, shooting: 90, passing: 88, dribbling: 94, defense: 40, physical: 74 },
    overall: 91,
    style: '忧郁王子',
    description: '技术细腻，任意球大师，进攻核心'
  },
  {
    id: 'ibrahimovic',
    name: '兹拉坦·伊布拉希莫维奇',
    country: '瑞典',
    position: 'FWD',
    positionCN: '前锋',
    era: '2006-2016',
    stats: { speed: 78, shooting: 90, passing: 82, dribbling: 86, defense: 45, physical: 92 },
    overall: 90,
    style: '支点型中锋',
    description: '身体强悍，脚下技术出色，霸气十足'
  },
  {
    id: 'lewandowski',
    name: '罗伯特·莱万多夫斯基',
    country: '波兰',
    position: 'FWD',
    positionCN: '前锋',
    era: '2014-2022',
    stats: { speed: 80, shooting: 93, passing: 78, dribbling: 86, defense: 48, physical: 86 },
    overall: 92,
    style: '全能射手',
    description: '射门全面，做球能力强，支点作用突出'
  },
  {
    id: 'benzema',
    name: '卡里姆·本泽马',
    country: '法国',
    position: 'FWD',
    positionCN: '前锋',
    era: '2014-2022',
    stats: { speed: 78, shooting: 90, passing: 86, dribbling: 88, defense: 45, physical: 84 },
    overall: 91,
    style: '组织型中锋',
    description: '背身拿球稳，做球意识好，大器晚成'
  },
  {
    id: 'neymar',
    name: '内马尔',
    country: '巴西',
    position: 'FWD',
    positionCN: '边锋',
    era: '2014-2022',
    stats: { speed: 88, shooting: 84, passing: 86, dribbling: 95, defense: 38, physical: 76 },
    overall: 91,
    style: '桑巴边锋',
    description: '盘带华丽，创造力强，过人能力顶级'
  },
  {
    id: 'suarez',
    name: '路易斯·苏亚雷斯',
    country: '乌拉圭',
    position: 'FWD',
    positionCN: '前锋',
    era: '2014-2018',
    stats: { speed: 80, shooting: 90, passing: 82, dribbling: 88, defense: 52, physical: 86 },
    overall: 90,
    style: '全面中锋',
    description: '射门、做球、拼抢兼备，禁区嗅觉敏锐'
  },
  {
    id: 'robben',
    name: '阿尔杰·罗本',
    country: '荷兰',
    position: 'FWD',
    positionCN: '边锋',
    era: '2010-2014',
    stats: { speed: 90, shooting: 88, passing: 80, dribbling: 92, defense: 42, physical: 78 },
    overall: 89,
    style: '内切边锋',
    description: '标志性内切射门，速度和技术兼具'
  },
  {
    id: 'ribery',
    name: '弗兰克·里贝里',
    country: '法国',
    position: 'FWD',
    positionCN: '边锋',
    era: '2006-2014',
    stats: { speed: 88, shooting: 84, passing: 86, dribbling: 92, defense: 48, physical: 82 },
    overall: 89,
    style: '边路爆点',
    description: '盘带突破犀利，助攻能力强'
  }
];

export const getStarById = (id: string): StarPlayer | undefined =>
  starPlayers.find((s) => s.id === id);

export const getStarsByPosition = (position: StarPlayer['position']) =>
  starPlayers.filter((s) => s.position === position);

const STAT_KEYS: (keyof PlayerStats)[] = ['speed', 'shooting', 'passing', 'dribbling', 'defense', 'physical'];

// 计算两名球员的风格相似度（欧氏距离归一化）
export function calculateStyleSimilarity(
  player1: { stats: PlayerStats },
  player2: { stats: PlayerStats }
): number {
  const sumSquares = STAT_KEYS.reduce((sum, key) => {
    const diff = player1.stats[key] - player2.stats[key];
    return sum + diff * diff;
  }, 0);
  const distance = Math.sqrt(sumSquares);
  // 最大可能距离约为 sqrt(6 * 100^2) = 244.9
  const maxDistance = 244.9;
  const similarity = Math.max(0, Math.min(100, 100 - (distance / maxDistance) * 100));
  return Math.round(similarity);
}

// 为任意球员匹配最相似的球星
export function findBestMatchingStar(
  player: { stats: PlayerStats; position?: PlayerPosition }
): { star: StarPlayer; similarity: number } {
  const candidates = player.position
    ? starPlayers.filter((s) => s.position === player.position)
    : starPlayers;

  let best = candidates[0];
  let bestSim = 0;

  for (const star of candidates) {
    const sim = calculateStyleSimilarity(player, star);
    if (sim > bestSim) {
      bestSim = sim;
      best = star;
    }
  }

  return { star: best, similarity: bestSim };
}
