import React, { useState } from 'react';
import { GameProvider, useGame } from './context/GameContext';
import { SplashScreen } from './components/SplashScreen';
import { HomeScreen } from './components/HomeScreen';
import { WorldMapScreen } from './components/WorldMapScreen';
import { GameBoard } from './components/GameBoard';
import { ShopScreen } from './components/ShopScreen';
import { DailyChallengeScreen } from './components/DailyChallengeScreen';
import { ProfileModal } from './components/ProfileModal';
import { AchievementsModal } from './components/AchievementsModal';
import { LeaderboardModal } from './components/LeaderboardModal';
import { SettingsModal } from './components/SettingsModal';
import { InboxModal } from './components/InboxModal';
import { RewardCenterModal } from './components/RewardCenterModal';
import { AuthModal } from './components/AuthModal';
import { LevelSelectModal } from './components/LevelSelectModal';
import { LevelCompleteModal } from './components/LevelCompleteModal';
import { LevelFailedModal } from './components/LevelFailedModal';
import { CheckoutModal } from './components/CheckoutModal';
import { PauseModal } from './components/PauseModal';

const GameContainer: React.FC = () => {
  const { currentScreen, activeLevel, startLevel, retryLevel } = useGame();
  const [isPaused, setIsPaused] = useState(false);

  const handleResume = () => setIsPaused(false);
  const handleRestart = () => {
    setIsPaused(false);
    retryLevel();
  };

  return (
    <div className="relative w-screen h-screen max-w-[500px] max-h-[960px] mx-auto overflow-hidden bg-slate-950 shadow-2xl flex flex-col sm:rounded-[36px] sm:border-4 sm:border-slate-800">
      {/* Active Screen Router */}
      {currentScreen === 'splash' && <SplashScreen />}
      {currentScreen === 'home' && <HomeScreen />}
      {currentScreen === 'world_map' && <WorldMapScreen />}
      {(currentScreen === 'gameplay' || currentScreen === 'endless') && (
        <GameBoard onPause={() => setIsPaused(true)} />
      )}
      {currentScreen === 'shop' && <ShopScreen />}
      {currentScreen === 'daily' && <DailyChallengeScreen />}
      {currentScreen === 'profile' && <ProfileModal />}
      {currentScreen === 'achievements' && <AchievementsModal />}
      {currentScreen === 'leaderboard' && <LeaderboardModal />}
      {currentScreen === 'settings' && <SettingsModal />}
      {currentScreen === 'inbox' && <InboxModal />}
      {currentScreen === 'reward_wheel' && <RewardCenterModal />}
      {currentScreen === 'auth' && <AuthModal />}

      {/* Global Modals */}
      <LevelSelectModal />
      <LevelCompleteModal />
      <LevelFailedModal />
      <CheckoutModal />
      <PauseModal
        isOpen={isPaused}
        onResume={handleResume}
        onRestart={handleRestart}
      />
    </div>
  );
};

export function App() {
  return (
    <GameProvider>
      <div className="w-full h-full min-h-screen bg-[#05070e] flex items-center justify-center sm:p-4">
        <GameContainer />
      </div>
    </GameProvider>
  );
}

export default App;
