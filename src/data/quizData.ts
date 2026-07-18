export type QuizCategory = 'football' | 'campus_history' | 'sports_culture';

export interface QuizQuestion {
  id: string;
  category: QuizCategory;
  question: string;
  options: string[];
  correctIndex: number;
  explanation: string;
  difficulty: 'easy' | 'medium' | 'hard';
}

export const QUIZ_QUESTIONS: QuizQuestion[] = [
  {
    id: 'fq_001',
    category: 'football',
    question: '足球比赛中，一场比赛每队最多可以替换几名球员？',
    options: ['3名', '5名', '7名', '11名'],
    correctIndex: 1,
    explanation: '根据国际足联规则，一场正式比赛每队最多可替换5名球员（包括加时赛）。',
    difficulty: 'easy'
  },
  {
    id: 'fq_002',
    category: 'football',
    question: '世界杯历史上夺冠次数最多的国家是？',
    options: ['德国', '阿根廷', '巴西', '意大利'],
    correctIndex: 2,
    explanation: '巴西队是世界杯历史上夺冠次数最多的球队，共获得5次冠军（1958、1962、1970、1994、2002）。',
    difficulty: 'easy'
  },
  {
    id: 'fq_003',
    category: 'football',
    question: '足球比赛中，越位规则的判断基准是？',
    options: ['传球瞬间', '接球瞬间', '跑动过程', '射门瞬间'],
    correctIndex: 0,
    explanation: '越位规则的判断基准是传球瞬间，进攻球员是否比对方倒数第二名防守球员更靠近对方球门线。',
    difficulty: 'medium'
  },
  {
    id: 'fq_004',
    category: 'football',
    question: '以下哪位球员获得过金球奖次数最多？',
    options: ['梅西', 'C罗', '齐达内', '马拉多纳'],
    correctIndex: 0,
    explanation: '梅西共获得过8次金球奖（2009-2012, 2015, 2019, 2021, 2023），是历史上获得金球奖次数最多的球员。',
    difficulty: 'easy'
  },
  {
    id: 'fq_005',
    category: 'football',
    question: '足球比赛中，"帽子戏法"指的是？',
    options: ['一名球员在一场比赛中进3球', '一名球员完成3次助攻', '一名球员被红牌罚下', '一名球员完成3次扑救'],
    correctIndex: 0,
    explanation: '帽子戏法（Hat-trick）指一名球员在一场比赛中打进3个进球。',
    difficulty: 'easy'
  },
  {
    id: 'fq_006',
    category: 'football',
    question: '欧洲冠军联赛的奖杯叫什么名字？',
    options: ['大力神杯', '德劳内杯', '圣伯莱德杯', '美洲杯'],
    correctIndex: 2,
    explanation: '欧洲冠军联赛的奖杯名为圣伯莱德杯（The European Champion Clubs\' Cup）。',
    difficulty: 'medium'
  },
  {
    id: 'fq_007',
    category: 'football',
    question: '以下哪项技术是巴西球员罗纳尔多的标志性动作？',
    options: ['踩单车', '牛尾巴', '钟摆过人', '马赛回旋'],
    correctIndex: 2,
    explanation: '钟摆过人是罗纳尔多的标志性过人动作，通过左右晃动身体来突破防守。',
    difficulty: 'medium'
  },
  {
    id: 'fq_008',
    category: 'football',
    question: '2022年卡塔尔世界杯的冠军是哪支球队？',
    options: ['法国', '阿根廷', '巴西', '德国'],
    correctIndex: 1,
    explanation: '2022年卡塔尔世界杯决赛中，阿根廷队通过点球大战击败法国队，第三次获得世界杯冠军。',
    difficulty: 'easy'
  },
  {
    id: 'fq_009',
    category: 'football',
    question: '足球比赛中，裁判出示红牌意味着什么？',
    options: ['警告', '罚下', '点球', '任意球'],
    correctIndex: 1,
    explanation: '红牌意味着球员被罚下，该队将在剩余比赛中少一人作战。',
    difficulty: 'easy'
  },
  {
    id: 'fq_010',
    category: 'football',
    question: '以下哪位球员被称为"球王"？',
    options: ['贝利', '贝肯鲍尔', '普拉蒂尼', '克鲁伊夫'],
    correctIndex: 0,
    explanation: '贝利被广泛认为是足球历史上最伟大的球员之一，被誉为"球王"。',
    difficulty: 'easy'
  },
  {
    id: 'ch_001',
    category: 'campus_history',
    question: '新闻男足成立于哪一年？',
    options: ['2015年', '2016年', '2017年', '2018年'],
    correctIndex: 1,
    explanation: '新闻男足成立于2016年，由吴志鸣等人发起组建，开启了球队的拓荒时代。',
    difficulty: 'easy'
  },
  {
    id: 'ch_002',
    category: 'campus_history',
    question: '新闻男足历史上第一位队长是谁？',
    options: ['肖潇', '吴志鸣', '吾尔肯', '王楷硕'],
    correctIndex: 1,
    explanation: '吴志鸣是新闻男足的创始人兼首任队长，在球队至暗时刻坚持让球队活下去。',
    difficulty: 'easy'
  },
  {
    id: 'ch_003',
    category: 'campus_history',
    question: '新闻男足队史射手王是谁？',
    options: ['肖潇', '吾尔肯', '王楷硕', '谭琦'],
    correctIndex: 0,
    explanation: '肖潇是新闻男足队史射手王，打入了球队历史上第一粒正式比赛进球。',
    difficulty: 'easy'
  },
  {
    id: 'ch_004',
    category: 'campus_history',
    question: '新闻男足"黄金一代"巅峰时期是哪一年？',
    options: ['2020年', '2021年', '2022年', '2023年'],
    correctIndex: 2,
    explanation: '2022年是新闻男足黄金一代的巅峰时期，球队在华工杯上表现出色，吾尔肯完成任意球帽子戏法。',
    difficulty: 'easy'
  },
  {
    id: 'ch_005',
    category: 'campus_history',
    question: '新闻男足第一任正式教练是谁？',
    options: ['赵凌冬', '龚昊', '吾尔肯', '刘俊哲'],
    correctIndex: 0,
    explanation: '赵凌冬是新闻男足第一任真正意义上的教练，他把一支散兵游勇捏合成了一支真正的球队。',
    difficulty: 'easy'
  },
  {
    id: 'ch_006',
    category: 'campus_history',
    question: '新闻男足在2026年十年谢幕赛季获得了什么成绩？',
    options: ['冠军', '亚军', '季军', '止步小组赛'],
    correctIndex: 2,
    explanation: '2026年是新闻男足成立十周年，球队在十年谢幕赛季中获得了季军的历史最佳成绩。',
    difficulty: 'easy'
  },
  {
    id: 'ch_007',
    category: 'campus_history',
    question: '2022年华工杯上，哪位球员完成了任意球帽子戏法？',
    options: ['刘俊哲', '吾尔肯', '肖潇', '王楷硕'],
    correctIndex: 1,
    explanation: '2022年华工杯上，吾尔肯完成了任意球帽子戏法，成为球队历史上的经典时刻。',
    difficulty: 'medium'
  },
  {
    id: 'ch_008',
    category: 'campus_history',
    question: '新闻男足"重建时代"的核心球员不包括以下哪位？',
    options: ['杨云帆', '谭琦', '王楷硕', '肖潇'],
    correctIndex: 3,
    explanation: '肖潇属于拓荒时代和黄金一代时期的球员，杨云帆、谭琦、王楷硕是重建时代的核心球员。',
    difficulty: 'medium'
  },
  {
    id: 'ch_009',
    category: 'campus_history',
    question: '2026年季军赛中，哪位球员完成了帽子戏法？',
    options: ['钱文伟', '谭琦', '王楷硕', '陈勇旭'],
    correctIndex: 0,
    explanation: '2026年季军赛中，钱文伟完成了帽子戏法，帮助球队锁定胜局。',
    difficulty: 'medium'
  },
  {
    id: 'ch_010',
    category: 'campus_history',
    question: '2026年门将骨折后，哪位球员临危受命出任门将？',
    options: ['伍彦名', '王俊博', '杨云帆', '张明阳'],
    correctIndex: 0,
    explanation: '2026年门将骨折后，伍彦名临危受命出任门将，速成门神并多次做出关键扑救。',
    difficulty: 'medium'
  },
  {
    id: 'ch_011',
    category: 'campus_history',
    question: '新闻男足历史上首次进入淘汰赛是在哪一年？',
    options: ['2018年', '2019年', '2020年', '2021年'],
    correctIndex: 2,
    explanation: '2020年赵凌冬接手球队后，新闻男足首次进入了华工杯淘汰赛。',
    difficulty: 'medium'
  },
  {
    id: 'ch_012',
    category: 'campus_history',
    question: '哪位球员从人文学院转会到新闻学院，成为黄金一代的重要成员？',
    options: ['艾弘毅', '苗雨辰', '唐嘉睿', '刘俊哲'],
    correctIndex: 0,
    explanation: '艾弘毅从人文学院转会新闻学院，成为黄金一代时期的边路突击手。',
    difficulty: 'hard'
  },
  {
    id: 'ch_013',
    category: 'campus_history',
    question: '2019年华工杯上，哪位球员拼到抽筋呕吐仍坚持比赛？',
    options: ['苗雨辰', '梁子', '王俊博', '刘俊哲'],
    correctIndex: 0,
    explanation: '2019年华工杯上，苗雨辰作为后卫拼到抽筋呕吐，展现了铁血精神。',
    difficulty: 'hard'
  },
  {
    id: 'ch_014',
    category: 'campus_history',
    question: '2023级新生在军训期间自发组建球队，其中不包括以下哪位？',
    options: ['杨云帆', '谭琦', '钱文伟', '吾尔肯'],
    correctIndex: 3,
    explanation: '吾尔肯是2019级球员，属于黄金一代。杨云帆、谭琦、钱文伟都是2023级自发组队的核心成员。',
    difficulty: 'medium'
  },
  {
    id: 'ch_015',
    category: 'campus_history',
    question: '新闻男足队史最佳球员是谁？',
    options: ['吾尔肯', '肖潇', '王楷硕', '刘俊哲'],
    correctIndex: 0,
    explanation: '吾尔肯被认为是新闻男足队史最佳球员，七年校队生涯取得四冠二亚的成绩。',
    difficulty: 'easy'
  },
  {
    id: 'sc_001',
    category: 'sports_culture',
    question: '奥林匹克运动会起源于哪个国家？',
    options: ['希腊', '罗马', '法国', '英国'],
    correctIndex: 0,
    explanation: '奥林匹克运动会起源于古希腊，古代奥运会始于公元前776年的奥林匹亚。',
    difficulty: 'easy'
  },
  {
    id: 'sc_002',
    category: 'sports_culture',
    question: '足球被称为"世界第一运动"的主要原因是？',
    options: ['历史最悠久', '参与人数最多', '奖金最高', '场馆最大'],
    correctIndex: 1,
    explanation: '足球是世界上参与人数最多、影响力最广的体育运动，因此被称为"世界第一运动"。',
    difficulty: 'easy'
  },
  {
    id: 'sc_003',
    category: 'sports_culture',
    question: '现代足球的发源地是哪个国家？',
    options: ['巴西', '西班牙', '英国', '意大利'],
    correctIndex: 2,
    explanation: '现代足球规则起源于19世纪的英国，1863年英格兰足球总会成立标志着现代足球的诞生。',
    difficulty: 'easy'
  },
  {
    id: 'sc_004',
    category: 'sports_culture',
    question: '以下哪个不是足球运动的特点？',
    options: ['对抗激烈', '战术复杂', '节奏缓慢', '团队协作'],
    correctIndex: 2,
    explanation: '足球是一项快节奏、对抗激烈、战术复杂且需要高度团队协作的运动。',
    difficulty: 'easy'
  },
  {
    id: 'sc_005',
    category: 'sports_culture',
    question: '体育精神的核心不包括以下哪项？',
    options: ['公平竞争', '友谊第一', '追求胜利', '弄虚作假'],
    correctIndex: 3,
    explanation: '体育精神的核心包括公平竞争、友谊第一、追求胜利等，弄虚作假违背体育精神。',
    difficulty: 'easy'
  },
  {
    id: 'sc_006',
    category: 'sports_culture',
    question: '足球比赛中，"德比"指的是？',
    options: ['同城球队之间的比赛', '不同国家球队的比赛', '决赛', '友谊赛'],
    correctIndex: 0,
    explanation: '德比（Derby）指同一城市或地区两支球队之间的比赛，通常竞争激烈。',
    difficulty: 'medium'
  },
  {
    id: 'sc_007',
    category: 'sports_culture',
    question: '以下哪项是足球运动员最重要的体能素质？',
    options: ['柔韧性', '耐力', '爆发力', '平衡性'],
    correctIndex: 1,
    explanation: '足球比赛时间长、跑动距离大，耐力是足球运动员最重要的体能素质。',
    difficulty: 'medium'
  },
  {
    id: 'sc_008',
    category: 'sports_culture',
    question: '足球战术中的"4-3-3"阵型指的是？',
    options: ['4后卫3中场3前锋', '4前锋3中场3后卫', '4中场3后卫3前锋', '4守门员3后卫3前锋'],
    correctIndex: 0,
    explanation: '4-3-3阵型是指4名后卫、3名中场、3名前锋的站位配置。',
    difficulty: 'medium'
  },
  {
    id: 'sc_009',
    category: 'sports_culture',
    question: '足球场上"越位陷阱"是哪种战术？',
    options: ['进攻战术', '防守战术', '定位球战术', '反击战术'],
    correctIndex: 1,
    explanation: '越位陷阱是一种防守战术，通过后卫线集体前压来制造进攻方越位。',
    difficulty: 'medium'
  },
  {
    id: 'sc_010',
    category: 'sports_culture',
    question: '以下哪位不是著名的足球教练？',
    options: ['穆里尼奥', '瓜迪奥拉', '博斯克', '费德勒'],
    correctIndex: 3,
    explanation: '费德勒是著名网球运动员，不是足球教练。穆里尼奥、瓜迪奥拉、博斯克都是著名足球教练。',
    difficulty: 'easy'
  }
];

