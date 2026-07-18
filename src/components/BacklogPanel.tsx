import { useGameStore } from '../stores/gameStore';
import { X } from 'lucide-react';
import { useEffect, useRef } from 'react';

interface BacklogPanelProps {
  onClose: () => void;
}

export const BacklogPanel = ({ onClose }: BacklogPanelProps) => {
  const dialogHistory = useGameStore((s) => s.dialogHistory);
  const scrollRef = useRef<HTMLDivElement>(null);

  // Auto-scroll to bottom when opened
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, []);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={onClose} />

      {/* Panel */}
      <div className="relative w-full max-w-2xl max-h-[80vh] bg-gradient-to-br from-slate-900 to-slate-800 border-4 border-green-500 rounded-xl shadow-2xl animate-fade-in overflow-hidden">
        {/* Corner decorations */}
        <div className="absolute top-0 left-0 w-3 h-3 bg-yellow-400" style={{ clipPath: 'polygon(0 0, 100% 0, 0 100%)' }} />
        <div className="absolute top-0 right-0 w-3 h-3 bg-yellow-400" style={{ clipPath: 'polygon(100% 0, 100% 100%, 0 0)' }} />

        {/* Header */}
        <div className="flex items-center justify-between p-4 bg-slate-900/90 border-b-2 border-green-500/50">
          <h2 className="text-lg font-bold text-white pixel-text flex items-center gap-2">
            📜 对话历史
          </h2>
          <div className="flex items-center gap-3">
            <span className="text-xs text-gray-500">
              {dialogHistory.length} 条记录
            </span>
            <button
              onClick={onClose}
              className="w-8 h-8 bg-slate-700 hover:bg-slate-600 rounded-lg flex items-center justify-center transition-colors border border-slate-500"
            >
              <X className="w-4 h-4 text-gray-300" />
            </button>
          </div>
        </div>

        {/* Scrollable content */}
        <div
          ref={scrollRef}
          className="p-4 space-y-3 overflow-y-auto max-h-[60vh] scrollbar-thin"
        >
          {dialogHistory.length === 0 ? (
            <div className="text-center py-12 text-gray-500">
              <p className="text-4xl mb-3">💬</p>
              <p className="text-sm pixel-text">暂无对话记录</p>
            </div>
          ) : (
            dialogHistory.map((dialog, index) => (
              <div
                key={index}
                className="flex items-start gap-3 p-3 bg-slate-800/50 rounded-lg border border-slate-700/50 hover:border-green-500/30 transition-colors"
              >
                {/* Speaker badge */}
                <div className="flex-shrink-0 px-3 py-1.5 bg-gradient-to-br from-green-600 to-green-800 rounded-lg border border-green-400/50">
                  <span className="text-white text-xs font-bold pixel-text" style={{ fontSize: '9px' }}>
                    {dialog.speaker.length > 4 ? dialog.speaker.slice(0, 4) : dialog.speaker}
                  </span>
                </div>

                {/* Text */}
                <div className="flex-1 min-w-0">
                  <p className="text-sm text-gray-200 leading-relaxed pixel-text" style={{ fontSize: '10px', lineHeight: '1.8' }}>
                    {dialog.text}
                  </p>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Footer hint */}
        <div className="p-3 bg-slate-900/90 border-t-2 border-green-500/30 text-center">
          <p className="text-xs text-gray-500">
            按 <kbd className="px-1.5 py-0.5 bg-slate-700 rounded text-green-400 text-xs">L</kbd> 或 <kbd className="px-1.5 py-0.5 bg-slate-700 rounded text-green-400 text-xs">ESC</kbd> 关闭
          </p>
        </div>
      </div>
    </div>
  );
};
