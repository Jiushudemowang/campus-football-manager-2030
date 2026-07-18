#!/usr/bin/env python3
"""Generate and append 5 new storylines to stories.ts"""

STORYLINES = [
    # liujunzhe
    {
        "characterId": "liujunzhe",
        "title": "点球手的勇气",
        "scenes": [
            {
                "id": "liujunzhe_1",
                "background": "campus",
                "dialogs": [
                    {"speaker": "旁白", "text": "2018年秋天，刘俊哲加入了新闻男足。", "emotion": "neutral"},
                    {"speaker": "刘俊哲", "text": "这就是新闻男足！好多人啊！", "emotion": "excited"},
                    {"speaker": "欧翔", "text": "欢迎你！我们正在发展壮大！", "emotion": "happy"},
                    {"speaker": "旁白", "text": "刘俊哲很快融入了球队，展现出了出色的中场组织能力。", "emotion": "neutral"},
                ],
                "choices": [
                    {"id": "liujunzhe_choice_1", "text": "主动与队友交流配合！", "nextSceneId": "liujunzhe_2a", "weight": 1},
                    {"id": "liujunzhe_choice_2", "text": "先在场边观察学习！", "nextSceneId": "liujunzhe_2b", "weight": 0},
                ],
            },
            {
                "id": "liujunzhe_2a",
                "background": "football_field",
                "dialogs": [
                    {"speaker": "刘俊哲", "text": "传球！看我的！", "emotion": "confident"},
                    {"speaker": "旁白", "text": "刘俊哲精准的长传找到了前场的肖潇，一次漂亮的配合！", "emotion": "excited"},
                    {"speaker": "肖潇", "text": "好球！俊哲你的传球太准了！", "emotion": "happy"},
                ],
                "nextSceneId": "liujunzhe_3",
            },
            {
                "id": "liujunzhe_2b",
                "background": "football_field",
                "dialogs": [
                    {"speaker": "刘俊哲", "text": "（默默观察）他们的跑位习惯是...", "emotion": "focused"},
                    {"speaker": "旁白", "text": "刘俊哲花了时间去了解每个队友的特点。", "emotion": "neutral"},
                    {"speaker": "欧翔", "text": "俊哲，观察得真仔细！上场试试？", "emotion": "encouraging"},
                ],
                "nextSceneId": "liujunzhe_3",
            },
            {
                "id": "liujunzhe_3",
                "background": "football_field",
                "dialogs": [
                    {"speaker": "旁白", "text": "2021年，黄金一代迎来了巅峰赛季。", "emotion": "neutral"},
                    {"speaker": "赵凌冬", "text": "刘俊哲，你是我们中场的核心。相信你的判断。", "emotion": "encouraging"},
                    {"speaker": "刘俊哲", "text": "教练放心！我会把中场控制好的！", "emotion": "determined"},
                    {"speaker": "旁白", "text": "新闻男足一路过关斩将，小组赛出线了！", "emotion": "excited"},
                ],
                "nextSceneId": "liujunzhe_4",
            },
            {
                "id": "liujunzhe_4",
                "background": "football_field",
                "dialogs": [
                    {"speaker": "旁白", "text": "2022年华工杯半决赛，对手是自动化学院。90分钟还是0-0。", "emotion": "tense"},
                    {"speaker": "赵凌冬", "text": "进入点球大战了。谁第一个来？", "emotion": "serious"},
                    {"speaker": "旁白", "text": "全队沉默了片刻...", "emotion": "tense"},
                ],
                "choices": [
                    {"id": "liujunzhe_choice_3", "text": "让我来！我第一个罚！", "nextSceneId": "liujunzhe_5a", "weight": 1},
                    {"id": "liujunzhe_choice_4", "text": "让吾尔肯先来吧...", "nextSceneId": "liujunzhe_5b", "weight": 0},
                ],
            },
            {
                "id": "liujunzhe_5a",
                "background": "football_field",
                "dialogs": [
                    {"speaker": "刘俊哲", "text": "让我来！我不怕！", "emotion": "confident"},
                    {"speaker": "赵凌冬", "text": "好！相信你！", "emotion": "encouraging"},
                    {"speaker": "旁白", "text": "刘俊哲站上十二码点，全场寂静...", "emotion": "tense"},
                    {"speaker": "解说", "text": "射门——球进了！！刘俊哲！", "emotion": "excited"},
                    {"speaker": "旁白", "text": "虽然点球大战最终1-3告负，但这份勇气感染了全队。", "emotion": "significant"},
                ],
                "nextSceneId": "liujunzhe_6",
            },
            {
                "id": "liujunzhe_5b",
                "background": "football_field",
                "dialogs": [
                    {"speaker": "刘俊哲", "text": "吾尔肯学长，你经验丰富，你先来吧。", "emotion": "respectful"},
                    {"speaker": "吾尔肯", "text": "好，我来。", "emotion": "confident"},
                    {"speaker": "旁白", "text": "两人都稳稳罚进，但球队还是1-3输了。", "emotion": "sad"},
                ],
                "nextSceneId": "liujunzhe_6",
            },
            {
                "id": "liujunzhe_6",
                "background": "locker_room",
                "dialogs": [
                    {"speaker": "旁白", "text": "虽然输了，但更衣室里没有人低头。", "emotion": "neutral"},
                    {"speaker": "刘俊哲", "text": "大家别灰心！我们创造了历史！第一次进四强！", "emotion": "encouraging"},
                    {"speaker": "肖潇", "text": "俊哲说得对！明年我们会更强！", "emotion": "determined"},
                    {"speaker": "旁白", "text": "2023年，刘俊哲毕业了。", "emotion": "nostalgic"},
                ],
                "choices": [
                    {"id": "liujunzhe_choice_5", "text": "为球队骄傲！", "nextSceneId": "liujunzhe_end_good", "weight": 2},
                    {"id": "liujunzhe_choice_6", "text": "默默祝福下一代！", "nextSceneId": "liujunzhe_end_normal", "weight": 0},
                ],
            },
            {"id": "liujunzhe_end_good", "background": "football_field", "endingHint": "good", "dialogs": [
                {"speaker": "旁白", "text": "刘俊哲的点球精神一直激励着后来的队员。", "emotion": "nostalgic"},
                {"speaker": "刘俊哲", "text": "新闻男足，永远是我的骄傲！", "emotion": "grateful"},
            ]},
            {"id": "liujunzhe_end_normal", "background": "football_field", "endingHint": "normal", "dialogs": [
                {"speaker": "旁白", "text": "刘俊哲完成了自己的使命。", "emotion": "neutral"},
                {"speaker": "刘俊哲", "text": "这段经历，值得一辈子回忆。", "emotion": "nostalgic"},
            ]},
        ],
        "endings": {
            "good": "勇气传承：刘俊哲的点球精神成为了新闻男足永远的财富，激励着每一个后来者！",
            "normal": "光荣退役：作为黄金一代的核心中场，完成了自己的使命。",
            "bad": "遗憾：关键点球失误，但这段经历让他更加强大。",
        },
    },
    # chenzihao
    {
        "characterId": "chenzihao",
        "title": "东操的歌声",
        "scenes": [
            {
                "id": "chenzihao_1",
                "background": "campus",
                "dialogs": [
                    {"speaker": "旁白", "text": "2023年8月30日的夜晚，东操传来悠扬的歌声。", "emotion": "neutral"},
                    {"speaker": "陈子豪", "text": "（轻声哼唱）...夜色多温柔...", "emotion": "calm"},
                    {"speaker": "旁白", "text": "一个新生被歌声吸引，停下了脚步。", "emotion": "neutral"},
                ],
                "choices": [
                    {"id": "chenzihao_choice_1", "text": "主动过去打招呼！", "nextSceneId": "chenzihao_2a", "weight": 1},
                    {"id": "chenzihao_choice_2", "text": "继续唱，等他过来！", "nextSceneId": "chenzihao_2b", "weight": 0},
                ],
            },
            {
                "id": "chenzihao_2a",
                "background": "campus",
                "dialogs": [
                    {"speaker": "陈子豪", "text": "同学，你也喜欢音乐吗？", "emotion": "kind"},
                    {"speaker": "吴杨楚涵", "text": "学长你唱得太好听了！我是新闻学院的新生！", "emotion": "excited"},
                    {"speaker": "陈子豪", "text": "新闻学院的！要不要加入新闻男足？", "emotion": "happy"},
                    {"speaker": "吴杨楚涵", "text": "足球？我不太会踢...", "emotion": "nervous"},
                ],
                "nextSceneId": "chenzihao_3",
            },
            {
                "id": "chenzihao_2b",
                "background": "campus",
                "dialogs": [
                    {"speaker": "旁白", "text": "陈子豪继续唱着，歌声在夜空中回荡。", "emotion": "calm"},
                    {"speaker": "吴杨楚涵", "text": "（走近）学长，你唱得真好...", "emotion": "nervous"},
                    {"speaker": "陈子豪", "text": "哈哈谢谢你！你是新生吗？", "emotion": "kind"},
                ],
                "nextSceneId": "chenzihao_3",
            },
            {
                "id": "chenzihao_3",
                "background": "campus",
                "dialogs": [
                    {"speaker": "陈子豪", "text": "不会踢球没关系！我们需要宣传、记录的人才。", "emotion": "encouraging"},
                    {"speaker": "吴杨楚涵", "text": "记录球队的故事...这很有意思！", "emotion": "excited"},
                    {"speaker": "陈子豪", "text": "太好了！新闻男足又多了一员！", "emotion": "happy"},
                    {"speaker": "旁白", "text": "从那一天起，吴杨楚涵成了新闻男足的史官。", "emotion": "significant"},
                ],
                "choices": [
                    {"id": "chenzihao_choice_3", "text": "多关心新人成长！", "nextSceneId": "chenzihao_4a", "weight": 1},
                    {"id": "chenzihao_choice_4", "text": "让他自己摸索！", "nextSceneId": "chenzihao_4b", "weight": -1},
                ],
            },
            {
                "id": "chenzihao_4a",
                "background": "campus",
                "dialogs": [
                    {"speaker": "陈子豪", "text": "楚涵，有什么需要帮忙的吗？", "emotion": "kind"},
                    {"speaker": "吴杨楚涵", "text": "学长！我写了几篇推送，你帮我看看？", "emotion": "excited"},
                    {"speaker": "陈子豪", "text": "写得真好！你果然是个人才！", "emotion": "happy"},
                ],
                "nextSceneId": "chenzihao_5",
            },
            {
                "id": "chenzihao_4b",
                "background": "campus",
                "dialogs": [
                    {"speaker": "旁白", "text": "陈子豪忙于学业，与球队联系渐渐少了。", "emotion": "neutral"},
                    {"speaker": "吴杨楚涵", "text": "（自己摸索）公众号应该怎么写呢...", "emotion": "conflicted"},
                ],
                "nextSceneId": "chenzihao_5",
            },
            {
                "id": "chenzihao_5",
                "background": "football_field",
                "dialogs": [
                    {"speaker": "旁白", "text": "2026年十周年，陈子豪回到了球场。", "emotion": "nostalgic"},
                    {"speaker": "陈子豪", "text": "看到球队现在这么好，真高兴！", "emotion": "happy"},
                    {"speaker": "吴杨楚涵", "text": "学长，我写了队史！都是你当初带我进来的！", "emotion": "grateful"},
                    {"speaker": "旁白", "text": "陈子豪的歌声，成了一个传奇的开始。", "emotion": "significant"},
                ],
                "choices": [
                    {"id": "chenzihao_choice_5", "text": "为球队骄傲！", "nextSceneId": "chenzihao_end_good", "weight": 2},
                    {"id": "chenzihao_choice_6", "text": "一切都值得了！", "nextSceneId": "chenzihao_end_normal", "weight": 0},
                ],
            },
            {"id": "chenzihao_end_good", "background": "football_field", "endingHint": "good", "dialogs": [
                {"speaker": "旁白", "text": "陈子豪成了球队文化的象征。", "emotion": "significant"},
                {"speaker": "陈子豪", "text": "新闻男足的故事，永远不会结束！", "emotion": "encouraging"},
            ]},
            {"id": "chenzihao_end_normal", "background": "football_field", "endingHint": "normal", "dialogs": [
                {"speaker": "旁白", "text": "陈子豪完成了作为引路人的使命。", "emotion": "nostalgic"},
                {"speaker": "陈子豪", "text": "能成为这个故事的一部分，真好。", "emotion": "grateful"},
            ]},
        ],
        "endings": {
            "good": "文化传承：陈子豪的歌声和引路人精神成了球队文化不可或缺的一部分！",
            "normal": "光荣使命：完成了发掘新人、传承文化的使命。",
            "bad": "遗憾：没能让新人留下来，但每个故事都有它的意义。",
        },
    },
    # luziyi
    {
        "characterId": "luziyi",
        "title": "守护神的传承",
        "scenes": [
            {
                "id": "luziyi_1",
                "background": "campus",
                "dialogs": [
                    {"speaker": "旁白", "text": "2021年，卢子逸加入了新闻男足。他选择了最孤独的位置——门将。", "emotion": "neutral"},
                    {"speaker": "卢子逸", "text": "门将是最后一道防线，我愿意承担这个责任。", "emotion": "determined"},
                    {"speaker": "赵凌冬", "text": "好！有这份心就好！", "emotion": "encouraging"},
                ],
                "choices": [
                    {"id": "luziyi_choice_1", "text": "专攻门将位置！", "nextSceneId": "luziyi_2a", "weight": 1},
                    {"id": "luziyi_choice_2", "text": "也想试试其他位置！", "nextSceneId": "luziyi_2b", "weight": 0},
                ],
            },
            {"id": "luziyi_2a", "background": "football_field", "dialogs": [
                {"speaker": "卢子逸", "text": "我要成为最好的门将！", "emotion": "determined"},
                {"speaker": "旁白", "text": "卢子逸每天加练扑救，手掌磨出了茧子也不喊累。", "emotion": "neutral"},
            ], "nextSceneId": "luziyi_3"},
            {"id": "luziyi_2b", "background": "football_field", "dialogs": [
                {"speaker": "卢子逸", "text": "我不只想守门，还想体验不同位置。", "emotion": "curious"},
                {"speaker": "旁白", "text": "尝试了多个位置后，发现最适合的还是门将。", "emotion": "neutral"},
            ], "nextSceneId": "luziyi_3"},
            {
                "id": "luziyi_3",
                "background": "football_field",
                "dialogs": [
                    {"speaker": "旁白", "text": "一场关键比赛中，对方获得了点球！", "emotion": "tense"},
                    {"speaker": "解说", "text": "这球如果进了，比赛就结束了...", "emotion": "tense"},
                    {"speaker": "卢子逸", "text": "（深呼吸）来吧！", "emotion": "determined"},
                    {"speaker": "解说", "text": "扑出去了！！！卢子逸！！！", "emotion": "excited"},
                    {"speaker": "旁白", "text": "卢子逸扑出了关键点球！", "emotion": "significant"},
                ],
                "nextSceneId": "luziyi_4",
            },
            {
                "id": "luziyi_4",
                "background": "football_field",
                "dialogs": [
                    {"speaker": "旁白", "text": "2026年华工杯前，主力门将吴润泽受伤了。", "emotion": "tense"},
                    {"speaker": "伍彦名", "text": "卢子逸学长！教教我怎么守门吧！", "emotion": "nervous"},
                    {"speaker": "卢子逸", "text": "好啊！我来教你！", "emotion": "kind"},
                ],
                "choices": [
                    {"id": "luziyi_choice_3", "text": "倾囊相授！把会的都教给他！", "nextSceneId": "luziyi_5a", "weight": 2},
                    {"id": "luziyi_choice_4", "text": "让他自己摸索，门将需要自己悟！", "nextSceneId": "luziyi_5b", "weight": 0},
                ],
            },
            {"id": "luziyi_5a", "background": "football_field", "dialogs": [
                {"speaker": "卢子逸", "text": "记住，预判比反应更重要！看对方的脚！", "emotion": "wise"},
                {"speaker": "伍彦名", "text": "明白了！看脚不看球！", "emotion": "focused"},
                {"speaker": "旁白", "text": "伍彦名进步飞快！", "emotion": "excited"},
            ], "nextSceneId": "luziyi_6"},
            {"id": "luziyi_5b", "background": "football_field", "dialogs": [
                {"speaker": "卢子逸", "text": "门将这个位置，需要自己去体会...", "emotion": "wise"},
                {"speaker": "伍彦名", "text": "好的学长，我会努力的！", "emotion": "determined"},
            ], "nextSceneId": "luziyi_6"},
            {
                "id": "luziyi_6",
                "background": "football_field",
                "dialogs": [
                    {"speaker": "旁白", "text": "比赛开始了！伍彦名站在了球门前！", "emotion": "tense"},
                    {"speaker": "伍彦名", "text": "卢学长教的，我都记住了！", "emotion": "confident"},
                    {"speaker": "解说", "text": "漂亮的扑救！伍彦名！", "emotion": "excited"},
                    {"speaker": "卢子逸", "text": "（场边微笑）这小子，学得真快！", "emotion": "happy"},
                    {"speaker": "旁白", "text": "卢子逸的守门技艺成功传承给了下一代。", "emotion": "significant"},
                ],
                "choices": [
                    {"id": "luziyi_choice_5", "text": "这就是传承！", "nextSceneId": "luziyi_end_good", "weight": 2},
                    {"id": "luziyi_choice_6", "text": "可以安心毕业了！", "nextSceneId": "luziyi_end_normal", "weight": 0},
                ],
            },
            {"id": "luziyi_end_good", "background": "football_field", "endingHint": "good", "dialogs": [
                {"speaker": "旁白", "text": "卢子逸的守门技艺和精神在新闻男足代代相传。", "emotion": "significant"},
                {"speaker": "卢子逸", "text": "新闻男足的球门，永远有人守护！", "emotion": "confident"},
            ]},
            {"id": "luziyi_end_normal", "background": "football_field", "endingHint": "normal", "dialogs": [
                {"speaker": "旁白", "text": "卢子逸完成了作为门将和传承者的使命。", "emotion": "neutral"},
                {"speaker": "卢子逸", "text": "这段守门的岁月，值得铭记。", "emotion": "nostalgic"},
            ]},
        ],
        "endings": {
            "good": "守护传承：卢子逸的守门技艺和精神在新闻男足代代相传！",
            "normal": "光荣退役：完成了作为门将和导师的使命。",
            "bad": "遗憾：伍彦名在比赛中失误了，但他们都在失败中成长了。",
        },
    },
    # zhaolingdong
    {
        "characterId": "zhaolingdong",
        "title": "战术革命",
        "scenes": [
            {
                "id": "zhaolingdong_1",
                "background": "football_field",
                "dialogs": [
                    {"speaker": "旁白", "text": "赵凌冬来到了新闻男足，发现球队的训练还比较随意。", "emotion": "neutral"},
                    {"speaker": "赵凌冬", "text": "队员们都很努力，但需要更系统的训练。", "emotion": "serious"},
                    {"speaker": "吴志鸣", "text": "教练，您有什么想法？", "emotion": "respectful"},
                ],
                "choices": [
                    {"id": "zhaolingdong_choice_1", "text": "制定严格的训练计划！", "nextSceneId": "zhaolingdong_2a", "weight": 1},
                    {"id": "zhaolingdong_choice_2", "text": "循序渐进引导大家！", "nextSceneId": "zhaolingdong_2b", "weight": 0},
                ],
            },
            {"id": "zhaolingdong_2a", "background": "football_field", "dialogs": [
                {"speaker": "赵凌冬", "text": "从今天开始，每周三次训练！每次两小时！", "emotion": "determined"},
                {"speaker": "队员", "text": "教练...这也太狠了吧...", "emotion": "surprised"},
                {"speaker": "赵凌冬", "text": "想变强就要付出！", "emotion": "confident"},
            ], "nextSceneId": "zhaolingdong_3"},
            {"id": "zhaolingdong_2b", "background": "football_field", "dialogs": [
                {"speaker": "赵凌冬", "text": "我们先从基础的传接球练起，慢慢来。", "emotion": "calm"},
                {"speaker": "队员", "text": "好的教练！", "emotion": "happy"},
                {"speaker": "旁白", "text": "队员们逐渐适应了新的训练节奏。", "emotion": "neutral"},
            ], "nextSceneId": "zhaolingdong_3"},
            {
                "id": "zhaolingdong_3",
                "background": "football_field",
                "dialogs": [
                    {"speaker": "旁白", "text": "赵凌冬为球队设计了全新的战术体系。", "emotion": "neutral"},
                    {"speaker": "赵凌冬", "text": "我们的优势是配合和跑动。不要单打独斗，要传球！", "emotion": "confident"},
                    {"speaker": "吾尔肯", "text": "明白了教练！我们会严格执行战术！", "emotion": "determined"},
                ],
                "nextSceneId": "zhaolingdong_4",
            },
            {
                "id": "zhaolingdong_4",
                "background": "football_field",
                "dialogs": [
                    {"speaker": "旁白", "text": "2022年华工杯，新闻男足迎来了最大的考验。", "emotion": "tense"},
                    {"speaker": "赵凌冬", "text": "对手很强，但我们有战术！相信自己的训练！", "emotion": "encouraging"},
                ],
                "choices": [
                    {"id": "zhaolingdong_choice_3", "text": "采取进攻战术！", "nextSceneId": "zhaolingdong_5a", "weight": 1},
                    {"id": "zhaolingdong_choice_4", "text": "稳守反击！", "nextSceneId": "zhaolingdong_5b", "weight": 0},
                ],
            },
            {"id": "zhaolingdong_5a", "background": "football_field", "dialogs": [
                {"speaker": "赵凌冬", "text": "进攻！打出我们训练的东西！", "emotion": "excited"},
                {"speaker": "旁白", "text": "新闻男足打出了漂亮的配合！", "emotion": "excited"},
                {"speaker": "解说", "text": "精彩的团队进球！新闻男足！", "emotion": "excited"},
            ], "nextSceneId": "zhaolingdong_6"},
            {"id": "zhaolingdong_5b", "background": "football_field", "dialogs": [
                {"speaker": "赵凌冬", "text": "守住！等反击机会！", "emotion": "serious"},
                {"speaker": "旁白", "text": "新闻男足稳扎稳打，不给对手任何机会。", "emotion": "neutral"},
                {"speaker": "解说", "text": "稳如磐石！新闻男足的防守太出色了！", "emotion": "excited"},
            ], "nextSceneId": "zhaolingdong_6"},
            {
                "id": "zhaolingdong_6",
                "background": "football_field",
                "dialogs": [
                    {"speaker": "旁白", "text": "新闻男足历史性地小组出线，最终闯入四强！", "emotion": "significant"},
                    {"speaker": "赵凌冬", "text": "这是你们努力的结果！我以你们为荣！", "emotion": "grateful"},
                    {"speaker": "全队", "text": "谢谢教练！", "emotion": "excited"},
                ],
                "choices": [
                    {"id": "zhaolingdong_choice_5", "text": "我们创造了历史！", "nextSceneId": "zhaolingdong_end_good", "weight": 2},
                    {"id": "zhaolingdong_choice_6", "text": "这只是开始！", "nextSceneId": "zhaolingdong_end_normal", "weight": 0},
                ],
            },
            {"id": "zhaolingdong_end_good", "background": "football_field", "endingHint": "good", "dialogs": [
                {"speaker": "旁白", "text": "赵凌冬的战术革命彻底改变了新闻男足。", "emotion": "significant"},
                {"speaker": "赵凌冬", "text": "战术只是工具，真正强大的是你们的心！", "emotion": "wise"},
            ]},
            {"id": "zhaolingdong_end_normal", "background": "football_field", "endingHint": "normal", "dialogs": [
                {"speaker": "旁白", "text": "赵凌冬带领黄金一代创造了队史最佳战绩。", "emotion": "neutral"},
                {"speaker": "赵凌冬", "text": "这支球队的潜力是无限的！", "emotion": "hopeful"},
            ]},
        ],
        "endings": {
            "good": "战术大师：赵凌冬的战术体系成为新闻男足的宝贵财富！",
            "normal": "光荣使命：带领黄金一代创造了队史最佳战绩。",
            "bad": "战术失败：新战术没有达到预期效果，但这是成长的必经之路。",
        },
    },
    # yangyunfan
    {
        "characterId": "yangyunfan",
        "title": "镜头背后的故事",
        "scenes": [
            {
                "id": "yangyunfan_1",
                "background": "campus",
                "dialogs": [
                    {"speaker": "旁白", "text": "2023年军训期间，杨云帆和谭琦开始自发组建球队。", "emotion": "neutral"},
                    {"speaker": "杨云帆", "text": "谭琦！我们去找人踢球吧！", "emotion": "excited"},
                    {"speaker": "谭琦", "text": "好啊！我已经联系了几个同学了！", "emotion": "happy"},
                ],
                "choices": [
                    {"id": "yangyunfan_choice_1", "text": "积极参与组织工作！", "nextSceneId": "yangyunfan_2a", "weight": 1},
                    {"id": "yangyunfan_choice_2", "text": "专注踢球就好！", "nextSceneId": "yangyunfan_2b", "weight": 0},
                ],
            },
            {"id": "yangyunfan_2a", "background": "campus", "dialogs": [
                {"speaker": "杨云帆", "text": "我们一个寝室一个寝室地找人！", "emotion": "excited"},
                {"speaker": "旁白", "text": "杨云帆用镜头记录下了球队组建的过程。", "emotion": "neutral"},
            ], "nextSceneId": "yangyunfan_3"},
            {"id": "yangyunfan_2b", "background": "football_field", "dialogs": [
                {"speaker": "杨云帆", "text": "我还是专注踢球吧，组织的事交给谭琦！", "emotion": "happy"},
                {"speaker": "旁白", "text": "杨云帆在球场上展现出了出色的技术。", "emotion": "neutral"},
            ], "nextSceneId": "yangyunfan_3"},
            {
                "id": "yangyunfan_3",
                "background": "football_field",
                "dialogs": [
                    {"speaker": "旁白", "text": "新生杯第二场对阵公卫学院。", "emotion": "neutral"},
                    {"speaker": "谭琦", "text": "云帆！看你的了！", "emotion": "encouraging"},
                    {"speaker": "旁白", "text": "杨云帆门前补射破门！新闻2-0！", "emotion": "excited"},
                    {"speaker": "旁白", "text": "最终新闻男足6-2大胜公卫学院！", "emotion": "significant"},
                ],
                "nextSceneId": "yangyunfan_4",
            },
            {
                "id": "yangyunfan_4",
                "background": "campus",
                "dialogs": [
                    {"speaker": "旁白", "text": "2026年十周年，杨云帆决定拍摄一部纪录片。", "emotion": "neutral"},
                    {"speaker": "杨云帆", "text": "我要把新闻男足的故事拍下来！", "emotion": "determined"},
                ],
                "choices": [
                    {"id": "yangyunfan_choice_3", "text": "聚焦比赛精彩瞬间！", "nextSceneId": "yangyunfan_5a", "weight": 1},
                    {"id": "yangyunfan_choice_4", "text": "采访每个人物的故事！", "nextSceneId": "yangyunfan_5b", "weight": 1},
                ],
            },
            {"id": "yangyunfan_5a", "background": "football_field", "dialogs": [
                {"speaker": "杨云帆", "text": "捕捉每一个进球、每一次扑救！", "emotion": "focused"},
                {"speaker": "旁白", "text": "杨云帆扛着摄像机跑遍了每一个球场。", "emotion": "neutral"},
            ], "nextSceneId": "yangyunfan_6"},
            {"id": "yangyunfan_5b", "background": "campus", "dialogs": [
                {"speaker": "杨云帆", "text": "新闻男足对你意味着什么？", "emotion": "curious"},
                {"speaker": "吾尔肯", "text": "青春。全部都是青春。", "emotion": "nostalgic"},
                {"speaker": "王楷硕", "text": "传承。接过前辈的旗帜。", "emotion": "determined"},
            ], "nextSceneId": "yangyunfan_6"},
            {
                "id": "yangyunfan_6",
                "background": "football_field",
                "dialogs": [
                    {"speaker": "旁白", "text": "杨云帆问了每一个人同样的问题。", "emotion": "neutral"},
                    {"speaker": "杨云帆", "text": "你希望未来的学弟学妹看到这个片子时，会是什么感受？", "emotion": "curious"},
                    {"speaker": "旁白", "text": "每个人的回答都不一样，但都指向同一个词：传承。", "emotion": "significant"},
                ],
                "choices": [
                    {"id": "yangyunfan_choice_5", "text": "这部纪录片会成为经典！", "nextSceneId": "yangyunfan_end_good", "weight": 2},
                    {"id": "yangyunfan_choice_6", "text": "记录本身就是意义！", "nextSceneId": "yangyunfan_end_normal", "weight": 0},
                ],
            },
            {"id": "yangyunfan_end_good", "background": "football_field", "endingHint": "good", "dialogs": [
                {"speaker": "旁白", "text": "杨云帆的纪录片成了新闻男足最珍贵的财富。", "emotion": "significant"},
                {"speaker": "杨云帆", "text": "这些故事，值得被永远记住！", "emotion": "grateful"},
            ]},
            {"id": "yangyunfan_end_normal", "background": "football_field", "endingHint": "normal", "dialogs": [
                {"speaker": "旁白", "text": "杨云帆完成了纪录片的拍摄。", "emotion": "neutral"},
                {"speaker": "杨云帆", "text": "能记录下这些，是我的荣幸。", "emotion": "nostalgic"},
            ]},
        ],
        "endings": {
            "good": "影像传承：杨云帆的纪录片成为经典，让新闻男足的故事永远流传！",
            "normal": "记录使命：完成了十周年纪录片的拍摄。",
            "bad": "遗憾：一些珍贵的素材意外丢失，但记忆永远留在心中。",
        },
    },
]

