# CHANGELOG - Crystal Quest: Realms of Aetheria

All notable changes and architectural phases for this project are documented in this file.

---

## [1.3.0] - 2026-10-03
### Phase: GitHub Deployment & Cloud Automation
- **Feature**: Full deployment to GitHub repository (`marketerdaddy/crystal-quest-match3`) with automated GitHub Actions CI/CD to GitHub Pages.
- **Files Created/Modified**:
  - [.github/workflows/deploy.yml](file:///c:/Users/ansha/OneDrive/Desktop/candy%20crush/.github/workflows/deploy.yml): Automated Node.js 20 build and GitHub Pages deployment workflow.
  - [.gitignore](file:///c:/Users/ansha/OneDrive/Desktop/candy%20crush/.gitignore): Configured exclusions for node_modules, build artifacts, logs, and system files.
  - [vite.config.ts](file:///c:/Users/ansha/OneDrive/Desktop/candy%20crush/vite.config.ts): Added `base: './'` for seamless relative static asset resolution on custom subpath domains.
  - [FINAL_WALKTHROUGH.md](file:///c:/Users/ansha/OneDrive/Desktop/candy%20crush/FINAL_WALKTHROUGH.md): Added live repository and GitHub Pages deployment URLs.
- **Database/Storage**:
  - Maintained client-side `localStorage` state persistence and graceful offline fallbacks for server APIs.
- **API Changes**:
  - Full client-side fallback verified for zero-dependency static hosting.
- **Breaking Changes**: None.
- **Notes**: Live deployment accessible at `https://marketerdaddy.github.io/crystal-quest-match3/`.

---

## [1.2.0] - 2026-09-27
### Phase: Polish, Modal System & Visual Excellence
- **Feature**: Redesigned UI modals, enhanced animations, and audio synthesizer integration.
- **Files Created/Modified**:
  - [LevelFailedModal.tsx](file:///c:/Users/ansha/OneDrive/Desktop/candy%20crush/src/components/LevelFailedModal.tsx): Fractured crystal insignia, life indicator, target breakdown, retry and shop refill options.
  - [PauseModal.tsx](file:///c:/Users/ansha/OneDrive/Desktop/candy%20crush/src/components/PauseModal.tsx): Ambient glow backdrop, mission objectives review, quick SFX/BGM/Haptic toggles with active feedback, Resume/Restart/Quit.
  - [LevelCompleteModal.tsx](file:///c:/Users/ansha/OneDrive/Desktop/candy%20crush/src/components/LevelCompleteModal.tsx): Staggered animated stars with audio chords, victory confetti, XP/Coin/Gem rewards display, next level flow.
  - [LevelSelectModal.tsx](file:///c:/Users/ansha/OneDrive/Desktop/candy%20crush/src/components/LevelSelectModal.tsx): Realm challenge overview, goal requirements, personal best score, and booster preview.
  - [HomeScreen.tsx](file:///c:/Users/ansha/OneDrive/Desktop/candy%20crush/src/components/HomeScreen.tsx): Ambient floating orbs, rotating 3D crystal preview, player level XP bar, quick play CTA, and persistent bottom navigation bar.
  - [WorldMapScreen.tsx](file:///c:/Users/ansha/OneDrive/Desktop/candy%20crush/src/components/WorldMapScreen.tsx): Zig-zag level path with glowing SVG energy connectors, multi-world selector across 8 elemental realms, star requirements, and progress counters.
  - [tailwind.config.js](file:///c:/Users/ansha/OneDrive/Desktop/candy%20crush/tailwind.config.js): Expanded keyframe animations (float, pulse-glow, shimmer, pop-in, spin-slow) and game token palettes.
- **Database/Storage**:
  - Optimized local storage state sync and automatic fallback recovery.
- **API Changes**:
  - None (reused high-performance REST routes).
- **Breaking Changes**: None.
- **Notes**: Zero browser console errors and fluid 60 FPS Canvas rendering confirmed across devices.

---

## [1.1.0] - 2026-09-27
### Phase: Core Gameplay Engine & Game Systems
- **Feature**: 60 FPS HTML5 Canvas Match-3 Engine with Cascades, Boosters, and Audio Synthesizer.
- **Files Created/Modified**:
  - [engine.ts](file:///c:/Users/ansha/OneDrive/Desktop/candy%20crush/src/game/engine.ts): Board simulation with match detection, special piece creation (Line Blasts, Bomb Nova, Astral Super Prism), cascade physics, and hint finder.
  - [renderer.ts](file:///c:/Users/ansha/OneDrive/Desktop/candy%20crush/src/game/renderer.ts): High-DPI canvas renderer with procedural crystal shaders, faceted reflections, glowing selection rings, and ice/frost overlays.
  - [particles.ts](file:///c:/Users/ansha/OneDrive/Desktop/candy%20crush/src/game/particles.ts): Dynamic particle system with sparkle showers, shockwaves, laser beams, and confetti.
  - [audio.ts](file:///c:/Users/ansha/OneDrive/Desktop/candy%20crush/src/game/audio.ts): Zero-dependency Web Audio API procedural synthesizer for swaps, matches, combos, explosions, victory fanfares, and defeat chords.
  - [levels.ts](file:///c:/Users/ansha/OneDrive/Desktop/candy%20crush/src/game/levels.ts): 8 handcrafted worlds with 40+ unique progression levels, obstacle rules (ice, stone, chains), and custom score targets.
  - [GameBoard.tsx](file:///c:/Users/ansha/OneDrive/Desktop/candy%20crush/src/components/GameBoard.tsx): Main interactive board component with touch/mouse dragging, booster triggers, score HUD, and combo announcement banners.
  - [DailyChallengeScreen.tsx](file:///c:/Users/ansha/OneDrive/Desktop/candy%20crush/src/components/DailyChallengeScreen.tsx): 7-day streak calendar and daily quests with rewards.
  - [RewardCenterModal.tsx](file:///c:/Users/ansha/OneDrive/Desktop/candy%20crush/src/components/RewardCenterModal.tsx): Interactive Astral Wheel with procedural spinning physics and jackpot prizes.
  - [ShopScreen.tsx](file:///c:/Users/ansha/OneDrive/Desktop/candy%20crush/src/components/ShopScreen.tsx): In-game treasury with micro-transaction bundles, currency packs, and booster refills.
  - [CheckoutModal.tsx](file:///c:/Users/ansha/OneDrive/Desktop/candy%20crush/src/components/CheckoutModal.tsx): Sandbox payment gateway with instant delivery, order receipts, and inbox notifications.
  - [AchievementsModal.tsx](file:///c:/Users/ansha/OneDrive/Desktop/candy%20crush/src/components/AchievementsModal.tsx): Hall of Glory tracking 6+ achievement categories with claimable gems.
  - [LeaderboardModal.tsx](file:///c:/Users/ansha/OneDrive/Desktop/candy%20crush/src/components/LeaderboardModal.tsx): Global player rankings for Endless Spire high scores and Realm Stars.
  - [InboxModal.tsx](file:///c:/Users/ansha/OneDrive/Desktop/candy%20crush/src/components/InboxModal.tsx): In-game messaging and receipt viewer with HTML mail reader.
  - [ProfileModal.tsx](file:///c:/Users/ansha/OneDrive/Desktop/candy%20crush/src/components/ProfileModal.tsx): Archon dossier with customizable sigils, statistics overview, and cloud save sync.
  - [SettingsModal.tsx](file:///c:/Users/ansha/OneDrive/Desktop/candy%20crush/src/components/SettingsModal.tsx): Master volume sliders, haptic feedback toggles, and reduced motion options.
- **Database/Storage**:
  - Structured `PlayerProfile` schema in client storage with automatic cloud ledger backup.
- **API Endpoints**:
  - `/api/shop/checkout`, `/api/cloud-save/sync`, `/api/leaderboard`, `/api/email/purchase-confirmation`.
- **Breaking Changes**: None.
- **Notes**: Synthesized procedural audio eliminates any external audio asset dependency.

---

## [1.0.0] - 2026-09-27
### Phase: Initialization & Core System Architecture
- **Feature**: Project bootstrapping and foundational game architecture.
- **Files Created/Modified**:
  - `package.json`: Vite, React 18, TailwindCSS, Lucide-react, Canvas Confetti.
  - `vite.config.ts`: Integrated backend API handler plugin for unified dev server.
  - `tsconfig.json`: TypeScript configuration for React 18 + ES2020.
  - `tailwind.config.js`: Custom palette with crystal elemental colors, dark glass aesthetics.
  - `postcss.config.js`: Tailwind & Autoprefixer plugin setup.
  - `index.html`: Responsive mobile viewport, Outfit & Cinzel Google fonts, theme colors.
  - `public/crystal.svg`: Vector faceted crystal game icon.
- **Database/Storage**:
  - Client local persistence + Cloud Save sync architecture.
- **API Endpoints**:
  - `/api/auth/register`, `/api/auth/login`, `/api/auth/guest`
  - `/api/cloud-save/sync`, `/api/cloud-save/load`
  - `/api/shop/catalog`, `/api/shop/checkout`
  - `/api/email/purchase-confirmation`
  - `/api/leaderboard`
- **Breaking Changes**: None. Initial release.
- **Notes**: Built from the ground up with 100% original fantasy branding, audio synthesis, and match-3 mechanics.
