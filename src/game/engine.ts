import { TilePiece, CrystalColor, SpecialType, ObstacleType, LevelObjective } from '../types/game';

export interface MatchResult {
  matchedTiles: { row: number; col: number; tile: TilePiece }[];
  specialSpawns: { row: number; col: number; special: SpecialType; color: CrystalColor }[];
  comboCount: number;
  clearedIce: number;
  clearedCages: number;
  destroyedStones: number;
  collectedColors: Record<CrystalColor, number>;
  scoreGained: number;
  specialComboTriggered?: string;
}

export class Match3Engine {
  public rows: number;
  public cols: number;
  public grid: (TilePiece | null)[][];
  public allowedColors: CrystalColor[];
  private idCounter = 1;

  constructor(rows = 8, cols = 8, allowedColors: CrystalColor[] = ['ruby', 'sapphire', 'emerald', 'amethyst', 'topaz', 'diamond']) {
    this.rows = rows;
    this.cols = cols;
    this.allowedColors = allowedColors;
    this.grid = this.createEmptyGrid();
  }

  private createEmptyGrid(): (TilePiece | null)[][] {
    const grid: (TilePiece | null)[][] = [];
    for (let r = 0; r < this.rows; r++) {
      grid[r] = [];
      for (let c = 0; c < this.cols; c++) {
        grid[r][c] = null;
      }
    }
    return grid;
  }

  public getRandomColor(): CrystalColor {
    const idx = Math.floor(Math.random() * this.allowedColors.length);
    return this.allowedColors[idx];
  }

  public createPiece(
    row: number,
    col: number,
    color?: CrystalColor,
    special: SpecialType = 'none',
    obstacle: ObstacleType = 'none'
  ): TilePiece {
    return {
      id: `tile_${this.idCounter++}_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`,
      row,
      col,
      color: color || this.getRandomColor(),
      special,
      obstacle,
      scale: 1.0,
      alpha: 1.0
    };
  }

  /**
   * Initialize a board without pre-existing matches, guaranteed to have valid moves
   */
  public initializeBoard(obstacles?: { row: number; col: number; type: ObstacleType }[]) {
    let attempts = 0;
    const maxAttempts = 100;

    while (attempts < maxAttempts) {
      attempts++;
      this.grid = this.createEmptyGrid();

      // Place any initial obstacles
      if (obstacles) {
        for (const obs of obstacles) {
          if (obs.row < this.rows && obs.col < this.cols) {
            this.grid[obs.row][obs.col] = this.createPiece(obs.row, obs.col, this.getRandomColor(), 'none', obs.type);
          }
        }
      }

      // Fill remaining cells ensuring no 3-in-a-row at start
      for (let r = 0; r < this.rows; r++) {
        for (let c = 0; c < this.cols; c++) {
          if (!this.grid[r][c]) {
            const forbidden: CrystalColor[] = [];
            if (c >= 2 && this.grid[r][c - 1]?.color === this.grid[r][c - 2]?.color) {
              const prev = this.grid[r][c - 1]?.color;
              if (prev) forbidden.push(prev);
            }
            if (r >= 2 && this.grid[r - 1][c]?.color === this.grid[r - 2][c]?.color) {
              const prev = this.grid[r - 1][c]?.color;
              if (prev) forbidden.push(prev);
            }

            const available = this.allowedColors.filter(col => !forbidden.includes(col));
            const chosen = available.length > 0
              ? available[Math.floor(Math.random() * available.length)]
              : this.getRandomColor();

            this.grid[r][c] = this.createPiece(r, c, chosen);
          }
        }
      }

      // Check if board has at least 1 valid move
      if (this.hasPossibleMoves()) {
        return;
      }
    }

    // Fallback: shuffle until a move is found
    this.smartShuffle();
  }

  /**
   * Check if two coordinates are adjacent
   */
  public isAdjacent(r1: number, c1: number, r2: number, c2: number): boolean {
    const dr = Math.abs(r1 - r2);
    const dc = Math.abs(c1 - c2);
    return (dr === 1 && dc === 0) || (dr === 0 && dc === 1);
  }

