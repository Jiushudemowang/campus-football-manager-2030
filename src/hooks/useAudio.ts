import { useEffect } from 'react';
import { useGameStore } from '../stores/gameStore';
import { bgm } from '../audio/AudioManager';

/**
 * Hook to manage background music based on current game state.
 * Automatically starts/stops BGM based on settings.
 */
export const useBGM = (scene: 'menu' | 'game' | 'ending') => {
  const settings = useGameStore((s) => s.settings);

  useEffect(() => {
    if (settings.muted) {
      bgm.stop();
      return;
    }

    switch (scene) {
      case 'menu':
        bgm.startMenu();
        break;
      case 'game':
        bgm.startGame();
        break;
      case 'ending':
        bgm.stop(); // No BGM on ending screen
        break;
    }

    return () => {
      // Don't stop on unmount to avoid gaps during navigation
    };
  }, [scene, settings.muted]);

  // Sync volume changes
  useEffect(() => {
    bgm.setVolume(settings.bgmVolume);
  }, [settings.bgmVolume]);

  // Sync mute state
  useEffect(() => {
    if (settings.muted) {
      bgm.stop();
    }
  }, [settings.muted]);
};
