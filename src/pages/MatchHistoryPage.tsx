import { useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Trophy, Calendar, Swords } from 'lucide-react';
import { useGameStore } from '../stores/gameStore';
import { getCampusPlayerById } from '../data/campusPlayers';

const POSITION_COLORS: Record<import('../data/playerTypes').PlayerPosition, string> = {
  GK: '1B5E20',
  DEF: '0D47A1',
  MID: 'F57F17',
  FWD: 'B71C1C'
};

export const MatchHistoryPage = () => {
  const navigate = useNavigate();
  const matchHistory = useGameStore((s) => s.matchHistory);

  const stats = useMemo(() => {
    const total = matchHistory.length;
    const wins = matchHistory.filter((m) => m.result === 'win').length;
    const draws = matchHistory.filter((m) => m.result === 'draw').length;
    const losses = matchHistory.filter((m) => m.result === 'lose').length;
    const totalGoals = matchHistory.reduce((sum, m) => sum + m.whiteScore, 0);

    const goalCounts: Record<string, number> = {};
    matchHistory.forEach((m) => {
      m.goalScorerIds.forEach((id) => {
        goalCounts[id] = (goalCounts[id] || 0) + 1;
      });
    });

    const topScorerId = Object.entries(goalCounts).sort((a, b) => b[1] - a[1])[0]?.[0];
    const topScorer = topScorerId ? getCampusPlayerById(topScorerId) : null;
    const topScorerGoals = topScorerId ? goalCounts[topScorerId] : 0;

    return { total, wins, draws, losses, totalGoals, topScorer, topScorerGoals };
  }, [matchHistory]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-green-900/10 to-slate-900 text-white">
      <header className="sticky top-0 z-30 flex items-center p-4 bg-slate-900/95 backdrop-blur-sm border-b-4 border-orange-500">
        <button
          onClick={() => navigate('/manager')}
          className="flex items-center gap-2 text-gray-300 hover:text-orange-400 transition-colors px-4 py-2 rounded-lg hover:bg-orange-500/20"
        >
          <ArrowLeft className="w-5 h-5" />
          <span className="pixel-text text-sm">返回经理中枢</span>
        </button>
        <h1 className="text-xl font-bold text-white pixel-text mx-auto">近期战绩</h1>
        <div className="w-24" />
      </header>

      <main className="container mx-auto px-4 py-6">
        {/* 统计卡片 */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          <div className="bg-slate-800/80 rounded-xl p-4 border border-slate-700 text-center">
            <div className="text-2xl font-bold text-white">{stats.total}</div>
            <div className="text-xs text-gray-400">总场次</div>
          </div>
          <div className="bg-slate-800/80 rounded-xl p-4 border border-slate-700 text-center">
            <div className="text-2xl font-bold text-green-400">{stats.wins}</div>
            <div className="text-xs text-gray-400">胜 / {stats.draws} 平 / {stats.losses} 负</div>
          </div>
          <div className="bg-slate-800/80 rounded-xl p-4 border border-slate-700 text-center">
            <div className="text-2xl font-bold text-yellow-400">{stats.totalGoals}</div>
            <div className="text-xs text-gray-400">总进球</div>
          </div>
          <div className="bg-slate-800/80 rounded-xl p-4 border border-slate-700 text-center">
            <div className="text-lg font-bold text-white truncate">
              {stats.topScorer ? stats.topScorer.name : '-'}
            </div>
            <div className="text-xs text-gray-400">{stats.topScorer ? `${stats.topScorerGoals} 球` : '最佳射手'}</div>
          </div>
        </div>

        {matchHistory.length === 0 ? (
          <div className="text-center py-16 bg-slate-800/50 rounded-2xl border-2 border-dashed border-slate-600">
            <Swords className="w-12 h-12 text-slate-600 mx-auto mb-3" />
            <p className="text-gray-400 text-lg pixel-text mb-2">暂无比赛记录</p>
            <p className="text-gray-500 text-sm">先去组建阵容，然后在棋盘对战挑战 AI 传奇队</p>
          </div>
        ) : (
          <div className="space-y-4">
            {matchHistory.map((match) => (
              <div
                key={match.id}
                className="bg-slate-800/80 rounded-xl p-4 border border-slate-700"
              >
                <div className="flex flex-wrap items-center justify-between gap-4 mb-3">
                  <div className="flex items-center gap-3">
                    <div className={`px-3 py-1 rounded text-xs font-bold ${
                      match.result === 'win'
                        ? 'bg-green-500/20 text-green-400'
                        : match.result === 'draw'
                        ? 'bg-yellow-500/20 text-yellow-400'
                        : 'bg-red-500/20 text-red-400'
                    }`}>
                      {match.result === 'win' ? '胜利' : match.result === 'draw' ? '平局' : '失利'}
                    </div>
                    <div className="text-lg font-bold">
                      {match.whiteScore} : {match.blackScore}
                    </div>
                    <span className="text-sm text-gray-400">vs {match.opponent}</span>
                  </div>
                  <div className="flex items-center gap-2 text-xs text-gray-500">
                    <Calendar className="w-3 h-3" />
                    {new Date(match.timestamp).toLocaleDateString('zh-CN')}
                    <span className="ml-2">{match.turnCount} 回合</span>
                  </div>
                </div>

                <div className="flex flex-wrap items-center gap-4">
                  <div className="flex -space-x-2">
                    {match.activeSquadIds.map((id) => {
                      const p = getCampusPlayerById(id);
                      if (!p) return null;
                      return (
                        <img
                          key={id}
                          src={`https://api.dicebear.com/9.x/pixel-art/svg?seed=${encodeURIComponent(id)}&backgroundColor=${POSITION_COLORS[p.position]}`}
                          alt={p.name}
                          className="w-8 h-8 rounded-full border-2 border-slate-800 bg-slate-700"
                          title={p.name}
                        />
                      );
                    })}
                  </div>
                  <div className="flex-1 min-w-[200px]">
                    {match.goalScorerIds.length > 0 ? (
                      <div className="text-sm text-gray-300">
                        <Trophy className="inline w-4 h-4 text-yellow-400 mr-1" />
                        进球者:{' '}
                        {match.goalScorerIds
                          .map((id) => getCampusPlayerById(id)?.name || id)
                          .join('、')}
                      </div>
                    ) : (
                      <div className="text-sm text-gray-500">无进球</div>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  );
};