  /**
   * Swap two pieces in the grid
   */
  public swap(r1: number, c1: number, r2: number, c2: number) {
    const temp = this.grid[r1][c1];
    this.grid[r1][c1] = this.grid[r2][c2];
    this.grid[r2][c2] = temp;

    if (this.grid[r1][c1]) {
      this.grid[r1][c1]!.row = r1;
      this.grid[r1][c1]!.col = c1;
    }
    if (this.grid[r2][c2]) {
      this.grid[r2][c2]!.row = r2;
      this.grid[r2][c2]!.col = c2;
    }
  }

  /**
   * Test if swapping two tiles yields a valid match or special combo
   */
  public isValidSwap(r1: number, c1: number, r2: number, c2: number): boolean {
    if (!this.isAdjacent(r1, c1, r2, c2)) return false;

    const t1 = this.grid[r1][c1];
    const t2 = this.grid[r2][c2];
    if (!t1 || !t2) return false;

    // Stone or Caged pieces cannot be swapped
    if (t1.obstacle === 'stone' || t2.obstacle === 'stone') return false;
    if (t1.obstacle === 'cage' || t2.obstacle === 'cage') return false;

    // Special combo check (e.g. Prism + anything, or Special + Special)
    if (t1.special !== 'none' && t2.special !== 'none') return true;
    if (t1.special === 'super_prism' || t2.special === 'super_prism') return true;

    // Regular match check
    this.swap(r1, c1, r2, c2);
    const matches = this.findMatches();
    this.swap(r1, c1, r2, c2); // swap back

    return matches.length > 0;
  }

  /**
   * Check if any valid move exists on the entire board
   */
  public hasPossibleMoves(): boolean {
    for (let r = 0; r < this.rows; r++) {
      for (let c = 0; c < this.cols; c++) {
        const piece = this.grid[r][c];
        if (!piece || piece.obstacle === 'stone' || piece.obstacle === 'cage') continue;

        // Try right swap
        if (c + 1 < this.cols && this.isValidSwap(r, c, r, c + 1)) return true;
        // Try down swap
        if (r + 1 < this.rows && this.isValidSwap(r, c, r + 1, c)) return true;
      }
    }
    return false;
  }

  /**
   * Find a hint move [r1, c1, r2, c2]
   */
  public findHint(): [number, number, number, number] | null {
    for (let r = 0; r < this.rows; r++) {
      for (let c = 0; c < this.cols; c++) {
        const piece = this.grid[r][c];
        if (!piece || piece.obstacle === 'stone' || piece.obstacle === 'cage') continue;

        if (c + 1 < this.cols && this.isValidSwap(r, c, r, c + 1)) {
          return [r, c, r, c + 1];
        }
        if (r + 1 < this.rows && this.isValidSwap(r, c, r + 1, c)) {
          return [r, c, r + 1, c];
        }
      }
    }
    return null;
  }

  /**
   * Smart board reshuffle preserving obstacles
   */
  public smartShuffle() {
    const swappableTiles: { color: CrystalColor; special: SpecialType }[] = [];
    const positions: { r: number; c: number }[] = [];

    for (let r = 0; r < this.rows; r++) {
      for (let c = 0; c < this.cols; c++) {
        const t = this.grid[r][c];
        if (t && t.obstacle !== 'stone' && t.obstacle !== 'cage') {
          swappableTiles.push({ color: t.color, special: t.special });
          positions.push({ r, c });
        }
      }
    }

    let iterations = 0;
    while (iterations < 50) {
      iterations++;
      // Fisher-Yates shuffle
      for (let i = swappableTiles.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [swappableTiles[i], swappableTiles[j]] = [swappableTiles[j], swappableTiles[i]];
      }

      // Re-apply to positions
      for (let i = 0; i < positions.length; i++) {
        const pos = positions[i];
        const data = swappableTiles[i];
        this.grid[pos.r][pos.c] = this.createPiece(pos.r, pos.c, data.color, data.special);
      }

      // Make sure no immediate matches are formed and at least 1 move exists
      if (this.findMatches().length === 0 && this.hasPossibleMoves()) {
        return;
      }
    }
  }

