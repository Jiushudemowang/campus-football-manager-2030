import { useState, useMemo } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { ArrowLeft, Play, Save, RotateCcw, Zap, Target, Share2, Footprints, Shield, Dumbbell, AlertTriangle } from 'lucide-react';
import { getCampusPlayerById } from '../data/campusPlayers';
import { useGameStore } from '../stores/gameStore';
import { StatBar } from '../components/Manager/StatBar';
import { simulateTraining, INTENSITY_CONFIG, TrainingFocus, TrainingIntensity } from '../data/trainingEngine';
import { trainingEvents } from '../data/trainingEvents';
import { applyBoosts, calculateOverall } from '../data/playerTypes';

const FOCUS_OPTIONS: { key: TrainingFocus; label: string; icon: React.ReactNode; color: string }[] = [
  { key: 'speed', label: '速度', icon: <Zap className="w-4 h-4" />, color: 'text-green-400' },
  { key: 'shooting', label: '射门', icon: <Target className="w-4 h-4" />, color: 'text-yellow-400' },
  { key: 'passing', label: '传球', icon: <Share2 className="w-4 h-4" />, color: 'text-blue-400' },
  { key: 'dribbling', label: '盘带', icon: <Footprints className="w-4 h-4" />, color: 'text-purple-400' },
  { key: 'defense', label: '防守', icon: <Shield className="w-4 h-4" />, color: 'text-red-400' },
  { key: 'physical', label: '体能', icon: <Dumbbell className="w-4 h-4" />, color: 'text-orange-400' }
];

const INTENSITY_OPTIONS: { key: TrainingIntensity; label: string; color: string }[] = [
  { key: 'light', label: '轻松', color: 'text-green-400' },
  { key: 'normal', label: '正常', color: 'text-yellow-400' },
  { key: 'intense', label: '高强度', color: 'text-red-400' }
];

const STAT_LABELS: { key: TrainingFocus; label: string }[] = [
  { key: 'speed', label: '速度' },
  { key: 'shooting', label: '射门' },
  { key: 'passing', label: '传球' },
  { key: 'dribbling', label: '盘带' },
  { key: 'defense', label: '防守' },
  { key: 'physical', label: '体能' }
];

