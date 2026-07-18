interface StatBarProps {
  label: string;
  base: number;
  boost?: number;
  color?: string;
}

export const StatBar = ({ label, base, boost = 0, color = 'bg-green-400' }: StatBarProps) => {
  const effective = Math.min(99, Math.max(1, base + boost));
  const displayBoost = boost > 0 ? `+${boost}` : boost < 0 ? `${boost}` : '';

  return (
    <div className="space-y-1">
      <div className="flex justify-between items-center text-xs">
        <span className="text-gray-400">{label}</span>
        <div className="flex items-center gap-1">
          <span className="font-bold text-white">{base}</span>
          {boost !== 0 && (
            <span className={`font-bold ${boost > 0 ? 'text-yellow-400' : 'text-red-400'}`}>
              {displayBoost}
            </span>
          )}
          <span className="text-gray-500">→</span>
          <span className="font-bold text-white">{effective}</span>
        </div>
      </div>
      <div className="h-2.5 bg-slate-700 rounded-full overflow-hidden">
        <div
          className={`h-full ${color} rounded-full transition-all duration-500`}
          style={{ width: `${effective}%` }}
        />
      </div>
    </div>
  );
};