  /**
   * Find all matches across the board (horizontal & vertical lines)
   */
  public findMatches(): { tiles: { r: number; c: number }[]; isHorizontal: boolean; color: CrystalColor }[] {
    const matchGroups: { tiles: { r: number; c: number }[]; isHorizontal: boolean; color: CrystalColor }[] = [];

    // 1. Horizontal Matches
    for (let r = 0; r < this.rows; r++) {
      let matchLen = 1;
      for (let c = 0; c < this.cols; c++) {
        const current = this.grid[r][c];
        const next = c + 1 < this.cols ? this.grid[r][c + 1] : null;

        const isMatch = current && next &&
          current.obstacle !== 'stone' && next.obstacle !== 'stone' &&
          current.special !== 'super_prism' && next.special !== 'super_prism' &&
          current.color === next.color;

        if (isMatch) {
          matchLen++;
        } else {
          if (matchLen >= 3 && current) {
            const tiles: { r: number; c: number }[] = [];
            for (let i = 0; i < matchLen; i++) {
              tiles.push({ r, c: c - i });
            }
            matchGroups.push({ tiles, isHorizontal: true, color: current.color });
          }
          matchLen = 1;
        }
      }
    }

    // 2. Vertical Matches
    for (let c = 0; c < this.cols; c++) {
      let matchLen = 1;
      for (let r = 0; r < this.rows; r++) {
        const current = this.grid[r][c];
        const next = r + 1 < this.rows ? this.grid[r + 1][c] : null;

        const isMatch = current && next &&
          current.obstacle !== 'stone' && next.obstacle !== 'stone' &&
          current.special !== 'super_prism' && next.special !== 'super_prism' &&
          current.color === next.color;

        if (isMatch) {
          matchLen++;
        } else {
          if (matchLen >= 3 && current) {
            const tiles: { r: number; c: number }[] = [];
            for (let i = 0; i < matchLen; i++) {
              tiles.push({ r: r - i, c });
            }
            matchGroups.push({ tiles, isHorizontal: false, color: current.color });
          }
          matchLen = 1;
        }
      }
    }

    return matchGroups;
  }

