// CG 图鉴条目
export interface CGItem {
  id: string;
  sceneId: string;
  characterId: string;
  title: string;
  description: string;
  image: string; // URL or placeholder
}

// 成就条目
export interface Achievement {
  id: string;
  title: string;
  description: string;
  icon: string;
  hint: string; // 未解锁时显示的提示
  condition: (state: { completedEndings: string[]; unlockedCGs: string[]; endingScore: number }) => boolean;
}

// CG 图鉴数据 - 每个角色至少1张CG
export const cgItems: CGItem[] = [
  // 吾尔肯
  { id: 'cg_wuerken_goal', sceneId: 'wuerken_4a', characterId: 'wuerken', title: '梅开二度', description: '吾尔肯带领球队取得首胜', image: '' },
  { id: 'cg_wuerken_penalty', sceneId: 'wuerken_6a', characterId: 'wuerken', title: '点球决战', description: '半决赛的点球大战', image: '' },
  { id: 'cg_wuerken_champion', sceneId: 'wuerken_end_good', characterId: 'wuerken', title: '十周年冠军', description: '最完美的告别', image: '' },
  // 吴志鸣
  { id: 'cg_wuzhiming_found', sceneId: 'wuzhiming_1', characterId: 'wuzhiming', title: '球队创立', description: '新闻男足的诞生', image: '' },
  { id: 'cg_wuzhiming_afu', sceneId: 'wuzhiming_7', characterId: 'wuzhiming', title: '相遇阿负', description: '黑暗中的一束光', image: '' },
  // 肖潇
  { id: 'cg_xiaoxiao_first_goal', sceneId: 'xiaoxiao_2a', characterId: 'xiaoxiao', title: '队史首球', description: '新闻男足第一粒正式比赛进球', image: '' },
  { id: 'cg_xiaoxiao_breakout', sceneId: 'xiaoxiao_4', characterId: 'xiaoxiao', title: '黄金一代巅峰', description: '与吾尔肯并肩作战', image: '' },
  // 欧翔
  { id: 'cg_ouxiang_leadership', sceneId: 'ouxiang_1', characterId: 'ouxiang', title: '接任队长', description: '承担传承的使命', image: '' },
  // 吴杨楚涵
  { id: 'cg_wuyangchuhan_meet', sceneId: 'wuyangchuhan_2a', characterId: 'wuyangchuhan', title: '东操初遇', description: '听见了悠扬的歌声', image: '' },
  { id: 'cg_wuyangchuhan_history', sceneId: 'wuyangchuhan_7', characterId: 'wuyangchuhan', title: '书写历史', description: '完成新闻男足简史', image: '' },
  // 阿负
  { id: 'cg_afu_support', sceneId: 'afu_3', characterId: 'afu', title: '十年守护', description: '默默支持的力量', image: '' },
  // 王楷硕
  { id: 'cg_wangkaishuo_growth', sceneId: 'wangkaishuo_5', characterId: 'wangkaishuo', title: '新一代核心', description: '接过前辈的衣钵', image: '' },
  // 伍彦名
  { id: 'cg_wuyanming_goalkeeper', sceneId: 'wuyanming_5', characterId: 'wuyanming', title: '临危受命', description: '速成门神的诞生', image: '' },
  // 谭琦
  { id: 'cg_tanqi_rebuild', sceneId: 'tanqi_1', characterId: 'tanqi', title: '重建之始', description: '军训期间自建球队', image: '' },
  { id: 'cg_tanqi_first_win', sceneId: 'tanqi_5', characterId: 'tanqi', title: '打破不胜纪录', description: '新生杯首胜', image: '' },
  // 钱文伟
  { id: 'cg_qianwenwei_defense', sceneId: 'qianwenwei_3', characterId: 'qianwenwei', title: '钢铁防线', description: '后防定海神针', image: '' },
  // 洛桑罗布
  { id: 'cg_luosangluobu_volley', sceneId: 'luosangluobu_2b', characterId: 'luosangluobu', title: '雪域雄心', description: '来自高原的力量', image: '' },
];

// 成就数据
export const achievements: Achievement[] = [
  {
    id: 'first_complete',
    title: '初次通关',
    description: '完成任意一位角色的故事',
    icon: '⭐',
    hint: '体验一位球员的完整故事',
    condition: (s) => s.completedEndings.length >= 1,
  },
  {
    id: 'three_endings',
    title: '故事收藏家',
    description: '完成3位角色的故事',
    icon: '📚',
    hint: '完成3个角色的故事',
    condition: (s) => s.completedEndings.length >= 3,
  },
  {
    id: 'five_endings',
    title: '资深读者',
    description: '完成5位角色的故事',
    icon: '📖',
    hint: '完成5个角色的故事',
    condition: (s) => s.completedEndings.length >= 5,
  },
  {
    id: 'all_endings',
    title: '全故事通关',
    description: '完成所有角色的故事',
    icon: '🏆',
    hint: '完成全部角色的故事',
    condition: (s) => s.completedEndings.length >= 16,
  },
  {
    id: 'cg_collector',
    title: 'CG收藏家',
    description: '解锁5张CG',
    icon: '🖼️',
    hint: '在不同角色的故事中解锁CG',
    condition: (s) => s.unlockedCGs.length >= 5,
  },
  {
    id: 'good_ending',
    title: '完美主义者',
    description: '打出一次好结局',
    icon: '✨',
    hint: '做出正确的选择，走向更好的未来',
    condition: (s) => s.endingScore > 0,
  },
  {
    id: 'cg_master',
    title: 'CG鉴赏家',
    description: '解锁10张CG',
    icon: '🎨',
    hint: '探索更多的剧情分支',
    condition: (s) => s.unlockedCGs.length >= 10,
  },
  {
    id: 'all_cg',
    title: '全CG收集',
    description: '解锁所有CG',
    icon: '🌟',
    hint: '体验每一个角色的每一个结局',
    condition: (s) => s.unlockedCGs.length >= cgItems.length,
  },
];

// 辅助函数
export const getCGBySceneId = (sceneId: string): CGItem | undefined => {
  return cgItems.find(cg => cg.sceneId === sceneId);
};

export const getCGById = (cgId: string): CGItem | undefined => {
  return cgItems.find(cg => cg.id === cgId);
};

export const checkAndUnlockAchievements = (
  state: { completedEndings: string[]; unlockedCGs: string[]; endingScore: number },
  unlockedIds: string[]
): string[] => {
  const newUnlocks: string[] = [];
  achievements.forEach((ach) => {
    if (!unlockedIds.includes(ach.id) && ach.condition(state)) {
      newUnlocks.push(ach.id);
    }
  });
  return newUnlocks;
};
