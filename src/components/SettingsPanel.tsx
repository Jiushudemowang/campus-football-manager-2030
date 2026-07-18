import { useGameStore, GameSettings } from '../stores/gameStore';
import { X, Volume2, VolumeX, Type, Clock, Music } from 'lucide-react';

interface SettingsPanelProps {
  onClose: () => void;
}

export const SettingsPanel = ({ onClose }: SettingsPanelProps) => {
  const settings = useGameStore((s) => s.settings);
  const updateSettings = useGameStore((s) => s.updateSettings);

  const handleChange = (key: keyof GameSettings, value: number | boolean) => {
    updateSettings({ [key]: value });
    // Immediately persist to localStorage
    const state = useGameStore.getState();
    state.saveGame();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={onClose} />

      {/* Panel */}
      <div className="relative w-full max-w-md bg-gradient-to-br from-slate-900 to-slate-800 border-4 border-green-500 rounded-xl p-6 shadow-2xl animate-fade-in">
        {/* Corner decorations */}
        <div className="absolute top-0 left-0 w-3 h-3 bg-yellow-400" style={{ clipPath: 'polygon(0 0, 100% 0, 0 100%)' }} />
        <div className="absolute top-0 right-0 w-3 h-3 bg-yellow-400" style={{ clipPath: 'polygon(100% 0, 100% 100%, 0 0)' }} />

        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-bold text-white pixel-text flex items-center gap-2">
            ⚙️ 设置
          </h2>
          <button
            onClick={onClose}
            className="w-8 h-8 bg-slate-700 hover:bg-slate-600 rounded-lg flex items-center justify-center transition-colors border border-slate-500"
          >
            <X className="w-4 h-4 text-gray-300" />
          </button>
        </div>

        <div className="space-y-6">
          {/* Text Speed */}
          <div>
            <div className="flex items-center gap-2 mb-2">
              <Type className="w-4 h-4 text-green-400" />
              <span className="text-white text-sm pixel-text">文本速度</span>
              <span className="text-gray-500 text-xs ml-auto">{settings.textSpeed}ms/字</span>
            </div>
            <input
              type="range"
              min="10"
              max="100"
              step="10"
              value={settings.textSpeed}
              onChange={(e) => handleChange('textSpeed', Number(e.target.value))}
              className="w-full h-2 bg-slate-700 rounded-full appearance-none cursor-pointer accent-green-500"
            />
            <div className="flex justify-between text-xs text-gray-600 mt-1">
              <span>快</span>
              <span>慢</span>
            </div>
          </div>

          {/* Auto Mode Delay */}
          <div>
            <div className="flex items-center gap-2 mb-2">
              <Clock className="w-4 h-4 text-yellow-400" />
              <span className="text-white text-sm pixel-text">自动模式等待</span>
              <span className="text-gray-500 text-xs ml-auto">{settings.autoDelay / 1000}s</span>
            </div>
            <input
              type="range"
              min="500"
              max="5000"
              step="500"
              value={settings.autoDelay}
              onChange={(e) => handleChange('autoDelay', Number(e.target.value))}
              className="w-full h-2 bg-slate-700 rounded-full appearance-none cursor-pointer accent-yellow-500"
            />
            <div className="flex justify-between text-xs text-gray-600 mt-1">
              <span>0.5s</span>
              <span>5s</span>
            </div>
          </div>

          {/* BGM Volume */}
          <div>
            <div className="flex items-center gap-2 mb-2">
              <Music className="w-4 h-4 text-blue-400" />
              <span className="text-white text-sm pixel-text">背景音乐</span>
              <span className="text-gray-500 text-xs ml-auto">{settings.bgmVolume}%</span>
            </div>
            <input
              type="range"
              min="0"
              max="100"
              step="5"
              value={settings.bgmVolume}
              onChange={(e) => handleChange('bgmVolume', Number(e.target.value))}
              className="w-full h-2 bg-slate-700 rounded-full appearance-none cursor-pointer accent-blue-500"
            />
          </div>

          {/* SFX Volume */}
          <div>
            <div className="flex items-center gap-2 mb-2">
              <Volume2 className="w-4 h-4 text-purple-400" />
              <span className="text-white text-sm pixel-text">音效</span>
              <span className="text-gray-500 text-xs ml-auto">{settings.sfxVolume}%</span>
            </div>
            <input
              type="range"
              min="0"
              max="100"
              step="5"
              value={settings.sfxVolume}
              onChange={(e) => handleChange('sfxVolume', Number(e.target.value))}
              className="w-full h-2 bg-slate-700 rounded-full appearance-none cursor-pointer accent-purple-500"
            />
          </div>

          {/* Mute Toggle */}
          <div className="flex items-center justify-between p-3 bg-slate-800/50 rounded-lg border border-slate-700">
            <div className="flex items-center gap-2">
              {settings.muted ? (
                <VolumeX className="w-5 h-5 text-red-400" />
              ) : (
                <Volume2 className="w-5 h-5 text-green-400" />
              )}
              <span className="text-white text-sm pixel-text">静音</span>
            </div>
            <button
              onClick={() => handleChange('muted', !settings.muted)}
              className={`relative w-14 h-7 rounded-full transition-colors duration-200 ${
                settings.muted ? 'bg-red-600' : 'bg-green-600'
              }`}
            >
              <div
                className={`absolute top-0.5 w-6 h-6 bg-white rounded-full shadow transition-transform duration-200 ${
                  settings.muted ? 'left-7' : 'left-0.5'
                }`}
              />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
