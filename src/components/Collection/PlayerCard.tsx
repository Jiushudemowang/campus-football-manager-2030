import { useState } from 'react';
import { CampusPlayer } from '../../data/playerTypes';
import { getPieceTypeName } from '../../data/chessRules';
import { Lock } from 'lucide-react';

interface PlayerCardProps {
  player: CampusPlayer;
  isUnlocked?: boolean;
  isSelected?: boolean;
  showTrainingLevel?: boolean;
  growthPoints?: number;
  onClick?: () => void;
}

const RARITY_STYLES: Record<CampusPlayer['rarity'], { border: string; text: string; bg: string; glow: string }> = {
  N: {
    border: 'border-gray-500',
    text: 'text-gray-400',
    bg: 'bg-gray-500/10',
    glow: 'hover:shadow-gray-500/20'
  },
  R: {
    border: 'border-blue-500',
    text: 'text-blue-400',
    bg: 'bg-blue-500/10',
    glow: 'hover:shadow-blue-500/20'
  },
  SR: {
    border: 'border-purple-500',
    text: 'text-purple-400',
    bg: 'bg-purple-500/10',
    glow: 'hover:shadow-purple-500/20'
  },
  SSR: {
    border: 'border-yellow-500',
    text: 'text-yellow-400',
    bg: 'bg-yellow-500/10',
    glow: 'hover:shadow-yellow-500/20'
  }
};

const POSITION_COLORS: Record<CampusPlayer['position'], string> = {
  GK: '1B5E20',
  DEF: '0D47A1',
  MID: 'F57F17',
  FWD: 'B71C1C'
};

const MINI_STATS: Array<{ key: keyof CampusPlayer['stats']; label: string; color: string }> = [
  { key: 'speed', label: '速度', color: 'bg-green-400' },
  { key: 'shooting', label: '射门', color: 'bg-yellow-400' },
  { key: 'defense', label: '防守', color: 'bg-red-400' }
];

export const PlayerCard = ({ player, isUnlocked = true, isSelected = false, showTrainingLevel = false, onClick }: PlayerCardProps) => {
  const rarity = RARITY_STYLES[player.rarity];
  const [imgError, setImgError] = useState(false);

  const positionColor = POSITION_COLORS[player.position];
  const avatarUrl = imgError
    ? '/favicon.svg'
    : `https://api.dicebear.com/9.x/pixel-art/svg?seed=${encodeURIComponent(player.id)}&backgroundColor=${positionColor}`;

  return (
    <div
      onClick={onClick}
      className={`
        relative group transition-all duration-300 transform
        ${isUnlocked ? 'cursor-pointer hover:scale-[1.03]' : 'opacity-60 cursor-not-allowed'}
      `}
    >
      <div
        className={`
          pixel-card h-full flex flex-col relative overflow-hidden
          border-2 ${isSelected ? 'border-green-400 ring-2 ring-green-400 ring-offset-2 ring-offset-slate-900' : rarity.border}
          ${rarity.glow} hover:shadow-lg
        `}
      >
        <div className="pixel-corner pixel-corner-tl" />
        <div className="pixel-corner pixel-corner-tr" />
        <div className="pixel-corner pixel-corner-bl" />
        <div className="pixel-corner pixel-corner-br" />

        {isSelected && (
          <div className="absolute top-2 left-2 z-20 w-6 h-6 bg-green-500 rounded-full flex items-center justify-center border-2 border-white shadow-lg">
            <svg className="w-4 h-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
            </svg>
          </div>
        )}

        {!isUnlocked && (
          <div className="absolute inset-0 bg-black/70 flex flex-col items-center justify-center z-20">
            <Lock className="w-10 h-10 text-gray-500 mb-2" />
            <span className="text-gray-400 text-xs pixel-text">未解锁</span>
          </div>
        )}

        <div className={`absolute top-2 right-2 z-10 px-2 py-0.5 rounded border ${rarity.border} ${rarity.bg} ${rarity.text} text-xs font-bold pixel-text`}>
          {player.rarity}
        </div>

        {showTrainingLevel && (
          <div className="absolute top-2 left-2 z-10 px-2 py-0.5 rounded border border-green-500 bg-green-500/10 text-green-400 text-xs font-bold pixel-text">
            Lv.{player.trainingLevel}
          </div>
        )}

        <div className="aspect-square relative overflow-hidden bg-slate-900">
          <img
            src={avatarUrl}
            alt={player.name}
            className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110"
            style={{ imageRendering: 'pixelated' }}
            onError={() => setImgError(true)}
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/30 to-transparent" />

          <div className="absolute bottom-2 left-2 right-2">
            <div className="flex items-center gap-2">
              <span className="px-2 py-0.5 bg-slate-800/80 border border-slate-600 rounded text-[10px] text-gray-300 pixel-text">
                {player.positionCN}
              </span>
              <span className="px-2 py-0.5 bg-slate-800/80 border border-slate-600 rounded text-[10px] text-gray-300 pixel-text">
                {getPieceTypeName(player.chessPiece)}
              </span>
            </div>
          </div>
        </div>

        <div className="p-3 flex-1 flex flex-col">
          <div className="flex items-start justify-between mb-2">
            <h3 className="text-sm font-bold text-white pixel-text leading-tight" style={{ fontSize: '12px' }}>
              {player.name}
            </h3>
            <div className="text-right">
              <div className={`text-lg font-bold ${rarity.text}`} style={{ fontSize: '18px', lineHeight: 1 }}>
                {player.overall}
              </div>
              <div className="text-[9px] text-gray-500">总评</div>
            </div>
          </div>

          <p className="text-[10px] text-gray-400 mb-3 line-clamp-2">{player.style}</p>

          <div className="space-y-1.5 mt-auto">
            {MINI_STATS.map((s) => (
              <div key={s.key} className="flex items-center gap-2">
                <span className="text-[9px] text-gray-500 w-6">{s.label}</span>
                <div className="flex-1 h-1.5 bg-slate-700 rounded-full overflow-hidden">
                  <div
                    className={`h-full ${s.color} rounded-full`}
                    style={{ width: `${player.stats[s.key]}%` }}
                  />
                </div>
                <span className="text-[9px] text-gray-300 w-5 text-right">{player.stats[s.key]}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
