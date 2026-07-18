import { Character } from '../../data/characters';
import { useGameStore } from '../../stores/gameStore';
import { useNavigate } from 'react-router-dom';
import { Lock, Star, Zap } from 'lucide-react';
import { useState } from 'react';

interface CharacterCardProps {
  character: Character;
  isUnlocked: boolean;
}

export const CharacterCard = ({ character, isUnlocked }: CharacterCardProps) => {
  const selectCharacter = useGameStore((state) => state.selectCharacter);
  const navigate = useNavigate();
  const [flipped, setFlipped] = useState(false);

  const handleEnterStory = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (isUnlocked) {
      selectCharacter(character);
      navigate('/game');
    }
  };

  const handleFlip = () => {
    if (isUnlocked) {
      setFlipped((prev) => !prev);
    }
  };

  const getEraColor = (era: string) => {
    if (era.includes('拓荒')) return 'from-green-500 to-green-700';
    if (era.includes('黄金')) return 'from-yellow-500 to-orange-500';
    if (era.includes('重建')) return 'from-orange-500 to-red-500';
    return 'from-cyan-500 to-blue-500';
  };

  const getEraIcon = (era: string) => {
    if (era.includes('拓荒')) return '⚔️';
    if (era.includes('黄金')) return '✨';
    if (era.includes('重建')) return '🔥';
    return '🌟';
  };

  const getEraLabel = (era: string) => {
    if (era.includes('拓荒')) return '拓荒时代';
    if (era.includes('黄金')) return '黄金一代';
    if (era.includes('重建')) return '重建时代';
    return '全时代';
  };

  const isLocalPhoto = !character.image.includes('dicebear');

  return (
    <div
      onClick={handleFlip}
      className={`
        group relative transition-all duration-300 transform
        ${isUnlocked ? 'cursor-pointer hover:scale-105 pixel-pop-in' : 'opacity-60 cursor-not-allowed grayscale'}
      `}
      style={{ perspective: '1000px' }}
    >
      <div
        className={`
          relative w-full transition-transform duration-700
          ${flipped ? '[transform:rotateY(180deg)]' : ''}
        `}
        style={{ minHeight: '420px', transformStyle: 'preserve-3d' }}
      >
        {/* 正面 */}
        <div className="absolute inset-0 rounded-xl overflow-hidden border-2 border-slate-700 bg-slate-800 shadow-xl" style={{ backfaceVisibility: 'hidden' }}>
          <div className="pixel-corner pixel-corner-tl" />
          <div className="pixel-corner pixel-corner-tr" />
          <div className="pixel-corner pixel-corner-bl" />
          <div className="pixel-corner pixel-corner-br" />

          {!isUnlocked && (
            <div className="absolute inset-0 bg-black/70 flex flex-col items-center justify-center z-20">
              <Lock className="w-12 h-12 text-gray-500 mb-2" />
              <span className="text-gray-400 text-xs pixel-text" style={{ fontSize: '10px' }}>未解锁</span>
            </div>
          )}

          {isUnlocked && (
            <div className="absolute top-3 right-3 z-10">
              <div className="flex items-center gap-1 px-3 py-1 bg-gradient-to-r from-yellow-400 to-orange-500 rounded pixel-bounce border-2 border-white shadow-lg">
                <Star className="w-3 h-3 text-white" />
                <span className="text-white text-xs font-bold pixel-text" style={{ fontSize: '8px' }}>NEW</span>
              </div>
            </div>
          )}

          <div className="aspect-square relative overflow-hidden">
            <img
              src={character.image}
              alt={character.name}
              className={`
                w-full h-full object-cover transition-all duration-300
                ${isUnlocked ? 'group-hover:scale-110' : 'grayscale'}
                ${isLocalPhoto ? '' : 'pixelated'}
              `}
            />

            <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/30 to-transparent" />

            <div className="absolute bottom-3 left-3 right-3">
              <div className={`px-3 py-1 bg-gradient-to-r ${getEraColor(character.era)} rounded-full inline-flex items-center gap-1 mb-2 border-2 border-white shadow`}>
                <span className="text-white text-xs font-bold pixel-text" style={{ fontSize: '8px' }}>
                  {getEraIcon(character.era)} {getEraLabel(character.era)}
                </span>
              </div>
            </div>
          </div>

          <div className="p-4">
            <h3 className="text-sm font-bold text-white mb-2 pixel-text leading-tight" style={{ fontSize: '12px' }}>
              {character.name}
            </h3>
            <p className="text-xs text-gray-400 mb-3 flex items-center gap-2">
              <span className="px-2 py-1 bg-green-500/20 border-2 border-green-500/50 rounded text-green-400 pixel-text" style={{ fontSize: '8px' }}>
                {character.grade}
              </span>
              <span className="px-2 py-1 bg-blue-500/20 border-2 border-blue-500/50 rounded text-blue-400 pixel-text" style={{ fontSize: '8px' }}>
                {character.position}
              </span>
            </p>

            {isUnlocked && (
              <button
                onClick={handleEnterStory}
                className="w-full flex items-center justify-center gap-2 py-2 bg-gradient-to-r from-green-500/20 to-green-600/20 border-2 border-green-500/30 rounded-lg pixel-pulse hover:bg-green-500/30 transition-colors"
              >
                <Zap className="w-4 h-4 text-green-400" />
                <span className="text-green-400 text-xs font-bold pixel-text" style={{ fontSize: '9px' }}>点击体验叙事</span>
              </button>
            )}
          </div>
        </div>

        {/* 背面 */}
        <div
          className="absolute inset-0 rounded-xl overflow-hidden border-2 border-yellow-500/50 bg-slate-800/95 p-4 shadow-xl flex flex-col"
          style={{ backfaceVisibility: 'hidden', transform: 'rotateY(180deg)' }}
        >
          <div className="pixel-corner pixel-corner-tl" />
          <div className="pixel-corner pixel-corner-tr" />
          <div className="pixel-corner pixel-corner-bl" />
          <div className="pixel-corner pixel-corner-br" />

          <div className="flex items-center gap-3 mb-3">
            <img
              src={character.image}
              alt={character.name}
              className={`w-14 h-14 rounded-lg object-cover border-2 border-yellow-500/50 ${isLocalPhoto ? '' : 'pixelated'}`}
            />
            <div className="flex-1 min-w-0">
              <h3 className="text-sm font-bold text-white pixel-text leading-tight" style={{ fontSize: '12px' }}>
                {character.name}
              </h3>
              <p className="text-xs text-gray-400 mt-1">{character.grade} · {character.position}</p>
            </div>
          </div>

          <div className={`px-3 py-1 bg-gradient-to-r ${getEraColor(character.era)} rounded-full inline-flex items-center gap-1 mb-3 border-2 border-white/30 shadow self-start`}>
            <span className="text-white text-xs font-bold pixel-text" style={{ fontSize: '8px' }}>
              {getEraIcon(character.era)} {getEraLabel(character.era)}
            </span>
          </div>

          <p className="text-xs text-gray-300 leading-relaxed mb-3 flex-1" style={{ fontSize: '10px' }}>
            {character.description}
          </p>

          <div className="mb-3">
            <div className="text-xs text-gray-500 mb-2 pixel-text" style={{ fontSize: '8px' }}>故事线</div>
            <div className="flex flex-wrap gap-1.5">
              {character.storyLine.map((story, index) => (
                <span
                  key={index}
                  className="text-xs px-2 py-1 bg-slate-700/70 border border-slate-600 rounded text-gray-300 pixel-text"
                  style={{ fontSize: '8px' }}
                >
                  {story}
                </span>
              ))}
            </div>
          </div>

          {isUnlocked && (
            <button
              onClick={handleEnterStory}
              className="w-full flex items-center justify-center gap-2 py-2 bg-gradient-to-r from-green-500/20 to-green-600/20 border-2 border-green-500/30 rounded-lg pixel-pulse hover:bg-green-500/30 transition-colors"
            >
              <Zap className="w-4 h-4 text-green-400" />
              <span className="text-green-400 text-xs font-bold pixel-text" style={{ fontSize: '9px' }}>点击体验叙事</span>
            </button>
          )}

          {!isUnlocked && (
            <div className="flex items-center justify-center gap-2 py-2 bg-slate-700/30 border-2 border-slate-600 rounded-lg">
              <Lock className="w-4 h-4 text-gray-500" />
              <span className="text-gray-500 text-xs font-bold pixel-text" style={{ fontSize: '9px' }}>未解锁</span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