  /**
   * Process special piece combinations (when player directly swaps specials)
   */
  public executeSpecialCombo(
    r1: number,
    c1: number,
    r2: number,
    c2: number,
    comboMultiplier: number = 1
  ): MatchResult {
    const t1 = this.grid[r1][c1]!;
    const t2 = this.grid[r2][c2]!;

    const tilesToClear = new Set<string>();
    const clearedIce = { count: 0 };
    const clearedCages = { count: 0 };
    const destroyedStones = { count: 0 };
    const collectedColors: Record<CrystalColor, number> = {
      ruby: 0, sapphire: 0, emerald: 0, amethyst: 0, topaz: 0, diamond: 0
    };
    let comboName = 'SPECIAL COMBO!';

    // Helper to mark tile for removal
    const markTile = (r: number, c: number) => {
      if (r < 0 || r >= this.rows || c < 0 || c >= this.cols) return;
      const tile = this.grid[r][c];
      if (!tile) return;

      tilesToClear.add(`${r},${c}`);
      if (tile.color) collectedColors[tile.color]++;

      // Damage obstacles
      if (tile.obstacle === 'ice_1' || tile.obstacle === 'ice_2') clearedIce.count++;
      if (tile.obstacle === 'cage') clearedCages.count++;
      if (tile.obstacle === 'stone') destroyedStones.count++;
    };

    // Case 1: Super Prism + Super Prism (APOCALYPSE)
    if (t1.special === 'super_prism' && t2.special === 'super_prism') {
      comboName = 'ASTRAL APOCALYPSE!';
      for (let r = 0; r < this.rows; r++) {
        for (let c = 0; c < this.cols; c++) {
          markTile(r, c);
        }
      }
    }
    // Case 2: Super Prism + Beam
    else if ((t1.special === 'super_prism' && (t2.special === 'horizontal_beam' || t2.special === 'vertical_beam')) ||
             (t2.special === 'super_prism' && (t1.special === 'horizontal_beam' || t1.special === 'vertical_beam'))) {
      const targetColor = t1.special === 'super_prism' ? t2.color : t1.color;
      comboName = 'PRISMATIC BEAM STORM!';
      markTile(r1, c1);
      markTile(r2, c2);

      // Convert all target color to beams and clear their rows/cols
      for (let r = 0; r < this.rows; r++) {
        for (let c = 0; c < this.cols; c++) {
          const t = this.grid[r][c];
          if (t && t.color === targetColor) {
            // Clear row or col
            for (let i = 0; i < this.cols; i++) markTile(r, i);
            for (let i = 0; i < this.rows; i++) markTile(i, c);
          }
        }
      }
    }
    // Case 3: Super Prism + Nova Bomb
    else if ((t1.special === 'super_prism' && t2.special === 'nova_bomb') ||
             (t2.special === 'super_prism' && t1.special === 'nova_bomb')) {
      const targetColor = t1.special === 'super_prism' ? t2.color : t1.color;
      comboName = 'SUPER NOVA CATACLYSM!';
      markTile(r1, c1);
      markTile(r2, c2);

      for (let r = 0; r < this.rows; r++) {
        for (let c = 0; c < this.cols; c++) {
          const t = this.grid[r][c];
          if (t && t.color === targetColor) {
            for (let dr = -1; dr <= 1; dr++) {
              for (let dc = -1; dc <= 1; dc++) {
                markTile(r + dr, c + dc);
              }
            }
          }
        }
      }
    }
    // Case 4: Super Prism + Regular Piece
    else if (t1.special === 'super_prism' || t2.special === 'super_prism') {
      const targetColor = t1.special === 'super_prism' ? t2.color : t1.color;
      comboName = 'PRISM ELEMENT DISINTEGRATION!';
      markTile(r1, c1);
      markTile(r2, c2);

      for (let r = 0; r < this.rows; r++) {
        for (let c = 0; c < this.cols; c++) {
          const t = this.grid[r][c];
          if (t && t.color === targetColor) {
            markTile(r, c);
          }
        }
      }
    }
    // Case 5: Beam + Beam (Cross Laser)
    else if ((t1.special === 'horizontal_beam' || t1.special === 'vertical_beam') &&
             (t2.special === 'horizontal_beam' || t2.special === 'vertical_beam')) {
      comboName = 'CROSS ELEMENT LASER!';
      for (let c = 0; c < this.cols; c++) markTile(r2, c);
      for (let r = 0; r < this.rows; r++) markTile(r, c2);
    }
    // Case 6: Nova Bomb + Nova Bomb (Ultra 5x5 Crater)
    else if (t1.special === 'nova_bomb' && t2.special === 'nova_bomb') {
      comboName = 'MEGA CRATER BLAST!';
      for (let dr = -2; dr <= 2; dr++) {
        for (let dc = -2; dc <= 2; dc++) {
          markTile(r2 + dr, c2 + dc);
        }
      }
    }
    // Case 7: Beam + Nova Bomb (Triple Line Clear)
    else if ((t1.special === 'nova_bomb' && (t2.special === 'horizontal_beam' || t2.special === 'vertical_beam')) ||
             (t2.special === 'nova_bomb' && (t1.special === 'horizontal_beam' || t1.special === 'vertical_beam'))) {
      comboName = 'TRIPLE BEAM SUPERNOVA!';
      for (let dr = -1; dr <= 1; dr++) {
        for (let c = 0; c < this.cols; c++) markTile(r2 + dr, c);
      }
      for (let dc = -1; dc <= 1; dc++) {
        for (let r = 0; r < this.rows; r++) markTile(r, c2 + dc);
      }
    }

    // Build matched tiles list
    const matchedTilesList: { row: number; col: number; tile: TilePiece }[] = [];
    tilesToClear.forEach(pos => {
      const [r, c] = pos.split(',').map(Number);
      if (this.grid[r][c]) {
        matchedTilesList.push({ row: r, col: c, tile: this.grid[r][c]! });
        this.grid[r][c] = null;
      }
    });

    const scoreGained = matchedTilesList.length * 75 * comboMultiplier;

    return {
      matchedTiles: matchedTilesList,
      specialSpawns: [],
      comboCount: comboMultiplier,
      clearedIce: clearedIce.count,
      clearedCages: clearedCages.count,
      destroyedStones: destroyedStones.count,
      collectedColors,
      scoreGained,
      specialComboTriggered: comboName
    };
  }

