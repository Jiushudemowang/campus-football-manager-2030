import { CampusPlayer } from '../../data/playerTypes';

interface SquadSlotProps {
  index: number;
  player?: CampusPlayer;
  onRemove?: () => void;
}

const POSITION_COLORS: Record<CampusPlayer['position'], string> = {
  GK: '1B5E20',
  DEF: '0D47A1',
  MID: 'F57F17',
  FWD: 'B71C1C'
};

export const SquadSlot = ({ index, player, onRemove }: SquadSlotProps) => {
  if (!player) {
    return (
      <div className="aspect-square bg-slate-800/50 border-2 border-dashed border-slate-600 rounded-xl flex flex-col items-center justify-center text-slate-500">
        <span className="text-lg font-bold">{index + 1}</span>
        <span className="text-[10px]">空位</span>
      </div>
    );
  }

  const avatarUrl = `https://api.dicebear.com/9.x/pixel-art/svg?seed=${encodeURIComponent(player.id)}&backgroundColor=${POSITION_COLORS[player.position]}`;

  return (
    <div className="relative aspect-square bg-slate-800 border-2 border-green-500/50 rounded-xl overflow-hidden group">
      <img
        src={avatarUrl}
        alt={player.name}
        className="w-full h-full object-cover"
        style={{ imageRendering: 'pixelated' }}
      />
      <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/30 to-transparent" />
      <button
        onClick={onRemove}
        className="absolute top-1 right-1 w-5 h-5 bg-red-500/80 hover:bg-red-500 text-white rounded-full flex items-center justify-center text-xs opacity-0 group-hover:opacity-100 transition-opacity"
      >
        ×
      </button>
      <div className="absolute bottom-1 left-1 right-1">
        <p className="text-[10px] text-white font-bold truncate leading-tight">{player.name}</p>
        <p className="text-[9px] text-green-400">{player.positionCN}</p>
      </div>
    </div>
  );
};
