/**
 * High-performance 2D Canvas Particle & Visual Effects Engine
 */

export interface Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  size: number;
  color: string;
  alpha: number;
  decay: number;
  shape: 'shard' | 'sparkle' | 'circle' | 'ring';
  rotation: number;
  vRot: number;
  gravity?: number;
}

export interface FloatingText {
  x: number;
  y: number;
  text: string;
  color: string;
  size: number;
  alpha: number;
  vy: number;
  scale: number;
  weight?: string;
}

export interface LaserBeam {
  type: 'horizontal' | 'vertical';
  index: number;
  color: string;
  alpha: number;
  width: number;
  maxTime: number;
  time: number;
}

export class ParticleSystem {
  public particles: Particle[] = [];
  public floatingTexts: FloatingText[] = [];
  public laserBeams: LaserBeam[] = [];

  // Color lookup for crystal types
  public static getColorHex(color: string): string {
    switch (color) {
      case 'ruby': return '#ff2d55';
      case 'sapphire': return '#007aff';
      case 'emerald': return '#34c759';
      case 'amethyst': return '#af52de';
      case 'topaz': return '#ff9500';
      case 'diamond': return '#5ac8fa';
      default: return '#ffffff';
    }
  }

  // Crystal explosion shards
  public spawnMatchExplosion(x: number, y: number, color: string, count = 18) {
    const hex = ParticleSystem.getColorHex(color);
    for (let i = 0; i < count; i++) {
      const angle = (Math.PI * 2 * i) / count + (Math.random() - 0.5) * 0.5;
      const speed = 2.5 + Math.random() * 5.5;
      this.particles.push({
        x,
        y,
        vx: Math.cos(angle) * speed,
        vy: Math.sin(angle) * speed,
        size: 3 + Math.random() * 5,
        color: hex,
        alpha: 1.0,
        decay: 0.02 + Math.random() * 0.03,
        shape: Math.random() > 0.4 ? 'shard' : 'sparkle',
        rotation: Math.random() * Math.PI * 2,
        vRot: (Math.random() - 0.5) * 0.3,
        gravity: 0.12
      });
    }

    // Add central glow ring
    this.particles.push({
      x,
      y,
      vx: 0,
      vy: 0,
      size: 10,
      color: hex,
      alpha: 0.9,
      decay: 0.06,
      shape: 'ring',
      rotation: 0,
      vRot: 0
    });
  }

  // Nova bomb area shockwave
  public spawnBombBlast(x: number, y: number, color = 'topaz') {
    const hex = ParticleSystem.getColorHex(color);
    for (let i = 0; i < 36; i++) {
      const angle = Math.random() * Math.PI * 2;
      const speed = 4 + Math.random() * 9;
      this.particles.push({
        x,
        y,
        vx: Math.cos(angle) * speed,
        vy: Math.sin(angle) * speed,
        size: 4 + Math.random() * 8,
        color: i % 2 === 0 ? hex : '#ffffff',
        alpha: 1.0,
        decay: 0.025,
        shape: 'shard',
        rotation: Math.random() * Math.PI * 2,
        vRot: (Math.random() - 0.5) * 0.4,
        gravity: 0.08
      });
    }

    // Expanding shockwave rings
    for (let r = 0; r < 2; r++) {
      this.particles.push({
        x,
        y,
        vx: 0,
        vy: 0,
        size: 15 + r * 15,
        color: '#ffdd55',
        alpha: 0.95,
        decay: 0.04,
        shape: 'ring',
        rotation: 0,
        vRot: 0
      });
    }
  }

  // Laser beam spawn
  public spawnBeam(type: 'horizontal' | 'vertical', index: number, color = '#5ac8fa') {
    this.laserBeams.push({
      type,
      index,
      color,
      alpha: 1.0,
      width: 24,
      maxTime: 20,
      time: 0
    });
  }

  // Floating score text
  public spawnFloatingText(x: number, y: number, text: string, color = '#ffffff', size = 20, weight = '800') {
    this.floatingTexts.push({
      x,
      y,
      text,
      color,
      size,
      alpha: 1.0,
      vy: -1.6,
      scale: 1.25,
      weight
    });
  }

  // Update loop
  public update() {
    // Update particles
    for (let i = this.particles.length - 1; i >= 0; i--) {
      const p = this.particles[i];
      p.x += p.vx;
      p.y += p.vy;
      if (p.gravity) p.vy += p.gravity;
      p.rotation += p.vRot;
      p.alpha -= p.decay;

      if (p.shape === 'ring') {
        p.size += 4.5;
      }

      if (p.alpha <= 0) {
        this.particles.splice(i, 1);
      }
    }

    // Update floating texts
    for (let i = this.floatingTexts.length - 1; i >= 0; i--) {
      const t = this.floatingTexts[i];
      t.y += t.vy;
      t.alpha -= 0.022;
      t.scale = Math.max(1.0, t.scale - 0.015);
      if (t.alpha <= 0) {
        this.floatingTexts.splice(i, 1);
      }
    }

    // Update laser beams
    for (let i = this.laserBeams.length - 1; i >= 0; i--) {
      const b = this.laserBeams[i];
      b.time++;
      b.alpha = 1.0 - (b.time / b.maxTime);
      b.width = Math.max(2, 24 * (1.0 - b.time / b.maxTime));
      if (b.time >= b.maxTime) {
        this.laserBeams.splice(i, 1);
      }
    }
  }

