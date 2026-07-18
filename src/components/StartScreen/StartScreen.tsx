
import { characters, CardRole } from '../../data/characters';
import { getCharacterById } from '../../data/characters';
import { useGameStore } from '../../stores/gameStore';
import { PlayerCard } from './PlayerCard';
import { SaveLoadScreen } from '../SaveLoadScreen';
import { Trophy, Calendar, Users, Star, Zap, Heart, Image, TrendingUp, Swords, Target, Flag } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useEffect, useState, CSSProperties } from 'react';

const StarField = () => {
  const [stars, setStars] = useState<Array<{ id: number; x: number; y: number; delay: number }>>([]);

  useEffect(() => {
    const newStars = Array.from({ length: 50 }, (_, i) => ({
      id: i,
      x: Math.random() * 100,
      y: Math.random() * 100,
      delay: Math.random() * 3
    }));
    setStars(newStars);
  }, []);

  return (
    <div className="absolute inset-0 overflow-hidden">
      {stars.map((star) => (
        <div
          key={star.id}
          className="absolute w-1 h-1 bg-white rounded-full animate-star-twinkle"
          style={{
            left: `${star.x}%`,
            top: `${star.y}%`,
            animationDelay: `${star.delay}s`
          }}
        />
      ))}
    </div>
  );
};

const PixelCloud = ({ className, style }: { className: string; style?: CSSProperties }) => (
  <div className={`absolute ${className}`} style={style}>
    <div className="relative">
      <div className="w-24 h-12 bg-white/20 rounded-full" />
      <div className="absolute -top-4 left-4 w-16 h-12 bg-white/20 rounded-full" />
      <div className="absolute -top-2 right-4 w-12 h-10 bg-white/20 rounded-full" />
    </div>
  </div>
);

const FloatingPixel = ({ delay, x, duration }: { delay: number; x: number; duration: number }) => (
  <div
    className="absolute w-2 h-2 bg-green-400 animate-float opacity-60"
    style={{
      left: `${x}%`,
      top: '20%',
      animationDelay: `${delay}s`,
      animationDuration: `${duration}s`
    }}
  />
);

