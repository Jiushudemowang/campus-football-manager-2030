import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Image, Trophy } from 'lucide-react';
import { useGameStore } from '../stores/gameStore';

// Placeholder GalleryPage - will be fully implemented in Phase 2.3
export const GalleryPage = () => {
  const navigate = useNavigate();
  const unlockedCGs = useGameStore((s) => s.unlockedCGs);
  const unlockedAchievements = useGameStore((s) => s.unlockedAchievements);
  const completedEndings = useGameStore((s) => s.completedEndings);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-green-900/20 to-slate-900">
      {/* Header */}
      <header className="flex items-center p-4 bg-slate-900/90 backdrop-blur-sm border-b-4 border-green-500">
        <button
          onClick={() => navigate('/')}
          className="flex items-center gap-2 text-gray-300 hover:text-green-400 transition-colors px-4 py-2 rounded-lg hover:bg-green-500/20"
        >
          <ArrowLeft className="w-5 h-5" />
          <span className="pixel-text text-sm">返回主页</span>
        </button>
        <h1 className="text-xl font-bold text-white pixel-text mx-auto">图鉴与成就</h1>
        <div className="w-24" />
      </header>

      <div className="container mx-auto px-4 py-8">
        {/* CG Gallery Section */}
        <section className="mb-12">
          <h2 className="text-lg font-bold text-white pixel-text mb-4 flex items-center gap-2">
            <Image className="w-5 h-5 text-green-400" />
            CG 图鉴
            <span className="text-xs text-gray-500">({unlockedCGs.length} 解锁)</span>
          </h2>
          {unlockedCGs.length === 0 ? (
            <div className="text-center py-16 bg-slate-800/50 rounded-xl border-2 border-dashed border-slate-600">
              <Image className="w-12 h-12 text-slate-600 mx-auto mb-3" />
              <p className="text-slate-500 text-sm pixel-text">暂无解锁CG</p>
              <p className="text-slate-600 text-xs mt-1">完成角色的故事来解锁CG</p>
            </div>
          ) : (
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {unlockedCGs.map((cg) => (
                <div key={cg} className="bg-slate-800 rounded-lg p-2 border border-slate-700">
                  <div className="aspect-video bg-slate-700 rounded flex items-center justify-center">
                    <Image className="w-8 h-8 text-green-500" />
                  </div>
                  <p className="text-xs text-gray-400 mt-1 text-center">{cg}</p>
                </div>
              ))}
            </div>
          )}
        </section>

        {/* Achievements Section */}
        <section className="mb-12">
          <h2 className="text-lg font-bold text-white pixel-text mb-4 flex items-center gap-2">
            <Trophy className="w-5 h-5 text-yellow-400" />
            成就
            <span className="text-xs text-gray-500">({unlockedAchievements.length} 解锁)</span>
          </h2>
          <div className="space-y-3">
            {[
              { id: 'first_complete', title: '初次通关', desc: '完成任意一位角色的故事', icon: '⭐', unlocked: completedEndings.length >= 1 },
              { id: 'three_endings', title: '故事收藏家', desc: '完成3个角色的故事', icon: '📚', unlocked: completedEndings.length >= 3 },
              { id: 'all_endings', title: '全故事通关', desc: '完成所有角色的故事', icon: '🏆', unlocked: completedEndings.length >= 11 },
              { id: 'cg_collector', title: 'CG收藏家', desc: '解锁5张CG', icon: '🖼️', unlocked: unlockedCGs.length >= 5 },
            ].map((ach) => (
              <div
                key={ach.id}
                className={`flex items-center gap-4 p-4 rounded-xl border-2 transition-all duration-300 ${
                  ach.unlocked
                    ? 'bg-green-900/20 border-green-500/50'
                    : 'bg-slate-800/50 border-slate-600/30 opacity-50'
                }`}
              >
                <div className={`w-12 h-12 rounded-full flex items-center justify-center text-2xl ${
                  ach.unlocked ? 'bg-green-500/20' : 'bg-slate-700/50'
                }`}>
                  {ach.icon}
                </div>
                <div>
                  <h3 className={`text-sm font-bold pixel-text ${ach.unlocked ? 'text-green-400' : 'text-gray-500'}`}>
                    {ach.title}
                  </h3>
                  <p className="text-xs text-gray-500 mt-1">{ach.desc}</p>
                </div>
                {ach.unlocked && (
                  <div className="ml-auto text-green-400 text-sm">✓ 已解锁</div>
                )}
              </div>
            ))}
          </div>
        </section>
      </div>
    </div>
  );
};
