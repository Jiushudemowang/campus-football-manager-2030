import { useNavigate } from 'react-router-dom';
import { ArrowLeft, ScrollText, CheckCircle2, Gift, Target } from 'lucide-react';
import { useMemo } from 'react';
import { useShallow } from 'zustand/react/shallow';
import { useGameStore } from '../stores/gameStore';
import { QUESTS, Quest, QuestProgress, getConditionLabel, getInitialQuestProgress } from '../data/quests';

const typeLabels: Record<Quest['type'], string> = {
  main: '主线',
  training: '训练',
  match: '对战',
  collection: '收集'
};

const typeColors: Record<Quest['type'], { border: string; bg: string; text: string }> = {
  main: { border: 'border-yellow-500', bg: 'bg-yellow-500/10', text: 'text-yellow-400' },
  training: { border: 'border-blue-500', bg: 'bg-blue-500/10', text: 'text-blue-400' },
  match: { border: 'border-red-500', bg: 'bg-red-500/10', text: 'text-red-400' },
  collection: { border: 'border-green-500', bg: 'bg-green-500/10', text: 'text-green-400' }
};

function QuestCard({
  quest,
  progress,
  onClaim
}: {
  quest: Quest;
  progress: QuestProgress;
  onClaim: () => void;
}) {
  const percent = Math.min(100, Math.round((progress.current / quest.condition.target) * 100));
  const canClaim = progress.completed && !progress.claimed;

  return (
    <div
      className={`
        relative overflow-hidden rounded-xl border-2 p-4 transition-all
        ${progress.claimed ? 'border-slate-700 bg-slate-800/50 opacity-70' : `${typeColors[quest.type].border} ${typeColors[quest.type].bg} bg-opacity-30`}
      `}
    >
      <div className="flex items-start justify-between gap-4 mb-3">
        <div className="flex-1">
          <div className="flex items-center gap-2 mb-1">
            <span
              className={`
                px-2 py-0.5 rounded text-[10px] font-bold border
                ${typeColors[quest.type].border} ${typeColors[quest.type].text}
              `}
            >
              {typeLabels[quest.type]}
            </span>
            {progress.claimed && (
              <span className="px-2 py-0.5 rounded text-[10px] font-bold border border-green-500 text-green-400">
                已领取
              </span>
            )}
            {!progress.completed && !progress.claimed && (
              <span className="px-2 py-0.5 rounded text-[10px] font-bold border border-slate-600 text-slate-400">
                进行中
              </span>
            )}
          </div>
          <h3 className={`text-lg font-bold pixel-text ${progress.claimed ? 'text-slate-400' : 'text-white'}`}>
            {quest.title}
          </h3>
          <p className="text-sm text-gray-400 mt-1">{quest.description}</p>
        </div>
        {progress.claimed ? (
          <CheckCircle2 className="w-8 h-8 text-green-500 shrink-0" />
        ) : (
          <Target className={`w-8 h-8 shrink-0 ${typeColors[quest.type].text}`} />
        )}
      </div>

      <div className="space-y-2">
        <div className="flex justify-between text-xs text-gray-400">
          <span>{getConditionLabel(quest.condition)}</span>
          <span>
            {progress.current} / {quest.condition.target}
          </span>
        </div>
        <div className="h-2 bg-slate-700 rounded-full overflow-hidden">
          <div
            className={`h-full rounded-full transition-all duration-500 ${
              progress.claimed ? 'bg-green-500' : 'bg-gradient-to-r from-green-500 to-yellow-500'
            }`}
            style={{ width: `${percent}%` }}
          />
        </div>
      </div>

      {canClaim && (
        <button
          onClick={onClaim}
          className="mt-4 w-full flex items-center justify-center gap-2 px-4 py-2.5 bg-yellow-600 hover:bg-yellow-500 text-white rounded-lg font-bold transition-colors pixel-text"
        >
          <Gift className="w-4 h-4" />
          领取奖励
        </button>
      )}

      {!progress.completed && quest.rewards.length > 0 && (
        <div className="mt-3 text-xs text-gray-500">
          奖励: {quest.rewards.map((r) => {
            if (r.type === 'growth_points') return `${r.growthPoints} 成长点`;
            if (r.type === 'unlock_player') return '解锁球员';
            if (r.type === 'stat_boost') return '属性加成';
            return '未知';
          }).join('、')}
        </div>
      )}
    </div>
  );
}

export const QuestPage = () => {
  const navigate = useNavigate();
  const questProgress = useGameStore(useShallow((s) => s.questProgress));
  const claimQuestReward = useGameStore((s) => s.claimQuestReward);

  const activeQuests = useMemo(() => {
    return QUESTS.filter((quest) => {
      const progress = questProgress[quest.id] || getInitialQuestProgress(quest.id);
      if (progress.claimed) return false;
      if (quest.prerequisiteQuestId) {
        const pre = questProgress[quest.prerequisiteQuestId];
        return !!pre?.completed;
      }
      return true;
    });
  }, [questProgress]);

  const allQuests = useMemo(() => QUESTS.slice().sort((a, b) => a.order - b.order), []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-green-900/10 to-slate-900 text-white">
      <header className="sticky top-0 z-30 flex items-center p-4 bg-slate-900/95 backdrop-blur-sm border-b-4 border-yellow-500">
        <button
          onClick={() => navigate('/manager')}
          className="flex items-center gap-2 text-gray-300 hover:text-yellow-400 transition-colors px-4 py-2 rounded-lg hover:bg-yellow-500/20"
        >
          <ArrowLeft className="w-5 h-5" />
          <span className="pixel-text text-sm">返回经理中枢</span>
        </button>
        <h1 className="text-xl font-bold text-white pixel-text mx-auto">任务中心</h1>
        <div className="w-24" />
      </header>

      <main className="container mx-auto px-4 py-6">
        {activeQuests.length > 0 && (
          <div className="mb-8">
            <div className="flex items-center gap-2 mb-4">
              <ScrollText className="w-5 h-5 text-yellow-400" />
              <h2 className="text-lg font-bold pixel-text text-yellow-400">当前目标</h2>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {activeQuests.map((quest) => (
                <QuestCard
                  key={quest.id}
                  quest={quest}
                  progress={questProgress[quest.id] || { questId: quest.id, current: 0, completed: false, claimed: false }}
                  onClaim={() => claimQuestReward(quest.id)}
                />
              ))}
            </div>
          </div>
        )}

        <div className="flex items-center gap-2 mb-4">
          <CheckCircle2 className="w-5 h-5 text-green-400" />
          <h2 className="text-lg font-bold pixel-text text-green-400">全部任务</h2>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {allQuests.map((quest) => (
            <QuestCard
              key={quest.id}
              quest={quest}
              progress={questProgress[quest.id] || { questId: quest.id, current: 0, completed: false, claimed: false }}
              onClaim={() => claimQuestReward(quest.id)}
            />
          ))}
        </div>
      </main>
    </div>
  );
};
