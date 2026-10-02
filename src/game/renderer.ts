import { TilePiece, CrystalColor, SpecialType, ObstacleType } from '../types/game';

export class CrystalRenderer {
  // Color palette for gems
  private static colors: Record<CrystalColor, { main: string; light: string; dark: string; glow: string }> = {
    ruby: {
      main: '#ff1744',
      light: '#ff8a80',
      dark: '#b71c1c',
      glow: 'rgba(255, 23, 68, 0.6)'
    },
    sapphire: {
      main: '#0070f3',
      light: '#79b8ff',
      dark: '#003e8a',
      glow: 'rgba(0, 112, 243, 0.6)'
    },
    emerald: {
      main: '#00e676',
      light: '#b9f6ca',
      dark: '#007e33',
      glow: 'rgba(0, 230, 118, 0.6)'
    },
    amethyst: {
      main: '#d500f9',
      light: '#f48fb1',
      dark: '#7b1fa2',
      glow: 'rgba(213, 0, 249, 0.6)'
    },
    topaz: {
      main: '#ffab00',
      light: '#ffe57f',
      dark: '#ff6f00',
      glow: 'rgba(255, 171, 0, 0.6)'
    },
    diamond: {
      main: '#00e5ff',
      light: '#ffffff',
      dark: '#0097a7',
      glow: 'rgba(0, 229, 255, 0.6)'
    }
  };

  /**
   * Render single tile piece
   */
  public static drawTile(
    ctx: CanvasRenderingContext2D,
    tile: TilePiece,
    x: number,
    y: number,
    size: number,
    isSelected: boolean,
    isHinted: boolean,
    time: number
  ) {
    ctx.save();

    const scale = tile.scale ?? 1.0;
    const alpha = tile.alpha ?? 1.0;
    const cx = x + size / 2 + (tile.xOffset ?? 0);
    const cy = y + size / 2 + (tile.yOffset ?? 0);
    const radius = (size / 2) * 0.76 * scale;

    ctx.globalAlpha = Math.max(0, Math.min(1, alpha));
    ctx.translate(cx, cy);

    // Selected or Hinted pulse
    if (isSelected) {
      ctx.save();
      const pulse = 1 + Math.sin(time * 8) * 0.08;
      ctx.scale(pulse, pulse);
      ctx.strokeStyle = '#ffffff';
      ctx.lineWidth = 3.5;
      ctx.shadowColor = '#00f2fe';
      ctx.shadowBlur = 16;
      ctx.beginPath();
      ctx.arc(0, 0, radius * 1.25, 0, Math.PI * 2);
      ctx.stroke();
      ctx.restore();
    } else if (isHinted) {
      ctx.save();
      const pulse = 1 + Math.sin(time * 6) * 0.12;
      ctx.scale(pulse, pulse);
      ctx.strokeStyle = '#ffea00';
      ctx.lineWidth = 2.5;
      ctx.shadowColor = '#ffea00';
      ctx.shadowBlur = 12;
      ctx.beginPath();
      ctx.arc(0, 0, radius * 1.2, 0, Math.PI * 2);
      ctx.stroke();
      ctx.restore();
    }

    // Draw Stone Obstacle if stone
    if (tile.obstacle === 'stone') {
      this.drawStone(ctx, radius);
      ctx.restore();
      return;
    }

    // Draw Gem Core
    if (tile.special === 'super_prism') {
      this.drawSuperPrism(ctx, radius, time);
    } else {
      this.drawCrystalShape(ctx, tile.color, radius, time);
    }

    // Draw Special Effects overlay
    if (tile.special === 'horizontal_beam') {
      this.drawBeamOverlay(ctx, 'horizontal', radius, time);
    } else if (tile.special === 'vertical_beam') {
      this.drawBeamOverlay(ctx, 'vertical', radius, time);
    } else if (tile.special === 'nova_bomb') {
      this.drawBombOverlay(ctx, radius, time);
    }

    // Draw Obstacle Overlays (Ice / Cage)
    if (tile.obstacle === 'ice_1' || tile.obstacle === 'ice_2') {
      this.drawIceOverlay(ctx, radius, tile.obstacle === 'ice_2');
    }

    if (tile.obstacle === 'cage') {
      this.drawCageOverlay(ctx, radius);
    }

    ctx.restore();
  }

