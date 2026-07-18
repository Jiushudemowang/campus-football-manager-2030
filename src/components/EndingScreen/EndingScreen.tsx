
import { useGameStore } from '../../stores/gameStore';
import { getStoryByCharacterId } from '../../data/stories';
import { Home, RotateCcw, Star } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export const EndingScreen = () => {
  const currentCharacter = useGameStore((state) => state.currentCharacter);
  const endingType = useGameStore((state) => state.endingType);
  const endingScore = useGameStore((state) => state.endingScore);
  const completeEnding = useGameStore((state) => state.completeEnding);
  const saveGame = useGameStore((state) => state.saveGame);

  const navigate = useNavigate();

  if (!currentCharacter) {
    return (
      <div className="min-h-screen bg-slate-900 flex items-center justify-center">
        <p className="text-white text-xl">请先选择一位球员开始体验</p>
      </div>
    );
  }

  const story = getStoryByCharacterId(currentCharacter.id);
  const ending = story?.endings[endingType] || story?.endings.normal || '恭喜你完成了这个故事！';

  completeEnding(`${currentCharacter.id}_${endingType}`);
  saveGame();

  const endingConfig = {
    good: {
      title: '光辉结局',
      color: 'from-green-400 to-emerald-600',
      borderColor: 'border-green-500',
      textColor: 'text-green-400',
      icon: '🏆'
    },
    normal: {
      title: '平凡结局',
      color: 'from-blue-400 to-cyan-600',
      borderColor: 'border-blue-500',
      textColor: 'text-blue-400',
      icon: '⭐'
    },
    bad: {
      title: '遗憾结局',
      color: 'from-orange-400 to-red-600',
      borderColor: 'border-orange-500',
      textColor: 'text-orange-400',
      icon: '💔'
    }
  };

  const config = endingConfig[endingType];

  const handleBackHome = () => {
    navigate('/');
  };

  const handleReplay = () => {
    navigate('/');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-green-900/30 to-slate-900 flex items-center justify-center">
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-green-500/10 rounded-full blur-3xl" />
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-orange-500/10 rounded-full blur-3xl" />
      </div>

      <div className="relative z-10 max-w-2xl w-full mx-4">
        <div className="bg-slate-800/95 backdrop-blur-sm rounded-2xl p-8 border border-slate-700 text-center">
          <div className="mb-6">
            <div className={`inline-flex items-center justify-center w-24 h-24 bg-gradient-to-br ${config.color} rounded-full mb-4`}>
              <span className="text-4xl">{config.icon}</span>
            </div>
            <h1 className="text-3xl font-bold text-white mb-2">{config.title}</h1>
            <p className="text-gray-400">{currentCharacter.name} 的故事</p>
            <p className="text-xs text-gray-500 mt-1">结局分数: {endingScore}</p>
          </div>

          <div className={`bg-slate-700/50 rounded-xl p-6 mb-6 border ${config.borderColor}`}>
            <div className="flex items-center justify-center gap-2 mb-4">
              <Star className={`w-5 h-5 ${config.textColor}`} />
              <span className={`${config.textColor} font-semibold`}>结局</span>
              <Star className={`w-5 h-5 ${config.textColor}`} />
            </div>
            <p className="text-white text-lg leading-relaxed">
              {ending}
            </p>
          </div>

          <div className="flex items-center justify-center gap-4 mb-6">
            <div className="w-20 h-20 rounded-full overflow-hidden border-2 border-green-500">
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
              onClick={handleReplay}
              className="w-full flex items-center justify-center gap-2 px-6 py-3 bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white font-semibold rounded-xl transition-all duration-200"
            >
              <RotateCcw className="w-5 h-5" />
              重新开始
            </button>
            <button
              onClick={handleBackHome}
              className="w-full flex items-center justify-center gap-2 px-6 py-3 bg-slate-700 hover:bg-slate-600 text-white font-semibold rounded-xl transition-all duration-200"
            >
              <Home className="w-5 h-5" />
              返回主页
            </button>
          </div>

          <p className="mt-8 text-gray-500 text-sm">
            "绿茵纪 · 用 AI 记录体育历史"
          </p>
        </div>
      </div>
    </div>
  );
};
