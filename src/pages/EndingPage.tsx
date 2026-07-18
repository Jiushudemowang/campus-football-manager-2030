import { useEffect } from 'react';
import { useGameStore } from '../stores/gameStore';
import { getStoryByCharacterId } from '../data/stories';
import { Trophy, Home, RotateCcw, Star, Sparkles } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export const EndingPage = () => {
  const currentCharacter = useGameStore((state) => state.currentCharacter);
  const endingType = useGameStore((state) => state.endingType);
  const endingScore = useGameStore((state) => state.endingScore);
  const completeEnding = useGameStore((state) => state.completeEnding);
  const saveGame = useGameStore((state) => state.saveGame);

  const navigate = useNavigate();

  // Side effects moved into useEffect (fixes React anti-pattern)
  useEffect(() => {
    if (currentCharacter) {
      completeEnding(`${currentCharacter.id}_ending`);
      saveGame();
    }
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  if (!currentCharacter) {
    return (
      <div className="min-h-screen bg-slate-900 flex items-center justify-center">
        <p className="text-white text-xl">请先选择一位球员开始游戏</p>
      </div>
    );
  }

  const story = getStoryByCharacterId(currentCharacter.id);
  const ending = story?.endings[endingType] || story?.endings.normal || '恭喜你完成了这个故事！';

  // Visual theme based on endingType
  const themes = {
    good: {
      gradient: 'from-yellow-400 to-yellow-600',
      accent: 'text-yellow-400',
      border: 'border-yellow-500',
      bgGlow: 'bg-yellow-500/10',
      bgGlow2: 'bg-yellow-500/5',
      label: '完美结局',
      labelColor: 'text-yellow-400',
      iconBg: 'from-yellow-400 to-yellow-600',
      message: '恭喜！你打出了最好的结局！',
    },
    normal: {
      gradient: 'from-green-400 to-green-600',
      accent: 'text-green-400',
      border: 'border-green-500',
      bgGlow: 'bg-green-500/10',
      bgGlow2: 'bg-green-500/5',
      label: '普通结局',
      labelColor: 'text-green-400',
      iconBg: 'from-green-400 to-green-600',
      message: '故事圆满落幕，感谢你的陪伴！',
    },
    bad: {
      gradient: 'from-blue-400 to-gray-500',
      accent: 'text-blue-400',
      border: 'border-blue-500/50',
      bgGlow: 'bg-blue-500/10',
      bgGlow2: 'bg-gray-500/5',
      label: '未完待续...',
      labelColor: 'text-blue-400',
      iconBg: 'from-blue-400 to-gray-500',
      message: '也许下一次会更好...',
    },
  };

  const theme = themes[endingType] || themes.normal;

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-green-900/30 to-slate-900 flex items-center justify-center">
      <div className="absolute inset-0 overflow-hidden">
        <div className={`absolute top-1/4 left-1/4 w-96 h-96 ${theme.bgGlow} rounded-full blur-3xl`} />
        <div className={`absolute bottom-1/4 right-1/4 w-96 h-96 ${theme.bgGlow2} rounded-full blur-3xl`} />
      </div>

      <div className="relative z-10 max-w-2xl w-full mx-4">
        <div className={`bg-slate-800/95 backdrop-blur-sm rounded-2xl p-8 border ${theme.border} text-center`}>
          <div className="mb-6">
            <div className={`inline-flex items-center justify-center w-24 h-24 bg-gradient-to-br ${theme.iconBg} rounded-full mb-4 relative`}>
              {endingType === 'good' ? (
                <>
                  <Trophy className="w-12 h-12 text-white" />
                  <Sparkles className="w-5 h-5 text-yellow-200 absolute -top-1 -right-1 animate-pulse" />
                </>
              ) : (
                <Star className="w-12 h-12 text-white" />
              )}
            </div>
            <h1 className="text-3xl font-bold text-white mb-2">故事完成</h1>
            <p className="text-gray-400">{currentCharacter.name} 的故事</p>
          </div>

          <div className="bg-slate-700/50 rounded-xl p-6 mb-6">
            <div className="flex items-center justify-center gap-2 mb-4">
              <Star className={`w-5 h-5 ${theme.accent}`} />
              <span className={`${theme.labelColor} font-semibold`}>
                {theme.label}
              </span>
              <Star className={`w-5 h-5 ${theme.accent}`} />
            </div>
            <p className="text-white text-lg leading-relaxed">
              {ending}
            </p>
            <div className="mt-4 flex items-center justify-center gap-2">
              <span className="text-gray-500 text-sm">结局分值:</span>
              <span className={`text-sm font-bold ${
                endingScore > 0 ? 'text-yellow-400' :
                endingScore < 0 ? 'text-blue-400' : 'text-green-400'
              }`}>
                {endingScore > 0 ? '+' : ''}{endingScore}
              </span>
            </div>
            <p className={`mt-3 text-xs italic opacity-60 ${theme.labelColor}`}>
              {theme.message}
            </p>
          </div>

          <div className="flex items-center justify-center gap-4 mb-6">
            <div className={`w-20 h-20 rounded-full overflow-hidden border-2 ${theme.border}`}>
              <img
                src={currentCharacter.image}
                alt={currentCharacter.name}
                className="w-full h-full object-cover"
              />
            </div>
            <div className="text-left">
              <h3 className="text-white font-bold text-lg">{currentCharacter.name}</h3>
              <p className="text-gray-400 text-sm">{currentCharacter.grade} | {currentCharacter.position}</p>
              <p className="text-gray-500 text-xs">{currentCharacter.era}</p>
            </div>
          </div>

          <div className="space-y-3">
            <button
              onClick={() => navigate('/')}
              className={`w-full flex items-center justify-center gap-2 px-6 py-3 bg-gradient-to-r ${theme.gradient} hover:opacity-90 text-white font-semibold rounded-xl transition-all duration-200`}
            >
              <RotateCcw className="w-5 h-5" />
              重新开始
            </button>
            <button
              onClick={() => navigate('/')}
              className="w-full flex items-center justify-center gap-2 px-6 py-3 bg-slate-700 hover:bg-slate-600 text-white font-semibold rounded-xl transition-all duration-200"
            >
              <Home className="w-5 h-5" />
              返回主页
            </button>
          </div>

          <p className="mt-8 text-gray-500 text-sm">
            "新闻男足，快乐就完事了！"
          </p>
        </div>
      </div>
    </div>
  );
};