  /**
   * Process standard matches and trigger cascades
   */
  public processMatches(
    lastSwappedPos?: { r: number; c: number },
    comboMultiplier: number = 1
  ): MatchResult {
    const rawMatches = this.findMatches();
    if (rawMatches.length === 0) {
      return {
        matchedTiles: [],
        specialSpawns: [],
        comboCount: comboMultiplier,
        clearedIce: 0,
        clearedCages: 0,
        destroyedStones: 0,
        collectedColors: { ruby: 0, sapphire: 0, emerald: 0, amethyst: 0, topaz: 0, diamond: 0 },
        scoreGained: 0
      };
    }

    const tilesToClear = new Map<string, { r: number; c: number; tile: TilePiece }>();
    const specialSpawns: { row: number; col: number; special: SpecialType; color: CrystalColor }[] = [];
    const collectedColors: Record<CrystalColor, number> = {
      ruby: 0, sapphire: 0, emerald: 0, amethyst: 0, topaz: 0, diamond: 0
    };
    let clearedIce = 0;
    let clearedCages = 0;
    let destroyedStones = 0;

    // Helper: Mark and inspect special activations
    const queueTileClear = (r: number, c: number) => {
      if (r < 0 || r >= this.rows || c < 0 || c >= this.cols) return;
      const key = `${r},${c}`;
      if (tilesToClear.has(key)) return;

      const tile = this.grid[r][c];
      if (!tile) return;

      tilesToClear.set(key, { r, c, tile });
      if (tile.color) collectedColors[tile.color]++;

      // Check if tile is a special piece itself, triggering secondary clearing!
      if (tile.special === 'horizontal_beam') {
        for (let col = 0; col < this.cols; col++) queueTileClear(r, col);
      } else if (tile.special === 'vertical_beam') {
        for (let row = 0; row < this.rows; row++) queueTileClear(row, c);
      } else if (tile.special === 'nova_bomb') {
        for (let dr = -1; dr <= 1; dr++) {
          for (let dc = -1; dc <= 1; dc++) {
            queueTileClear(r + dr, c + dc);
          }
        }
      }
    };

    // Analyze match shapes to determine special creation (5 in line = Super Prism, T/L = Nova Bomb, 4 in line = Beam)
    // Group matches by tile coordinate to find intersections (T or L)
    const coordMatches = new Map<string, typeof rawMatches>();
    for (const match of rawMatches) {
      for (const t of match.tiles) {
        const key = `${t.r},${t.c}`;
        const existing = coordMatches.get(key) || [];
        existing.push(match);
        coordMatches.set(key, existing);
      }
    }

    const processedMatchGroups = new Set<number>();

    // Detect T or L shapes
    coordMatches.forEach((matchesAtCoord, coordKey) => {
      const [cr, cc] = coordKey.split(',').map(Number);
      if (matchesAtCoord.length >= 2) {
        // Horizontal and vertical intersection = T or L shape -> Nova Bomb!
        const color = matchesAtCoord[0].color;
        specialSpawns.push({ row: cr, col: cc, special: 'nova_bomb', color });

        matchesAtCoord.forEach(m => {
          const idx = rawMatches.indexOf(m);
          processedMatchGroups.add(idx);
          m.tiles.forEach(t => queueTileClear(t.r, t.c));
        });
      }
    });

    // Detect remaining 5-in-a-row and 4-in-a-row
    rawMatches.forEach((match, idx) => {
      if (processedMatchGroups.has(idx)) return;

      match.tiles.forEach(t => queueTileClear(t.r, t.c));

      let spawnPos = match.tiles[Math.floor(match.tiles.length / 2)];
      if (lastSwappedPos && match.tiles.some(t => t.r === lastSwappedPos.r && t.c === lastSwappedPos.c)) {
        spawnPos = lastSwappedPos;
      }

      if (match.tiles.length >= 5) {
        // 5-match -> Astral Super Prism!
        specialSpawns.push({
          row: spawnPos.r,
          col: spawnPos.c,
          special: 'super_prism',
          color: match.color
        });
      } else if (match.tiles.length === 4) {
        // 4-match -> Beam crystal
        specialSpawns.push({
          row: spawnPos.r,
          col: spawnPos.c,
          special: match.isHorizontal ? 'vertical_beam' : 'horizontal_beam',
          color: match.color
        });
      }
    });

    // Damage adjacent obstacles (Ice & Cages)
    tilesToClear.forEach(({ r, c }) => {
      const neighbors = [
        { r: r - 1, c },
        { r: r + 1, c },
        { r, c: c - 1 },
        { r, c: c + 1 }
      ];

      for (const n of neighbors) {
        if (n.r >= 0 && n.r < this.rows && n.c >= 0 && n.c < this.cols) {
          const neighbor = this.grid[n.r][n.c];
          if (!neighbor) continue;

          if (neighbor.obstacle === 'ice_2') {
            neighbor.obstacle = 'ice_1';
            clearedIce++;
          } else if (neighbor.obstacle === 'ice_1') {
            neighbor.obstacle = 'none';
            clearedIce++;
          } else if (neighbor.obstacle === 'cage') {
            neighbor.obstacle = 'none';
            clearedCages++;
          }
        }
      }
    });

    // Execute tile destruction from grid
    const matchedTilesList: { row: number; col: number; tile: TilePiece }[] = [];
    tilesToClear.forEach(({ r, c, tile }) => {
      matchedTilesList.push({ row: r, col: c, tile });
      this.grid[r][c] = null;
    });

    // Place special spawns into grid
    for (const sp of specialSpawns) {
      this.grid[sp.row][sp.col] = this.createPiece(sp.row, sp.col, sp.color, sp.special);
    }

    const scoreGained = matchedTilesList.length * 60 * comboMultiplier;

    return {
      matchedTiles: matchedTilesList,
      specialSpawns,
      comboCount: comboMultiplier,
      clearedIce,
      clearedCages,
      destroyedStones,
      collectedColors,
      scoreGained
    };
  }

