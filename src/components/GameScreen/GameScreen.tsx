import { useEffect, useState, useRef } from 'react';
import { useGameStore } from '../../stores/gameStore';
import { getStoryByCharacterId, StoryLine, Scene, Dialog, Choice } from '../../data/stories';

interface GameChoice extends Choice {
  score?: number;
  ending?: { type: 'good' | 'normal' | 'bad'; score: number };
  description?: string;
}
import { DialogBox } from './DialogBox';
import { SaveLoadScreen } from '../SaveLoadScreen';
import { BacklogPanel } from '../BacklogPanel';
import { SettingsPanel } from '../SettingsPanel';
import { MiniGameWrapper, MiniGameResult } from '../../minigames/MiniGameWrapper';
import { ArrowLeft, Save, BookOpen, MapPin, List, Settings, Play, FastForward } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const sceneImages = {
  football_field: [
    'https://images.unsplash.com/photo-1551488831-00ddcb6c6bd3?w=1920&q=80',
    'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=1920&q=80',
    'https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=1920&q=80',
    'https://images.unsplash.com/photo-1546519638-68e109498ffc?w=1920&q=80',
    'https://images.unsplash.com/photo-1546519638-68e109498ffc?w=1920&q=80',
  ],
  campus: [
    'https://images.unsplash.com/photo-1444703686981-a3abbc4d4fe3?w=1920&q=80',
    'https://images.unsplash.com/photo-1509062522246-3755977927d7?w=1920&q=80',
    'https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?w=1920&q=80',
    'https://images.unsplash.com/photo-1542831371-29b0f74f9713?w=1920&q=80',
    'https://images.unsplash.com/photo-1500534314209-a25ddb2bd429?w=1920&q=80',
  ],
  locker_room: [
    'https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?w=1920&q=80',
    'https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?w=1920&q=80',
    'https://images.unsplash.com/photo-1546519638-68e109498ffc?w=1920&q=80',
  ],
  night_city: [
    'https://images.unsplash.com/photo-1504280390367-361c6d9f38f4?w=1920&q=80',
    'https://images.unsplash.com/photo-1485846234645-a62644f84728?w=1920&q=80',
  ],
  park: [
    'https://images.unsplash.com/photo-1500534314209-a25ddb2bd429?w=1920&q=80',
    'https://images.unsplash.com/photo-1500534314209-a25ddb2bd429?w=1920&q=80',
  ],
  gym: [
    'https://images.unsplash.com/photo-1501785888041-af3ef285b470?w=1920&q=80',
    'https://images.unsplash.com/photo-1541364983171-a8ba01e95cfc?w=1920&q=80',
  ],
  street: [
    'https://images.unsplash.com/photo-1448375240586-882707db888b?w=1920&q=80',
    'https://images.unsplash.com/photo-1533227268428-f9ed0900fb3b?w=1920&q=80',
  ],
  beach: [
    'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=1920&q=80',
  ],
  mountain: [
    'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?w=1920&q=80',
  ],
  library: [
    'https://images.unsplash.com/photo-1490730141103-6cac27aaab94?w=1920&q=80',
  ],
  restaurant: [
    'https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=1920&q=80',
  ],
  bus: [
    'https://images.unsplash.com/photo-1544620347-c4fd4a3d5957?w=1920&q=80',
  ],
  trophy_room: [
    'https://images.unsplash.com/photo-1585366190849-7a99052a9f10?w=1920&q=80',
  ],
  default: [
    'https://images.unsplash.com/photo-1553531384-c983a97b98d8?w=1920&q=80',
  ]
};

