import { Search, X } from 'lucide-react';

interface FilterBarProps {
  search: string;
  onSearchChange: (v: string) => void;
  selectedRarities: string[];
  onRarityToggle: (r: string) => void;
  selectedPositions: string[];
  onPositionToggle: (p: string) => void;
  selectedEras: string[];
  onEraToggle: (e: string) => void;
  sortBy: string;
  onSortChange: (s: string) => void;
  resultCount: number;
  totalCount: number;
}

const RARITIES = [
  { key: 'SSR', label: 'SSR', color: 'text-yellow-400 border-yellow-500 bg-yellow-500/10' },
  { key: 'SR', label: 'SR', color: 'text-purple-400 border-purple-500 bg-purple-500/10' },
  { key: 'R', label: 'R', color: 'text-blue-400 border-blue-500 bg-blue-500/10' },
  { key: 'N', label: 'N', color: 'text-gray-400 border-gray-500 bg-gray-500/10' }
];

const POSITIONS = [
  { key: 'GK', label: '门将' },
  { key: 'DEF', label: '后卫' },
  { key: 'MID', label: '中场' },
  { key: 'FWD', label: '前锋' }
];

const ERAS = [
  { key: '拓荒', label: '拓荒时代' },
  { key: '黄金', label: '黄金一代' },
  { key: '重建', label: '重建时代' },
  { key: '十周年', label: '十周年' }
];

const SORTS = [
  { key: 'overallDesc', label: '总评 高→低' },
  { key: 'overallAsc', label: '总评 低→高' },
  { key: 'rarityDesc', label: '稀有度 高→低' },
  { key: 'nameAsc', label: '姓名 A-Z' }
];

export const FilterBar = ({
  search,
  onSearchChange,
  selectedRarities,
  onRarityToggle,
  selectedPositions,
  onPositionToggle,
  selectedEras,
  onEraToggle,
  sortBy,
  onSortChange,
  resultCount,
  totalCount
}: FilterBarProps) => {
  const hasActiveFilters =
    search || selectedRarities.length || selectedPositions.length || selectedEras.length;

  const clearFilters = () => {
    onSearchChange('');
    selectedRarities.forEach(onRarityToggle);
    selectedPositions.forEach(onPositionToggle);
    selectedEras.forEach(onEraToggle);
  };

  return (
    <div className="bg-slate-800/80 backdrop-blur-sm rounded-xl p-4 border border-slate-700 space-y-4">
      <div className="flex flex-col md:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
          <input
            type="text"
            value={search}
            onChange={(e) => onSearchChange(e.target.value)}
            placeholder="搜索球员、风格、故事..."
            className="w-full pl-10 pr-4 py-2 bg-slate-900 border-2 border-slate-700 rounded-lg text-sm text-white placeholder-gray-500 focus:border-green-500 focus:outline-none pixel-text"
            style={{ fontSize: '11px' }}
          />
        </div>
        <div className="flex items-center gap-2">
          <select
            value={sortBy}
            onChange={(e) => onSortChange(e.target.value)}
            className="px-3 py-2 bg-slate-900 border-2 border-slate-700 rounded-lg text-sm text-white focus:border-green-500 focus:outline-none pixel-text"
            style={{ fontSize: '11px' }}
          >
            {SORTS.map((s) => (
              <option key={s.key} value={s.key}>{s.label}</option>
            ))}
          </select>
          {hasActiveFilters && (
            <button
              onClick={clearFilters}
              className="flex items-center gap-1 px-3 py-2 bg-slate-700 hover:bg-slate-600 rounded-lg text-xs text-gray-300 transition-colors"
            >
              <X className="w-3 h-3" />
              重置
            </button>
          )}
        </div>
      </div>

      <div className="space-y-2">
        <div className="flex flex-wrap items-center gap-2">
          <span className="text-xs text-gray-500 mr-1">稀有度:</span>
          {RARITIES.map((r) => {
            const active = selectedRarities.includes(r.key);
            return (
              <button
                key={r.key}
                onClick={() => onRarityToggle(r.key)}
                className={`px-3 py-1 rounded border text-xs font-bold transition-all ${
                  active
                    ? `${r.color} ring-1 ring-offset-1 ring-offset-slate-900`
                    : 'text-gray-500 border-slate-600 bg-slate-700/30 hover:bg-slate-700'
                }`}
                style={{ fontSize: '10px' }}
              >
                {r.label}
              </button>
            );
          })}
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <span className="text-xs text-gray-500 mr-1">位置:</span>
          {POSITIONS.map((p) => {
            const active = selectedPositions.includes(p.key);
            return (
              <button
                key={p.key}
                onClick={() => onPositionToggle(p.key)}
                className={`px-3 py-1 rounded border text-xs transition-all ${
                  active
                    ? 'text-green-400 border-green-500 bg-green-500/10 ring-1 ring-offset-1 ring-offset-slate-900'
                    : 'text-gray-500 border-slate-600 bg-slate-700/30 hover:bg-slate-700'
                }`}
                style={{ fontSize: '10px' }}
              >
                {p.label}
              </button>
            );
          })}
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <span className="text-xs text-gray-500 mr-1">年代:</span>
          {ERAS.map((e) => {
            const active = selectedEras.includes(e.key);
            return (
              <button
                key={e.key}
                onClick={() => onEraToggle(e.key)}
                className={`px-3 py-1 rounded border text-xs transition-all ${
                  active
                    ? 'text-yellow-400 border-yellow-500 bg-yellow-500/10 ring-1 ring-offset-1 ring-offset-slate-900'
                    : 'text-gray-500 border-slate-600 bg-slate-700/30 hover:bg-slate-700'
                }`}
                style={{ fontSize: '10px' }}
              >
                {e.label}
              </button>
            );
          })}
        </div>
      </div>

      <div className="flex justify-between items-center text-xs text-gray-500 border-t border-slate-700 pt-3">
        <span>共 {resultCount} / {totalCount} 名球员</span>
        {hasActiveFilters && <span className="text-green-400">已启用筛选</span>}
      </div>
    </div>
  );
};