export const TrainingPlayerPage = () => {
  const { playerId } = useParams<{ playerId: string }>();
  const navigate = useNavigate();
  const player = useMemo(() => (playerId ? getCampusPlayerById(playerId) : undefined), [playerId]);

  const getPlayerGrowthState = useGameStore((s) => s.getPlayerGrowthState);
  const applyTrainingResult = useGameStore((s) => s.applyTrainingResult);
  const consumeExtraTrainingChance = useGameStore((s) => s.consumeExtraTrainingChance);
  const growthState = player ? getPlayerGrowthState(player.id) : null;
  const gameWeek = useGameStore((s) => s.gameWeek);
  const isExtraTraining = growthState && growthState.lastTrainingWeek >= gameWeek;

  const [focus, setFocus] = useState<TrainingFocus>('speed');
  const [intensity, setIntensity] = useState<TrainingIntensity>('normal');
  const [result, setResult] = useState<ReturnType<typeof simulateTraining> | null>(null);

  if (!player || !growthState) {
    return (
      <div className="min-h-screen bg-slate-900 flex items-center justify-center text-white">
        <div className="text-center">
          <p className="text-xl mb-4">未找到球员</p>
          <button
            onClick={() => navigate('/manager/training')}
            className="px-6 py-3 bg-green-600 hover:bg-green-500 rounded-xl"
          >
            返回训练列表
          </button>
        </div>
      </div>
    );
  }

  const beforeStats = applyBoosts(player.stats, growthState.statBoosts);
  const beforeOverall = calculateOverall(beforeStats);

  const handleSimulate = () => {
    const plan = { focus, intensity, weeks: 4 };
    const simulation = simulateTraining(player, plan, growthState, trainingEvents);
    setResult(simulation);
  };

  const handleSave = () => {
    if (!result) return;
    applyTrainingResult(result);
    if (isExtraTraining) {
      consumeExtraTrainingChance();
    }
    navigate('/manager/training');
  };

  const currentStats = result
    ? applyBoosts(player.stats, applyBoosts(growthState.statBoosts, result.totalStatChanges))
    : beforeStats;
  const currentOverall = result ? result.afterOverall : beforeOverall;

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-green-900/10 to-slate-900 text-white">
      <header className="sticky top-0 z-30 flex items-center p-4 bg-slate-900/95 backdrop-blur-sm border-b-4 border-yellow-500">
        <button
          onClick={() => navigate('/manager/training')}
          className="flex items-center gap-2 text-gray-300 hover:text-yellow-400 transition-colors px-4 py-2 rounded-lg hover:bg-yellow-500/20"
        >
          <ArrowLeft className="w-5 h-5" />
          <span className="pixel-text text-sm">返回训练列表</span>
        </button>
        <h1 className="text-xl font-bold text-white pixel-text mx-auto">{player.name} 的训练计划</h1>
        {isExtraTraining && (
          <div className="flex items-center gap-1 px-3 py-1.5 bg-yellow-600/30 rounded-lg border border-yellow-500/50">
            <Zap className="w-4 h-4 text-yellow-400" />
            <span className="text-sm text-yellow-400">额外机会</span>
          </div>
        )}
        {!isExtraTraining && <div className="w-24" />}
      </header>

      <main className="container mx-auto px-4 py-6">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* 左侧球员信息 */}
          <div className="space-y-4">
            <div className="bg-slate-800/80 rounded-xl p-4 border border-slate-700">
              <div className="flex items-center gap-4 mb-4">
                <div className="w-20 h-20 rounded-xl overflow-hidden border-2 border-slate-600 bg-slate-900">
                  <img
                    src={`https://api.dicebear.com/9.x/pixel-art/svg?seed=${encodeURIComponent(player.id)}&backgroundColor=${
                      player.position === 'GK' ? '1B5E20' : player.position === 'DEF' ? '0D47A1' : player.position === 'MID' ? 'F57F17' : 'B71C1C'
                    }`}
                    alt={player.name}
                    className="w-full h-full object-cover"
                    style={{ imageRendering: 'pixelated' }}
                  />
                </div>
                <div>
                  <h2 className="text-xl font-bold">{player.name}</h2>
                  <p className="text-sm text-gray-400">{player.positionCN} · {player.grade}</p>
                  <div className="flex items-center gap-2 mt-1">
                    <span className="px-2 py-0.5 bg-yellow-500/10 border border-yellow-500 rounded text-xs text-yellow-400">
                      Lv.{growthState.trainingLevel}
                    </span>
                    <span className="px-2 py-0.5 bg-green-500/10 border border-green-500 rounded text-xs text-green-400">
                      {growthState.growthPoints} GP
                    </span>
                  </div>
                </div>
              </div>

              <div className="text-center py-3 bg-slate-900/50 rounded-lg mb-4">
                <div className="text-3xl font-bold text-white">{currentOverall}</div>
                <div className="text-xs text-gray-500">当前总评 {result ? `(原 ${beforeOverall})` : ''}</div>
              </div>

              <div className="space-y-3">
                {STAT_LABELS.map(({ key, label }) => (
                  <StatBar
                    key={key}
                    label={label}
                    base={player.stats[key]}
                    boost={currentStats[key] - player.stats[key]}
                  />
                ))}
              </div>
            </div>
          </div>

          {/* 中间训练配置 */}
          <div className="space-y-4">
            <div className="bg-slate-800/80 rounded-xl p-4 border border-slate-700">
              <h3 className="text-lg font-bold mb-4 flex items-center gap-2">
                <Target className="w-5 h-5 text-yellow-400" />
                训练重点
              </h3>
              <div className="grid grid-cols-2 gap-3">
                {FOCUS_OPTIONS.map((opt) => (
                  <button
                    key={opt.key}
                    onClick={() => setFocus(opt.key)}
                    className={`p-3 rounded-lg border-2 text-left transition-all ${
                      focus === opt.key
                        ? 'border-yellow-500 bg-yellow-500/10'
                        : 'border-slate-600 bg-slate-700/30 hover:bg-slate-700'
                    }`}
                  >
                    <div className={`flex items-center gap-2 mb-1 ${opt.color}`}>
                      {opt.icon}
                      <span className="font-bold">{opt.label}</span>
                    </div>
                    <div className="text-xs text-gray-400">当前 {player.stats[opt.key]}</div>
                  </button>
                ))}
              </div>
            </div>

            <div className="bg-slate-800/80 rounded-xl p-4 border border-slate-700">
              <h3 className="text-lg font-bold mb-4 flex items-center gap-2">
                <Zap className="w-5 h-5 text-orange-400" />
                训练强度
              </h3>
              <div className="space-y-2">
                {INTENSITY_OPTIONS.map((opt) => (
                  <button
                    key={opt.key}
                    onClick={() => setIntensity(opt.key)}
                    className={`w-full p-3 rounded-lg border-2 flex items-center justify-between transition-all ${
                      intensity === opt.key
                        ? 'border-orange-500 bg-orange-500/10'
                        : 'border-slate-600 bg-slate-700/30 hover:bg-slate-700'
                    }`}
                  >
                    <span className={`font-bold ${opt.color}`}>{opt.label}</span>
                    <span className="text-xs text-gray-400">
                      倍率 {INTENSITY_CONFIG[opt.key].multiplier}x / 风险 {INTENSITY_CONFIG[opt.key].riskMultiplier}x
                    </span>
                  </button>
                ))}
              </div>
            </div>

            {!result ? (
              <button
                onClick={handleSimulate}
                className="w-full flex items-center justify-center gap-2 px-6 py-4 bg-yellow-600 hover:bg-yellow-500 text-white rounded-xl font-bold transition-colors pixel-text"
              >
                <Play className="w-5 h-5" />
                开始 4 周训练模拟
              </button>
            ) : (
              <div className="flex gap-3">
                <button
                  onClick={() => setResult(null)}
                  className="flex-1 flex items-center justify-center gap-2 px-4 py-3 bg-slate-700 hover:bg-slate-600 text-white rounded-xl font-bold transition-colors"
                >
                  <RotateCcw className="w-4 h-4" />
                  重新模拟
                </button>
                <button
                  onClick={handleSave}
                  className="flex-1 flex items-center justify-center gap-2 px-4 py-3 bg-green-600 hover:bg-green-500 text-white rounded-xl font-bold transition-colors"
                >
                  <Save className="w-4 h-4" />
                  保存结果
                </button>
              </div>
            )}
          </div>

          {/* 右侧周次日志 */}
          <div className="space-y-4">
            <div className="bg-slate-800/80 rounded-xl p-4 border border-slate-700">
              <h3 className="text-lg font-bold mb-4">训练日志</h3>
              {!result ? (
                <div className="text-center py-12 text-gray-500">
                  <Play className="w-12 h-12 mx-auto mb-3 opacity-30" />
                  <p>点击开始训练查看 4 周模拟结果</p>
                </div>
              ) : (
                <div className="space-y-3">
                  {result.weekResults.map((week) => (
                    <div
                      key={week.week}
                      className={`p-3 rounded-lg border ${
                        week.injuryOccurred
                          ? 'bg-red-500/10 border-red-500/30'
                          : week.eventTriggered
                          ? 'bg-yellow-500/10 border-yellow-500/30'
                          : 'bg-slate-700/30 border-slate-600'
                      }`}
                    >
                      <div className="flex items-center justify-between mb-1">
                        <span className="text-sm font-bold text-white">第 {week.week} 周</span>
                        {week.injuryOccurred && (
                          <span className="flex items-center gap-1 text-xs text-red-400">
                            <AlertTriangle className="w-3 h-3" />
                            伤病
                          </span>
                        )}
                        {week.eventTriggered && !week.injuryOccurred && (
                          <span className="text-xs text-yellow-400">奇遇</span>
                        )}
                      </div>
                      <p className="text-xs text-gray-300 mb-2">{week.eventDescription}</p>
                      <div className="flex flex-wrap gap-2">
                        {Object.entries(week.statChanges).map(([key, value]) => (
                          <span
                            key={key}
                            className={`text-xs px-2 py-0.5 rounded ${
                              value > 0 ? 'bg-green-500/20 text-green-400' : 'bg-red-500/20 text-red-400'
                            }`}
                          >
                            {STAT_LABELS.find((s) => s.key === key)?.label} {value > 0 ? '+' : ''}{value}
                          </span>
                        ))}
                        <span className="text-xs px-2 py-0.5 rounded bg-yellow-500/20 text-yellow-400">
                          +{week.growthPointsEarned} GP
                        </span>
                      </div>
                    </div>
                  ))}

                  <div className="p-4 bg-green-500/10 border border-green-500/30 rounded-lg">
                    <div className="text-sm font-bold text-green-400 mb-2">训练总结</div>
                    <div className="text-xs text-gray-300 space-y-1">
                      <div>总评: {result.beforeOverall} → {result.afterOverall}</div>
                      <div>成长点: +{result.totalGrowthPoints}</div>
                      <div>
                        属性变化:{' '}
                        {Object.entries(result.totalStatChanges)
                          .filter(([, v]) => v !== 0)
                          .map(([key, value]) => {
                            const label = STAT_LABELS.find((s) => s.key === key)?.label || key;
                            return `${label} ${value > 0 ? '+' : ''}${value}`;
                          })
                          .join(' / ') || '无变化'}
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};
