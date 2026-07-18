import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useGameStore } from '../stores/gameStore';
import { ChessBoard } from '../components/ChessBoard/ChessBoard';
import { aiOpponentTeams, getAvailableAIOpponentTeams } from '../data/aiOpponents';
import { Swords, Users, Trophy, Lock, Star } from 'lucide-react';

type MatchState = 'select' | 'playing';
type GameMode = '3v3' | '9v9' | '11v11';

export const ChessMatchPage = () => {
  const navigate = useNavigate();
  const activeSquad = useGameStore((s) => s.activeSquad);
  const matchHistory = useGameStore((s) => s.matchHistory);
  const [matchState, setMatchState] = useState<MatchState>('select');
  const [selectedTeamId, setSelectedTeamId] = useState<string | null>(null);
  const [gameMode, setGameMode] = useState<GameMode>('3v3');

  if (!activeSquad || activeSquad.playerIds.length < 3) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-green-900/20 to-slate-900 flex items-center justify-center p-4">
        <div className="bg-slate-800/95 backdrop-blur-sm rounded-2xl p-8 border border-slate-700 max-w-md w-full text-center">
          <Swords className="w-16 h-16 text-yellow-400 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-white mb-3 pixel-text">尚未设置首发阵容</h2>
          <p className="text-gray-400 mb-6">
            请先在经理中枢组建你的球队（至少3人），再挑战 AI 传奇队。
          </p>
          <button
            onClick={() => navigate('/manager/squad')}
            className="flex items-center justify-center gap-2 w-full px-6 py-3 bg-green-600 hover:bg-green-500 text-white rounded-xl font-bold transition-colors"
          >
            <Users className="w-5 h-5" />
            前往组建阵容
          </button>
        </div>
      </div>
    );
  }

  const completedMatches = matchHistory.length;
  const completedWins = matchHistory.filter((r) => r.result === 'win').length;
  const availableTeams = getAvailableAIOpponentTeams({ completedMatches, completedWins });

  if (matchState === 'select') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-green-900/10 to-slate-900 text-white">
        <header className="sticky top-0 z-30 flex items-center p-4 bg-slate-900/95 backdrop-blur-sm border-b-4 border-yellow-500">
          <button
            onClick={() => navigate('/manager')}
            className="flex items-center gap-2 text-gray-300 hover:text-yellow-400 transition-colors px-4 py-2 rounded-lg hover:bg-yellow-500/20"
          >
            <Swords className="w-5 h-5" />
            <span className="pixel-text text-sm">返回经理中枢</span>
          </button>
          <h1 className="text-xl font-bold text-white pixel-text mx-auto">挑战传奇 AI</h1>
          <div className="w-32" />
        </header>

        <main className="container mx-auto px-4 py-8">
          <div className="max-w-4xl mx-auto">
            <div className="bg-slate-800/80 rounded-2xl p-6 border border-slate-700 mb-8">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-xl font-bold mb-2">当前战绩</h2>
                  <p className="text-sm text-gray-400">已完成 {completedMatches} 场比赛，胜利 {completedWins} 场</p>
                </div>
                <div className="flex gap-4">
                  <div className="text-center px-4 py-2 bg-green-600/20 rounded-lg border border-green-500/30">
                    <div className="text-2xl font-bold text-green-400">{completedWins}</div>
                    <div className="text-xs text-gray-400">胜利</div>
                  </div>
                  <div className="text-center px-4 py-2 bg-slate-700/50 rounded-lg border border-slate-600">
                    <div className="text-2xl font-bold text-gray-300">{completedMatches - completedWins}</div>
                    <div className="text-xs text-gray-400">失败/平局</div>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-slate-800/80 rounded-2xl p-6 border border-slate-700 mb-8">
              <h3 className="text-lg font-bold mb-4 flex items-center gap-2">
                <Users className="w-5 h-5 text-blue-400" />
                选择对战模式
              </h3>
              <div className="grid grid-cols-3 gap-4">
                {([
                  { mode: '3v3' as GameMode, label: '3v3', description: '快速对战', color: 'green' },
                  { mode: '9v9' as GameMode, label: '9v9', description: '标准对战', color: 'blue' },
                  { mode: '11v11' as GameMode, label: '11v11', description: '完整对战', color: 'purple' }
                ]).map(({ mode, label, description, color }) => (
                  <button
                    key={mode}
                    onClick={() => setGameMode(mode)}
                    className={`p-4 rounded-xl border-2 transition-all ${
                      gameMode === mode
                        ? `border-${color}-500 bg-${color}-500/20 shadow-lg shadow-${color}-500/20`
                        : 'border-slate-600 bg-slate-800/50 hover:border-slate-500'
                    }`}
                  >
                    <div className={`text-2xl font-bold mb-1 ${gameMode === mode ? `text-${color}-400` : 'text-white'}`}>
                      {label}
                    </div>
                    <div className="text-xs text-gray-400">{description}</div>
                  </button>
                ))}
              </div>
            </div>

            <h3 className="text-lg font-bold mb-4 flex items-center gap-2">
              <Trophy className="w-5 h-5 text-yellow-400" />
              选择对手
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {aiOpponentTeams.map((team) => {
                const isAvailable = availableTeams.some((t) => t.id === team.id);
                const isSelected = selectedTeamId === team.id;

                const difficultyColors = {
                  easy: 'border-green-500 bg-green-500/10 text-green-400',
                  normal: 'border-blue-500 bg-blue-500/10 text-blue-400',
                  hard: 'border-orange-500 bg-orange-500/10 text-orange-400',
                  legendary: 'border-purple-500 bg-purple-500/10 text-purple-400'
                };

                return (
                  <button
                    key={team.id}
                    onClick={() => {
                      if (isAvailable) {
                        setSelectedTeamId(team.id);
                      }
                    }}
                    disabled={!isAvailable}
                    className={`relative p-6 rounded-2xl border-2 text-left transition-all ${
                      isSelected
                        ? `${difficultyColors[team.difficulty]} scale-[1.02] shadow-lg`
                        : isAvailable
                        ? 'border-slate-600 bg-slate-800/50 hover:border-slate-500'
                        : 'border-slate-700 bg-slate-800/20 opacity-50 cursor-not-allowed'
                    }`}
                  >
                    {!isAvailable && (
                      <div className="absolute top-4 right-4">
                        <Lock className="w-5 h-5 text-gray-500" />
                      </div>
                    )}

                    <div className="flex items-start gap-4">
                      <div className={`w-14 h-14 rounded-xl ${difficultyColors[team.difficulty]} flex items-center justify-center text-2xl`}>
                        {team.icon}
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <h4 className="text-lg font-bold">{team.name}</h4>
                          {team.difficulty === 'legendary' && <Star className="w-4 h-4 text-yellow-400" />}
                        </div>
                        <p className="text-sm text-gray-400 mb-3">{team.description}</p>
                        <div className="flex items-center gap-4">
                          <span className={`px-2 py-1 rounded text-xs font-bold ${difficultyColors[team.difficulty]}`}>
                            {team.difficultyLabel}
                          </span>
                          <span className="text-sm text-yellow-400">
                            <Trophy className="w-4 h-4 inline mr-1" />
                            +{team.rewardGrowthPoints} GP
                          </span>
                        </div>
                      </div>
                    </div>

                    <div className="mt-4 pt-4 border-t border-slate-700">
                      <div className="text-xs text-gray-500 mb-2">对手阵容</div>
                      <div className="flex gap-3">
                        {team.players.map((player) => (
                          <div
                            key={player.id}
                            className={`flex flex-col items-center px-3 py-2 rounded-lg ${
                              player.pieceType === 'king'
                                ? 'bg-red-900/30 border border-red-500/30'
                                : player.pieceType === 'queen'
                                ? 'bg-yellow-900/30 border border-yellow-500/30'
                                : 'bg-blue-900/30 border border-blue-500/30'
                            }`}
                          >
                            <span className="text-xs font-bold">{player.name}</span>
                            <span className="text-[10px] text-gray-400">{player.positionCN}</span>
                          </div>
                        ))}
                      </div>
                    </div>

                    {!isAvailable && (
                      <div className="mt-3 text-xs text-gray-500">
                        {team.difficulty === 'normal' && '解锁条件：完成1场比赛'}
                        {team.difficulty === 'hard' && '解锁条件：取得3场胜利'}
                        {team.difficulty === 'legendary' && '解锁条件：取得6场胜利'}
                      </div>
                    )}
                  </button>
                );
              })}
            </div>

            {selectedTeamId && (
              <div className="mt-8">
                <button
                  onClick={() => setMatchState('playing')}
                  className="w-full py-4 bg-gradient-to-r from-yellow-600 to-orange-600 hover:from-yellow-500 hover:to-orange-500 rounded-2xl font-bold text-lg transition-all transform hover:scale-[1.02] shadow-lg shadow-orange-500/20"
                >
                  开始挑战 {aiOpponentTeams.find((t) => t.id === selectedTeamId)?.name}
                </button>
              </div>
            )}
          </div>
        </main>
      </div>
    );
  }

  return (
    <ChessBoard
      onBack={() => setMatchState('select')}
      activeSquadIds={activeSquad.playerIds}
      aiTeamId={selectedTeamId || 'team_europe'}
      gameMode={gameMode}
    />
  );
};
