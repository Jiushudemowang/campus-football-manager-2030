#!/usr/bin/env python3
"""Append 5 new storylines to stories.ts"""
import re

filepath = '//wsl.localhost/Ubuntu/home/chengchen/cc_work/新闻男足动画游戏/src/data/stories.ts'
with open(filepath, 'r', encoding='utf-8') as f:
    content = f.read()

insert_pos = content.rfind('];')

# New storylines to insert
new_storylines = """
  {
    characterId: 'liujunzhe',
    title: '点球手的勇气',
    scenes: [
      {
        id: 'liujunzhe_1',
        background: 'campus',
        dialogs: [
          { speaker: '旁白', text: '2018年秋天，刘俊哲加入了新闻男足。', emotion: 'neutral' },
          { speaker: '刘俊哲', text: '这就是新闻男足！好多人啊！', emotion: 'excited' },
          { speaker: '欧翔', text: '欢迎你！我们正在发展壮大！', emotion: 'happy' },
          { speaker: '旁白', text: '刘俊哲很快融入了球队，展现出了出色的中场组织能力。', emotion: 'neutral' }
        ],
        choices: [
          { id: 'liujunzhe_choice_1', text: '主动与队友交流配合！', nextSceneId: 'liujunzhe_2a', weight: 1 },
          { id: 'liujunzhe_choice_2', text: '先在场边观察学习！', nextSceneId: 'liujunzhe_2b', weight: 0 }
        ]
      },
      {
        id: 'liujunzhe_2a',
        background: 'football_field',
        dialogs: [
          { speaker: '刘俊哲', text: '传球！看我的！', emotion: 'confident' },
          { speaker: '旁白', text: '刘俊哲精准的长传找到了前场的肖潇，一次漂亮的配合！', emotion: 'excited' },
          { speaker: '肖潇', text: '好球！俊哲你的传球太准了！', emotion: 'happy' }
        ],
        nextSceneId: 'liujunzhe_3'
      },
      {
        id: 'liujunzhe_2b',
        background: 'football_field',
        dialogs: [
          { speaker: '刘俊哲', text: '（默默观察）他们的跑位习惯是...', emotion: 'focused' },
          { speaker: '旁白', text: '刘俊哲花了时间去了解每个队友的特点。', emotion: 'neutral' },
          { speaker: '欧翔', text: '俊哲，你观察得真仔细！上场试试？', emotion: 'encouraging' }
        ],
        nextSceneId: 'liujunzhe_3'
      },
      {
        id: 'liujunzhe_3',
        background: 'football_field',
        dialogs: [
          { speaker: '旁白', text: '2021年，黄金一代迎来了巅峰赛季。', emotion: 'neutral' },
          { speaker: '赵凌冬', text: '刘俊哲，你是我们中场的核心。相信你的判断。', emotion: 'encouraging' },
          { speaker: '刘俊哲', text: '教练放心！我会把中场控制好的！', emotion: 'determined' },
          { speaker: '旁白', text: '新闻男足一路过关斩将，小组赛出线了！', emotion: 'excited' }
        ],
        nextSceneId: 'liujunzhe_4'
      },
      {
        id: 'liujunzhe_4',
        background: 'football_field',
        dialogs: [
          { speaker: '旁白', text: '2022年华工杯半决赛，对手是自动化学院。90分钟还是0-0。', emotion: 'tense' },
          { speaker: '赵凌冬', text: '进入点球大战了。谁第一个来？', emotion: 'serious' },
          { speaker: '旁白', text: '全队沉默了片刻...', emotion: 'tense' }
        ],
        choices: [
          { id: 'liujunzhe_choice_3', text: '让我来！我第一个罚！', nextSceneId: 'liujunzhe_5a', weight: 1 },
          { id: 'liujunzhe_choice_4', text: '让吾尔肯先来吧...', nextSceneId: 'liujunzhe_5b', weight: 0 }
        ]
      },
      {
        id: 'liujunzhe_5a',
        background: 'football_field',
        dialogs: [
          { speaker: '刘俊哲', text: '让我来！我不怕！', emotion: 'confident' },
          { speaker: '赵凌冬', text: '好！相信你！', emotion: 'encouraging' },
          { speaker: '旁白', text: '刘俊哲站上十二码点，全场寂静...', emotion: 'tense' },
          { speaker: '解说', text: '射门——球进了！！刘俊哲！', emotion: 'excited' },
          { speaker: '旁白', text: '虽然最终点球大战1-3告负，但这份勇气感染了全队。', emotion: 'significant' }
        ],
        nextSceneId: 'liujunzhe_6'
      },
      {
        id: 'liujunzhe_5b',
        background: 'football_field',
        dialogs: [
          { speaker: '刘俊哲', text: '吾尔肯学长，你经验丰富，你先来吧。', emotion: 'respectful' },
          { speaker: '吾尔肯', text: '好，我来。', emotion: 'confident' },
          { speaker: '旁白', text: '吾尔肯稳稳将球罚进。刘俊哲在第二顺位也成功罚进...', emotion: 'neutral' },
          { speaker: '旁白', text: '但最终球队还是1-3输掉了点球大战。', emotion: 'sad' }
        ],
        nextSceneId: 'liujunzhe_6'
      },
      {
        id: 'liujunzhe_6',
        background: 'locker_room',
        dialogs: [
          { speaker: '旁白', text: '虽然输了，但更衣室里没有人低头。', emotion: 'neutral' },
          { speaker: '刘俊哲', text: '大家别灰心！我们创造了历史！第一次进四强！', emotion: 'encouraging' },
          { speaker: '肖潇', text: '俊哲说得对！明年我们会更强！', emotion: 'determined' },
          { speaker: '旁白', text: '2023年，刘俊哲毕业了。', emotion: 'nostalgic' }
        ],
        choices: [
          { id: 'liujunzhe_choice_5', text: '为球队骄傲！', nextSceneId: 'liujunzhe_end_good', weight: 2 },
          { id: 'liujunzhe_choice_6', text: '默默祝福下一代！', nextSceneId: 'liujunzhe_end_normal', weight: 0 }
        ]
      },
      {
        id: 'liujunzhe_end_good',
        background: 'football_field',
        endingHint: 'good',
        dialogs: [
          { speaker: '旁白', text: '刘俊哲毕业后依然关注着新闻男足，他的点球精神一直激励着后来的队员。', emotion: 'nostalgic' },
          { speaker: '刘俊哲', text: '新闻男足，永远是我的骄傲！', emotion: 'grateful' }
        ]
      },
      {
        id: 'liujunzhe_end_normal',
        background: 'football_field',
        endingHint: 'normal',
        dialogs: [
          { speaker: '旁白', text: '刘俊哲完成了自己的使命——成为黄金一代的可靠中场。', emotion: 'neutral' },
          { speaker: '刘俊哲', text: '这段经历，值得一辈子回忆。', emotion: 'nostalgic' }
        ]
      }
    ],
    endings: {
      good: '勇气传承：刘俊哲的点球精神成为了新闻男足永远的财富，激励着每一个后来者！',
      normal: '光荣退役：作为黄金一代的核心中场，完成了自己的使命。',
      bad: '遗憾：关键点球失误，但这段经历让他更加强大。'
    }
  }
"""

# Insert before ];
new_content = content[:insert_pos] + ',\n' + new_storylines.strip() + '\n];'

with open(filepath, 'w', encoding='utf-8') as f:
    f.write(new_content)

print('Done!')
