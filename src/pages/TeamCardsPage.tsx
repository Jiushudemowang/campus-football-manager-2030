import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Flag, Users } from 'lucide-react';

interface TeamCardInfo {
  id: string;
  folder: string;
  name: string;
  nameEn: string;
  flag: string;
  file: string;
  players: number;
}

const TEAMS: TeamCardInfo[] = [
  { id: 'argentina', folder: '阿根廷卡牌', name: '阿根廷', nameEn: 'Argentina', flag: '🇦🇷', file: 'argentina-cards.html', players: 14 },
  { id: 'brazil', folder: '巴西卡牌', name: '巴西', nameEn: 'Brazil', flag: '🇧🇷', file: 'brazil-cards.html', players: 11 },
  { id: 'germany', folder: '德国卡牌', name: '德国', nameEn: 'Germany', flag: '🇩🇪', file: 'germany-cards.html', players: 13 },
  { id: 'france', folder: '法国卡牌', name: '法国', nameEn: 'France', flag: '🇫🇷', file: 'france-cards.html', players: 13 },
  { id: 'england', folder: '英格兰卡牌', name: '英格兰', nameEn: 'England', flag: '🏴󠁧󠁢󠁥󠁮󠁧󠁿', file: 'england-cards.html', players: 13 },
  { id: 'croatia', folder: '克罗地亚卡牌', name: '克罗地亚', nameEn: 'Croatia', flag: '🇭🇷', file: 'croatia-cards.html', players: 13 },
  { id: 'japan', folder: '日本卡牌', name: '日本', nameEn: 'Japan', flag: '🇯🇵', file: 'japan-cards.html', players: 11 },
  { id: 'portugal', folder: '葡萄牙卡牌', name: '葡萄牙', nameEn: 'Portugal', flag: '🇵🇹', file: 'portugal-cards.html', players: 11 },
  { id: 'spain', folder: '西班牙卡牌', name: '西班牙', nameEn: 'Spain', flag: '🇪🇸', file: 'spain-cards.html', players: 13 }
];

export const TeamCardsPage = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-green-900/10 to-slate-900 text-white">
      <header className="sticky top-0 z-30 flex items-center p-4 bg-slate-900/95 backdrop-blur-sm border-b-4 border-yellow-500">
        <button
          onClick={() => navigate('/')}
          className="flex items-center gap-2 text-gray-300 hover:text-yellow-400 transition-colors px-4 py-2 rounded-lg hover:bg-yellow-500/20"
        >
          <ArrowLeft className="w-5 h-5" />
          <span className="pixel-text text-sm">返回主页</span>
        </button>
        <h1 className="text-xl font-bold text-white pixel-text mx-auto">世界杯球星卡牌</h1>
        <div className="w-24" />
      </header>

      <main className="container mx-auto px-4 py-6">
        <div className="text-center mb-8">
          <p className="text-gray-400 text-sm max-w-2xl mx-auto">
            查看 2026 世界杯参赛球队球星基准卡牌。点击国家队卡片即可浏览该队完整卡牌阵容。
          </p>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {TEAMS.map((team) => (
            <a
              key={team.id}
              href={`./team-cards/${encodeURIComponent(team.folder)}/${team.file}`}
              target="_blank"
              rel="noopener noreferrer"
              className="group relative overflow-hidden rounded-xl border-2 border-slate-700 bg-slate-800/50 p-5 hover:border-yellow-500 hover:bg-yellow-500/10 transition-all duration-300"
            >
              <div className="flex items-start justify-between mb-4">
                <span className="text-5xl" role="img" aria-label={team.name}>
                  {team.flag}
                </span>
                <Flag className="w-6 h-6 text-yellow-400 opacity-60 group-hover:opacity-100 transition-opacity" />
              </div>

              <h2 className="text-xl font-bold pixel-text text-white mb-1">{team.name}</h2>
              <p className="text-xs text-gray-500 uppercase tracking-wider mb-3">{team.nameEn}</p>

              <div className="flex items-center gap-2 text-sm text-gray-400">
                <Users className="w-4 h-4 text-green-400" />
                <span>{team.players} 张卡牌</span>
              </div>

              <div className="mt-4 text-xs text-yellow-400 opacity-0 group-hover:opacity-100 transition-opacity">
                点击查看 →
              </div>
            </a>
          ))}
        </div>
      </main>
    </div>
  );
};