  // Render on canvas
  public render(ctx: CanvasRenderingContext2D, tileSize: number, boardOffsetX: number, boardOffsetY: number, rows: number, cols: number) {
    ctx.save();

    // Render Laser Beams
    for (const b of this.laserBeams) {
      ctx.save();
      ctx.globalAlpha = Math.max(0, b.alpha);
      ctx.shadowColor = b.color;
      ctx.shadowBlur = 18;

      if (b.type === 'horizontal') {
        const y = boardOffsetY + b.index * tileSize + tileSize / 2;
        const startX = boardOffsetX;
        const endX = boardOffsetX + cols * tileSize;

        const grad = ctx.createLinearGradient(0, y - b.width / 2, 0, y + b.width / 2);
        grad.addColorStop(0, 'rgba(255,255,255,0)');
        grad.addColorStop(0.5, b.color);
        grad.addColorStop(1, 'rgba(255,255,255,0)');

        ctx.fillStyle = grad;
        ctx.fillRect(startX, y - b.width / 2, endX - startX, b.width);

        // Core white line
        ctx.fillStyle = '#ffffff';
        ctx.fillRect(startX, y - 2, endX - startX, 4);
      } else {
        const x = boardOffsetX + b.index * tileSize + tileSize / 2;
        const startY = boardOffsetY;
        const endY = boardOffsetY + rows * tileSize;

        const grad = ctx.createLinearGradient(x - b.width / 2, 0, x + b.width / 2, 0);
        grad.addColorStop(0, 'rgba(255,255,255,0)');
        grad.addColorStop(0.5, b.color);
        grad.addColorStop(1, 'rgba(255,255,255,0)');

        ctx.fillStyle = grad;
        ctx.fillRect(x - b.width / 2, startY, b.width, endY - startY);

        // Core white line
        ctx.fillStyle = '#ffffff';
        ctx.fillRect(x - 2, startY, 4, endY - startY);
      }
      ctx.restore();
    }

    // Render Particles
    for (const p of this.particles) {
      ctx.save();
      ctx.globalAlpha = Math.max(0, p.alpha);
      ctx.translate(p.x, p.y);
      ctx.rotate(p.rotation);

      if (p.shape === 'ring') {
        ctx.strokeStyle = p.color;
        ctx.lineWidth = 3;
        ctx.beginPath();
        ctx.arc(0, 0, p.size, 0, Math.PI * 2);
        ctx.stroke();
      } else if (p.shape === 'shard') {
        ctx.fillStyle = p.color;
        ctx.beginPath();
        ctx.moveTo(0, -p.size);
        ctx.lineTo(p.size * 0.6, 0);
        ctx.lineTo(0, p.size);
        ctx.lineTo(-p.size * 0.6, 0);
        ctx.closePath();
        ctx.fill();
      } else if (p.shape === 'sparkle') {
        ctx.fillStyle = '#ffffff';
        ctx.beginPath();
        ctx.moveTo(0, -p.size * 1.2);
        ctx.lineTo(p.size * 0.3, -p.size * 0.3);
        ctx.lineTo(p.size * 1.2, 0);
        ctx.lineTo(p.size * 0.3, p.size * 0.3);
        ctx.lineTo(0, p.size * 1.2);
        ctx.lineTo(-p.size * 0.3, p.size * 0.3);
        ctx.lineTo(-p.size * 1.2, 0);
        ctx.lineTo(-p.size * 0.3, -p.size * 0.3);
        ctx.closePath();
        ctx.fill();
      } else {
        ctx.fillStyle = p.color;
        ctx.beginPath();
        ctx.arc(0, 0, p.size / 2, 0, Math.PI * 2);
        ctx.fill();
      }

      ctx.restore();
    }

    // Render Floating Texts
    for (const t of this.floatingTexts) {
      ctx.save();
      ctx.globalAlpha = Math.max(0, t.alpha);
      ctx.font = `${t.weight || '800'} ${Math.round(t.size * t.scale)}px Outfit, sans-serif`;
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';

      // Outline shadow
      ctx.strokeStyle = 'rgba(0,0,0,0.8)';
      ctx.lineWidth = 4;
      ctx.strokeText(t.text, t.x, t.y);

      ctx.fillStyle = t.color;
      ctx.fillText(t.text, t.x, t.y);
      ctx.restore();
    }

    ctx.restore();
  }
}