export const GameScreen = () => {
  const navigate = useNavigate();
  
  const currentCharacter = useGameStore((state) => state.currentCharacter);
  const currentSceneId = useGameStore((state) => state.currentSceneId);
  const currentDialogIndex = useGameStore((state) => state.currentDialogIndex);
  const setScene = useGameStore((state) => state.setScene);
  const setCurrentDialogIndex = useGameStore((state) => state.setCurrentDialogIndex);
  const makeChoice = useGameStore((state) => state.makeChoice);
  const addEndingScore = useGameStore((state) => state.addEndingScore);
  const setEndingType = useGameStore((state) => state.setEndingType);
  const addDialogHistory = useGameStore((state) => state.addDialogHistory);
  const autoMode = useGameStore((state) => state.autoMode);
  const skipMode = useGameStore((state) => state.skipMode);
  const setAutoMode = useGameStore((state) => state.setAutoMode);
  const setSkipMode = useGameStore((state) => state.setSkipMode);
  const settings = useGameStore((state) => state.settings);

  const [currentStoryLine, setCurrentStoryLine] = useState<StoryLine | null>(null);
  const [showChoices, setShowChoices] = useState(false);
  const [sceneIndex, setSceneIndex] = useState(0);
  const [isInitialized, setIsInitialized] = useState(false);
  const [showSaveLoad, setShowSaveLoad] = useState<'save' | 'load' | null>(null);
  const [showBacklog, setShowBacklog] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [isTyping, setIsTyping] = useState(false);
  const [activeMiniGame, setActiveMiniGame] = useState<string | null>(null);
  const autoTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    if (currentCharacter && !currentSceneId && !isInitialized) {
      const story = getStoryByCharacterId(currentCharacter.id);
      if (story && story.scenes && story.scenes.length > 0) {
        setCurrentStoryLine(story);
        setScene(story.scenes[0].id);
        setIsInitialized(true);
      }
    }
  }, [currentCharacter, currentSceneId, setScene, isInitialized]);

  useEffect(() => {
    if (currentCharacter) {
      const story = getStoryByCharacterId(currentCharacter.id);
      if (story) {
        setCurrentStoryLine(story);
      }
    }
  }, [currentCharacter]);

  useEffect(() => {
    if (currentSceneId) {
      setSceneIndex(prev => prev + 1);
      setCurrentDialogIndex(0);
      setShowChoices(false);
    }
  }, [currentSceneId, setCurrentDialogIndex]);

  useEffect(() => {
    if (autoMode && !isTyping && !showChoices && currentCharacter && currentSceneId) {
      const currentScene = currentStoryLine?.scenes?.find((s: Scene) => s.id === currentSceneId);
      const currentDialog = currentScene?.dialogs?.[currentDialogIndex];
      if (currentDialog) {
        autoTimerRef.current = setTimeout(() => {
          const nextIndex = currentDialogIndex + 1;
          if (nextIndex < currentScene.dialogs.length) {
            setCurrentDialogIndex(nextIndex);
          } else {
            if (currentScene.choices && currentScene.choices.length > 0) {
              setShowChoices(true);
            } else if (currentScene.nextSceneId) {
              setScene(currentScene.nextSceneId);
            }
          }
        }, settings.autoDelay);
      }
    }
    return () => {
      if (autoTimerRef.current) {
        clearTimeout(autoTimerRef.current);
      }
    };
  }, [autoMode, isTyping, showChoices, currentDialogIndex, currentSceneId, currentStoryLine, currentCharacter, settings.autoDelay, setCurrentDialogIndex, setScene]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'l' || e.key === 'L') {
        e.preventDefault();
        setShowBacklog((prev) => !prev);
      }
      if (e.key === 'Escape') {
        setShowBacklog(false);
        setShowSaveLoad(null);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  const handleDialogComplete = () => {
    if (isTyping) {
      setIsTyping(false);
      return;
    }

    const currentScene = currentStoryLine?.scenes?.find((s: any) => s.id === currentSceneId);
    if (!currentScene) return;

    const nextIndex = currentDialogIndex + 1;
    if (nextIndex < currentScene.dialogs.length) {
      setCurrentDialogIndex(nextIndex);
      addDialogHistory({
        speaker: currentScene.dialogs[nextIndex]?.speaker || '???',
        text: currentScene.dialogs[nextIndex]?.text || ''
      });
    } else {
      if (currentScene.choices && currentScene.choices.length > 0) {
        setShowChoices(true);
      } else if (currentScene.nextSceneId) {
        setScene(currentScene.nextSceneId);
      } else if (currentScene.ending) {
        setEndingType(currentScene.ending.type);
        addEndingScore(currentScene.ending.score || 0);
        navigate('/ending');
      }
    }
  };

  const handleChoice = (choice: GameChoice) => {
    makeChoice(currentSceneId, choice.id);
    if (choice.score) {
      addEndingScore(choice.score);
    }
    if (choice.nextSceneId) {
      setScene(choice.nextSceneId);
    } else if (choice.ending) {
      setEndingType(choice.ending.type);
      addEndingScore(choice.ending.score || 0);
      navigate('/ending');
    }
    setShowChoices(false);
  };

  const handleMiniGameComplete = (result: MiniGameResult) => {
    if (result.result === 'win') {
      addEndingScore(result.score || 10);
    }
    setActiveMiniGame(null);
    const currentScene = currentStoryLine?.scenes?.find((s: any) => s.id === currentSceneId);
    if (currentScene?.nextSceneId) {
      setScene(currentScene.nextSceneId);
    }
  };

  const currentScene = currentStoryLine?.scenes?.find((s: any) => s.id === currentSceneId);
  const currentDialog = currentScene?.dialogs?.[currentDialogIndex];
  const sceneType = currentScene?.sceneType || 'default';
  const backgroundImages = sceneImages[sceneType as keyof typeof sceneImages] || sceneImages.default;
  const currentBackground = backgroundImages[sceneIndex % backgroundImages.length];

  return (
    <div className="relative min-h-screen overflow-hidden bg-slate-900">
      <div 
        className="absolute inset-0 bg-cover bg-center transition-all duration-1000"
        style={{ 
          backgroundImage: `url(${currentBackground})`,
          filter: 'brightness(0.6)'
        }}
      />
      
      <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-slate-900/50 to-transparent" />

      <header className="relative z-10 flex items-center justify-between px-4 py-3 bg-slate-900/80 backdrop-blur-sm">
        <button
          onClick={() => navigate('/')}
          className="flex items-center gap-2 text-white/80 hover:text-white transition-colors"
        >
          <ArrowLeft className="w-5 h-5" />
          <span className="text-sm font-medium">返回</span>
        </button>

        <div className="flex items-center gap-4">
          <button
            onClick={() => setShowSaveLoad('save')}
            className="p-2 text-white/60 hover:text-green-400 hover:bg-green-500/10 rounded-lg transition-colors"
            title="保存"
          >
            <Save className="w-5 h-5" />
          </button>
          <button
            onClick={() => setShowSaveLoad('load')}
            className="p-2 text-white/60 hover:text-blue-400 hover:bg-blue-500/10 rounded-lg transition-colors"
            title="读取"
          >
            <BookOpen className="w-5 h-5" />
          </button>
          <button
            onClick={() => setShowBacklog(!showBacklog)}
            className={`p-2 rounded-lg transition-colors ${showBacklog ? 'text-green-400 bg-green-500/20' : 'text-white/60 hover:text-yellow-400 hover:bg-yellow-500/10'}`}
            title="回忆"
          >
            <List className="w-5 h-5" />
          </button>
          <button
            onClick={() => setShowSettings(!showSettings)}
            className="p-2 text-white/60 hover:text-purple-400 hover:bg-purple-500/10 rounded-lg transition-colors"
            title="设置"
          >
            <Settings className="w-5 h-5" />
          </button>
        </div>
      </header>

      <main className="relative z-10 flex flex-col min-h-[calc(100vh-60px)]">
        <div className="flex-1 flex items-center justify-center p-4">
          {currentCharacter && !currentStoryLine && (
            <div className="text-center max-w-md">
              <img
                src={currentCharacter.image}
                alt={currentCharacter.name}
                className="w-32 h-32 mx-auto rounded-full border-4 border-green-500/50 shadow-lg shadow-green-500/20 object-cover"
                onError={(e) => {
                  (e.target as HTMLImageElement).src = `https://api.dicebear.com/9.x/pixel-art/svg?seed=${encodeURIComponent(currentCharacter.id)}&backgroundColor=1B5E20`;
                }}
              />
              <h1 className="text-2xl font-bold text-white mt-4 pixel-text">{currentCharacter.name}</h1>
              <p className="text-sm text-green-400 mt-1">{currentCharacter.era}</p>
              <p className="text-sm text-white/60 mt-1">{currentCharacter.position}</p>

              <div className="mt-6 p-6 bg-slate-800/80 rounded-xl border border-slate-600">
                <p className="text-gray-300 mb-4">该球员暂无专属叙事线，敬请期待后续更新。</p>
                <button
                  onClick={() => navigate('/')}
                  className="inline-flex items-center gap-2 px-5 py-2 bg-green-600 hover:bg-green-500 text-white rounded-lg transition-colors"
                >
                  <ArrowLeft className="w-4 h-4" />
                  返回主页
                </button>
              </div>
            </div>
          )}

          {currentCharacter && currentStoryLine && (
            <div className="text-center mb-8">
              <img
                src={currentCharacter.image}
                alt={currentCharacter.name}
                className="w-32 h-32 mx-auto rounded-full border-4 border-green-500/50 shadow-lg shadow-green-500/20 object-cover"
                onError={(e) => {
                  (e.target as HTMLImageElement).src = `https://api.dicebear.com/9.x/pixel-art/svg?seed=${encodeURIComponent(currentCharacter.id)}&backgroundColor=1B5E20`;
                }}
              />
              <h1 className="text-2xl font-bold text-white mt-4 pixel-text">{currentCharacter.name}</h1>
              <p className="text-sm text-green-400 mt-1">{currentCharacter.era}</p>
              <p className="text-sm text-white/60 mt-1">{currentCharacter.position}</p>
            </div>
          )}
        </div>

        {currentDialog && currentStoryLine && (
          <DialogBox
            dialog={currentDialog}
            onComplete={handleDialogComplete}
            onTypingChange={setIsTyping}
          />
        )}
      </main>

      <footer className="relative z-10 px-4 py-3 bg-slate-900/80 backdrop-blur-sm border-t border-slate-700">
        <div className="flex items-center justify-between text-xs text-white/40">
          <div className="flex items-center gap-4">
            <span className="flex items-center gap-1">
              <MapPin className="w-3 h-3" />
              {currentScene?.name || (currentStoryLine ? '???' : '暂无叙事')}
            </span>
            {currentScene && currentScene.dialogs && (
              <span>{currentDialogIndex + 1} / {currentScene.dialogs.length}</span>
            )}
          </div>
          <div className="flex items-center gap-4">
            <button
              onClick={() => setAutoMode(!autoMode)}
              className={`flex items-center gap-1 px-2 py-1 rounded text-xs transition-colors ${autoMode ? 'bg-green-500/20 text-green-400' : 'text-white/40 hover:text-white/60'}`}
            >
              <Play className="w-3 h-3" />
              自动
            </button>
            <button
              onClick={() => setSkipMode(!skipMode)}
              className={`flex items-center gap-1 px-2 py-1 rounded text-xs transition-colors ${skipMode ? 'bg-yellow-500/20 text-yellow-400' : 'text-white/40 hover:text-white/60'}`}
            >
              <FastForward className="w-3 h-3" />
              快进
            </button>
          </div>
        </div>
      </footer>

      {showChoices && currentScene?.choices && (
        <div className="fixed inset-0 z-50 flex items-end justify-center bg-black/60 backdrop-blur-sm p-4 pb-8">
          <div className="w-full max-w-md space-y-3 animate-slide-up">
            {currentScene.choices.map((choice: GameChoice, index: number) => (
              <button
                key={choice.id}
                onClick={() => handleChoice(choice)}
                className="w-full px-6 py-4 bg-slate-800/90 hover:bg-slate-700 border-2 border-slate-600 hover:border-green-500 rounded-xl text-left transition-all"
                style={{ animationDelay: `${index * 100}ms` }}
              >
                <div className="flex items-center gap-3">
                  <span className="w-8 h-8 rounded-full bg-green-500/20 text-green-400 flex items-center justify-center font-bold text-sm">
                    {index + 1}
                  </span>
                  <div>
                    <p className="text-white font-medium">{choice.text}</p>
                    {choice.description && (
                      <p className="text-xs text-white/40 mt-1">{choice.description}</p>
                    )}
                  </div>
                </div>
              </button>
            ))}
          </div>
        </div>
      )}

      {activeMiniGame && (
        <MiniGameWrapper
          gameType={activeMiniGame}
          onComplete={handleMiniGameComplete}
          onCancel={() => setActiveMiniGame(null)}
        />
      )}

      {showSaveLoad && (
        <SaveLoadScreen
          mode={showSaveLoad}
          onClose={() => setShowSaveLoad(null)}
        />
      )}

      {showBacklog && <BacklogPanel onClose={() => setShowBacklog(false)} />}
      {showSettings && <SettingsPanel onClose={() => setShowSettings(false)} />}
    </div>
  );
};