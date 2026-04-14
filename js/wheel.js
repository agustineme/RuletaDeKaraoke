// ============================================================
// WHEEL — Canvas spinning wheel animation
// ============================================================

class SpinWheel {
  constructor(canvas, size) {
    this.canvas = canvas;
    this.canvas.width  = size;
    this.canvas.height = size;
    this.ctx  = canvas.getContext('2d');
    this.size = size;
    this.angle = Math.random() * Math.PI * 2;
    this.animId = null;

    // Segment colors matching the party palette
    this.colors = [
      '#FF4D8D', // hot pink
      '#FFD600', // yellow
      '#00C2C7', // teal
      '#FF6E40', // orange
      '#7C3AED', // purple
      '#22C55E', // green
      '#EF4444', // red
      '#3B82F6', // blue
    ];
    this.numSegments = this.colors.length;

    this.draw(this.angle);
  }

  // ── Drawing ──────────────────────────────────────────────

  draw(angle) {
    const { ctx, size, numSegments, colors } = this;
    const cx = size / 2;
    const cy = size / 2;
    const r  = size / 2 - 6;

    ctx.clearRect(0, 0, size, size);

    // Drop shadow behind wheel
    ctx.save();
    ctx.shadowBlur  = 28;
    ctx.shadowColor = 'rgba(0,0,0,0.5)';

    // Segments
    for (let i = 0; i < numSegments; i++) {
      const start = angle + (i / numSegments) * Math.PI * 2 - Math.PI / 2;
      const end   = angle + ((i + 1) / numSegments) * Math.PI * 2 - Math.PI / 2;

      ctx.beginPath();
      ctx.moveTo(cx, cy);
      ctx.arc(cx, cy, r, start, end);
      ctx.closePath();
      ctx.fillStyle = colors[i];
      ctx.fill();
    }

    ctx.restore();

    // Segment dividers
    for (let i = 0; i < numSegments; i++) {
      const a = angle + (i / numSegments) * Math.PI * 2 - Math.PI / 2;
      ctx.beginPath();
      ctx.moveTo(cx, cy);
      ctx.lineTo(cx + r * Math.cos(a), cy + r * Math.sin(a));
      ctx.strokeStyle = 'rgba(255,255,255,0.5)';
      ctx.lineWidth = 2;
      ctx.stroke();
    }

    // Outer ring
    ctx.beginPath();
    ctx.arc(cx, cy, r, 0, Math.PI * 2);
    ctx.strokeStyle = 'rgba(255,255,255,0.9)';
    ctx.lineWidth = 5;
    ctx.stroke();

    // Center pin
    ctx.beginPath();
    ctx.arc(cx, cy, r * 0.09, 0, Math.PI * 2);
    ctx.fillStyle = '#1A0A3E';
    ctx.fill();
    ctx.strokeStyle = 'white';
    ctx.lineWidth = 3;
    ctx.stroke();

    // Pointer (triangle pointing DOWN into wheel from top)
    const pSize = size * 0.07;
    const pY    = 2;
    ctx.beginPath();
    ctx.moveTo(cx - pSize, pY);
    ctx.lineTo(cx + pSize, pY);
    ctx.lineTo(cx, pY + pSize * 1.8);
    ctx.closePath();
    ctx.fillStyle = 'white';
    ctx.fill();
    ctx.shadowBlur  = 6;
    ctx.shadowColor = 'rgba(0,0,0,0.6)';
    ctx.strokeStyle = 'rgba(0,0,0,0.3)';
    ctx.lineWidth = 1.5;
    ctx.stroke();
  }

  // ── Idle slow rotation ────────────────────────────────────

  startIdle() {
    this.stopAnim();
    const tick = () => {
      this.angle += 0.005;
      this.draw(this.angle);
      this.animId = requestAnimationFrame(tick);
    };
    this.animId = requestAnimationFrame(tick);
  }

  // ── Full spin (3.5 s, ease-out) ──────────────────────────

  spin(durationMs, onComplete) {
    this.stopAnim();
    const start       = performance.now();
    const startAngle  = this.angle;
    // 6–10 full rotations for drama
    const totalRot    = Math.PI * 2 * (6 + Math.random() * 4);

    const tick = (now) => {
      const elapsed  = now - start;
      const progress = Math.min(elapsed / durationMs, 1);
      // Ease out cubic
      const eased    = 1 - Math.pow(1 - progress, 3);

      this.angle = startAngle + totalRot * eased;
      this.draw(this.angle);

      if (progress < 1) {
        this.animId = requestAnimationFrame(tick);
      } else {
        this.angle = startAngle + totalRot;
        this.draw(this.angle);
        if (onComplete) onComplete();
      }
    };
    this.animId = requestAnimationFrame(tick);
  }

  // ── Quick re-spin (for "cambiar canción") ─────────────────

  quickSpin(onComplete) {
    this.spin(1800, onComplete);
  }

  stopAnim() {
    if (this.animId) {
      cancelAnimationFrame(this.animId);
      this.animId = null;
    }
  }
}
