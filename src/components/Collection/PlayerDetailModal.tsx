import { useEffect, useRef, useState } from 'react';
import { X, Trophy, Target, Zap } from 'lucide-react';
import { CampusPlayer } from '../../data/playerTypes';
import { findBestMatchingStar } from '../../data/starPlayers';
import { getPieceTypeName } from '../../data/chessRules';
import { RadarChart } from '../RadarChart';

interface PlayerDetailModalProps {
  player: CampusPlayer;
  onClose: () => void;
}

const STAT_ROWS: Array<{ key: keyof CampusPlayer['stats']; label: string; color: string }> = [
  { key: 'speed', label: '速度', color: 'text-green-400' },
  { key: 'shooting', label: '射门', color: 'text-yellow-400' },
  { key: 'passing', label: '传球', color: 'text-blue-400' },
  { key: 'dribbling', label: '盘带', color: 'text-purple-400' },
  { key: 'defense', label: '防守', color: 'text-red-400' },
  { key: 'physical', label: '体能', color: 'text-orange-400' }
];

const RARITY_COLORS: Record<CampusPlayer['rarity'], string> = {
  N: 'text-gray-400 border-gray-500 bg-gray-500/10',
  R: 'text-blue-400 border-blue-500 bg-blue-500/10',
  SR: 'text-purple-400 border-purple-500 bg-purple-500/10',
  SSR: 'text-yellow-400 border-yellow-500 bg-yellow-500/10'
};

const POSITION_COLORS: Record<CampusPlayer['position'], string> = {
  GK: '1B5E20',
  DEF: '0D47A1',
  MID: 'F57F17',
  FWD: 'B71C1C'
};

