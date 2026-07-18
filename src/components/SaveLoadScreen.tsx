import { useGameStore, SaveSlot } from '../stores/gameStore';
import { Save, Trash2, X, Clock, User, MapPin } from 'lucide-react';
import { useState } from 'react';

interface SaveLoadScreenProps {
  mode: 'save' | 'load';
  onClose: () => void;
  onLoad?: (slotIndex: number) => void;
}

const formatTimestamp = (ts: number): string => {
  const d = new Date(ts);
  return `${d.getFullYear()}/${(d.getMonth() + 1).toString().padStart(2, '0')}/${d.getDate().toString().padStart(2, '0')} ${d.getHours().toString().padStart(2, '0')}:${d.getMinutes().toString().padStart(2, '0')}`;
};

export const SaveLoadScreen = ({ mode, onClose, onLoad }: SaveLoadScreenProps) => {
  const saveSlots = useGameStore((s) => s.saveSlots);
  const saveToSlot = useGameStore((s) => s.saveToSlot);
  const loadFromSlot = useGameStore((s) => s.loadFromSlot);
  const deleteSlot = useGameStore((s) => s.deleteSlot);
  const currentCharacter = useGameStore((s) => s.currentCharacter);

  const [confirmDelete, setConfirmDelete] = useState<number | null>(null);
  const [savedMessage, setSavedMessage] = useState<number | null>(null);

  const handleSave = (slotIndex: number) => {
    saveToSlot(slotIndex);
    setSavedMessage(slotIndex);
    setTimeout(() => setSavedMessage(null), 2000);
  };

  const handleLoad = (slotIndex: number) => {
    const slot = saveSlots[slotIndex];
    if (!slot) return;
    loadFromSlot(slotIndex);
    if (onLoad) {
      onLoad(slotIndex);
    }
    onClose();
  };

  const handleDelete = (slotIndex: number) => {
    deleteSlot(slotIndex);
    setConfirmDelete(null);
  };

  const renderSlot = (slot: SaveSlot | null, index: number) => (
    <div
      key={index}
      className={`relative p-4 rounded-xl border-2 transition-all duration-300 ${
        slot
          ? 'border-green-500/50 bg-slate-800/80 hover:border-green-400 hover:bg-slate-700/80'
          : 'border-slate-600/30 bg-slate-800/40'
      }`}
    >
      {/* Slot number */}
      <div className="absolute -top-3 -left-3 w-8 h-8 bg-gradient-to-br from-green-500 to-green-700 rounded-lg flex items-center justify-center border-2 border-white/20 shadow-lg">
        <span className="text-white font-bold text-sm pixel-text">{index + 1}</span>
      </div>

      {slot ? (
        <div className="pl-4 pt-1">
          {/* Character name and timestamp */}
          <div className="flex items-center gap-2 mb-2">
            <div className="w-8 h-8 bg-gradient-to-br from-yellow-500 to-orange-600 rounded-full flex items-center justify-center border-2 border-white/30">
              <User className="w-4 h-4 text-white" />
            </div>
            <div>
              <p className="text-white text-sm font-bold pixel-text" style={{ fontSize: '10px' }}>{slot.characterName}</p>
              <div className="flex items-center gap-1 text-gray-400">
                <Clock className="w-3 h-3" />
                <p className="text-xs" style={{ fontSize: '8px' }}>{formatTimestamp(slot.timestamp)}</p>
              </div>
            </div>
          </div>

          {/* Scene info */}
          <div className="flex items-center gap-1 text-gray-400 mb-3">
            <MapPin className="w-3 h-3" />
            <span className="text-xs pixel-text" style={{ fontSize: '8px' }}>场景: {slot.sceneId}</span>
          </div>

          {/* Buttons */}
          <div className="flex gap-2">
            {mode === 'save' ? (
              <button
                onClick={() => handleSave(index)}
                className={`flex-1 flex items-center justify-center gap-1 px-3 py-2 rounded-lg text-xs font-bold transition-all duration-200 pixel-text ${
                  savedMessage === index
                    ? 'bg-green-500 text-white'
                    : 'bg-green-600/50 hover:bg-green-500 text-green-300 hover:text-white border border-green-500/50'
                }`}
                style={{ fontSize: '8px' }}
              >
                <Save className="w-3 h-3" />
                {savedMessage === index ? '已保存!' : '覆盖保存'}
              </button>
            ) : (
              <button
                onClick={() => handleLoad(index)}
                className="flex-1 flex items-center justify-center gap-1 px-3 py-2 bg-blue-600/50 hover:bg-blue-500 text-blue-300 hover:text-white rounded-lg transition-all duration-200 border border-blue-500/50 text-xs font-bold pixel-text"
                style={{ fontSize: '8px' }}
              >
                读取
              </button>
            )}

            {confirmDelete === index ? (
              <div className="flex gap-1">
                <button
                  onClick={() => handleDelete(index)}
                  className="px-2 py-2 bg-red-600 hover:bg-red-500 text-white rounded-lg transition-all duration-200"
                >
                  <Trash2 className="w-3 h-3" />
                </button>
                <button
                  onClick={() => setConfirmDelete(null)}
                  className="px-2 py-2 bg-gray-600 hover:bg-gray-500 text-white rounded-lg transition-all duration-200"
                >
                  <X className="w-3 h-3" />
                </button>
              </div>
            ) : (
              <button
                onClick={() => setConfirmDelete(index)}
                className="px-2 py-2 bg-red-600/30 hover:bg-red-600/50 text-red-400 hover:text-red-300 rounded-lg transition-all duration-200 border border-red-500/30"
              >
                <Trash2 className="w-3 h-3" />
              </button>
            )}
          </div>
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center py-6 text-center">
          <div className="w-16 h-16 bg-slate-700/50 rounded-full flex items-center justify-center mb-3 border-2 border-dashed border-slate-600">
            <Save className="w-6 h-6 text-slate-500" />
          </div>
          <p className="text-slate-500 text-xs pixel-text" style={{ fontSize: '9px' }}>
            {mode === 'save' ? '空存档位' : '无存档'}
          </p>
          {mode === 'save' && currentCharacter && (
            <button
              onClick={() => handleSave(index)}
              className="mt-3 px-4 py-2 bg-green-600/50 hover:bg-green-500 text-green-300 hover:text-white rounded-lg transition-all duration-200 border border-green-500/50 text-xs font-bold pixel-text"
              style={{ fontSize: '9px' }}
            >
              <Save className="w-3 h-3 inline mr-1" />
              保存到此
            </button>
          )}
        </div>
      )}
    </div>
  );

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" onClick={onClose} />

      {/* Panel */}
      <div className="relative w-full max-w-lg bg-gradient-to-br from-slate-900 to-slate-800 border-4 border-green-500 rounded-xl p-6 shadow-2xl animate-fade-in pixel-bg-pattern">
        {/* Corner decorations */}
        <div className="absolute top-0 left-0 w-4 h-4 bg-yellow-400" style={{ clipPath: 'polygon(0 0, 100% 0, 0 100%)' }} />
        <div className="absolute top-0 right-0 w-4 h-4 bg-yellow-400" style={{ clipPath: 'polygon(100% 0, 100% 100%, 0 0)' }} />
        <div className="absolute bottom-0 left-0 w-4 h-4 bg-yellow-400" style={{ clipPath: 'polygon(0 100%, 100% 100%, 0 0)' }} />
        <div className="absolute bottom-0 right-0 w-4 h-4 bg-yellow-400" style={{ clipPath: 'polygon(100% 100%, 100% 0, 0 100%)' }} />

        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-bold text-white pixel-text flex items-center gap-2">
            <Save className="w-5 h-5 text-green-400" />
            {mode === 'save' ? '保存游戏' : '读取存档'}
          </h2>
          <button
            onClick={onClose}
            className="w-8 h-8 bg-slate-700 hover:bg-slate-600 rounded-lg flex items-center justify-center transition-colors border border-slate-500"
          >
            <X className="w-4 h-4 text-gray-300" />
          </button>
        </div>

        {/* Save slots */}
        <div className="space-y-4">
          {[0, 1, 2].map((i) => renderSlot(saveSlots[i], i))}
        </div>

        {/* Footer */}
        <div className="mt-4 text-center">
          <p className="text-gray-500 text-xs" style={{ fontSize: '8px' }}>
            {mode === 'save' ? '选择空位保存新存档，或覆盖已有存档' : '选择一个存档读取，将恢复当时的游戏进度'}
          </p>
        </div>
      </div>
    </div>
  );
};