  // Draw multifaceted crystals
  private static drawCrystalShape(
    ctx: CanvasRenderingContext2D,
    color: CrystalColor,
    r: number,
    time: number
  ) {
    const pal = this.colors[color] || this.colors.ruby;

    ctx.save();
    ctx.shadowColor = pal.glow;
    ctx.shadowBlur = 10;

    switch (color) {
      case 'ruby':
        // Hexagonal faceted ruby
        this.drawFacetedPolygon(ctx, 6, r, pal);
        break;
      case 'sapphire':
        // Teardrop / Pear brilliant gem
        this.drawTeardropGem(ctx, r, pal);
        break;
      case 'emerald':
        // Octagonal emerald cut
        this.drawEmeraldCut(ctx, r, pal);
        break;
      case 'amethyst':
        // Rhombus diamond
        this.drawRhombusGem(ctx, r, pal);
        break;
      case 'topaz':
        // 5-pointed radiant star gem
        this.drawStarGem(ctx, r, pal, time);
        break;
      case 'diamond':
        // Kite / Shield crystal
        this.drawShieldGem(ctx, r, pal);
        break;
    }

    ctx.restore();
  }

  // Hexagon Ruby
  private static drawFacetedPolygon(ctx: CanvasRenderingContext2D, sides: number, r: number, pal: { main: string; light: string; dark: string }) {
    ctx.beginPath();
    for (let i = 0; i < sides; i++) {
      const angle = (Math.PI * 2 * i) / sides - Math.PI / 2;
      const x = Math.cos(angle) * r;
      const y = Math.sin(angle) * r;
      if (i === 0) ctx.moveTo(x, y);
      else ctx.lineTo(x, y);
    }
    ctx.closePath();

    const grad = ctx.createRadialGradient(-r * 0.2, -r * 0.3, r * 0.1, 0, 0, r);
    grad.addColorStop(0, pal.light);
    grad.addColorStop(0.6, pal.main);
    grad.addColorStop(1, pal.dark);
    ctx.fillStyle = grad;
    ctx.fill();

    // Internal facets
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.4)';
    ctx.lineWidth = 1.5;
    ctx.beginPath();
    for (let i = 0; i < sides; i++) {
      const angle = (Math.PI * 2 * i) / sides - Math.PI / 2;
      const x = Math.cos(angle) * (r * 0.55);
      const y = Math.sin(angle) * (r * 0.55);
      if (i === 0) ctx.moveTo(x, y);
      else ctx.lineTo(x, y);
    }
    ctx.closePath();
    ctx.fillStyle = 'rgba(255, 255, 255, 0.15)';
    ctx.fill();
    ctx.stroke();