import json

filepath = '//wsl.localhost/Ubuntu/home/chengchen/cc_work/新闻男足动画游戏/src/data/stories.ts'
with open(filepath, 'r', encoding='utf-8') as f:
    content = f.read()

def format_dialog(d):
    return "{ speaker: '" + d["speaker"] + "', text: '" + d["text"].replace("'", "\\'") + "', emotion: '" + d.get("emotion", "neutral") + "' }"

def format_choice(c):
    w = c.get("weight")
    weight_str = ", weight: " + str(w) if w is not None else ""
    return "{ id: '" + c["id"] + "', text: '" + c["text"] + "', nextSceneId: '" + c["nextSceneId"] + "'" + weight_str + " }"

def format_scene(s):
    lines = ["      {"]
    lines.append("        id: '" + s["id"] + "',")
    lines.append("        background: '" + s["background"] + "',")
    if "endingHint" in s:
        lines.append("        endingHint: '" + s["endingHint"] + "',")
    lines.append("        dialogs: [")
    for d in s["dialogs"]:
        lines.append("          " + format_dialog(d) + ",")
    lines.append("        ],")
    if "choices" in s:
        lines.append("        choices: [")
        for c in s["choices"]:
            lines.append("          " + format_choice(c) + ",")
        lines.append("        ],")
    if "nextSceneId" in s:
        lines.append("        nextSceneId: '" + s["nextSceneId"] + "',")
    if lines[-1].endswith(","):
        lines[-1] = lines[-1][:-1]
    lines.append("      },")
    return "\n".join(lines)

def format_storyline(sl):
    lines = ["  {"]
    lines.append("    characterId: '" + sl["characterId"] + "',")
    lines.append("    title: '" + sl["title"] + "',")
    lines.append("    scenes: [")
    for s in sl["scenes"]:
        lines.append(format_scene(s))
    lines.append("    ],")
    end = sl["endings"]
    lines.append("    endings: {")
    lines.append("      good: '" + end["good"] + "',")
    lines.append("      normal: '" + end["normal"] + "',")
    lines.append("      bad: '" + end["bad"] + "',")
    lines.append("    },")
    # Remove trailing comma from last scene
    lines.append("  },")
    return "\n".join(lines)

# Assemble all new storylines
new_block = ""
for i, sl in enumerate(STORYLINES):
    new_block += format_storyline(sl)
    if i < len(STORYLINES) - 1:
        new_block += "\n"

# Insert before ];
insert_pos = content.rfind('];')
new_content = content[:insert_pos] + ',\n' + new_block + '\n];'

with open(filepath, 'w', encoding='utf-8') as f:
    f.write(new_content)

print(f"Done! Appended {len(STORYLINES)} new storylines.")
