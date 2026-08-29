// A small, dependency-free confetti burst for form-success moments.
// Pure canvas, cleans itself up, and does nothing for visitors who've
// asked for reduced motion.
type Particle = {
  x: number;
  y: number;
  vx: number;
  vy: number;
  size: number;
  color: string;
  rotation: number;
  rotationSpeed: number;
};

const COLORS = ["#f94902", "#ffffff", "#ffb199", "#ffd9c7", "#2f7d52"];

export function launchConfetti() {
  if (typeof window === "undefined") return;
  if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

  const canvas = document.createElement("canvas");
  Object.assign(canvas.style, {
    position: "fixed",
    inset: "0",
    width: "100vw",
    height: "100vh",
    pointerEvents: "none",
    zIndex: "9999",
  });
  document.body.appendChild(canvas);

  const dpr = Math.min(window.devicePixelRatio || 1, 2);
  const width = window.innerWidth;
  const height = window.innerHeight;
  canvas.width = width * dpr;
  canvas.height = height * dpr;

  const ctx = canvas.getContext("2d");
  if (!ctx) {
    canvas.remove();
    return;
  }
  ctx.scale(dpr, dpr);

  const particles: Particle[] = Array.from({ length: 140 }, () => {
    const angle = Math.random() * Math.PI;
    const speed = 4 + Math.random() * 6;
    return {
      x: width / 2 + (Math.random() - 0.5) * width * 0.5,
      y: height * 0.35,
      vx: Math.cos(angle) * speed * (Math.random() < 0.5 ? -1 : 1),
      vy: -Math.abs(Math.sin(angle)) * speed - 4,
      size: 6 + Math.random() * 6,
      color: COLORS[Math.floor(Math.random() * COLORS.length)],
      rotation: Math.random() * Math.PI * 2,
      rotationSpeed: (Math.random() - 0.5) * 0.3,
    };
  });

  const gravity = 0.18;
  const drag = 0.995;
  const maxFrames = 130;
  let frame = 0;

  function tick() {
    frame += 1;
    ctx!.clearRect(0, 0, width, height);
    const life = Math.max(0, 1 - frame / maxFrames);

    for (const particle of particles) {
      particle.vx *= drag;
      particle.vy = particle.vy * drag + gravity;
      particle.x += particle.vx;
      particle.y += particle.vy;
      particle.rotation += particle.rotationSpeed;

      ctx!.save();
      ctx!.globalAlpha = life;
      ctx!.translate(particle.x, particle.y);
      ctx!.rotate(particle.rotation);
      ctx!.fillStyle = particle.color;
      ctx!.fillRect(-particle.size / 2, -particle.size / 4, particle.size, particle.size / 2);
      ctx!.restore();
    }

    if (frame < maxFrames) {
      requestAnimationFrame(tick);
    } else {
      canvas.remove();
    }
  }

  requestAnimationFrame(tick);
}