export const QUIZ_CATEGORIES: { key: QuizCategory; label: string; icon: string }[] = [
  { key: 'football', label: '足球知识', icon: '⚽' },
  { key: 'campus_history', label: '新闻男足历史', icon: '🏛️' },
  { key: 'sports_culture', label: '体育文化', icon: '🏆' }
];

export function getQuestionsByCategory(category: QuizCategory): QuizQuestion[] {
  return QUIZ_QUESTIONS.filter(q => q.category === category);
}

export function getRandomQuestions(count: number, category?: QuizCategory): QuizQuestion[] {
  const pool = category ? getQuestionsByCategory(category) : QUIZ_QUESTIONS;
  const shuffled = [...pool].sort(() => Math.random() - 0.5);
  return shuffled.slice(0, Math.min(count, shuffled.length));
}

export function calculateQuizScore(correctCount: number, totalCount: number): number {
  return Math.round((correctCount / totalCount) * 100);
}

export function getQuizRewards(score: number): { growthPoints: number; trainingChance: boolean } {
  if (score >= 90) {
    return { growthPoints: 50, trainingChance: true };
  } else if (score >= 70) {
    return { growthPoints: 30, trainingChance: true };
  } else if (score >= 50) {
    return { growthPoints: 15, trainingChance: false };
  } else {
    return { growthPoints: 5, trainingChance: false };
  }
}