export const StartScreen = () => {
  const unlockedCharacters = useGameStore((state) => state.unlockedCharacters);
  const completedEndings = useGameStore((state) => state.completedEndings);
  const saveSlots = useGameStore((state) => state.saveSlots);
  const selectCharacter = useGameStore((state) => state.selectCharacter);
  const navigate = useNavigate();

  const [showSaveLoad, setShowSaveLoad] = useState<'save' | 'load' | null>(null);
  const [activeFilter, setActiveFilter] = useState<CardRole | 'all'>('all');

  const filteredCharacters = activeFilter === 'all'
    ? characters
    : characters.filter((c) => c.role === activeFilter);

  const playerCount = characters.filter((c) => c.role !== 'staff').length;
  const staffCount = characters.filter((c) => c.role === 'staff').length;

  return (
    <div className="min-h-screen relative overflow-hidden" style={{
      background: 'linear-gradient(180deg, #0a0a1a 0%, #1a2a3a 50%, #0a0a1a 100%)'
    }}>
      <StarField />
      <PixelCloud className="top-20 left-10 animate-cloud-float" />
      <PixelCloud className="top-32 right-20 animate-cloud-float" style={{ animationDelay: '2s' }} />
      <PixelCloud className="bottom-40 left-1/4 animate-cloud-float" style={{ animationDelay: '4s' }} />

      {[...Array(5)].map((_, i) => (
        <FloatingPixel key={i} delay={i * 0.5} x={20 + i * 15} duration={3 + i * 0.5} />
      ))}

      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-green-900/5 to-transparent" />

      <div className="relative z-10 container mx-auto px-4 py-8">
        <header className="text-center mb-12">
        <div className="flex justify-center mb-6 animate-hero-float">
          <div className="relative">
            <div className="w-32 h-32 md:w-40 md:h-40 bg-gradient-to-br from-green-400 via-green-500 to-green-700 rounded-lg flex items-center justify-center transform rotate-12 hover:rotate-0 transition-transform duration-500 pixel-border hover-glow cursor-pointer pixel-victory">
              <Trophy className="w-16 h-16 md:w-20 md:h-20 text-white drop-shadow-lg" />
            </div>
              <div className="absolute -top-4 -right-4 w-12 h-12 bg-gradient-to-br from-yellow-400 to-orange-500 rounded-full flex items-center justify-center animate-bounce shadow-lg">
                <span className="text-white font-bold text-lg pixel-text">10</span>
              </div>
              <div className="absolute -bottom-2 -left-2 w-8 h-8 bg-gradient-to-br from-cyan-400 to-blue-500 rounded-full animate-pulse" />
            </div>
          </div>

          <h1 className="text-4xl md:text-6xl font-bold mb-4">
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-green-400 via-yellow-400 to-orange-500 animate-rainbow pixel-text">
              校园足球经理·2030
            </span>
          </h1>

          <h2 className="text-2xl md:text-4xl font-bold mb-6 glow-green text-green-400 pixel-text">
            AI 球星对标 · 棋盘战术 · 模拟成长
          </h2>

          <div className="flex justify-center gap-4 mb-6">
            <div className="px-4 py-2 bg-green-500/20 border-2 border-green-500 rounded-lg animate-pulse">
              <span className="text-green-400 text-xs md:text-sm">卡牌收集</span>
            </div>
            <div className="px-4 py-2 bg-yellow-500/20 border-2 border-yellow-500 rounded-lg animate-pulse" style={{ animationDelay: '0.5s' }}>
              <span className="text-yellow-400 text-xs md:text-sm">AI 球星对标</span>
            </div>
            <div className="px-4 py-2 bg-orange-500/20 border-2 border-orange-500 rounded-lg animate-pulse" style={{ animationDelay: '1s' }}>
              <span className="text-orange-400 text-xs md:text-sm">棋盘对战</span>
            </div>
          </div>

          <p className="text-gray-400 max-w-2xl mx-auto text-sm md:text-base leading-relaxed">
            以华中科技大学
            <span className="text-green-400">新闻男足</span>
            真实数据为基础，把象棋棋盘改造成足球场。
            <br />
            用 AI 为校园球员匹配世界杯球星，组建华科梦之队挑战传奇 AI。
          </p>

          <div className="flex justify-center gap-2 mt-6">
            <Heart className="w-5 h-5 text-red-500 animate-bounce" />
            <span className="text-red-400 text-sm animate-pulse">新闻男足 · 快乐就完事了</span>
            <Heart className="w-5 h-5 text-red-500 animate-bounce" />
          </div>

          {/* 操作按钮栏 */}
          <div className="flex justify-center gap-3 mt-6 flex-wrap">
            <button
              onClick={() => navigate('/match')}
              className="flex items-center gap-2 px-5 py-3 bg-green-600 hover:bg-green-500 text-white rounded-xl transition-all duration-200 border-2 border-green-400 pixel-button-glow group"
            >
              <Swords className="w-4 h-4 text-yellow-300" />
              <span className="text-sm font-bold pixel-text">棋盘对战</span>
            </button>
            <button
              onClick={() => navigate('/manager')}
              className="flex items-center gap-2 px-5 py-3 bg-indigo-600/80 hover:bg-indigo-500 text-white rounded-xl transition-all duration-200 border-2 border-indigo-400 text-sm font-bold pixel-text"
            >
              <Users className="w-4 h-4" />
              经理中枢
            </button>
            <button
              onClick={() => navigate('/collection')}
              className="flex items-center gap-2 px-5 py-3 bg-purple-600/80 hover:bg-purple-500 text-white rounded-xl transition-all duration-200 border-2 border-purple-400 text-sm font-bold pixel-text"
            >
              <Image className="w-4 h-4" />
              球员图鉴
            </button>
            <button
              onClick={() => navigate('/team-cards')}
              className="flex items-center gap-2 px-5 py-3 bg-amber-600/80 hover:bg-amber-500 text-white rounded-xl transition-all duration-200 border-2 border-amber-400 text-sm font-bold pixel-text"
            >
              <Flag className="w-4 h-4" />
              世界杯卡牌
            </button>
            <button
              onClick={() => navigate('/timeline')}
              className="flex items-center gap-2 px-5 py-3 bg-cyan-600/80 hover:bg-cyan-500 text-white rounded-xl transition-all duration-200 border-2 border-cyan-400 text-sm font-bold pixel-text"
            >
              <TrendingUp className="w-4 h-4" />
              十年战绩
            </button>
            <button
              onClick={() => navigate('/game')}
              className="flex items-center gap-2 px-5 py-3 bg-blue-600/80 hover:bg-blue-500 text-white rounded-xl transition-all duration-200 border-2 border-blue-400 text-sm font-bold pixel-text"
            >
              <Target className="w-4 h-4" />
              故事模式
            </button>
          </div>
        </header>

        {/* 校园球员卡牌 - FIFA 风格 */}
        <div className="mb-12">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-xl md:text-2xl font-bold text-white pixel-text">
              <span className="text-green-400">校园球员</span>卡牌
            </h3>
          </div>

          {/* 筛选条 */}
          <div className="flex justify-center flex-wrap gap-2 mb-6">
            {([
              { key: 'all', label: '⚽ 全部', role: 'all' as const },
              { key: 'gk', label: '🧤 门将', role: 'gk' as CardRole },
              { key: 'def', label: '🛡️ 后卫', role: 'def' as CardRole },
              { key: 'mid', label: '⚙️ 中场', role: 'mid' as CardRole },
              { key: 'fwd', label: '⚡ 前锋', role: 'fwd' as CardRole },
              { key: 'staff', label: '📋 教练/经理', role: 'staff' as CardRole },
            ] as const).map(({ key, label, role }) => (
              <button
                key={key}
                onClick={() => setActiveFilter(role)}
                className={`px-3 py-1.5 rounded-full border text-[11px] font-semibold uppercase tracking-wide transition-all duration-300 ${
                  activeFilter === role
                    ? 'bg-gradient-to-r from-[#1B3A6B] to-[#6B4C9A] border-transparent text-white shadow-lg shadow-indigo-500/20'
                    : 'border-white/5 bg-white/[0.02] text-white/30 hover:border-white/10 hover:text-white/50'
                }`}
              >
                {label}
              </button>
            ))}
          </div>

          {/* 卡牌网格 */}
          <div className="flex justify-center flex-wrap gap-5">
            {filteredCharacters.map((character, index) => (
              <div
                key={character.id}
                className="animate-slide-right"
                style={{ animationDelay: `${index * 0.05}s` }}
              >
                <PlayerCard character={character} />
              </div>
            ))}
          </div>
        </div>

        <footer className="text-center text-gray-500 text-xs md:text-sm pb-8">
          <div className="flex flex-wrap justify-center gap-6 mb-6">
            <div className="flex items-center gap-2 px-4 py-2 bg-slate-800/50 rounded-lg border border-slate-700">
              <Users className="w-5 h-5 text-green-400" />
              <span className="text-white">{playerCount} 位球员</span>
            </div>
            <div className="flex items-center gap-2 px-4 py-2 bg-slate-800/50 rounded-lg border border-slate-700">
              <Calendar className="w-5 h-5 text-yellow-400" />
              <span className="text-white">2016-2026</span>
            </div>
            <div className="flex items-center gap-2 px-4 py-2 bg-slate-800/50 rounded-lg border border-slate-700">
              <Trophy className="w-5 h-5 text-orange-400" />
              <span className="text-white">{completedEndings.length} 个结局</span>
            </div>
            <div className="flex items-center gap-2 px-4 py-2 bg-slate-800/50 rounded-lg border border-slate-700">
              <Zap className="w-5 h-5 text-cyan-400" />
              <span className="text-white">多结局</span>
            </div>
          </div>

          <div className="flex justify-center gap-4 mb-4">
            <Star className="w-4 h-4 text-yellow-400 animate-star-twinkle" />
            <Star className="w-4 h-4 text-yellow-400 animate-star-twinkle" style={{ animationDelay: '0.5s' }} />
            <Star className="w-4 h-4 text-yellow-400 animate-star-twinkle" style={{ animationDelay: '1s' }} />
          </div>

          <p className="text-xs text-gray-600">
            © 2026 绿茵纪 · 第二届 AIGC 应用大赛参赛作品 · 改编自华中科技大学新闻男足真实故事
          </p>
        </footer>
      </div>

      <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-green-900/20 to-transparent pointer-events-none" />

      {/* Save/Load Modal */}
      {showSaveLoad && (
        <SaveLoadScreen
          mode={showSaveLoad}
          onClose={() => setShowSaveLoad(null)}
          onLoad={(slotIndex) => {
            const slot = saveSlots[slotIndex];
            if (slot) {
              const char = getCharacterById(slot.characterId);
              if (char) selectCharacter(char);
              navigate('/game');
            }
          }}
        />
      )}
    </div>
  );
};
