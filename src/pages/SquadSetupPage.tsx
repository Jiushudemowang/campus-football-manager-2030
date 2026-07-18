import { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Save, AlertCircle, Check } from 'lucide-react';
import { campusPlayers, getCampusPlayerById } from '../data/campusPlayers';
import { CampusPlayer } from '../data/playerTypes';
import { useGameStore } from '../stores/gameStore';
import { PlayerCard } from '../components/Collection/PlayerCard';
import { SquadSlot } from '../components/Manager/SquadSlot';

const MAX_SQUAD_SIZE = 8;

export const SquadSetupPage = () => {
  const navigate = useNavigate();
  const activeSquad = useGameStore((s) => s.activeSquad);
  const setActiveSquad = useGameStore((s) => s.setActiveSquad);

  const [selectedIds, setSelectedIds] = useState<string[]>(
    activeSquad?.playerIds.slice(0, MAX_SQUAD_SIZE) || []
  );

  const selectedPlayers = useMemo(() => {
    return selectedIds
      .map((id) => getCampusPlayerById(id))
      .filter((p): p is CampusPlayer => p !== undefined);
  }, [selectedIds]);

  const togglePlayer = (id: string) => {
    setSelectedIds((prev) => {
      if (prev.includes(id)) {
        return prev.filter((pid) => pid !== id);
      }
      if (prev.length >= MAX_SQUAD_SIZE) return prev;
      return [...prev, id];
    });
  };

  const removePlayer = (id: string) => {
    setSelectedIds((prev) => prev.filter((pid) => pid !== id));
  };

  const hasGoalkeeper = selectedPlayers.some((p) => p.chessPiece === 'king');
  const isValid = selectedIds.length === MAX_SQUAD_SIZE && hasGoalkeeper;

  const handleSave = () => {
    if (!isValid) return;
    setActiveSquad({ playerIds: selectedIds, formationName: '4-3-1' });
    navigate('/manager');
  };

  const validationMessage =
    selectedIds.length < MAX_SQUAD_SIZE
      ? `还需选择 ${MAX_SQUAD_SIZE - selectedIds.length} 名球员`
      : !hasGoalkeeper
      ? '阵容必须包含 1 名门将'
      : '阵容完整，可以保存';

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-green-900/10 to-slate-900 text-white">
      <header className="sticky top-0 z-30 flex items-center p-4 bg-slate-900/95 backdrop-blur-sm border-b-4 border-green-500">
        <button
          onClick={() => navigate('/manager')}
          className="flex items-center gap-2 text-gray-300 hover:text-green-400 transition-colors px-4 py-2 rounded-lg hover:bg-green-500/20"
        >
          <ArrowLeft className="w-5 h-5" />
          <span className="pixel-text text-sm">返回经理中枢</span>
        </button>
        <h1 className="text-xl font-bold text-white pixel-text mx-auto">球队阵容</h1>
        <button
          onClick={handleSave}
          disabled={!isValid}
          className={`
            flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-bold transition-colors
            ${isValid
              ? 'bg-green-600 hover:bg-green-500 text-white'
              : 'bg-slate-700 text-slate-400 cursor-not-allowed'}
          `}
        >
          <Save className="w-4 h-4" />
          保存阵容
        </button>
      </header>

      <main className="container mx-auto px-4 py-6">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* 球员池 */}
          <div className="lg:col-span-2 space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-bold pixel-text">球员池</h2>
              <span className="text-sm text-gray-400">已选择 {selectedIds.length}/{MAX_SQUAD_SIZE}</span>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
              {campusPlayers.map((player) => (
                <PlayerCard
                  key={player.id}
                  player={player}
                  isSelected={selectedIds.includes(player.id)}
                  onClick={() => togglePlayer(player.id)}
                />
              ))}
            </div>
          </div>

          {/* 当前阵容 */}
          <div className="space-y-4">
            <h2 className="text-lg font-bold pixel-text">当前阵容</h2>
            <div className="bg-slate-800/80 backdrop-blur-sm rounded-xl p-4 border border-slate-700">
              <div className="grid grid-cols-4 gap-3">
                {Array.from({ length: MAX_SQUAD_SIZE }, (_, i) => (
                  <SquadSlot
                    key={i}
                    index={i}
                    player={selectedPlayers[i]}
                    onRemove={selectedPlayers[i] ? () => removePlayer(selectedPlayers[i].id) : undefined}
                  />
                ))}
              </div>

              <div className={`mt-4 p-3 rounded-lg flex items-start gap-2 ${
                isValid ? 'bg-green-500/10 border border-green-500/30' : 'bg-yellow-500/10 border border-yellow-500/30'
              }`}>
                {isValid ? (
                  <>
                    <Check className="w-5 h-5 text-green-400 flex-shrink-0 mt-0.5" />
                    <span className="text-sm text-green-400">{validationMessage}</span>
                  </>
                ) : (
                  <>
                    <AlertCircle className="w-5 h-5 text-yellow-400 flex-shrink-0 mt-0.5" />
                    <span className="text-sm text-yellow-400">{validationMessage}</span>
                  </>
                )}
              </div>
            </div>

            <div className="bg-slate-800/50 rounded-xl p-4 border border-slate-700">
              <h3 className="text-sm font-bold text-white mb-2">阵容规则</h3>
              <ul className="text-xs text-gray-400 space-y-1">
                <li>• 必须选择恰好 8 名球员</li>
                <li>• 必须包含 1 名门将（棋子类型为 门将）</li>
                <li>• 球员按棋子类型对应棋盘初始位置</li>
                <li>• 保存后可在棋盘对战使用此阵容</li>
              </ul>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};
