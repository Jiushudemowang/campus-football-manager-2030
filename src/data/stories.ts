export interface Dialog {
  speaker: string;
  text: string;
  emotion?: 'happy' | 'sad' | 'angry' | 'neutral' | 'excited' | 'confident' | 'serious' | 'tense' | 'encouraging' | 'determined' | 'nostalgic' | 'kind' | 'conflicted' | 'wise' | 'grateful' | 'hopeful' | 'significant' | 'respectful' | 'discouraged' | 'nervous' | 'surprised' | 'emotional' | 'passionate' | 'calm' | 'focused' | 'curious';
}

export interface Choice {
  id: string;
  text: string;
  nextSceneId: string;
  weight?: number;
}

export interface Scene {
  id: string;
  background: string;
  dialogs: Dialog[];
  choices?: Choice[];
  nextSceneId?: string;
  triggerMiniGame?: string;
  endingHint?: 'good' | 'normal' | 'bad';
}

export interface StoryLine {
  characterId: string;
  title: string;
  scenes: Scene[];
  endings: {
    good: string;
    normal: string;
    bad: string;
  };
}

export const stories: StoryLine[] = [
  // ========== 吴志鸣：拓荒者 ==========
  {
    characterId: 'wuzhiming',
    title: '在失败中诞生',
    scenes: [
      {
        id: 'wuzhiming_1',
        background: 'campus',
        dialogs: [
          { speaker: '旁白', text: '2016年秋天，华中科技大学新闻学院。几个热爱足球的新生凑在一起，他们不想再去看别的学院比赛了。', emotion: 'neutral' },
          { speaker: '吴志鸣', text: '我们新闻学院，为什么不能有自己的球队？', emotion: 'determined' },
          { speaker: '陈子昱', text: '人太少了，一级男生才二三十个，怎么凑十一人制？', emotion: 'conflicted' },
          { speaker: '肖潇', text: '凑一个是一个，先踢起来再说。', emotion: 'encouraging' }
        ],
        choices: [
          { id: 'wm_c1_a', text: '主动去每个班招人，哪怕只有七个人也要组队', nextSceneId: 'wuzhiming_2a', weight: 1 },
          { id: 'wm_c1_b', text: '先观望一下，等更多人有兴趣再说', nextSceneId: 'wuzhiming_2b', weight: 0 },
          { id: 'wm_c1_c', text: '算了，反正也赢不了，随便踢踢', nextSceneId: 'wuzhiming_2c', weight: -1 }
        ]
      },
      {
        id: 'wuzhiming_2a',
        background: 'football_field',
        dialogs: [
          { speaker: '旁白', text: '2016年10月，新闻男足迎来了第一场正式比赛——新生杯。', emotion: 'significant' },
          { speaker: '吴志鸣', text: '大家别紧张，输也要输得像个球队。', emotion: 'encouraging' },
          { speaker: '旁白', text: '最终比分 0:2，新闻男足迎来了队史第一场失利。', emotion: 'sad' },
          { speaker: '肖潇', text: '但至少我们有一个进球了，只是越位了。', emotion: 'hopeful' }
        ],
        nextSceneId: 'wuzhiming_3'
      },
      {
        id: 'wuzhiming_2b',
        background: 'football_field',
        dialogs: [
          { speaker: '旁白', text: '由于人员不足，新闻男足的第一场比赛被迫临时拼凑阵容。', emotion: 'tense' },
          { speaker: '吴志鸣', text: '早知道就该早点招新。', emotion: 'discouraged' },
          { speaker: '旁白', text: '三战皆负，仅进一球。这是一个艰难的开端。', emotion: 'sad' }
        ],
        nextSceneId: 'wuzhiming_3'
      },
      {
        id: 'wuzhiming_2c',
        background: 'football_field',
        dialogs: [
          { speaker: '旁白', text: '由于缺乏组织，新闻男足的首次参赛草草结束。', emotion: 'discouraged' },
          { speaker: '吴志鸣', text: '也许我们本可以做得更好……', emotion: 'conflicted' }
        ],
        nextSceneId: 'wuzhiming_3'
      },
      {
        id: 'wuzhiming_3',
        background: 'football_field',
        dialogs: [
          { speaker: '旁白', text: '2017年，新闻男足第一次踏上华工杯赛场，面对的却是残酷现实。', emotion: 'tense' },
          { speaker: '吴志鸣', text: '法学院……0:10。', emotion: 'emotional' },
          { speaker: '旁白', text: '队长吴志鸣还遭遇了伤病，后续两场因人数不足被迫弃权。', emotion: 'sad' },
          { speaker: '陈子昱', text: '我们还能继续吗？', emotion: 'discouraged' }
        ],
        choices: [
          { id: 'wm_c3_a', text: '当然继续，新闻男足不能就这么消失', nextSceneId: 'wuzhiming_4a', weight: 1 },
          { id: 'wm_c3_b', text: '先休整一年，等情况好转再说', nextSceneId: 'wuzhiming_4b', weight: 0 },
          { id: 'wm_c3_c', text: '也许新闻学院真的不适合有足球队', nextSceneId: 'wuzhiming_4c', weight: -1 }
        ]
      },
      {
        id: 'wuzhiming_4a',
        background: 'campus',
        dialogs: [
          { speaker: '旁白', text: '2017年下半年，一个来自澳门的人走进了新闻男足的历史。', emotion: 'significant' },
          { speaker: '阿负', text: '我看到你们很努力，我愿意长期支持你们。', emotion: 'kind' },
          { speaker: '吴志鸣', text: '谢谢你，阿负。这支球队，会继续活下去。', emotion: 'grateful' },
          { speaker: '旁白', text: '在最黑暗的时刻，有人愿意相信他们。这是新闻男足真正意义上的起点。', emotion: 'significant' }
        ],
        endingHint: 'good'
      },
      {
        id: 'wuzhiming_4b',
        background: 'campus',
        dialogs: [
          { speaker: '旁白', text: '球队休整了一年，虽然艰难，但火种没有熄灭。', emotion: 'neutral' },
          { speaker: '吴志鸣', text: '至少，我们把球队留下来了。', emotion: 'hopeful' }
        ],
        endingHint: 'normal'
      },
      {
        id: 'wuzhiming_4c',
        background: 'campus',
        dialogs: [
          { speaker: '旁白', text: '由于缺乏坚持，新闻男足在成立不久后解散了。', emotion: 'sad' },
          { speaker: '吴志鸣', text: '也许，我们本可以留下一段故事。', emotion: 'nostalgic' }
        ],
        endingHint: 'bad'
      }
    ],
    endings: {
      good: '吴志鸣的坚持，让新闻男足在至暗时刻活了下来。阿负的支持、欧翔的接任，让这支球队第一次拥有了传承。',
      normal: '新闻男足虽然经历阵痛，但最终还是延续了下来。只是，他们错过了更早崛起的机会。',
      bad: '如果 founder 在最初就放弃，新闻男足的故事也许永远不会被写下。但历史没有如果。'
    }
  },

  // ========== 肖潇：射手王 ==========
  {
    characterId: 'xiaoxiao',
    title: '第一粒进球',
    scenes: [
      {
        id: 'xiaoxiao_1',
        background: 'football_field',
        dialogs: [
          { speaker: '旁白', text: '2016年新生杯，新闻男足第二场比赛对阵社会学院。', emotion: 'neutral' },
          { speaker: '肖潇', text: '比分还是 0:1，我们落后。', emotion: 'tense' },
          { speaker: '旁白', text: '比赛最后时刻，肖潇抓住机会，打入一球。', emotion: 'excited' },
          { speaker: '肖潇', text: '进了！新闻男足的第一球！', emotion: 'excited' }
        ],
        choices: [
          { id: 'xx_c1_a', text: '把进球当作开始，激励全队继续战斗', nextSceneId: 'xiaoxiao_2a', weight: 1 },
          { id: 'xx_c1_b', text: '享受这一刻，但知道未来还很远', nextSceneId: 'xiaoxiao_2b', weight: 0 },
          { id: 'xx_c1_c', text: '一个进球改变不了什么，还是输', nextSceneId: 'xiaoxiao_2c', weight: -1 }
        ]
      },
      {
        id: 'xiaoxiao_2a',
        background: 'gym',
        dialogs: [
          { speaker: '旁白', text: '尽管球队仍然输球，但肖潇把那个进球刻在了心里。', emotion: 'hopeful' },
          { speaker: '肖潇', text: '只要还能进球，就有希望。', emotion: 'determined' },
          { speaker: '旁白', text: '他成为了训练最刻苦的人之一。', emotion: 'significant' }
        ],
        nextSceneId: 'xiaoxiao_3'
      },
      {
        id: 'xiaoxiao_2b',
        background: 'gym',
        dialogs: [
          { speaker: '旁白', text: '肖潇没有沉浸在进球喜悦中太久。', emotion: 'calm' },
          { speaker: '肖潇', text: '一场球说明不了什么，但我愿意继续。', emotion: 'neutral' }
        ],
        nextSceneId: 'xiaoxiao_3'
      },
      {
        id: 'xiaoxiao_2c',
        background: 'gym',
        dialogs: [
          { speaker: '旁白', text: '消极情绪开始蔓延，肖潇的训练热情下降。', emotion: 'discouraged' },
          { speaker: '肖潇', text: '也许新闻男足，真的只是鱼腩。', emotion: 'sad' }
        ],
        nextSceneId: 'xiaoxiao_3'
      },
      {
        id: 'xiaoxiao_3',
        background: 'football_field',
        dialogs: [
          { speaker: '旁白', text: '2018年华工杯，新闻对阵船海。肖潇打入队史第一粒华工杯进球。', emotion: 'significant' },
          { speaker: '肖潇', text: '从新生杯第一球，到华工杯第一球。原来我们一直在前进。', emotion: 'emotional' },
          { speaker: '旁白', text: '虽然还是输球，但那一个进球，让黑暗中的球队看见了光。', emotion: 'hopeful' }
        ],
        nextSceneId: 'xiaoxiao_4'
      },
      {
        id: 'xiaoxiao_4',
        background: 'football_field',
        dialogs: [
          { speaker: '旁白', text: '2022年，新闻男足黄金一代巅峰。肖潇作为队长，站在队伍最前面。', emotion: 'significant' },
          { speaker: '肖潇', text: '我们3:1外国语，三战全胜出线！', emotion: 'excited' },
          { speaker: '旁白', text: '半决赛点球大战失利，肖潇红了眼眶。', emotion: 'emotional' },
          { speaker: '肖潇', text: '哭什么……大不了明年再来。', emotion: 'conflicted' }
        ],
        choices: [
          { id: 'xx_c4_a', text: '安慰队友，把遗憾化作下一年的动力', nextSceneId: 'xiaoxiao_5a', weight: 1 },
          { id: 'xx_c4_b', text: '独自承受，不想让队友看见脆弱', nextSceneId: 'xiaoxiao_5b', weight: 0 },
          { id: 'xx_c4_c', text: '觉得再也冲不上去了，心灰意冷', nextSceneId: 'xiaoxiao_5c', weight: -1 }
        ]
      },
      {
        id: 'xiaoxiao_5a',
        background: 'trophy_room',
        dialogs: [
          { speaker: '旁白', text: '肖潇把黄金一代的精神传给了下一届。', emotion: 'significant' },
          { speaker: '肖潇', text: '我不是最强的队长，但我愿意做最后一个离开的人。', emotion: 'grateful' }
        ],
        endingHint: 'good'
      },
      {
        id: 'xiaoxiao_5b',
        background: 'locker_room',
        dialogs: [
          { speaker: '旁白', text: '肖潇的沉默让队友们也学会了隐忍。', emotion: 'sad' },
          { speaker: '肖潇', text: '明年，我们一定要回来。', emotion: 'determined' }
        ],
        endingHint: 'normal'
      },
      {
        id: 'xiaoxiao_5c',
        background: 'locker_room',
        dialogs: [
          { speaker: '旁白', text: '肖潇的退役带着遗憾，但他的进球永远留在了新闻男足的历史里。', emotion: 'sad' },
          { speaker: '肖潇', text: '如果当时再坚持一下，会不会不一样？', emotion: 'nostalgic' }
        ],
        endingHint: 'bad'
      }
    ],
    endings: {
      good: '肖潇从队史第一球开始，成为新闻男足的射手王和精神领袖。他的坚持，让后来者相信：再小的球队，也能拥有伟大的前锋。',
      normal: '肖潇的职业生涯充满遗憾，但他留下的进球和故事，成为新闻男足最珍贵的记忆。',
      bad: '如果肖潇在困难中放弃，新闻男足也许会失去他们最早的英雄。但历史选择了坚持。'
    }
  },

  // ========== 吾尔肯：传奇14号 ==========
  {
    characterId: 'wuerken',
    title: '光明勇敢的战士',
    scenes: [
      {
        id: 'wuerken_1',
        background: 'campus',
        dialogs: [
          { speaker: '旁白', text: '2019年秋天，军训结束后的夜晚，一个新疆少年独自在操场练球。', emotion: 'neutral' },
          { speaker: '戴红焰', text: '小伙子，球踢得不错啊！想不想进校队？', emotion: 'kind' },
          { speaker: '吾尔肯', text: '当然想！', emotion: 'excited' },
          { speaker: '旁白', text: '就这样，吾尔肯进入华科校队，也改变了新闻男足的命运。', emotion: 'significant' }
        ],
        choices: [
          { id: 'wk_c1_a', text: '加入校队，同时代表新闻男足出战', nextSceneId: 'wuerken_2a', weight: 1 },
          { id: 'wk_c1_b', text: '先专注校队，院队比赛看情况', nextSceneId: 'wuerken_2b', weight: 0 },
          { id: 'wk_c1_c', text: '觉得院队水平太低，不想浪费时间', nextSceneId: 'wuerken_2c', weight: -1 }
        ]
      },
      {
        id: 'wuerken_2a',
        background: 'football_field',
        dialogs: [
          { speaker: '旁白', text: '2019年，吾尔肯随华科校队夺得湖北省大学生足球联赛冠军。', emotion: 'excited' },
          { speaker: '吾尔肯', text: '这只是开始。新闻男足，我来了。', emotion: 'determined' }
        ],
        nextSceneId: 'wuerken_3'
      },
      {
        id: 'wuerken_2b',
        background: 'football_field',
        dialogs: [
          { speaker: '旁白', text: '吾尔肯在校队表现出色，但很少参加院队比赛。', emotion: 'neutral' },
          { speaker: '吾尔肯', text: '也许我该多为新闻男足做点什么。', emotion: 'conflicted' }
        ],
        nextSceneId: 'wuerken_3'
      },
      {
        id: 'wuerken_2c',
        background: 'locker_room',
        dialogs: [
          { speaker: '旁白', text: '吾尔肯与新闻男足渐行渐远。', emotion: 'sad' },
          { speaker: '吾尔肯', text: '我一个人强，又有什么意义？', emotion: 'discouraged' }
        ],
        nextSceneId: 'wuerken_3'
      },
      {
        id: 'wuerken_3',
        background: 'football_field',
        dialogs: [
          { speaker: '旁白', text: '2022年华工杯，新闻对阵化学。吾尔肯上演任意球帽子戏法。', emotion: 'excited' },
          { speaker: '吾尔肯', text: '黄沙百战穿金甲，不破楼兰终不还！', emotion: 'passionate' },
          { speaker: '旁白', text: '那一年，新闻男足首次杀入四强。', emotion: 'significant' }
        ],
        nextSceneId: 'wuerken_4'
      },
      {
        id: 'wuerken_4',
        background: 'football_field',
        dialogs: [
          { speaker: '旁白', text: '2024年华工杯，新闻2:5不敌外国语。吾尔肯情绪失控，被红牌罚下。', emotion: 'angry' },
          { speaker: '吾尔肯', text: '我们本可以走更远的……', emotion: 'emotional' },
          { speaker: '陈子豪', text: '愤怒改变不了结果，但我们可以改变未来。', emotion: 'wise' }
        ],
        choices: [
          { id: 'wk_c4_a', text: '反思自己，从此每场比赛后说“戒骄戒躁”', nextSceneId: 'wuerken_5a', weight: 1 },
          { id: 'wk_c4_b', text: '把愤怒藏在心里，用训练发泄', nextSceneId: 'wuerken_5b', weight: 0 },
          { id: 'wk_c4_c', text: '对队友失去耐心，觉得他们跟不上自己', nextSceneId: 'wuerken_5c', weight: -1 }
        ]
      },
      {
        id: 'wuerken_5a',
        background: 'football_field',
        dialogs: [
          { speaker: '旁白', text: '2026年，吾尔肯的谢幕之年。', emotion: 'significant' },
          { speaker: '吾尔肯', text: '3:3中欧，我帽子戏法。但更重要的是，我们没有放弃。', emotion: 'grateful' },
          { speaker: '旁白', text: '十年落幕，新闻男足夺得华工杯乙组季军，创造历史最佳战绩。', emotion: 'significant' },
          { speaker: '吾尔肯', text: '这十年，值了。', emotion: 'nostalgic' }
        ],
        endingHint: 'good'
      },
      {
        id: 'wuerken_5b',
        background: 'football_field',
        dialogs: [
          { speaker: '旁白', text: '2026年，吾尔肯用沉默的拼搏完成了自己的谢幕。', emotion: 'neutral' },
          { speaker: '吾尔肯', text: '有时候，行动比语言更有力量。', emotion: 'calm' }
        ],
        endingHint: 'normal'
      },
      {
        id: 'wuerken_5c',
        background: 'locker_room',
        dialogs: [
          { speaker: '旁白', text: '吾尔肯与队友的关系日渐疏远，最终带着遗憾离开。', emotion: 'sad' },
          { speaker: '吾尔肯', text: '一个人的强大，撑不起一支球队。', emotion: 'sad' }
        ],
        endingHint: 'bad'
      }
    ],
    endings: {
      good: '吾尔肯从校队新星成长为新闻男足的传奇。他的七年，连接了两个巅峰时代，也诠释了什么是真正的领袖。',
      normal: '吾尔肯的个人能力毋庸置疑，但他与球队的关系始终带着一丝孤独。',
      bad: '如果最强的球员无法与球队共情，再耀眼的天赋也会留下遗憾。'
    }
  },

  // ========== 赵凌冬：第一任教练 ==========
  {
    characterId: 'zhaolingdong',
    title: '把散兵游勇变成球队',
    scenes: [
      {
        id: 'zhaolingdong_1',
        background: 'gym',
        dialogs: [
          { speaker: '旁白', text: '2020年，新闻男足迎来了历史上第一位真正意义上的教练——赵凌冬。', emotion: 'significant' },
          { speaker: '赵凌冬', text: '你们有热情，但缺少体系。从今天起，我们像一支真正的球队那样训练。', emotion: 'serious' },
          { speaker: '刘俊哲', text: '教练，我们基础很差，能练出来吗？', emotion: 'conflicted' }
        ],
        choices: [
          { id: 'zld_c1_a', text: '从最基础的体能和传接球开始，稳扎稳打', nextSceneId: 'zhaolingdong_2a', weight: 1 },
          { id: 'zld_c1_b', text: '直接上战术，让大家先知道怎么踢', nextSceneId: 'zhaolingdong_2b', weight: 0 },
          { id: 'zld_c1_c', text: '主要靠友谊赛，以赛代练', nextSceneId: 'zhaolingdong_2c', weight: -1 }
        ]
      },
      {
        id: 'zhaolingdong_2a',
        background: 'gym',
        dialogs: [
          { speaker: '旁白', text: '基础训练枯燥而漫长，但球员们开始真正理解足球。', emotion: 'neutral' },
          { speaker: '赵凌冬', text: '传接球都接不稳，谈什么战术？', emotion: 'serious' }
        ],
        nextSceneId: 'zhaolingdong_3'
      },
      {
        id: 'zhaolingdong_2b',
        background: 'football_field',
        dialogs: [
          { speaker: '旁白', text: '战术让大家耳目一新，但执行起来漏洞百出。', emotion: 'tense' },
          { speaker: '赵凌冬', text: '回去继续练基础。', emotion: 'serious' }
        ],
        nextSceneId: 'zhaolingdong_3'
      },
      {
        id: 'zhaolingdong_2c',
        background: 'football_field',
        dialogs: [
          { speaker: '旁白', text: '友谊赛输多赢少，球队依然缺乏体系。', emotion: 'discouraged' },
          { speaker: '赵凌冬', text: '这样踢，永远走不远。', emotion: 'serious' }
        ],
        nextSceneId: 'zhaolingdong_3'
      },
      {
        id: 'zhaolingdong_3',
        background: 'football_field',
        dialogs: [
          { speaker: '旁白', text: '2022年华工杯，新闻男足历史性杀入四强。', emotion: 'excited' },
          { speaker: '赵凌冬', text: '他们已经顶不住了，继续压上去！', emotion: 'passionate' },
          { speaker: '旁白', text: '半决赛点球失利，赵凌冬在场边低下了头，泪水滑落。', emotion: 'emotional' }
        ],
        choices: [
          { id: 'zld_c3_a', text: '告诉队员：这就是成长，明年再来', nextSceneId: 'zhaolingdong_4a', weight: 1 },
          { id: 'zld_c3_b', text: '独自承担失利的责任，沉默离开', nextSceneId: 'zhaolingdong_4b', weight: 0 },
          { id: 'zld_c3_c', text: '责怪球员执行不力，气氛降至冰点', nextSceneId: 'zhaolingdong_4c', weight: -1 }
        ]
      },
      {
        id: 'zhaolingdong_4a',
        background: 'campus',
        dialogs: [
          { speaker: '旁白', text: '2023年，黄金一代谢幕，赵凌冬也毕业了。', emotion: 'nostalgic' },
          { speaker: '赵凌冬', text: '我把这支球队带到这里，后面的路，交给你们了。', emotion: 'grateful' },
          { speaker: '旁白', text: '他留下的战术理念和团队文化，成为新闻男足最宝贵的财富。', emotion: 'significant' }
        ],
        endingHint: 'good'
      },
      {
        id: 'zhaolingdong_4b',
        background: 'locker_room',
        dialogs: [
          { speaker: '旁白', text: '赵凌冬带着遗憾离开，但他的训练方法被保留了下来。', emotion: 'sad' },
          { speaker: '赵凌冬', text: '如果我再严厉一点，结果会不会不同？', emotion: 'nostalgic' }
        ],
        endingHint: 'normal'
      },
      {
        id: 'zhaolingdong_4c',
        background: 'locker_room',
        dialogs: [
          { speaker: '旁白', text: '赵凌冬与球员关系破裂，球队陷入分裂。', emotion: 'angry' },
          { speaker: '赵凌冬', text: '我付出了那么多，为什么他们不明白？', emotion: 'emotional' }
        ],
        endingHint: 'bad'
      }
    ],
    endings: {
      good: '赵凌冬把新闻男足从一支业余散兵，锻造成了一支有战术、有信念的球队。他是黄金一代真正的奠基人。',
      normal: '赵凌冬的执教让新闻男足脱胎换骨，但点球失利的遗憾，始终萦绕在他心头。',
      bad: '如果教练无法与球员建立信任，再先进的战术也只是空中楼阁。'
    }
  },

  // ========== 杨云帆：重建队长 ==========
  {
    characterId: 'yangyunfan',
    title: '在废墟中重建',
    scenes: [
      {
        id: 'yangyunfan_1',
        background: 'campus',
        dialogs: [
          { speaker: '旁白', text: '2023年，黄金一代谢幕，新闻男足陷入人才断档。', emotion: 'sad' },
          { speaker: '杨云帆', text: '人不够，就我们九个先练起来。', emotion: 'determined' },
          { speaker: '谭琦', text: '但是大二大三加起来都没几个人，华工杯怎么办？', emotion: 'conflicted' }
        ],
        choices: [
          { id: 'yyf_c1_a', text: '主动召集2023级新生，从零开始建队', nextSceneId: 'yangyunfan_2a', weight: 1 },
          { id: 'yyf_c1_b', text: '先凑齐人数报名，边踢边找办法', nextSceneId: 'yangyunfan_2b', weight: 0 },
          { id: 'yyf_c1_c', text: '觉得没希望，把队长担子推给别人', nextSceneId: 'yangyunfan_2c', weight: -1 }
        ]
      },
      {
        id: 'yangyunfan_2a',
        background: 'gym',
        dialogs: [
          { speaker: '旁白', text: '2023级九人自发组队，参加新生杯。', emotion: 'hopeful' },
          { speaker: '杨云帆', text: '我们2:0赢环境，打破了不胜环境的记录！', emotion: 'excited' }
        ],
        nextSceneId: 'yangyunfan_3'
      },
      {
        id: 'yangyunfan_2b',
        background: 'football_field',
        dialogs: [
          { speaker: '旁白', text: '球队勉强凑齐阵容，但默契不足。', emotion: 'tense' },
          { speaker: '杨云帆', text: '先活下去，再谈踢好。', emotion: 'serious' }
        ],
        nextSceneId: 'yangyunfan_3'
      },
      {
        id: 'yangyunfan_2c',
        background: 'locker_room',
        dialogs: [
          { speaker: '旁白', text: '球队士气低落，重建迟迟无法启动。', emotion: 'discouraged' },
          { speaker: '杨云帆', text: '也许我真的不是当队长的料。', emotion: 'sad' }
        ],
        nextSceneId: 'yangyunfan_3'
      },
      {
        id: 'yangyunfan_3',
        background: 'football_field',
        dialogs: [
          { speaker: '旁白', text: '2024年华工杯，新闻2:5不敌外国语，再次惨痛出局。', emotion: 'angry' },
          { speaker: '杨云帆', text: '我们荒废了几百天，不配赢。', emotion: 'emotional' },
          { speaker: '旁白', text: '但这次失败，反而点燃了球队的斗志。', emotion: 'hopeful' }
        ],
        nextSceneId: 'yangyunfan_4'
      },
      {
        id: 'yangyunfan_4',
        background: 'football_field',
        dialogs: [
          { speaker: '旁白', text: '2025年华工杯，新闻男足绝境突围，杀入淘汰赛。', emotion: 'excited' },
          { speaker: '杨云帆', text: '我们3:1软件，突围了！', emotion: 'excited' },
          { speaker: '旁白', text: '但在训练中，杨云帆膝盖撞上木桩，重伤休学一年。', emotion: 'sad' }
        ],
        choices: [
          { id: 'yyf_c4_a', text: '积极治疗，坚信一年后能回到球场', nextSceneId: 'yangyunfan_5a', weight: 1 },
          { id: 'yyf_c4_b', text: '把队长职责交给队友，安心养伤', nextSceneId: 'yangyunfan_5b', weight: 0 },
          { id: 'yyf_c4_c', text: '因伤消沉，渐渐远离球队', nextSceneId: 'yangyunfan_5c', weight: -1 }
        ]
      },
      {
        id: 'yangyunfan_5a',
        background: 'campus',
        dialogs: [
          { speaker: '旁白', text: '2026年，杨云帆伤愈归来，见证了球队十周年季军。', emotion: 'significant' },
          { speaker: '杨云帆', text: '我没能在场上，但我一直在。', emotion: 'grateful' }
        ],
        endingHint: 'good'
      },
      {
        id: 'yangyunfan_5b',
        background: 'campus',
        dialogs: [
          { speaker: '旁白', text: '杨云帆把球队交给了王楷硕，自己在场边默默支持。', emotion: 'neutral' },
          { speaker: '杨云帆', text: '他们会比我做得更好。', emotion: 'hopeful' }
        ],
        endingHint: 'normal'
      },
      {
        id: 'yangyunfan_5c',
        background: 'night_city',
        dialogs: [
          { speaker: '旁白', text: '杨云帆带着遗憾离开了足球场，那段重建岁月成了他心中未完成的梦。', emotion: 'sad' },
          { speaker: '杨云帆', text: '如果我没受伤，结局会不会不同？', emotion: 'nostalgic' }
        ],
        endingHint: 'bad'
      }
    ],
    endings: {
      good: '杨云帆在最艰难的时刻扛起球队，虽然伤病让他错过十周年的赛场，但他的精神成为重建时期最亮的火把。',
      normal: '杨云帆把队长袖标交给了下一代，自己成为了球队背后的支持者。',
      bad: '伤病击垮了杨云帆的斗志，重建时期失去了一位本可以带领球队走得更远的队长。'
    }
  },

  // ========== 王楷硕：新队长 ==========
  {
    characterId: 'wangkaishuo',
    title: '十年圆梦',
    scenes: [
      {
        id: 'wangkaishuo_1',
        background: 'football_field',
        dialogs: [
          { speaker: '旁白', text: '2024年新生杯，新闻男足被分入死亡之组。', emotion: 'tense' },
          { speaker: '王楷硕', text: '每一场都少打一人，但我们不能认输。', emotion: 'determined' },
          { speaker: '旁白', text: '最终三场惨败，王楷硕却用进球证明了自己的天赋。', emotion: 'neutral' }
        ],
        choices: [
          { id: 'wks_c1_a', text: '把惨败当作动力，更加刻苦训练', nextSceneId: 'wangkaishuo_2a', weight: 1 },
          { id: 'wks_c1_b', text: '认为自己已经尽力，等待机会', nextSceneId: 'wangkaishuo_2b', weight: 0 },
          { id: 'wks_c1_c', text: '对自己失去信心，逐渐淡出', nextSceneId: 'wangkaishuo_2c', weight: -1 }
        ]
      },
      {
        id: 'wangkaishuo_2a',
        background: 'gym',
        dialogs: [
          { speaker: '旁白', text: '王楷硕成为训练最积极的人之一。', emotion: 'hopeful' },
          { speaker: '王楷硕', text: '我一个人改变不了比赛，但我可以让身边的人变强。', emotion: 'determined' }
        ],
        nextSceneId: 'wangkaishuo_3'
      },
      {
        id: 'wangkaishuo_2b',
        background: 'gym',
        dialogs: [
          { speaker: '旁白', text: '王楷硕等待机会，但球队迟迟无法形成体系。', emotion: 'neutral' },
          { speaker: '王楷硕', text: '也许我需要更主动一点。', emotion: 'conflicted' }
        ],
        nextSceneId: 'wangkaishuo_3'
      },
      {
        id: 'wangkaishuo_2c',
        background: 'locker_room',
        dialogs: [
          { speaker: '旁白', text: '王楷硕的离开让球队失去了一颗冉冉升起的新星。', emotion: 'sad' },
          { speaker: '王楷硕', text: '也许，我一开始就不该来。', emotion: 'discouraged' }
        ],
        nextSceneId: 'wangkaishuo_3'
      },
      {
        id: 'wangkaishuo_3',
        background: 'football_field',
        dialogs: [
          { speaker: '旁白', text: '2025年华工杯，新闻2:1复仇外国语。王楷硕打入制胜球。', emotion: 'excited' },
          { speaker: '王楷硕', text: '去年他们送我们出局，今年我们送他们回家。', emotion: 'passionate' },
          { speaker: '旁白', text: '那一天，王楷硕真正成为了球队的领袖。', emotion: 'significant' }
        ],
        nextSceneId: 'wangkaishuo_4'
      },
      {
        id: 'wangkaishuo_4',
        background: 'football_field',
        dialogs: [
          { speaker: '旁白', text: '2026年，王楷硕作为队长带领新闻男足征战十周年华工杯。', emotion: 'significant' },
          { speaker: '王楷硕', text: '今年是十周年，我们要创造历史。', emotion: 'determined' },
          { speaker: '旁白', text: '半决赛0:6不敌计算机，冲甲梦碎。但季军赛，他们再次站起。', emotion: 'emotional' }
        ],
        choices: [
          { id: 'wks_c4_a', text: '赛前动员全队：为十周年，为所有相信我们的人', nextSceneId: 'wangkaishuo_5a', weight: 1 },
          { id: 'wks_c4_b', text: '默默承担压力，用行动带领球队', nextSceneId: 'wangkaishuo_5b', weight: 0 },
          { id: 'wks_c4_c', text: '被半决赛击垮，季军赛前失去信心', nextSceneId: 'wangkaishuo_5c', weight: -1 }
        ]
      },
      {
        id: 'wangkaishuo_5a',
        background: 'trophy_room',
        dialogs: [
          { speaker: '旁白', text: '新闻男足5:2战胜中欧，夺得华工杯乙组季军，创造队史最佳战绩。', emotion: 'excited' },
          { speaker: '王楷硕', text: '十年，我们做到了。这不是终点，是新的开始。', emotion: 'grateful' }
        ],
        endingHint: 'good'
      },
      {
        id: 'wangkaishuo_5b',
        background: 'trophy_room',
        dialogs: [
          { speaker: '旁白', text: '新闻男足夺得季军，王楷硕在领奖台上沉默而坚定。', emotion: 'neutral' },
          { speaker: '王楷硕', text: '我们做到了，虽然没人知道这一路有多难。', emotion: 'calm' }
        ],
        endingHint: 'normal'
      },
      {
        id: 'wangkaishuo_5c',
        background: 'locker_room',
        dialogs: [
          { speaker: '旁白', text: '新闻男足季军赛失利，十年征程留下遗憾。', emotion: 'sad' },
          { speaker: '王楷硕', text: '对不起，我没能在最后一场带领你们。', emotion: 'emotional' }
        ],
        endingHint: 'bad'
      }
    ],
    endings: {
      good: '王楷硕从新生杯惨败中成长起来，最终作为队长带领新闻男足在十周年创造历史最佳战绩。他是新一代的领袖。',
      normal: '王楷硕完成了队长的职责，但十周年的辉煌背后，是他独自承担的巨大压力。',
      bad: '如果新队长无法在失败中站起，新闻男足的十周年或许会以一种遗憾的方式结束。'
    }
  }
];

export const getStoryByCharacterId = (characterId: string): StoryLine | undefined =>
  stories.find((story) => story.characterId === characterId);

export const getSceneById = (story: StoryLine, sceneId: string): Scene | undefined =>
  story.scenes.find((scene) => scene.id === sceneId);
