import { useState } from 'react';
import { Trophy } from 'lucide-react';

export interface MiniGameResult {
  result: 'win' | 'lose' | 'draw';
  score: number;
}

interface MiniGameWrapperProps {
  gameType: string;
  onComplete: (result: MiniGameResult) => void;
  onCancel?: () => void;
}

export const MiniGameWrapper = ({ gameType, onComplete }: MiniGameWrapperProps) => {
  const [result, setResult] = useState<MiniGameResult['result'] | null>(null);

  const handleGameEnd = (gameResult: MiniGameResult) => {
    setResult(gameResult.result);
    // Short delay to show result before continuing
    setTimeout(() => onComplete(gameResult), 2000);
  };

  // Dynamically import mini-game components
  // For now, use simple placeholder logic
  const renderGame = () => {
    if (result) {
      return (
        <div className="text-center animate-fade-in">
          <div className={`text-6xl mb-4 ${result === 'win' ? 'animate-bounce' : ''}`}>
            {result === 'win' ? '⚽🎉' : result === 'draw' ? '🤝' : '😔'}
          </div>
          <h3 className={`text-2xl font-bold pixel-text mb-2 ${
            result === 'win' ? 'text-yellow-400' :
            result === 'draw' ? 'text-blue-400' : 'text-red-400'
          }`}>
            {result === 'win' ? '胜利！' : result === 'draw' ? '平局' : '失利...'}
          </h3>
        </div>
      );
    }

    switch (gameType) {
      case 'penalty':
        return <PenaltyGame onComplete={handleGameEnd} />;
      case 'defense':
        return <DefenseGame onComplete={handleGameEnd} />;
      default:
        return <p className="text-gray-400">未知游戏类型</p>;
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/80" />
      <div className="relative w-full max-w-2xl bg-gradient-to-br from-slate-900 to-slate-800 border-4 border-yellow-500 rounded-xl p-6 shadow-2xl">
        <div className="absolute top-0 left-0 w-3 h-3 bg-yellow-400" style={{ clipPath: 'polygon(0 0, 100% 0, 0 100%)' }} />
        <div className="absolute top-0 right-0 w-3 h-3 bg-yellow-400" style={{ clipPath: 'polygon(100% 0, 100% 100%, 0 0)' }} />

        {renderGame()}
      </div>
    </div>
  );
};

// Placeholder components - will be replaced with Canvas games
const PenaltyGame = ({ onComplete }: { onComplete: (r: MiniGameResult) => void }) => {
  const [round, setRound] = useState(0);
  const [score, setScore] = useState({ player: 0, opponent: 0 });
  const [shooting, setShooting] = useState(false);

  const handleShoot = (direction: 'left' | 'center' | 'right') => {
    if (shooting) return;
    setShooting(true);

    // Random opponent save direction
    const saveDir = ['left', 'center', 'right'][Math.floor(Math.random() * 3)];
    const scored = direction !== saveDir;

    setTimeout(() => {
      const newScore = { ...score, player: score.player + (scored ? 1 : 0) };
      setScore(newScore);

      // Opponent shoots
      const oppScored = Math.random() > 0.4; // 60% chance opponent scores
      const oppNewScore = { ...newScore, opponent: newScore.opponent + (oppScored ? 1 : 0) };
      setScore(oppNewScore);

      const newRound = round + 1;
      setRound(newRound);
      setShooting(false);

      if (newRound >= 3) {
        const win = oppNewScore.player > oppNewScore.opponent;
        const draw = oppNewScore.player === oppNewScore.opponent;
        onComplete({ result: win ? 'win' : draw ? 'draw' : 'lose', score: oppNewScore.player });
      }
    }, 1000);
  };

  return (
    <div className="text-center">
      <h3 className="text-xl font-bold text-white pixel-text mb-4 flex items-center justify-center gap-2">
        <Trophy className="w-5 h-5 text-yellow-400" />
        点球大战
      </h3>

      <div className="flex justify-center gap-8 mb-6">
        <div className="text-center">
          <p className="text-green-400 text-sm pixel-text mb-1">新闻男足</p>
          <p className="text-4xl font-bold text-white">{score.player}</p>
        </div>
        <div className="text-center">
          <p className="text-gray-400 text-sm pixel-text mb-1">第{round + 1}/3轮</p>
        </div>
        <div className="text-center">
          <p className="text-red-400 text-sm pixel-text mb-1">对手</p>
          <p className="text-4xl font-bold text-white">{score.opponent}</p>
        </div>
      </div>

      {!shooting && round < 3 && (
        <div className="space-y-3">
          <p className="text-white text-sm pixel-text mb-3">选择射门方向：</p>
          <div className="flex justify-center gap-4">
            {(['left', 'center', 'right'] as const).map((dir) => (
              <button
                key={dir}
                onClick={() => handleShoot(dir)}
                className="px-6 py-8 bg-gradient-to-b from-green-600 to-green-800 hover:from-green-500 hover:to-green-700 text-white rounded-lg border-2 border-green-400 shadow-lg transform hover:scale-105 transition-all pixel-button"
              >
                <span className="block text-2xl mb-2">
                  {dir === 'left' ? '⬅️' : dir === 'center' ? '⬆️' : '➡️'}
                </span>
                <span className="text-xs pixel-text">
                  {dir === 'left' ? '左边' : dir === 'center' ? '中路' : '右边'}
                </span>
              </button>
            ))}
          </div>
        </div>
      )}

      {shooting && (
        <div className="animate-pulse text-yellow-400 text-lg pixel-text">
          射门中...
        </div>
      )}

      {/* Goal visualization */}
      <div className="mt-6 relative w-64 h-32 mx-auto border-2 border-white/30 rounded-lg overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-white/5 to-transparent" />
        <div className="absolute left-0 top-1/4 w-1 h-1/2 bg-white/50" />
        <div className="absolute right-0 top-1/4 w-1 h-1/2 bg-white/50" />
        <div className="absolute top-0 left-1/4 right-1/4 h-0.5 bg-white/50" />
      </div>
    </div>
  );
};

const DefenseGame = ({ onComplete }: { onComplete: (r: MiniGameResult) => void }) => {
  const [position, setPosition] = useState(1); // 0=left, 1=center, 2=right
  const [obstacles, setObstacles] = useState<number[]>([]);
  const [score, setScore] = useState(0);
  const [timeLeft, setTimeLeft] = useState(30);
  const [started, setStarted] = useState(false);

  // Simple defense game: move player to avoid obstacles
  // Placeholder logic
  const handleMove = (dir: number) => {
    setPosition(Math.max(0, Math.min(2, dir)));
  };

  const handleStart = () => {
    setStarted(true);
    // Simulate a simple score-based mini-game
    const timer = setInterval(() => {
      setTimeLeft((t) => {
        if (t <= 1) {
          clearInterval(timer);
          const gameResult: MiniGameResult = score >= 5 ? { result: 'win', score } : score >= 3 ? { result: 'draw', score } : { result: 'lose', score };
          onComplete(gameResult);
          return 0;
        }
        return t - 1;
      });
    }, 1000);

    const spawner = setInterval(() => {
      setObstacles([Math.floor(Math.random() * 3)]);
      // Auto-score if obstacle not at player position
      setScore((s) => s + Math.random() > 0.5 ? 1 : 0);
    }, 2000);

    setTimeout(() => clearInterval(spawner), 30000);
  };

  return (
    <div className="text-center">
      <h3 className="text-xl font-bold text-white pixel-text mb-4 flex items-center justify-center gap-2">
        ⚡ 防守反击
      </h3>

      {!started ? (
        <button
          onClick={handleStart}
          className="px-8 py-4 bg-gradient-to-r from-green-500 to-green-700 text-white rounded-xl text-lg font-bold pixel-text pixel-button animate-pulse"
        >
          开始！
        </button>
      ) : (
        <>
          <div className="flex justify-center gap-4 mb-4">
            <span className="text-yellow-400 text-sm pixel-text">得分: {score}</span>
            <span className="text-gray-400 text-sm pixel-text">时间: {timeLeft}s</span>
          </div>

          <div className="relative h-32 w-full max-w-xs mx-auto bg-slate-800 rounded-lg border border-slate-600 mb-4 overflow-hidden">
            {/* Player */}
            <div
              className="absolute bottom-2 w-8 h-8 bg-green-500 rounded-full transition-all duration-150 border-2 border-white"
              style={{ left: `${position * 40 + 14}%` }}
            />
            {/* Obstacles */}
            {obstacles.map((obs, i) => (
              <div
                key={i}
                className="absolute top-2 w-8 h-8 bg-red-500 rounded-full animate-bounce border-2 border-red-300"
                style={{ left: `${obs * 40 + 14}%` }}
              />
            ))}
          </div>

          <div className="flex justify-center gap-4">
            {['⬅️', '⬆️', '➡️'].map((arrow, i) => (
              <button
                key={i}
                onClick={() => handleMove(i)}
                className="w-16 h-16 bg-slate-700 hover:bg-slate-600 rounded-xl text-2xl border-2 border-slate-500 transition-all active:scale-90"
              >
                {arrow}
              </button>
            ))}
          </div>
        </>
      )}
    </div>
  );
};