    // Specular highlight spot
    ctx.fillStyle = '#ffffff';
    ctx.beginPath();
    ctx.ellipse(-r * 0.28, -r * 0.35, r * 0.18, r * 0.08, -Math.PI / 4, 0, Math.PI * 2);
    ctx.fill();
  }

  // Teardrop Sapphire
  private static drawTeardropGem(ctx: CanvasRenderingContext2D, r: number, pal: { main: string; light: string; dark: string }) {
    ctx.beginPath();
    ctx.moveTo(0, -r * 1.05);
    ctx.bezierCurveTo(r * 1.0, -r * 0.4, r * 0.85, r * 0.9, 0, r * 0.95);
    ctx.bezierCurveTo(-r * 0.85, r * 0.9, -r * 1.0, -r * 0.4, 0, -r * 1.05);
    ctx.closePath();

    const grad = ctx.createRadialGradient(-r * 0.2, -r * 0.2, r * 0.1, 0, 0, r);
    grad.addColorStop(0, pal.light);
    grad.addColorStop(0.5, pal.main);
    grad.addColorStop(1, pal.dark);
    ctx.fillStyle = grad;
    ctx.fill();

    // Internal facet ring
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.45)';
    ctx.lineWidth = 1.5;
    ctx.beginPath();
    ctx.moveTo(0, -r * 0.6);
    ctx.bezierCurveTo(r * 0.5, -r * 0.2, r * 0.4, r * 0.5, 0, r * 0.6);
    ctx.bezierCurveTo(-r * 0.4, r * 0.5, -r * 0.5, -r * 0.2, 0, -r * 0.6);
    ctx.stroke();

    // Specular highlight
    ctx.fillStyle = '#ffffff';
    ctx.beginPath();
    ctx.arc(-r * 0.25, -r * 0.3, r * 0.14, 0, Math.PI * 2);
    ctx.fill();
  }

  // Emerald Cut Octagon
  private static drawEmeraldCut(ctx: CanvasRenderingContext2D, r: number, pal: { main: string; light: string; dark: string }) {
    const w = r * 0.88;
    const h = r * 0.95;
    const c = r * 0.35;

    ctx.beginPath();
    ctx.moveTo(-w + c, -h);
    ctx.lineTo(w - c, -h);
    ctx.lineTo(w, -h + c);
    ctx.lineTo(w, h - c);
    ctx.lineTo(w - c, h);
    ctx.lineTo(-w + c, h);
    ctx.lineTo(-w, h - c);
    ctx.lineTo(-w, -h + c);
    ctx.closePath();

    const grad = ctx.createLinearGradient(-w, -h, w, h);
    grad.addColorStop(0, pal.light);
    grad.addColorStop(0.4, pal.main);
    grad.addColorStop(1, pal.dark);
    ctx.fillStyle = grad;
    ctx.fill();

    // Step cut internal rectangle
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.45)';
    ctx.lineWidth = 1.5;
    ctx.strokeRect(-w * 0.55, -h * 0.55, w * 1.1, h * 1.1);

    // Highlight
    ctx.fillStyle = 'rgba(255,255,255,0.7)';
    ctx.fillRect(-w * 0.4, -h * 0.8, w * 0.25, h * 0.1);
  }

  // Rhombus Amethyst
  private static drawRhombusGem(ctx: CanvasRenderingContext2D, r: number, pal: { main: string; light: string; dark: string }) {
    ctx.beginPath();
    ctx.moveTo(0, -r * 1.1);
    ctx.lineTo(r * 0.85, 0);
    ctx.lineTo(0, r * 1.1);
    ctx.lineTo(-r * 0.85, 0);
    ctx.closePath();

    const grad = ctx.createRadialGradient(-r * 0.1, -r * 0.2, 0, 0, 0, r);
    grad.addColorStop(0, pal.light);
    grad.addColorStop(0.5, pal.main);
    grad.addColorStop(1, pal.dark);
    ctx.fillStyle = grad;
    ctx.fill();

    // Inner diamond facet
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.5)';
    ctx.lineWidth = 1.5;
    ctx.beginPath();
    ctx.moveTo(0, -r * 0.6);
    ctx.lineTo(r * 0.45, 0);
    ctx.lineTo(0, r * 0.6);
    ctx.lineTo(-r * 0.45, 0);
    ctx.closePath();
    ctx.stroke();

    ctx.fillStyle = '#ffffff';
    ctx.beginPath();
    ctx.arc(-r * 0.2, -r * 0.35, r * 0.12, 0, Math.PI * 2);
    ctx.fill();
  }

  // Topaz Star Radiant
  private static drawStarGem(ctx: CanvasRenderingContext2D, r: number, pal: { main: string; light: string; dark: string }, time: number) {
    const points = 5;
    const outerR = r * 1.05;
    const innerR = r * 0.52;

    ctx.beginPath();
    for (let i = 0; i < points * 2; i++) {
      const radius = i % 2 === 0 ? outerR : innerR;
      const angle = (Math.PI * i) / points - Math.PI / 2;
      const x = Math.cos(angle) * radius;
      const y = Math.sin(angle) * radius;
      if (i === 0) ctx.moveTo(x, y);
      else ctx.lineTo(x, y);
    }
    ctx.closePath();

    const grad = ctx.createRadialGradient(0, 0, r * 0.1, 0, 0, r);
    grad.addColorStop(0, pal.light);
    grad.addColorStop(0.6, pal.main);
    grad.addColorStop(1, pal.dark);
    ctx.fillStyle = grad;
    ctx.fill();

    // Center jewel
    ctx.fillStyle = 'rgba(255, 255, 255, 0.35)';
    ctx.beginPath();
    ctx.arc(0, 0, innerR * 0.6, 0, Math.PI * 2);
    ctx.fill();

    ctx.fillStyle = '#ffffff';
    ctx.beginPath();
    ctx.arc(-r * 0.2, -r * 0.2, r * 0.12, 0, Math.PI * 2);
    ctx.fill();
  }

  // Diamond Shield
  private static drawShieldGem(ctx: CanvasRenderingContext2D, r: number, pal: { main: string; light: string; dark: string }) {
    ctx.beginPath();
    ctx.moveTo(0, -r * 1.0);
    ctx.lineTo(r * 0.9, -r * 0.4);
    ctx.lineTo(r * 0.6, r * 0.85);
    ctx.lineTo(0, r * 1.05);
    ctx.lineTo(-r * 0.6, r * 0.85);
    ctx.lineTo(-r * 0.9, -r * 0.4);
    ctx.closePath();

    const grad = ctx.createLinearGradient(-r, -r, r, r);
    grad.addColorStop(0, '#ffffff');
    grad.addColorStop(0.3, pal.light);
    grad.addColorStop(0.7, pal.main);
    grad.addColorStop(1, pal.dark);
    ctx.fillStyle = grad;
    ctx.fill();

    // Diamond triangular facets
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.6)';
    ctx.lineWidth = 1.2;
    ctx.beginPath();
    ctx.moveTo(0, -r * 1.0);
    ctx.lineTo(0, r * 1.05);
    ctx.moveTo(-r * 0.9, -r * 0.4);
    ctx.lineTo(r * 0.9, -r * 0.4);
    ctx.stroke();

    ctx.fillStyle = '#ffffff';
    ctx.beginPath();
    ctx.arc(-r * 0.25, -r * 0.3, r * 0.15, 0, Math.PI * 2);
    ctx.fill();
  }

  // Super Prism (Color Bomb / Rainbow Orb)
  private static drawSuperPrism(ctx: CanvasRenderingContext2D, r: number, time: number) {
    ctx.save();
    // Rainbow outer aura
    const grad = ctx.createRadialGradient(0, 0, r * 0.2, 0, 0, r * 1.15);
    grad.addColorStop(0, '#ffffff');
    grad.addColorStop(0.2, '#ff0055');
    grad.addColorStop(0.4, '#ffaa00');
    grad.addColorStop(0.6, '#00ff88');
    grad.addColorStop(0.8, '#00aaff');
    grad.addColorStop(1, '#aa00ff');

    ctx.shadowColor = '#ffffff';
    ctx.shadowBlur = 16;
    ctx.fillStyle = grad;
    ctx.beginPath();
    ctx.arc(0, 0, r * 0.95, 0, Math.PI * 2);
    ctx.fill();

    // Orbiting rings
    ctx.rotate(time * 2);
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.7)';
    ctx.lineWidth = 2.5;
    ctx.beginPath();
    ctx.ellipse(0, 0, r * 1.1, r * 0.45, Math.PI / 6, 0, Math.PI * 2);
    ctx.stroke();

    ctx.beginPath();
    ctx.ellipse(0, 0, r * 1.1, r * 0.45, -Math.PI / 6, 0, Math.PI * 2);
    ctx.stroke();

    // Center star glint
    ctx.fillStyle = '#ffffff';
    ctx.beginPath();
    ctx.arc(0, 0, r * 0.25, 0, Math.PI * 2);
    ctx.fill();

    ctx.restore();
  }

  // Special Overlays: Beams & Bombs
  private static drawBeamOverlay(ctx: CanvasRenderingContext2D, type: 'horizontal' | 'vertical', r: number, time: number) {
    ctx.save();
    ctx.strokeStyle = '#ffffff';
    ctx.fillStyle = '#ffffff';
    ctx.lineWidth = 2.5;
    ctx.shadowColor = '#00f2fe';
    ctx.shadowBlur = 10;

    const pulse = 0.8 + Math.sin(time * 10) * 0.2;
    ctx.globalAlpha = pulse;

    if (type === 'horizontal') {
      // Left and right arrows
      const len = r * 0.8;
      ctx.beginPath();
      ctx.moveTo(-len, 0);
      ctx.lineTo(len, 0);
      ctx.stroke();

      // Arrowheads
      ctx.beginPath();
      ctx.moveTo(-len, 0);
      ctx.lineTo(-len + 8, -6);
      ctx.lineTo(-len + 8, 6);
      ctx.closePath();
      ctx.fill();

      ctx.beginPath();
      ctx.moveTo(len, 0);
      ctx.lineTo(len - 8, -6);
      ctx.lineTo(len - 8, 6);
      ctx.closePath();
      ctx.fill();
    } else {
      // Top and bottom arrows
      const len = r * 0.8;
      ctx.beginPath();
      ctx.moveTo(0, -len);
      ctx.lineTo(0, len);
      ctx.stroke();

      ctx.beginPath();
      ctx.moveTo(0, -len);
      ctx.lineTo(-6, -len + 8);
      ctx.lineTo(6, -len + 8);
      ctx.closePath();
      ctx.fill();

      ctx.beginPath();
      ctx.moveTo(0, len);
      ctx.lineTo(-6, len - 8);
      ctx.lineTo(6, len - 8);
      ctx.closePath();
      ctx.fill();
    }
    ctx.restore();
  }

  private static drawBombOverlay(ctx: CanvasRenderingContext2D, r: number, time: number) {
    ctx.save();
    const pulse = 1 + Math.sin(time * 9) * 0.15;
    ctx.scale(pulse, pulse);

    // Glowing fiery ring
    ctx.strokeStyle = '#ffdd00';
    ctx.lineWidth = 3;
    ctx.shadowColor = '#ff3b30';
    ctx.shadowBlur = 15;
    ctx.beginPath();
    ctx.arc(0, 0, r * 0.9, 0, Math.PI * 2);
    ctx.stroke();

    // Elemental spark in center
    ctx.fillStyle = '#ffffff';
    ctx.beginPath();
    ctx.moveTo(0, -r * 0.45);
    ctx.lineTo(r * 0.15, -r * 0.15);
    ctx.lineTo(r * 0.45, 0);
    ctx.lineTo(r * 0.15, r * 0.15);
    ctx.lineTo(0, r * 0.45);
    ctx.lineTo(-r * 0.15, r * 0.15);
    ctx.lineTo(-r * 0.45, 0);
    ctx.lineTo(-r * 0.15, -r * 0.15);
    ctx.closePath();
    ctx.fill();

    ctx.restore();
  }

  // Ice Obstacle Overlay
  private static drawIceOverlay(ctx: CanvasRenderingContext2D, r: number, isDouble: boolean) {
    ctx.save();
    ctx.fillStyle = isDouble ? 'rgba(160, 220, 255, 0.75)' : 'rgba(190, 235, 255, 0.5)';
    ctx.strokeStyle = '#ffffff';
    ctx.lineWidth = 2;

    const s = r * 1.1;
    ctx.beginPath();
    ctx.rect(-s, -s, s * 2, s * 2);
    ctx.fill();
    ctx.stroke();

    // Frost cracks
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.85)';
    ctx.lineWidth = 1.5;
    ctx.beginPath();
    ctx.moveTo(-s * 0.7, -s * 0.5);
    ctx.lineTo(-s * 0.1, -s * 0.2);
    ctx.lineTo(s * 0.4, -s * 0.6);
    ctx.moveTo(-s * 0.1, -s * 0.2);
    ctx.lineTo(s * 0.2, s * 0.4);
    ctx.stroke();

    ctx.restore();
  }

  // Crystal Cage Overlay
  private static drawCageOverlay(ctx: CanvasRenderingContext2D, r: number) {
    ctx.save();
    ctx.strokeStyle = '#f59e0b';
    ctx.lineWidth = 3.5;
    ctx.shadowColor = '#d97706';
    ctx.shadowBlur = 8;

    const s = r * 1.05;
    // Outer cage box
    ctx.strokeRect(-s, -s, s * 2, s * 2);

    // Diagonal chains
    ctx.lineWidth = 2.5;
    ctx.beginPath();
    ctx.moveTo(-s, -s);
    ctx.lineTo(s, s);
    ctx.moveTo(s, -s);
    ctx.lineTo(-s, s);
    ctx.stroke();

    // Central padlock rune
    ctx.fillStyle = '#fef3c7';
    ctx.beginPath();
    ctx.arc(0, 0, r * 0.25, 0, Math.PI * 2);
    ctx.fill();

    ctx.restore();
  }

  // Stone Obstacle (Indestructible except by bombs/hammer)
  private static drawStone(ctx: CanvasRenderingContext2D, r: number) {
    ctx.save();
    const s = r * 1.05;

    const grad = ctx.createLinearGradient(-s, -s, s, s);
    grad.addColorStop(0, '#475569');
    grad.addColorStop(0.5, '#1e293b');
    grad.addColorStop(1, '#0f172a');

    ctx.fillStyle = grad;
    ctx.strokeStyle = '#64748b';
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.roundRect(-s, -s, s * 2, s * 2, 8);
    ctx.fill();
    ctx.stroke();

    // Rune carving
    ctx.strokeStyle = '#94a3b8';
    ctx.lineWidth = 2.5;
    ctx.beginPath();
    ctx.moveTo(0, -s * 0.6);
    ctx.lineTo(0, s * 0.6);
    ctx.moveTo(-s * 0.4, -s * 0.2);
    ctx.lineTo(s * 0.4, -s * 0.2);
    ctx.stroke();

    ctx.restore();
  }
}