  /**
   * Apply Gravity and Refill grid with new crystals
   * Returns dropping tile move definitions for smooth animations
   */
  public applyGravityAndRefill(): { fromRow: number; toRow: number; col: number; isNew: boolean }[] {
    const drops: { fromRow: number; toRow: number; col: number; isNew: boolean }[] = [];

    // 1. Drop existing tiles downwards
    for (let c = 0; c < this.cols; c++) {
      let emptyRow = this.rows - 1;

      for (let r = this.rows - 1; r >= 0; r--) {
        const piece = this.grid[r][c];
        if (piece) {
          // If stone obstacle, stone does not fall
          if (piece.obstacle === 'stone') {
            emptyRow = r - 1;
            continue;
          }

          if (r !== emptyRow) {
            this.grid[emptyRow][c] = piece;
            piece.row = emptyRow;
            piece.col = c;
            this.grid[r][c] = null;

            drops.push({ fromRow: r, toRow: emptyRow, col: c, isNew: false });
          }
          emptyRow--;
        }
      }

      // 2. Refill empty cells from top with fresh crystals
      let spawnOffset = 1;
      for (let r = emptyRow; r >= 0; r--) {
        const newPiece = this.createPiece(r, c);
        this.grid[r][c] = newPiece;
        drops.push({ fromRow: -spawnOffset, toRow: r, col: c, isNew: true });
        spawnOffset++;
      }
    }

    return drops;
  }

