import { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Users } from 'lucide-react';
import { campusPlayers } from '@/data/campusPlayers';
import { CampusPlayer, Rarity } from '@/data/playerTypes';
import { FilterBar } from '@/components/Collection/FilterBar';
import { PlayerCard } from '@/components/Collection/PlayerCard';
import { PlayerDetailModal } from '@/components/Collection/PlayerDetailModal';

const RARITY_ORDER: Record<Rarity, number> = { N: 1, R: 2, SR: 3, SSR: 4 };

export const CollectionPage = () => {
  const navigate = useNavigate();
  const [search, setSearch] = useState('');
  const [selectedRarities, setSelectedRarities] = useState<string[]>([]);
  const [selectedPositions, setSelectedPositions] = useState<string[]>([]);
  const [selectedEras, setSelectedEras] = useState<string[]>([]);
  const [sortBy, setSortBy] = useState('overallDesc');
  const [selectedPlayer, setSelectedPlayer] = useState<CampusPlayer | null>(null);

  const toggleFilter = (value: string, list: string[], setter: (v: string[]) => void) => {
    if (list.includes(value)) {
      setter(list.filter((item) => item !== value));
    } else {
      setter([...list, value]);
    }
  };

  const filteredPlayers = useMemo(() => {
    let result = [...campusPlayers];

    if (search.trim()) {
      const kw = search.toLowerCase();
      result = result.filter(
        (p) =>
          p.name.toLowerCase().includes(kw) ||
          p.style.toLowerCase().includes(kw) ||
          p.description.toLowerCase().includes(kw) ||
          p.highlights.some((h) => h.toLowerCase().includes(kw))
      );
    }

    if (selectedRarities.length) {
      result = result.filter((p) => selectedRarities.includes(p.rarity));
    }

    if (selectedPositions.length) {
      result = result.filter((p) => selectedPositions.includes(p.position));
    }

    if (selectedEras.length) {
      result = result.filter((p) => selectedEras.some((e) => p.era.includes(e)));
    }

    switch (sortBy) {
      case 'overallAsc':
        result.sort((a, b) => a.overall - b.overall);
        break;
      case 'overallDesc':
        result.sort((a, b) => b.overall - a.overall);
        break;
      case 'rarityDesc':
        result.sort((a, b) => RARITY_ORDER[b.rarity] - RARITY_ORDER[a.rarity]);
        break;
      case 'nameAsc':
        result.sort((a, b) => a.name.localeCompare(b.name, 'zh-CN'));
        break;
    }

    return result;
  }, [search, selectedRarities, selectedPositions, selectedEras, sortBy]);

  const resetFilters = () => {
    setSearch('');
    setSelectedRarities([]);
    setSelectedPositions([]);
    setSelectedEras([]);
    setSortBy('overallDesc');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-green-900/10 to-slate-900 text-white">
      <header className="sticky top-0 z-30 flex items-center p-4 bg-slate-900/95 backdrop-blur-sm border-b-4 border-green-500">
        <button
          onClick={() => navigate('/')}
          className="flex items-center gap-2 text-gray-300 hover:text-green-400 transition-colors px-4 py-2 rounded-lg hover:bg-green-500/20"
        >
          <ArrowLeft className="w-5 h-5" />
          <span className="pixel-text text-sm">返回主页</span>
        </button>
        <h1 className="text-xl font-bold text-white pixel-text mx-auto">球员卡图鉴</h1>
        <div className="flex items-center gap-2 px-3 py-1.5 bg-slate-800 rounded-lg border border-slate-700">
          <Users className="w-4 h-4 text-green-400" />
          <span className="text-sm text-gray-300">{campusPlayers.length}</span>
        </div>
      </header>

      <main className="container mx-auto px-4 py-6">
        <FilterBar
          search={search}
          onSearchChange={setSearch}
          selectedRarities={selectedRarities}
          onRarityToggle={(r) => toggleFilter(r, selectedRarities, setSelectedRarities)}
          selectedPositions={selectedPositions}
          onPositionToggle={(p) => toggleFilter(p, selectedPositions, setSelectedPositions)}
          selectedEras={selectedEras}
          onEraToggle={(e) => toggleFilter(e, selectedEras, setSelectedEras)}
          sortBy={sortBy}
          onSortChange={setSortBy}
          resultCount={filteredPlayers.length}
          totalCount={campusPlayers.length}
        />

        {filteredPlayers.length > 0 ? (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 mt-6">
            {filteredPlayers.map((player) => (
              <PlayerCard
                key={player.id}
                player={player}
                onClick={() => setSelectedPlayer(player)}
              />
            ))}
          </div>
        ) : (
          <div className="mt-12 text-center py-16 bg-slate-800/50 rounded-2xl border-2 border-dashed border-slate-600">
            <div className="text-5xl mb-4">🔍</div>
            <p className="text-gray-400 text-lg pixel-text mb-2">未找到匹配球员</p>
            <p className="text-gray-500 text-sm mb-6">换个关键词或重置筛选条件试试</p>
            <button
              onClick={resetFilters}
              className="px-6 py-3 bg-green-600 hover:bg-green-500 text-white rounded-xl font-bold transition-colors pixel-text"
            >
              重置筛选
            </button>
          </div>
        )}
      </main>

      {selectedPlayer && (
        <PlayerDetailModal
          player={selectedPlayer}
          onClose={() => setSelectedPlayer(null)}
        />
      )}
    </div>
  );
};
