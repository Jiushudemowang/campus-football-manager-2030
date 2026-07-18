import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Users, Dumbbell, Trophy, ScrollText, BookOpen } from 'lucide-react';

const hubCards = [
  {
    title: '当前任务',
    description: '查看目标进度，领取任务奖励',
    icon: <ScrollText className="w-8 h-8" />,
    to: '/manager/quests',
    color: 'yellow',
    borderColor: 'border-yellow-500',
    bgColor: 'bg-yellow-500/10',
    textColor: 'text-yellow-400',
    hoverBg: 'hover:bg-yellow-500/20'
  },
  {
    title: '球队阵容',
    description: '选择8名校园球员组成首发阵容',
    icon: <Users className="w-8 h-8" />,
    to: '/manager/squad',
    color: 'green',
    borderColor: 'border-green-500',
    bgColor: 'bg-green-500/10',
    textColor: 'text-green-400',
    hoverBg: 'hover:bg-green-500/20'
  },
  {
    title: '训练计划',
    description: '制定4周训练计划，提升球员能力',
    icon: <Dumbbell className="w-8 h-8" />,
    to: '/manager/training',
    color: 'yellow',
    borderColor: 'border-yellow-500',
    bgColor: 'bg-yellow-500/10',
    textColor: 'text-yellow-400',
    hoverBg: 'hover:bg-yellow-500/20'
  },
  {
    title: '知识问答',
    description: '答题赢取成长点数和额外训练机会',
    icon: <BookOpen className="w-8 h-8" />,
    to: '/manager/quiz',
    color: 'blue',
    borderColor: 'border-blue-500',
    bgColor: 'bg-blue-500/10',
    textColor: 'text-blue-400',
    hoverBg: 'hover:bg-blue-500/20'
  },
  {
    title: '近期战绩',
    description: '查看最近比赛记录和球员成长',
    icon: <Trophy className="w-8 h-8" />,
    to: '/manager/history',
    color: 'orange',
    borderColor: 'border-orange-500',
    bgColor: 'bg-orange-500/10',
    textColor: 'text-orange-400',
    hoverBg: 'hover:bg-orange-500/20'
  }
];

export const ManagerHubPage = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-green-900/10 to-slate-900 text-white">
      <header className="sticky top-0 z-30 flex items-center p-4 bg-slate-900/95 backdrop-blur-sm border-b-4 border-green-500">
        <button
          onClick={() => navigate('/')}
          className="flex items-center gap-2 text-gray-300 hover:text-green-400 transition-colors px-4 py-2 rounded-lg hover:bg-green-500/20"
        >
          <ArrowLeft className="w-5 h-5" />
          <span className="pixel-text text-sm">返回主页</span>
        </button>
        <h1 className="text-xl font-bold text-white pixel-text mx-auto">经理中枢</h1>
        <div className="w-20" />
      </header>

      <main className="container mx-auto px-4 py-12">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-green-400 via-yellow-400 to-orange-500 pixel-text">
              AI 足球经理工作台
            </span>
          </h2>
          <p className="text-gray-400 max-w-2xl mx-auto">
            组建阵容、制定训练、追踪成长——把新闻男足培养成能挑战世界杯传奇 AI 的梦之队。
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 max-w-5xl mx-auto">
          {hubCards.map((card) => (
            <button
              key={card.title}
              onClick={() => navigate(card.to)}
              className={`
                pixel-card p-6 text-left transition-all duration-300 transform hover:scale-[1.02]
                border-2 ${card.borderColor} ${card.bgColor} ${card.hoverBg}
              `}
            >
              <div className={`${card.textColor} mb-4`}>{card.icon}</div>
              <h3 className={`text-xl font-bold mb-2 pixel-text ${card.textColor}`}>
                {card.title}
              </h3>
              <p className="text-sm text-gray-400">{card.description}</p>
              <div className="mt-4 flex justify-end">
                <span className={`text-sm font-bold ${card.textColor}`}>进入 →</span>
              </div>
            </button>
          ))}
        </div>
      </main>
    </div>
  );
};