export const PlayerDetailModal = ({ player, onClose }: PlayerDetailModalProps) => {
  const match = findBestMatchingStar(player);
  const [imgError, setImgError] = useState(false);
  const overlayRef = useRef<HTMLDivElement>(null);

  const positionColor = POSITION_COLORS[player.position];
  const avatarUrl = imgError
    ? '/favicon.svg'
    : `https://api.dicebear.com/9.x/pixel-art/svg?seed=${encodeURIComponent(player.id)}&backgroundColor=${positionColor}`;

  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handleKey);
    return () => window.removeEventListener('keydown', handleKey);
  }, [onClose]);

  const handleOverlayClick = (e: React.MouseEvent) => {
    if (e.target === overlayRef.current) onClose();
  };

  return (
    <div
      ref={overlayRef}
      onClick={handleOverlayClick}
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm"
    >
      <div className="relative w-full max-w-4xl max-h-[90vh] overflow-y-auto bg-slate-900 border-2 border-green-500 rounded-2xl pixel-pop-in">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 z-10 p-2 bg-slate-800 hover:bg-slate-700 rounded-lg text-gray-400 hover:text-white transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="p-6 md:p-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8">
            {/* 左侧信息 */}
            <div className="space-y-5">
              <div className="flex items-start gap-4">
                <div className="w-24 h-24 md:w-32 md:h-32 rounded-xl overflow-hidden border-2 border-slate-600 bg-slate-800 flex-shrink-0">
                  <img
                    src={avatarUrl}
                    alt={player.name}
                    className="w-full h-full object-cover"
                    style={{ imageRendering: 'pixelated' }}
                    onError={() => setImgError(true)}
                  />
                </div>
                <div className="flex-1 min-w-0">
                  <div className={`inline-block px-2 py-0.5 rounded border text-xs font-bold mb-2 ${RARITY_COLORS[player.rarity]}`}>
                    {player.rarity}
                  </div>
                  <h2 className="text-xl md:text-2xl font-bold text-white pixel-text leading-tight mb-1">
                    {player.name}
                  </h2>
                  <p className="text-sm text-gray-400 mb-1">{player.positionCN} · {getPieceTypeName(player.chessPiece)}</p>
                  <p className="text-xs text-gray-500">{player.grade} · {player.major}</p>
                  <p className="text-xs text-green-400 mt-1">{player.era}</p>
                </div>
              </div>

              <div className="bg-slate-800/50 rounded-xl p-4 border border-slate-700">
                <h3 className="text-sm font-bold text-white mb-2 flex items-center gap-2">
                  <Trophy className="w-4 h-4 text-yellow-400" />
                  球员简介
                </h3>
                <p className="text-sm text-gray-300 leading-relaxed">{player.description}</p>
              </div>

              <div className="bg-slate-800/50 rounded-xl p-4 border border-slate-700">
                <h3 className="text-sm font-bold text-white mb-3 flex items-center gap-2">
                  <Target className="w-4 h-4 text-blue-400" />
                  六维能力
                </h3>
                <div className="grid grid-cols-2 gap-3">
                  {STAT_ROWS.map((s) => (
                    <div key={s.key} className="bg-slate-900/50 rounded-lg p-3">
                      <div className="flex justify-between items-center mb-1">
                        <span className="text-xs text-gray-400">{s.label}</span>
                        <span className={`text-sm font-bold ${s.color}`}>{player.stats[s.key]}</span>
                      </div>
                      <div className="h-2 bg-slate-700 rounded-full overflow-hidden">
                        <div
                          className="h-full bg-gradient-to-r from-green-500 to-green-400 rounded-full"
                          style={{ width: `${player.stats[s.key]}%` }}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="bg-slate-800/50 rounded-xl p-4 border border-slate-700">
                <h3 className="text-sm font-bold text-white mb-3 flex items-center gap-2">
                  <Zap className="w-4 h-4 text-orange-400" />
                  成长数据
                </h3>
                <div className="grid grid-cols-2 gap-3 text-sm">
                  <div className="bg-slate-900/50 rounded-lg p-3">
                    <div className="text-xs text-gray-400">训练等级</div>
                    <div className="text-lg font-bold text-white">Lv.{player.trainingLevel}</div>
                  </div>
                  <div className="bg-slate-900/50 rounded-lg p-3">
                    <div className="text-xs text-gray-400">成长点</div>
                    <div className="text-lg font-bold text-yellow-400">{player.growthPoints}</div>
                  </div>
                  <div className="bg-slate-900/50 rounded-lg p-3">
                    <div className="text-xs text-gray-400">出场</div>
                    <div className="text-lg font-bold text-white">{player.matchesPlayed}</div>
                  </div>
                  <div className="bg-slate-900/50 rounded-lg p-3">
                    <div className="text-xs text-gray-400">进球</div>
                    <div className="text-lg font-bold text-green-400">{player.goalsScored}</div>
                  </div>
                </div>
              </div>
            </div>

            {/* 右侧雷达图与对标 */}
            <div className="space-y-5">
              <div className="bg-slate-800/50 rounded-xl p-4 border border-slate-700">
                <h3 className="text-sm font-bold text-white mb-1">AI 球星对标</h3>
                <div className="flex items-center gap-3 mb-3">
                  <div className="text-2xl font-bold text-yellow-400">{match.similarity}%
                  </div>
                  <div className="text-sm text-gray-300">
                    与 <span className="font-bold text-white">{match.star.name}</span> 风格最接近
                  </div>
                </div>
                <p className="text-xs text-gray-400 mb-4">{match.star.country} · {match.star.positionCN} · {match.star.style}</p>

                <RadarChart
                  campusPlayer={player}
                  starPlayer={match.star}
                  similarity={match.similarity}
                  height={280}
                />
              </div>

              <div className="bg-slate-800/50 rounded-xl p-4 border border-slate-700">
                <h3 className="text-sm font-bold text-white mb-3 flex items-center gap-2">
                  <Zap className="w-4 h-4 text-green-400" />
                  高光时刻
                </h3>
                <ul className="space-y-2">
                  {player.highlights.map((h, i) => (
                    <li key={i} className="flex items-start gap-2 text-sm text-gray-300">
                      <span className="text-green-400 mt-1">▸</span>
                      <span>{h}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