  /**
   * Booster Abilities:
   * 1. Hammer: Shatters single tile
   * 2. Nova: Clears 3x3
   * 3. Lightning: Clears row + col
   */
  public useHammer(r: number, c: number): MatchResult {
    const target = this.grid[r][c];
    if (!target) return this.emptyResult();

    const matchedTilesList = [{ row: r, col: c, tile: target }];
    this.grid[r][c] = null;

    let clearedIce = 0;
    let clearedCages = 0;
    let destroyedStones = 0;
    if (target.obstacle === 'ice_1' || target.obstacle === 'ice_2') clearedIce = 1;
    if (target.obstacle === 'cage') clearedCages = 1;
    if (target.obstacle === 'stone') destroyedStones = 1;

    return {
      matchedTiles: matchedTilesList,
      specialSpawns: [],
      comboCount: 1,
      clearedIce,
      clearedCages,
      destroyedStones,
      collectedColors: { ruby: 0, sapphire: 0, emerald: 0, amethyst: 0, topaz: 0, diamond: 0 },
      scoreGained: 250,
      specialComboTriggered: 'CRYSTAL HAMMER!'
    };
  }

  public useNovaBooster(r: number, c: number): MatchResult {
    const matchedTilesList: { row: number; col: number; tile: TilePiece }[] = [];
    let clearedIce = 0;
    let clearedCages = 0;
    let destroyedStones = 0;

    for (let dr = -1; dr <= 1; dr++) {
      for (let dc = -1; dc <= 1; dc++) {
        const nr = r + dr;
        const nc = c + dc;
        if (nr >= 0 && nr < this.rows && nc >= 0 && nc < this.cols) {
          const t = this.grid[nr][nc];
          if (t) {
            matchedTilesList.push({ row: nr, col: nc, tile: t });
            if (t.obstacle === 'ice_1' || t.obstacle === 'ice_2') clearedIce++;
            if (t.obstacle === 'cage') clearedCages++;
            if (t.obstacle === 'stone') destroyedStones++;
            this.grid[nr][nc] = null;
          }
        }
      }
    }

    return {
      matchedTiles: matchedTilesList,
      specialSpawns: [],
      comboCount: 1,
      clearedIce,
      clearedCages,
      destroyedStones,
      collectedColors: { ruby: 0, sapphire: 0, emerald: 0, amethyst: 0, topaz: 0, diamond: 0 },
      scoreGained: matchedTilesList.length * 100,
      specialComboTriggered: 'COSMIC NOVA!'
    };
  }

  public useLightningBooster(r: number, c: number): MatchResult {
    const matchedTilesList: { row: number; col: number; tile: TilePiece }[] = [];
    let clearedIce = 0;
    let clearedCages = 0;
    let destroyedStones = 0;

    for (let col = 0; col < this.cols; col++) {
      const t = this.grid[r][col];
      if (t) {
        matchedTilesList.push({ row: r, col, tile: t });
        if (t.obstacle === 'ice_1' || t.obstacle === 'ice_2') clearedIce++;
        if (t.obstacle === 'cage') clearedCages++;
        if (t.obstacle === 'stone') destroyedStones++;
        this.grid[r][col] = null;
      }
    }
    for (let row = 0; row < this.rows; row++) {
      const t = this.grid[row][c];
      if (t) {
        matchedTilesList.push({ row, col: c, tile: t });
        if (t.obstacle === 'ice_1' || t.obstacle === 'ice_2') clearedIce++;
        if (t.obstacle === 'cage') clearedCages++;
        if (t.obstacle === 'stone') destroyedStones++;
        this.grid[row][c] = null;
      }
    }

    return {
      matchedTiles: matchedTilesList,
      specialSpawns: [],
      comboCount: 1,
      clearedIce,
      clearedCages,
      destroyedStones,
      collectedColors: { ruby: 0, sapphire: 0, emerald: 0, amethyst: 0, topaz: 0, diamond: 0 },
      scoreGained: matchedTilesList.length * 90,
      specialComboTriggered: 'LIGHTNING STRIKE!'
    };
  }

  private emptyResult(): MatchResult {
    return {
      matchedTiles: [],
      specialSpawns: [],
      comboCount: 1,
      clearedIce: 0,
      clearedCages: 0,
      destroyedStones: 0,
      collectedColors: { ruby: 0, sapphire: 0, emerald: 0, amethyst: 0, topaz: 0, diamond: 0 },
      scoreGained: 0
    };
  }
}
