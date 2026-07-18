import { useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Dumbbell, Zap } from 'lucide-react';
import { campusPlayers } from '../data/campusPlayers';
import { useGameStore } from '../stores/gameStore';
import { PlayerCard } from '../components/Collection/PlayerCard';
import { applyBoosts, calculateOverall } from '../data/playerTypes';

export const TrainingPage = () => {
  const navigate = useNavigate();
  const playerGrowthStates = useGameStore((s) => s.playerGrowthStates);
  const gameWeek = useGameStore((s) => s.gameWeek);
  const extraTrainingChances = useGameStore((s) => s.extraTrainingChances);

  const playersWithStatus = useMemo(() => {
    return campusPlayers.map((player) => {
      const growth = playerGrowthStates[player.id] || {
        playerId: player.id,
        trainingLevel: 0,
        growthPoints: 0,
        statBoosts: { speed: 0, shooting: 0, passing: 0, dribbling: 0, defense: 0, physical: 0 },
        lastTrainingWeek: -1,
        totalTrainingWeeks: 0,
        matchesPlayed: 0,
        goalsScored: 0,
      };
      const effectiveStats = applyBoosts(player.stats, growth.statBoosts);
      const effectiveOverall = calculateOverall(effectiveStats);
      const canTrain = growth.lastTrainingWeek < gameWeek;
      const needsExtraChance = !canTrain && extraTrainingChances > 0;
      return { player, growth, effectiveOverall, canTrain, needsExtraChance };
    });
  }, [playerGrowthStates, gameWeek, extraTrainingChances]);

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
        <h1 className="text-xl font-bold text-white pixel-text mx-auto">训练计划</h1>
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2 px-3 py-1.5 bg-slate-800 rounded-lg border border-slate-700">
            <Dumbbell className="w-4 h-4 text-yellow-400" />
            <span className="text-sm text-gray-300">第 {gameWeek} 周</span>
          </div>
          {extraTrainingChances > 0 && (
            <div className="flex items-center gap-1 px-3 py-1.5 bg-yellow-600/30 rounded-lg border border-yellow-500/50">
              <Zap className="w-4 h-4 text-yellow-400" />
              <span className="text-sm text-yellow-400 font-bold">{extraTrainingChances}</span>
            </div>
          )}
        </div>
      </header>

      <main className="container mx-auto px-4 py-6">
        <div className="mb-6 bg-slate-800/80 rounded-xl p-4 border border-slate-700">
          <p className="text-sm text-gray-300 mb-2">
            选择一名球员制定 4 周训练计划。每位球员每周只能训练一次。训练会触发基于新闻男足球队史的真实奇遇事件。
          </p>
          {extraTrainingChances > 0 && (
            <p className="text-sm text-yellow-400 flex items-center gap-2">
              <Zap className="w-4 h-4" />
              你有 {extraTrainingChances} 次额外训练机会，可以为本周已训练的球员再次安排训练！
            </p>
          )}
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {playersWithStatus.map(({ player, growth, effectiveOverall, canTrain, needsExtraChance }) => (
            <div key={player.id} className="relative">
              <PlayerCard
                player={{ ...player, trainingLevel: growth.trainingLevel }}
                showTrainingLevel
                onClick={() => {
                  if (canTrain || needsExtraChance) navigate(`/manager/training/${player.id}`);
                }}
              />
              {!canTrain && !needsExtraChance && (
                <div className="absolute inset-0 bg-black/60 rounded-lg flex items-center justify-center z-20">
                  <span className="px-3 py-1.5 bg-slate-800 border border-slate-600 rounded-lg text-xs text-gray-300 pixel-text">
                    本周已训练
                  </span>
                </div>
              )}
              {needsExtraChance && (
                <div className="absolute inset-0 bg-yellow-500/10 rounded-lg flex items-center justify-center z-20 border-2 border-yellow-500/50">
                  <span className="px-3 py-1.5 bg-yellow-600/50 border border-yellow-500 rounded-lg text-xs text-yellow-300 pixel-text flex items-center gap-1">
                    <Zap className="w-3 h-3" />
                    使用额外机会
                  </span>
                </div>
              )}
              <div className="absolute -bottom-2 left-1/2 -translate-x-1/2 px-2 py-0.5 bg-slate-800 border border-slate-600 rounded text-[10px] text-yellow-400 whitespace-nowrap">
                总评 {effectiveOverall} · {growth.growthPoints} GP
              </div>
            </div>
          ))}
        </div>
      </main>
    </div>
  );
};
