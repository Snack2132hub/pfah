import React, { useEffect, useRef, useState } from 'react';
import {
  Volume2,
  VolumeX,
  Music,
  Download,
  RotateCcw,
  Sparkles,
  Gamepad2,
  Edit3,
  PartyPopper,
  Layers,
  Info,
  CheckCircle2,
} from 'lucide-react';
import { retroAudio } from './game/audio';
import {
  drawPixelPlayer,
  drawPixelShuttlecock,
  drawPixelMangaBook,
  drawQuestionBlock,
  drawBrickBlock,
  drawGroundTile,
  drawGoalSection,
  drawAnimeCheerSquad,
} from './game/pixelArt';
import { generateStandaloneGameHtml } from './game/standaloneGenerator';
import {
  Player,
  Platform,
  Collectible,
  FloatingText,
  ConfettiParticle,
  Firework,
  RenderMode,
} from './game/types';

export default function App() {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  // Game UI State
  const [score, setScore] = useState<number>(0);
  const [shuttlecockCount, setShuttlecockCount] = useState<number>(0);
  const [mangaCount, setMangaCount] = useState<number>(0);
  const [isMuted, setIsMuted] = useState<boolean>(false);
  const [isBgmOn, setIsBgmOn] = useState<boolean>(false);
  const [isVictory, setIsVictory] = useState<boolean>(false);
  const [renderMode, setRenderMode] = useState<RenderMode>('pixelArt');
  const [showWishEditor, setShowWishEditor] = useState<boolean>(false);
  const [showSpritesModal, setShowSpritesModal] = useState<boolean>(false);
  const [crtFilter, setCrtFilter] = useState<boolean>(true);

  // Customizable Birthday Wish
  const [recipientName, setRecipientName] = useState<string>("P'Fah");
  const [birthdayWish, setBirthdayWish] = useState<string>(
    "Happy Birthday P'Fah! 🏸 Wishing you unstoppable smash victories on the badminton court, thrilling anime marathons, and a fantastic year full of happiness and success! Keep inspiring everyone! 🎂✨"
  );

  // Custom Player Sprite Sheet Image
  const [customSpriteUrl, setCustomSpriteUrl] = useState<string | null>(null);
  const customImgRef = useRef<HTMLImageElement | null>(null);

  // References to game entities
  const playerRef = useRef<Player>({
    x: 80,
    y: 380,
    vx: 0,
    vy: 0,
    width: 38,
    height: 56,
    isGrounded: true,
    facing: 'right',
    animFrame: 0,
    animTimer: 0,
    isJumping: false,
    reachedGoal: false,
    slideTimer: 0,
  });

  const cameraRef = useRef<{ x: number }>({ x: 0 });
  const keysRef = useRef<{ left: boolean; right: boolean; jump: boolean }>({
    left: false,
    right: false,
    jump: false,
  });
  const platformsRef = useRef<Platform[]>([]);
  const collectiblesRef = useRef<Collectible[]>([]);
  const floatingTextsRef = useRef<FloatingText[]>([]);
  const confettiRef = useRef<ConfettiParticle[]>([]);
  const fireworksRef = useRef<Firework[]>([]);
  const flagProgressRef = useRef<number>(0);
  const victoryStateRef = useRef<boolean>(false);
  const animFrameIdRef = useRef<number | null>(null);

  const LEVEL_WIDTH = 3400;
  const GROUND_Y = 460;
  const GOAL_POLE_X = 2850;

  // Initialize Level Geometry & Collectibles
  const initLevel = () => {
    playerRef.current = {
      x: 80,
      y: GROUND_Y - 56,
      vx: 0,
      vy: 0,
      width: 38,
      height: 56,
      isGrounded: true,
      facing: 'right',
      animFrame: 0,
      animTimer: 0,
      isJumping: false,
      reachedGoal: false,
      slideTimer: 0,
    };

    cameraRef.current.x = 0;
    flagProgressRef.current = 0;
    victoryStateRef.current = false;
    setIsVictory(false);
    setScore(0);
    setShuttlecockCount(0);
    setMangaCount(0);
    floatingTextsRef.current = [];
    confettiRef.current = [];
    fireworksRef.current = [];

    // Platforms
    platformsRef.current = [
      // Ground segment
      { x: 0, y: GROUND_Y, width: LEVEL_WIDTH, height: 80, type: 'ground' },

      // Intro floating blocks
      { x: 300, y: 350, width: 40, height: 40, type: 'question', itemInside: 'shuttlecock' },
      { x: 340, y: 350, width: 40, height: 40, type: 'brick' },
      { x: 380, y: 350, width: 40, height: 40, type: 'question', itemInside: 'manga' },
      { x: 420, y: 350, width: 40, height: 40, type: 'brick' },
      { x: 460, y: 350, width: 40, height: 40, type: 'question', itemInside: 'shuttlecock' },

      // High floating platforms for badminton jumps
      { x: 620, y: 280, width: 120, height: 30, type: 'brick' },
      { x: 800, y: 340, width: 100, height: 30, type: 'brick' },
      { x: 960, y: 250, width: 140, height: 30, type: 'brick' },
      { x: 1010, y: 160, width: 40, height: 40, type: 'question', itemInside: 'manga' },

      // Mid-level acrobatic parkour
      { x: 1240, y: 360, width: 90, height: 30, type: 'brick' },
      { x: 1400, y: 300, width: 90, height: 30, type: 'brick' },
      { x: 1560, y: 240, width: 120, height: 30, type: 'brick' },
      { x: 1600, y: 150, width: 40, height: 40, type: 'question', itemInside: 'shuttlecock' },

      // Staircase leading to the grand stadium
      { x: 1820, y: 380, width: 80, height: 30, type: 'brick' },
      { x: 1960, y: 330, width: 80, height: 30, type: 'brick' },
      { x: 2120, y: 280, width: 80, height: 30, type: 'brick' },
      { x: 2280, y: 230, width: 100, height: 30, type: 'brick' },
      { x: 2460, y: 330, width: 120, height: 30, type: 'brick' },
    ];

    // Collectibles: Badminton shuttlecocks and Anime Manga books
    collectiblesRef.current = [
      // Badminton Shuttlecocks
      { id: 'sc-1', x: 200, y: 410, width: 28, height: 28, type: 'shuttlecock', collected: false, floatOffset: 0, value: 50 },
      { id: 'sc-2', x: 300, y: 290, width: 28, height: 28, type: 'shuttlecock', collected: false, floatOffset: 1, value: 50 },
      { id: 'sc-3', x: 460, y: 290, width: 28, height: 28, type: 'shuttlecock', collected: false, floatOffset: 2, value: 50 },
      { id: 'sc-4', x: 670, y: 220, width: 28, height: 28, type: 'shuttlecock', collected: false, floatOffset: 0.5, value: 50 },
      { id: 'sc-5', x: 840, y: 280, width: 28, height: 28, type: 'shuttlecock', collected: false, floatOffset: 1.5, value: 50 },
      { id: 'sc-6', x: 1280, y: 310, width: 28, height: 28, type: 'shuttlecock', collected: false, floatOffset: 2.2, value: 50 },
      { id: 'sc-7', x: 1610, y: 190, width: 28, height: 28, type: 'shuttlecock', collected: false, floatOffset: 0.8, value: 50 },
      { id: 'sc-8', x: 2000, y: 270, width: 28, height: 28, type: 'shuttlecock', collected: false, floatOffset: 1.8, value: 50 },
      { id: 'sc-9', x: 2320, y: 170, width: 28, height: 28, type: 'shuttlecock', collected: false, floatOffset: 2.5, value: 50 },
      { id: 'sc-10', x: 2510, y: 280, width: 28, height: 28, type: 'shuttlecock', collected: false, floatOffset: 0.3, value: 50 },

      // Anime Manga Books
      { id: 'mb-1', x: 380, y: 290, width: 26, height: 34, type: 'manga', title: 'Dragon Ball', collected: false, floatOffset: 0, value: 100 },
      { id: 'mb-2', x: 1010, y: 100, width: 26, height: 34, type: 'manga', title: 'One Piece', collected: false, floatOffset: 1.2, value: 100 },
      { id: 'mb-3', x: 1440, y: 240, width: 26, height: 34, type: 'manga', title: 'Naruto', collected: false, floatOffset: 2.1, value: 100 },
      { id: 'mb-4', x: 1860, y: 320, width: 26, height: 34, type: 'manga', title: 'My Hero Academia', collected: false, floatOffset: 0.7, value: 100 },
      { id: 'mb-5', x: 2160, y: 220, width: 26, height: 34, type: 'manga', title: 'Sailor Moon', collected: false, floatOffset: 1.9, value: 100 },
    ];
  };

  // Trigger Victory Celebration
  const triggerVictory = () => {
    victoryStateRef.current = true;
    setIsVictory(true);
    retroAudio.playVictoryFanfare();

    // Spawn 220 celebratory confetti particles
    const colors = ['#f43f5e', '#3b82f6', '#10b981', '#facc15', '#a855f7', '#fb923c', '#ec4899'];
    const newConfetti: ConfettiParticle[] = [];
    for (let i = 0; i < 220; i++) {
      newConfetti.push({
        x: Math.random() * 960,
        y: Math.random() * -540,
        vx: (Math.random() - 0.5) * 2.5,
        vy: 2 + Math.random() * 3.5,
        color: colors[Math.floor(Math.random() * colors.length)],
        size: 6 + Math.random() * 8,
        rotation: Math.random() * Math.PI * 2,
        vRot: (Math.random() - 0.5) * 0.2,
        oscillationSpeed: 0.04 + Math.random() * 0.08,
        wobble: Math.random() * Math.PI * 2,
      });
    }
    confettiRef.current = newConfetti;
  };

  // Keyboard Event Listeners
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (['ArrowLeft', 'KeyA'].includes(e.code)) keysRef.current.left = true;
      if (['ArrowRight', 'KeyD'].includes(e.code)) keysRef.current.right = true;
      if (['ArrowUp', 'Space', 'KeyW'].includes(e.code)) {
        if (!keysRef.current.jump && playerRef.current.isGrounded && !victoryStateRef.current) {
          playerRef.current.vy = -14.5;
          playerRef.current.isGrounded = false;
          playerRef.current.isJumping = true;
          retroAudio.playJump();
        }
        keysRef.current.jump = true;
      }
      if (e.code === 'KeyM') toggleMute();
      if (e.code === 'KeyR' && victoryStateRef.current) initLevel();
    };

    const handleKeyUp = (e: KeyboardEvent) => {
      if (['ArrowLeft', 'KeyA'].includes(e.code)) keysRef.current.left = false;
      if (['ArrowRight', 'KeyD'].includes(e.code)) keysRef.current.right = false;
      if (['ArrowUp', 'Space', 'KeyW'].includes(e.code)) keysRef.current.jump = false;
    };

    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keyup', handleKeyUp);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('keyup', handleKeyUp);
    };
  }, []);

  // Main Game Loop
  useEffect(() => {
    initLevel();

    let lastTime = performance.now();

    const gameLoop = (currentTime: number) => {
      const dt = Math.min((currentTime - lastTime) / 1000, 0.1);
      lastTime = currentTime;

      const canvas = canvasRef.current;
      if (canvas) {
        const ctx = canvas.getContext('2d');
        if (ctx) {
          updateGame(dt);
          renderGame(ctx, currentTime / 1000);
        }
      }

      animFrameIdRef.current = requestAnimationFrame(gameLoop);
    };

    animFrameIdRef.current = requestAnimationFrame(gameLoop);

    return () => {
      if (animFrameIdRef.current) {
        cancelAnimationFrame(animFrameIdRef.current);
      }
    };
  }, [renderMode, birthdayWish, recipientName]);

  // Game Physics & Collision Update
  const updateGame = (dt: number) => {
    const p = playerRef.current;

    // Victory celebration state updates
    if (victoryStateRef.current) {
      if (flagProgressRef.current < 1) {
        flagProgressRef.current = Math.min(1, flagProgressRef.current + dt * 1.2);
      }

      // Update Confetti
      for (const cf of confettiRef.current) {
        cf.y += cf.vy;
        cf.x += cf.vx + Math.sin(cf.wobble) * 1.5;
        cf.wobble += cf.oscillationSpeed;
        cf.rotation += cf.vRot;
        if (cf.y > 540 + 20) {
          cf.y = -20;
          cf.x = Math.random() * 960;
        }
      }

      // Spawn and update Fireworks
      if (Math.random() < 0.05) {
        const colors = ['#f43f5e', '#38bdf8', '#4ade80', '#facc15', '#e879f9', '#fb923c', '#ffffff'];
        const fwX = 80 + Math.random() * 800;
        const fwY = 70 + Math.random() * 190;
        const color = colors[Math.floor(Math.random() * colors.length)];
        const particles = [];
        for (let s = 0; s < 36; s++) {
          const angle = (s / 36) * Math.PI * 2;
          const speed = 1.8 + Math.random() * 3.5;
          particles.push({
            x: fwX,
            y: fwY,
            vx: Math.cos(angle) * speed,
            vy: Math.sin(angle) * speed,
            alpha: 1,
            color,
            size: 3 + Math.random() * 3,
            life: 0,
            maxLife: 1.2,
          });
        }
        fireworksRef.current.push({
          x: fwX,
          y: fwY,
          targetY: fwY,
          vy: 0,
          color,
          exploded: true,
          particles,
        });
      }

      for (let i = fireworksRef.current.length - 1; i >= 0; i--) {
        const fw = fireworksRef.current[i];
        let alive = false;
        for (const s of fw.particles) {
          s.x += s.vx;
          s.y += s.vy;
          s.vy += 0.04; // gravity
          s.alpha -= dt * 0.9;
          if (s.alpha > 0) alive = true;
        }
        if (!alive) {
          fireworksRef.current.splice(i, 1);
        }
      }
      return;
    }

    // Normal Gameplay Physics
    const ACCEL = 36;
    const FRICTION = 0.82;
    const MAX_SPEED = 6.4;

    if (keysRef.current.left) {
      p.vx -= ACCEL * dt;
      p.facing = 'left';
    }
    if (keysRef.current.right) {
      p.vx += ACCEL * dt;
      p.facing = 'right';
    }

    p.vx *= FRICTION;
    if (Math.abs(p.vx) > MAX_SPEED) {
      p.vx = Math.sign(p.vx) * MAX_SPEED;
    }
    if (Math.abs(p.vx) < 0.05) p.vx = 0;

    // Gravity
    const GRAVITY = 32;
    p.vy += GRAVITY * dt;
    if (p.vy > 18) p.vy = 18;

    // Update X position
    p.x += p.vx;
    if (p.x < 10) p.x = 10;
    if (p.x > LEVEL_WIDTH - 80) p.x = LEVEL_WIDTH - 80;

    // Update Y position
    p.y += p.vy;
    p.isGrounded = false;

    // Platform Collisions
    for (const plat of platformsRef.current) {
      // Landing on top
      if (
        p.x + p.width > plat.x &&
        p.x < plat.x + plat.width &&
        p.y + p.height >= plat.y &&
        p.y + p.height <= plat.y + 22 &&
        p.vy >= 0
      ) {
        p.y = plat.y - p.height;
        p.vy = 0;
        p.isGrounded = true;
        p.isJumping = false;
      }

      // Punching from bottom
      if (
        plat.type === 'question' &&
        !plat.isHit &&
        p.x + p.width > plat.x + 4 &&
        p.x < plat.x + plat.width - 4 &&
        p.y <= plat.y + plat.height &&
        p.y >= plat.y + plat.height - 18 &&
        p.vy < 0
      ) {
        plat.isHit = true;
        p.vy = 2; // bounce player down
        retroAudio.playBlockHit();

        if (plat.itemInside === 'shuttlecock') {
          setScore((s) => s + 50);
          setShuttlecockCount((sc) => sc + 1);
          retroAudio.playCollectShuttlecock();
          floatingTextsRef.current.push({
            id: String(Math.random()),
            x: plat.x + 8,
            y: plat.y - 10,
            text: '+50 🏸',
            color: '#facc15',
            alpha: 1,
            vy: -1.6,
          });
        } else if (plat.itemInside === 'manga') {
          setScore((s) => s + 100);
          setMangaCount((mc) => mc + 1);
          retroAudio.playCollectManga();
          floatingTextsRef.current.push({
            id: String(Math.random()),
            x: plat.x + 8,
            y: plat.y - 10,
            text: '+100 📖',
            color: '#f43f5e',
            alpha: 1,
            vy: -1.6,
          });
        }
      }
    }

    // Collectibles Collision
    for (const c of collectiblesRef.current) {
      if (!c.collected) {
        if (
          p.x + p.width > c.x &&
          p.x < c.x + c.width &&
          p.y + p.height > c.y &&
          p.y < c.y + c.height
        ) {
          c.collected = true;
          setScore((s) => s + c.value);
          if (c.type === 'shuttlecock') {
            setShuttlecockCount((sc) => sc + 1);
            retroAudio.playCollectShuttlecock();
            floatingTextsRef.current.push({
              id: String(Math.random()),
              x: c.x,
              y: c.y - 10,
              text: `+${c.value} 🏸`,
              color: '#38bdf8',
              alpha: 1,
              vy: -1.8,
            });
          } else {
            setMangaCount((mc) => mc + 1);
            retroAudio.playCollectManga();
            floatingTextsRef.current.push({
              id: String(Math.random()),
              x: c.x,
              y: c.y - 10,
              text: `+${c.value} 📖`,
              color: '#f43f5e',
              alpha: 1,
              vy: -1.8,
            });
          }
        }
      }
    }

    // Goal Post Reached (VICTORY SURPRISE TRIGGER!)
    if (p.x + p.width >= GOAL_POLE_X && !victoryStateRef.current) {
      p.vx = 0;
      p.vy = 0;
      p.x = GOAL_POLE_X - 12;
      triggerVictory();
    }

    // Running animation cycle
    if (Math.abs(p.vx) > 0.4 && p.isGrounded) {
      p.animTimer += dt * 10;
      p.animFrame = Math.floor(p.animTimer) % 6;
    } else {
      p.animFrame = 0;
    }

    // Smooth Camera Following
    const targetCamX = p.x - 960 * 0.35;
    cameraRef.current.x += (targetCamX - cameraRef.current.x) * 0.12;
    if (cameraRef.current.x < 0) cameraRef.current.x = 0;
    if (cameraRef.current.x > LEVEL_WIDTH - 960) cameraRef.current.x = LEVEL_WIDTH - 960;

    // Floating Texts update
    for (let i = floatingTextsRef.current.length - 1; i >= 0; i--) {
      const ft = floatingTextsRef.current[i];
      ft.y += ft.vy;
      ft.alpha -= dt * 0.8;
      if (ft.alpha <= 0) {
        floatingTextsRef.current.splice(i, 1);
      }
    }
  };

  // Rendering Game Scene
  const renderGame = (ctx: CanvasRenderingContext2D, sec: number) => {
    ctx.clearRect(0, 0, 960, 540);

    if (!victoryStateRef.current) {
      // 8-bit sky
      ctx.fillStyle = '#60a5fa';
      ctx.fillRect(0, 0, 960, 540);

      // Clouds (parallax)
      ctx.save();
      ctx.fillStyle = 'rgba(255, 255, 255, 0.75)';
      for (let cx = 0; cx < LEVEL_WIDTH; cx += 380) {
        const drawCloudX = cx - cameraRef.current.x * 0.25;
        drawCloud(ctx, drawCloudX, 70);
        drawCloud(ctx, drawCloudX + 180, 130);
      }
      ctx.restore();

      // Distant rolling green hills (parallax)
      ctx.save();
      for (let hx = -100; hx < LEVEL_WIDTH; hx += 320) {
        const hillX = hx - cameraRef.current.x * 0.5;
        drawHill(ctx, hillX, GROUND_Y);
      }
      ctx.restore();

      // World Camera Translation
      ctx.save();
      ctx.translate(-Math.floor(cameraRef.current.x), 0);

      // Draw Goal Section & Castle
      drawGoalSection(ctx, GOAL_POLE_X, GROUND_Y, flagProgressRef.current);

      // Draw Platforms
      for (const plat of platformsRef.current) {
        if (plat.type === 'ground') {
          drawGroundTile(ctx, plat.x, plat.y, plat.width, plat.height);
        } else if (plat.type === 'question') {
          drawQuestionBlock(ctx, plat.x, plat.y, plat.width, plat.height, plat.isHit);
        } else if (plat.type === 'brick') {
          drawBrickBlock(ctx, plat.x, plat.y, plat.width, plat.height);
        }
      }

      // Draw Collectibles
      for (const c of collectiblesRef.current) {
        if (!c.collected) {
          if (c.type === 'shuttlecock') {
            drawPixelShuttlecock(ctx, c.x, c.y, c.width, c.height, sec + c.floatOffset, renderMode);
          } else {
            drawPixelMangaBook(ctx, c.x, c.y, c.width, c.height, sec + c.floatOffset, renderMode);
          }
        }
      }

      // Draw Player (P'Fah)
      const p = playerRef.current;
      drawPixelPlayer(
        ctx,
        p.x,
        p.y,
        p.width,
        p.height,
        p.facing,
        p.animFrame,
        p.isJumping,
        renderMode,
        customImgRef.current
      );

      // Floating text popups
      for (const ft of floatingTextsRef.current) {
        ctx.fillStyle = ft.color;
        ctx.globalAlpha = Math.max(0, ft.alpha);
        ctx.font = 'bold 11px "Press Start 2P", monospace';
        ctx.fillText(ft.text, ft.x, ft.y);
      }
      ctx.globalAlpha = 1;

      ctx.restore();
    } else {
      // RENDER VICTORY SCREEN / BIRTHDAY SURPRISE (Image 3 & Image 4 inspired)
      renderVictoryScreen(ctx, sec);
    }
  };

  const drawCloud = (ctx: CanvasRenderingContext2D, x: number, y: number) => {
    ctx.fillStyle = '#ffffff';
    ctx.fillRect(x + 20, y, 70, 20);
    ctx.fillRect(x + 10, y + 10, 90, 20);
    ctx.fillRect(x, y + 20, 110, 20);
  };

  const drawHill = (ctx: CanvasRenderingContext2D, x: number, groundY: number) => {
    ctx.fillStyle = '#16a34a';
    ctx.beginPath();
    ctx.arc(x + 80, groundY, 75, Math.PI, 0);
    ctx.fill();
    ctx.fillStyle = '#15803d';
    ctx.beginPath();
    ctx.arc(x + 80, groundY, 75, Math.PI, Math.PI * 1.5);
    ctx.fill();
  };

  const renderVictoryScreen = (ctx: CanvasRenderingContext2D, sec: number) => {
    // Night festival sky
    const grad = ctx.createLinearGradient(0, 0, 0, 540);
    grad.addColorStop(0, '#020617');
    grad.addColorStop(0.5, '#0f172a');
    grad.addColorStop(1, '#1e1b4b');
    ctx.fillStyle = grad;
    ctx.fillRect(0, 0, 960, 540);

    // Exploding Fireworks
    for (const fw of fireworksRef.current) {
      for (const s of fw.particles) {
        ctx.fillStyle = s.color;
        ctx.globalAlpha = Math.max(0, s.alpha);
        ctx.fillRect(s.x, s.y, s.size, s.size);
      }
    }
    ctx.globalAlpha = 1;

    // Stage Trusses & Lights (Image 3 inspired)
    ctx.fillStyle = '#334155';
    ctx.fillRect(40, 50, 24, 490);
    ctx.fillRect(960 - 64, 50, 24, 490);
    ctx.fillRect(40, 50, 960 - 80, 20);

    // Speakers stack on left and right
    ctx.fillStyle = '#1e293b';
    ctx.fillRect(66, 240, 32, 120);
    ctx.fillRect(960 - 98, 240, 32, 120);
    ctx.fillStyle = '#475569';
    ctx.beginPath();
    ctx.arc(82, 270, 10, 0, Math.PI * 2);
    ctx.arc(82, 320, 12, 0, Math.PI * 2);
    ctx.arc(960 - 82, 270, 10, 0, Math.PI * 2);
    ctx.arc(960 - 82, 320, 12, 0, Math.PI * 2);
    ctx.fill();

    // Giant Glowing Neon Rainbow Banner
    const hue = Math.floor((sec * 120) % 360);
    ctx.fillStyle = '#090d16';
    ctx.fillRect(110, 68, 960 - 220, 68);
    ctx.strokeStyle = `hsl(${hue}, 100%, 65%)`;
    ctx.lineWidth = 4;
    ctx.strokeRect(110, 68, 960 - 220, 68);

    ctx.fillStyle = `hsl(${hue}, 100%, 75%)`;
    ctx.font = 'bold 22px "Press Start 2P", monospace';
    ctx.textAlign = 'center';
    ctx.fillText(`HAPPY BIRTHDAY ${recipientName.toUpperCase()}!`, 960 / 2, 110);

    // Stage Platform (Full width across screen)
    ctx.fillStyle = '#1e293b';
    ctx.fillRect(60, 345, 960 - 120, 48);
    ctx.fillStyle = '#f59e0b';
    ctx.fillRect(60, 345, 960 - 120, 6);
    // Stage lights along bottom edge
    for (let lx = 80; lx < 960 - 80; lx += 40) {
      const lightHue = Math.floor((sec * 180 + lx) % 360);
      ctx.fillStyle = `hsl(${lightHue}, 100%, 65%)`;
      ctx.beginPath();
      ctx.arc(lx, 350, 4, 0, Math.PI * 2);
      ctx.fill();
    }

    // Twin Spotlight Beams shining on center stage
    ctx.save();
    ctx.globalCompositeOperation = 'lighter';
    const spotGradL = ctx.createLinearGradient(66, 270, 480, 270);
    spotGradL.addColorStop(0, 'rgba(255, 255, 255, 0.35)');
    spotGradL.addColorStop(1, 'rgba(255, 255, 255, 0.05)');
    ctx.fillStyle = spotGradL;
    ctx.beginPath();
    ctx.moveTo(66, 260);
    ctx.lineTo(66, 280);
    ctx.lineTo(480 + 35, 330);
    ctx.lineTo(480 - 35, 220);
    ctx.closePath();
    ctx.fill();

    const spotGradR = ctx.createLinearGradient(960 - 66, 270, 480, 270);
    spotGradR.addColorStop(0, 'rgba(255, 255, 255, 0.35)');
    spotGradR.addColorStop(1, 'rgba(255, 255, 255, 0.05)');
    ctx.fillStyle = spotGradR;
    ctx.beginPath();
    ctx.moveTo(960 - 66, 260);
    ctx.lineTo(960 - 66, 280);
    ctx.lineTo(480 - 35, 330);
    ctx.lineTo(480 + 35, 220);
    ctx.closePath();
    ctx.fill();
    ctx.restore();

    // Clapping Anime VIP Squad: 14 characters filling the ENTIRE stage!
    drawAnimeCheerSquad(ctx, 960, 270, sec);

    // Center Stage Elevated Birthday Star Podium for P'Fah
    ctx.fillStyle = '#d97706';
    ctx.fillRect(480 - 36, 320, 72, 28);
    ctx.fillStyle = '#fde047';
    ctx.fillRect(480 - 36, 320, 72, 4);
    ctx.fillStyle = '#451a03';
    ctx.fillRect(480 - 34, 325, 68, 18);
    ctx.fillStyle = '#fef08a';
    ctx.font = '7px "Press Start 2P", monospace';
    ctx.textAlign = 'center';
    ctx.fillText("★ STAR ★", 480, 338);

    // Center Stage P'Fah with Badminton Racket Held High (no overlap with any character!)
    drawPixelPlayer(ctx, 480 - 24, 218, 48, 72, 'right', 0, true, renderMode, customImgRef.current);

    // Birthday Wish Card Overlay
    ctx.fillStyle = 'rgba(15, 23, 42, 0.92)';
    ctx.fillRect(130, 400, 960 - 260, 95);
    ctx.strokeStyle = '#f59e0b';
    ctx.lineWidth = 2;
    ctx.strokeRect(130, 400, 960 - 260, 95);

    ctx.fillStyle = '#fde047';
    ctx.font = '10px "Press Start 2P", monospace';
    ctx.textAlign = 'center';
    ctx.fillText(`🏸 A SPECIAL BIRTHDAY WISH FOR ${recipientName.toUpperCase()} 🎂`, 960 / 2, 422);

    ctx.fillStyle = '#f8fafc';
    ctx.font = '17px "VT323", monospace';
    const lines = wrapText(ctx, birthdayWish, 960 - 300);
    lines.slice(0, 3).forEach((line, idx) => {
      ctx.fillText(line, 960 / 2, 448 + idx * 21);
    });

    // Replay instructions
    ctx.fillStyle = '#94a3b8';
    ctx.font = '8px "Press Start 2P", monospace';
    ctx.fillText("TAP SCREEN OR PRESS 'R' TO PLAY AGAIN!", 960 / 2, 518);

    // Falling Confetti Particles
    for (const cf of confettiRef.current) {
      ctx.save();
      ctx.translate(cf.x, cf.y);
      ctx.rotate(cf.rotation);
      ctx.fillStyle = cf.color;
      ctx.fillRect(-cf.size / 2, -cf.size / 4, cf.size, cf.size / 2);
      ctx.restore();
    }
  };

  const wrapText = (context: CanvasRenderingContext2D, text: string, maxWidth: number) => {
    const words = text.split(' ');
    const lines = [];
    let currentLine = words[0];
    for (let i = 1; i < words.length; i++) {
      const word = words[i];
      const width = context.measureText(currentLine + ' ' + word).width;
      if (width < maxWidth) {
        currentLine += ' ' + word;
      } else {
        lines.push(currentLine);
        currentLine = word;
      }
    }
    lines.push(currentLine);
    return lines;
  };

  // Sound & BGM toggles
  const toggleMute = () => {
    const next = !isMuted;
    setIsMuted(next);
    retroAudio.setMuted(next);
  };

  const toggleBgm = () => {
    if (isBgmOn) {
      retroAudio.stopBGM();
      setIsBgmOn(false);
    } else {
      retroAudio.startBGM();
      setIsBgmOn(true);
    }
  };

  // Download Standalone .html file
  const handleDownloadStandalone = () => {
    const htmlContent = generateStandaloneGameHtml({
      recipientName,
      birthdayWish,
    });
    const blob = new Blob([htmlContent], { type: 'text/html' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `pfah_birthday_game.html`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  // Handle custom image upload for sprite sheet
  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        const url = event.target?.result as string;
        setCustomSpriteUrl(url);
        const img = new Image();
        img.src = url;
        customImgRef.current = img;
        setRenderMode('customImage');
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col items-center justify-start p-2 sm:p-4 font-sans select-none">
      {/* Main Game Screen */}
      <main className="w-full max-w-5xl flex flex-col items-center">
        {/* Retro Bezel Frame */}
        <div className="relative w-full bg-slate-900 p-2 sm:p-3 rounded-2xl border-4 border-slate-800 shadow-2xl overflow-hidden">
          {/* Top HUD Bar */}
          <div className="flex items-center justify-between px-3 py-2 bg-slate-950 border-b-2 border-slate-800 text-amber-400 font-pixel text-[10px] sm:text-xs">
            <div className="flex items-center gap-2">
              <span className="text-white font-bold">{recipientName.toUpperCase()}</span>
            </div>

            <div className="flex items-center gap-1 sm:gap-2">
              <span className="text-slate-400">SCORE</span>
              <span className="text-white tracking-widest">{String(score).padStart(6, '0')}</span>
            </div>

            <div className="flex items-center gap-1">
              <span>🏸</span>
              <span className="text-sky-300">x{String(shuttlecockCount).padStart(2, '0')}</span>
            </div>

            <div className="flex items-center gap-1">
              <span>📖</span>
              <span className="text-rose-400">x{String(mangaCount).padStart(2, '0')}</span>
            </div>

            <div className="flex items-center gap-1">
              <span className="text-slate-400">WORLD</span>
              <span className="text-emerald-400">1-1</span>
            </div>
          </div>

          {/* Game Canvas */}
          <div className="relative w-full aspect-[16/9] bg-black overflow-hidden flex items-center justify-center">
            <canvas
              ref={canvasRef}
              width={960}
              height={540}
              onClick={() => {
                retroAudio.playJump();
                if (victoryStateRef.current) initLevel();
              }}
              className="w-full h-full object-contain pixelated cursor-pointer"
            />

            {/* CRT Scanline Filter */}
            {crtFilter && <div className="crt-overlay pointer-events-none" />}

            {/* Overlay Banner if Victory */}
            {isVictory && (
              <div className="absolute top-3 right-3 flex items-center gap-2 bg-slate-900/80 backdrop-blur-md px-3 py-1.5 rounded-lg border border-amber-500/60 text-xs font-pixel text-amber-300 animate-bounce">
                <PartyPopper className="w-4 h-4 text-amber-400" />
                GOAL REACHED!
              </div>
            )}
          </div>

          {/* Bottom Control Helpers & Quick Tools */}
          <div className="flex flex-wrap items-center justify-between gap-2 px-3 py-2 bg-slate-950 border-t-2 border-slate-800 text-[10px] sm:text-xs text-slate-400 font-retro">
            <div className="flex items-center gap-2">
              <span className="text-slate-300">CONTROLS:</span>
              <kbd className="px-1.5 py-0.5 bg-slate-800 rounded text-slate-200 border border-slate-700">A</kbd>
              <kbd className="px-1.5 py-0.5 bg-slate-800 rounded text-slate-200 border border-slate-700">D</kbd>
              <span>or</span>
              <kbd className="px-1.5 py-0.5 bg-slate-800 rounded text-slate-200 border border-slate-700">◀</kbd>
              <kbd className="px-1.5 py-0.5 bg-slate-800 rounded text-slate-200 border border-slate-700">▶</kbd>
              <span>•</span>
              <span className="text-slate-300">JUMP:</span>
              <kbd className="px-1.5 py-0.5 bg-slate-800 rounded text-slate-200 border border-slate-700">SPACE</kbd>
              <span>or</span>
              <kbd className="px-1.5 py-0.5 bg-slate-800 rounded text-slate-200 border border-slate-700">W</kbd>
            </div>

            <div className="flex flex-wrap items-center gap-3">
              <button
                onClick={toggleMute}
                className="hover:text-amber-300 flex items-center gap-1 transition-colors cursor-pointer"
                title="Toggle Sound Effects (M)"
              >
                {isMuted ? <VolumeX className="w-3.5 h-3.5 text-rose-400" /> : <Volume2 className="w-3.5 h-3.5 text-emerald-400" />}
                <span>{isMuted ? 'MUTED' : 'SFX'}</span>
              </button>
              <button
                onClick={toggleBgm}
                className={`hover:text-amber-300 flex items-center gap-1 transition-colors cursor-pointer ${isBgmOn ? 'text-purple-400' : ''}`}
                title="Toggle Chiptune Music"
              >
                <Music className="w-3.5 h-3.5" />
                <span>{isBgmOn ? 'BGM ON' : 'BGM'}</span>
              </button>
              <button
                onClick={() => setShowWishEditor(true)}
                className="hover:text-amber-300 flex items-center gap-1 transition-colors cursor-pointer"
                title="Customize Birthday Wish Card"
              >
                <Edit3 className="w-3.5 h-3.5" />
                <span>WISH</span>
              </button>
              <button
                onClick={() => setCrtFilter(!crtFilter)}
                className="hover:text-amber-300 transition-colors cursor-pointer"
              >
                CRT: {crtFilter ? 'ON' : 'OFF'}
              </button>
              <button
                onClick={initLevel}
                className="hover:text-amber-300 flex items-center gap-1 transition-colors cursor-pointer"
              >
                <RotateCcw className="w-3.5 h-3.5" /> RESET
              </button>
              <button
                onClick={triggerVictory}
                className="text-amber-400 hover:text-amber-300 flex items-center gap-1 font-bold transition-colors cursor-pointer"
              >
                <Sparkles className="w-3.5 h-3.5" /> FINALE
              </button>
              <button
                onClick={handleDownloadStandalone}
                className="text-emerald-400 hover:text-emerald-300 flex items-center gap-1 font-bold transition-colors cursor-pointer"
                title="Download Single-File HTML"
              >
                <Download className="w-3.5 h-3.5" /> .HTML
              </button>
            </div>
          </div>
        </div>

        {/* Mobile On-Screen Touch Controls */}
        <div className="w-full flex items-center justify-between px-4 py-3 sm:hidden">
          <div className="flex gap-3">
            <button
              onTouchStart={(e) => {
                e.preventDefault();
                keysRef.current.left = true;
              }}
              onTouchEnd={(e) => {
                e.preventDefault();
                keysRef.current.left = false;
              }}
              className="w-16 h-16 bg-slate-800 border-2 border-slate-600 active:bg-blue-600 rounded-xl flex items-center justify-center text-white font-pixel text-xl shadow-lg"
            >
              ◀
            </button>
            <button
              onTouchStart={(e) => {
                e.preventDefault();
                keysRef.current.right = true;
              }}
              onTouchEnd={(e) => {
                e.preventDefault();
                keysRef.current.right = false;
              }}
              className="w-16 h-16 bg-slate-800 border-2 border-slate-600 active:bg-blue-600 rounded-xl flex items-center justify-center text-white font-pixel text-xl shadow-lg"
            >
              ▶
            </button>
          </div>

          <div>
            <button
              onTouchStart={(e) => {
                e.preventDefault();
                if (playerRef.current.isGrounded && !victoryStateRef.current) {
                  playerRef.current.vy = -14.5;
                  playerRef.current.isGrounded = false;
                  playerRef.current.isJumping = true;
                  retroAudio.playJump();
                }
              }}
              className="w-20 h-16 bg-rose-600 border-2 border-rose-400 active:bg-rose-500 rounded-xl flex items-center justify-center text-white font-pixel text-sm shadow-lg"
            >
              JUMP
            </button>
          </div>
        </div>
      </main>

      {/* Birthday Wish Customizer Drawer / Modal */}
      {showWishEditor && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="w-full max-w-lg bg-slate-900 border-2 border-amber-500 rounded-2xl p-6 shadow-2xl relative">
            <div className="flex items-center justify-between mb-4 border-b border-slate-800 pb-3">
              <div className="flex items-center gap-2 text-amber-400">
                <PartyPopper className="w-5 h-5" />
                <h2 className="font-pixel text-sm">CUSTOMIZE BIRTHDAY SURPRISE</h2>
              </div>
              <button
                onClick={() => setShowWishEditor(false)}
                className="text-slate-400 hover:text-white font-pixel text-xs"
              >
                ✕
              </button>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-xs font-pixel text-slate-300 mb-1">
                  BIRTHDAY HERO NAME
                </label>
                <input
                  type="text"
                  value={recipientName}
                  onChange={(e) => setRecipientName(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-950 border border-slate-700 rounded-lg text-amber-300 font-pixel text-sm focus:outline-none focus:border-amber-400"
                />
              </div>

              <div>
                <label className="block text-xs font-pixel text-slate-300 mb-1">
                  BIRTHDAY WISH MESSAGE
                </label>
                <textarea
                  rows={4}
                  value={birthdayWish}
                  onChange={(e) => setBirthdayWish(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-950 border border-slate-700 rounded-lg text-slate-200 text-sm focus:outline-none focus:border-amber-400"
                  placeholder="Enter your personal birthday wish..."
                />
                <p className="text-[11px] text-slate-400 mt-1">
                  This message appears in the victory stage box when reaching the goal!
                </p>
              </div>

              <div className="flex items-center justify-end gap-2 pt-2 border-t border-slate-800">
                <button
                  onClick={() => {
                    setShowWishEditor(false);
                    triggerVictory();
                  }}
                  className="px-4 py-2 bg-amber-500 hover:bg-amber-400 text-slate-950 font-pixel text-xs rounded-lg transition-colors flex items-center gap-1.5"
                >
                  <Sparkles className="w-4 h-4" /> PREVIEW IN FINALE
                </button>
                <button
                  onClick={() => setShowWishEditor(false)}
                  className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-white font-pixel text-xs rounded-lg transition-colors"
                >
                  SAVE & CLOSE
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Sprites & Rendering Mode Modal */}
      {showSpritesModal && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="w-full max-w-xl bg-slate-900 border-2 border-blue-500 rounded-2xl p-6 shadow-2xl relative">
            <div className="flex items-center justify-between mb-4 border-b border-slate-800 pb-3">
              <div className="flex items-center gap-2 text-blue-400">
                <Layers className="w-5 h-5" />
                <h2 className="font-pixel text-sm">SPRITES & GRAPHICS SETTINGS</h2>
              </div>
              <button
                onClick={() => setShowSpritesModal(false)}
                className="text-slate-400 hover:text-white font-pixel text-xs"
              >
                ✕
              </button>
            </div>

            <div className="space-y-5">
              <div>
                <p className="text-xs text-slate-300 font-pixel mb-3">SELECT RENDERING STYLE:</p>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  {/* Option 1: Detailed Pixel Art */}
                  <button
                    onClick={() => setRenderMode('pixelArt')}
                    className={`p-3 rounded-xl border-2 text-left transition-all ${
                      renderMode === 'pixelArt'
                        ? 'border-blue-400 bg-blue-950/60 text-white'
                        : 'border-slate-800 bg-slate-950 text-slate-400 hover:border-slate-700'
                    }`}
                  >
                    <div className="flex items-center justify-between mb-1">
                      <span className="font-pixel text-xs text-blue-300">8-Bit Pixel</span>
                      {renderMode === 'pixelArt' && <CheckCircle2 className="w-4 h-4 text-blue-400" />}
                    </div>
                    <p className="text-[11px] text-slate-400">
                      P'Fah with badminton racket, glasses & athletic attire matching uploaded sprite sheets.
                    </p>
                  </button>

                  {/* Option 2: Custom Sprite Image */}
                  <button
                    onClick={() => setRenderMode('customImage')}
                    className={`p-3 rounded-xl border-2 text-left transition-all ${
                      renderMode === 'customImage'
                        ? 'border-emerald-400 bg-emerald-950/60 text-white'
                        : 'border-slate-800 bg-slate-950 text-slate-400 hover:border-slate-700'
                    }`}
                  >
                    <div className="flex items-center justify-between mb-1">
                      <span className="font-pixel text-xs text-emerald-300">Custom Image</span>
                      {renderMode === 'customImage' && <CheckCircle2 className="w-4 h-4 text-emerald-400" />}
                    </div>
                    <p className="text-[11px] text-slate-400">
                      Use uploaded PNG/JPEG sprite image or sprite sheet file.
                    </p>
                  </button>

                  {/* Option 3: Simple Colored Rectangles Placeholder */}
                  <button
                    onClick={() => setRenderMode('placeholderRects')}
                    className={`p-3 rounded-xl border-2 text-left transition-all ${
                      renderMode === 'placeholderRects'
                        ? 'border-amber-400 bg-amber-950/60 text-white'
                        : 'border-slate-800 bg-slate-950 text-slate-400 hover:border-slate-700'
                    }`}
                  >
                    <div className="flex items-center justify-between mb-1">
                      <span className="font-pixel text-xs text-amber-300">Placeholders</span>
                      {renderMode === 'placeholderRects' && <CheckCircle2 className="w-4 h-4 text-amber-400" />}
                    </div>
                    <p className="text-[11px] text-slate-400">
                      Clean colored rectangles for debugging layout & custom asset replacement.
                    </p>
                  </button>
                </div>
              </div>

              {/* Upload custom sprite */}
              <div className="p-4 bg-slate-950 rounded-xl border border-slate-800">
                <label className="block text-xs font-pixel text-slate-300 mb-2">
                  UPLOAD CUSTOM SPRITE IMAGE / SPRITE SHEET:
                </label>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleImageUpload}
                  className="block w-full text-xs text-slate-400 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-xs file:font-pixel file:bg-blue-600 file:text-white hover:file:bg-blue-500 cursor-pointer"
                />
                {customSpriteUrl && (
                  <div className="mt-3 flex items-center gap-3">
                    <img
                      src={customSpriteUrl}
                      alt="Uploaded Sprite Preview"
                      className="w-12 h-12 object-contain bg-slate-900 border border-slate-700 rounded p-1"
                    />
                    <span className="text-xs text-emerald-400 font-pixel">Custom Sprite Loaded!</span>
                  </div>
                )}
              </div>

              <div className="p-3 bg-blue-950/30 border border-blue-800/40 rounded-xl flex items-start gap-2.5 text-xs text-blue-200">
                <Info className="w-4 h-4 text-blue-400 mt-0.5 shrink-0" />
                <span>
                  The downloadable single-file HTML also includes explicit variables:
                  <code className="text-amber-300 ml-1">let playerImg = new Image();</code> with code comments for easy replacement with any sprite sheet.
                </span>
              </div>

              <div className="flex justify-end pt-2 border-t border-slate-800">
                <button
                  onClick={() => setShowSpritesModal(false)}
                  className="px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white font-pixel text-xs rounded-lg transition-colors"
                >
                  DONE
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Footer info banner */}
      <footer className="w-full max-w-5xl mt-3 text-center text-[10px] text-slate-500 font-retro">
        Inspired by classic 8-bit platformers • Created with ❤️ for P'Fah's Birthday Celebration
      </footer>
    </div>
  );
}
