/**
 * 8-Bit Pixel Art Rendering Engine
 * Provides custom pixel-perfect rendering for P'Fah, badminton shuttlecocks,
 * anime books, platforms, castle, and the celebratory stage.
 */

// Helper: draw pixel block
function px(ctx: CanvasRenderingContext2D, x: number, y: number, w: number, h: number, color: string) {
  ctx.fillStyle = color;
  ctx.fillRect(Math.floor(x), Math.floor(y), Math.floor(w), Math.floor(h));
}

/**
 * Draw P'Fah (Player)
 * Matches the user's provided character:
 * - Short dark bob hair
 * - Eyeglasses
 * - White sports t-shirt
 * - Navy athletic shorts with white side trim
 * - Athletic sneakers
 * - Badminton racket in hand (moves in run & jump smash pose)
 */
export function drawPixelPlayer(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  width: number,
  height: number,
  facing: 'left' | 'right',
  animFrame: number,
  isJumping: boolean,
  mode: 'pixelArt' | 'customImage' | 'placeholderRects',
  customImg?: HTMLImageElement | null
) {
  ctx.save();

  // If placeholder mode is active: Simple colored rectangles with clear label
  if (mode === 'placeholderRects') {
    // Player body placeholder rectangle
    ctx.fillStyle = '#3b82f6'; // Bright blue
    ctx.fillRect(x, y, width, height);
    // Face indicator
    ctx.fillStyle = '#fde047';
    ctx.fillRect(facing === 'right' ? x + width - 14 : x + 2, y + 6, 12, 12);
    // Racket indicator
    ctx.fillStyle = '#e2e8f0';
    ctx.fillRect(facing === 'right' ? x + width + 2 : x - 10, y + 14, 8, 20);

    ctx.fillStyle = '#ffffff';
    ctx.font = '8px monospace';
    ctx.fillText("P'FAH", x + 2, y - 4);
    ctx.restore();
    return;
  }

  // If custom image is loaded:
  if (mode === 'customImage' && customImg && customImg.complete && customImg.naturalWidth > 0) {
    if (facing === 'left') {
      ctx.translate(x + width, y);
      ctx.scale(-1, 1);
      ctx.drawImage(customImg, 0, 0, width, height);
    } else {
      ctx.drawImage(customImg, x, y, width, height);
    }
    ctx.restore();
    return;
  }

  // Procedural 8-bit Pixel Character (Detailed P'Fah)
  const scale = width / 32; // Normalised to a 32x48 grid

  ctx.translate(facing === 'left' ? x + width : x, y);
  if (facing === 'left') {
    ctx.scale(-1, 1);
  }

  // Jumping Pose: Badminton Smash Air Pose (inspired by Image 2)
  if (isJumping) {
    // Head & Hair
    px(ctx, 10 * scale, 4 * scale, 12 * scale, 12 * scale, '#1e1b18'); // Hair base
    px(ctx, 11 * scale, 8 * scale, 10 * scale, 9 * scale, '#fed7aa'); // Face skin
    px(ctx, 9 * scale, 4 * scale, 14 * scale, 5 * scale, '#110f0d'); // Top hair
    px(ctx, 8 * scale, 8 * scale, 3 * scale, 8 * scale, '#110f0d'); // Left bangs
    px(ctx, 19 * scale, 8 * scale, 3 * scale, 6 * scale, '#110f0d'); // Right bangs

    // Glasses & Eyes
    px(ctx, 13 * scale, 11 * scale, 3 * scale, 3 * scale, '#0f172a'); // Left frame
    px(ctx, 17 * scale, 11 * scale, 3 * scale, 3 * scale, '#0f172a'); // Right frame
    px(ctx, 15 * scale, 11 * scale, 3 * scale, 1 * scale, '#0f172a'); // Bridge
    px(ctx, 14 * scale, 12 * scale, 1 * scale, 1 * scale, '#38bdf8'); // Glint
    px(ctx, 18 * scale, 12 * scale, 1 * scale, 1 * scale, '#38bdf8'); // Glint
    px(ctx, 15 * scale, 15 * scale, 3 * scale, 1 * scale, '#ea580c'); // Smile

    // Body: White Athletic Shirt angled
    px(ctx, 10 * scale, 17 * scale, 12 * scale, 11 * scale, '#f8fafc'); // White shirt
    px(ctx, 10 * scale, 24 * scale, 12 * scale, 4 * scale, '#e2e8f0'); // Shading
    // Navy sports shorts
    px(ctx, 11 * scale, 28 * scale, 11 * scale, 7 * scale, '#1e293b'); // Shorts
    px(ctx, 11 * scale, 32 * scale, 11 * scale, 2 * scale, '#f8fafc'); // White trim line

    // Legs bent in air (jumping motion)
    px(ctx, 9 * scale, 35 * scale, 4 * scale, 6 * scale, '#fed7aa'); // Leg 1
    px(ctx, 6 * scale, 39 * scale, 6 * scale, 5 * scale, '#94a3b8'); // Sneaker 1
    px(ctx, 18 * scale, 35 * scale, 5 * scale, 7 * scale, '#fed7aa'); // Leg 2
    px(ctx, 19 * scale, 41 * scale, 7 * scale, 5 * scale, '#94a3b8'); // Sneaker 2

    // Arms: Right arm holding badminton racket up high in smash position!
    px(ctx, 6 * scale, 19 * scale, 4 * scale, 8 * scale, '#fed7aa'); // Left arm balancing
    px(ctx, 20 * scale, 10 * scale, 4 * scale, 9 * scale, '#fed7aa'); // Right arm raised high
    px(ctx, 21 * scale, 8 * scale, 3 * scale, 3 * scale, '#fed7aa'); // Hand grip

    // Raised Badminton Racket
    px(ctx, 22 * scale, -2 * scale, 2 * scale, 11 * scale, '#64748b'); // Racket shaft
    // Racket head (oval mesh)
    px(ctx, 19 * scale, -14 * scale, 8 * scale, 12 * scale, '#3b82f6'); // Outer rim
    px(ctx, 21 * scale, -12 * scale, 4 * scale, 8 * scale, '#0f172a'); // Inner net void
    // Mesh cross pattern
    px(ctx, 21 * scale, -10 * scale, 4 * scale, 1 * scale, '#e2e8f0');
    px(ctx, 21 * scale, -7 * scale, 4 * scale, 1 * scale, '#e2e8f0');
    px(ctx, 23 * scale, -12 * scale, 1 * scale, 8 * scale, '#e2e8f0');
  } else {
    // Running / Idle Animation (matching Image 1's 6 frames)
    const legOffset = Math.sin(animFrame * Math.PI / 2) * 4 * scale;
    const armBob = Math.cos(animFrame * Math.PI / 2) * 2 * scale;

    // Hair & Head
    px(ctx, 10 * scale, (6 + armBob * 0.3) * scale, 12 * scale, 12 * scale, '#1e1b18'); // Hair
    px(ctx, 11 * scale, (10 + armBob * 0.3) * scale, 10 * scale, 9 * scale, '#fed7aa'); // Face
    px(ctx, 9 * scale, (6 + armBob * 0.3) * scale, 14 * scale, 5 * scale, '#110f0d'); // Top hair
    px(ctx, 8 * scale, (9 + armBob * 0.3) * scale, 3 * scale, 9 * scale, '#110f0d'); // Bangs L
    px(ctx, 20 * scale, (9 + armBob * 0.3) * scale, 3 * scale, 7 * scale, '#110f0d'); // Bangs R

    // Glasses & Face
    px(ctx, 13 * scale, (13 + armBob * 0.3) * scale, 3 * scale, 3 * scale, '#0f172a');
    px(ctx, 17 * scale, (13 + armBob * 0.3) * scale, 3 * scale, 3 * scale, '#0f172a');
    px(ctx, 15 * scale, (13 + armBob * 0.3) * scale, 3 * scale, 1 * scale, '#0f172a');
    px(ctx, 14 * scale, (14 + armBob * 0.3) * scale, 1 * scale, 1 * scale, '#38bdf8'); // Glint
    px(ctx, 18 * scale, (14 + armBob * 0.3) * scale, 1 * scale, 1 * scale, '#38bdf8'); // Glint
    px(ctx, 15 * scale, (17 + armBob * 0.3) * scale, 3 * scale, 1 * scale, '#ea580c'); // Smile

    // White Sports T-shirt
    px(ctx, 9 * scale, (19 + armBob * 0.3) * scale, 14 * scale, 10 * scale, '#f8fafc');
    px(ctx, 9 * scale, (26 + armBob * 0.3) * scale, 14 * scale, 3 * scale, '#e2e8f0');

    // Navy Shorts with white trim
    px(ctx, 10 * scale, 29 * scale, 12 * scale, 7 * scale, '#1e293b');
    px(ctx, 10 * scale, 34 * scale, 12 * scale, 2 * scale, '#f8fafc');

    // Legs with running cycle
    const l1Y = 36 * scale + legOffset;
    const l2Y = 36 * scale - legOffset;
    // Leg 1
    px(ctx, (10 - legOffset * 0.5) * scale, 36 * scale, 4 * scale, 7 * scale, '#fed7aa');
    px(ctx, (9 - legOffset * 0.8) * scale, 42 * scale, 6 * scale, 4 * scale, '#e2e8f0'); // Sneaker
    px(ctx, (9 - legOffset * 0.8) * scale, 45 * scale, 7 * scale, 2 * scale, '#475569'); // Sole

    // Leg 2
    px(ctx, (17 + legOffset * 0.5) * scale, 36 * scale, 4 * scale, 7 * scale, '#fed7aa');
    px(ctx, (17 + legOffset * 0.8) * scale, 42 * scale, 6 * scale, 4 * scale, '#e2e8f0'); // Sneaker
    px(ctx, (17 + legOffset * 0.8) * scale, 45 * scale, 7 * scale, 2 * scale, '#475569'); // Sole

    // Arm and Badminton Racket
    px(ctx, 19 * scale, (21 + armBob) * scale, 5 * scale, 6 * scale, '#fed7aa'); // Hand
    // Racket Shaft
    px(ctx, (21 + armBob * 0.5) * scale, (15 + armBob) * scale, 2 * scale, 14 * scale, '#64748b');
    // Racket head
    px(ctx, (18 + armBob * 0.5) * scale, (5 + armBob) * scale, 8 * scale, 10 * scale, '#3b82f6');
    px(ctx, (20 + armBob * 0.5) * scale, (7 + armBob) * scale, 4 * scale, 6 * scale, '#0f172a');
    // Strings
    px(ctx, (20 + armBob * 0.5) * scale, (9 + armBob) * scale, 4 * scale, 1 * scale, '#cbd5e1');
    px(ctx, (22 + armBob * 0.5) * scale, (7 + armBob) * scale, 1 * scale, 6 * scale, '#cbd5e1');
  }

  ctx.restore();
}

/**
 * Draw Badminton Shuttlecock Collectible
 */
export function drawPixelShuttlecock(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  width: number,
  height: number,
  time: number,
  mode: 'pixelArt' | 'customImage' | 'placeholderRects'
) {
  if (mode === 'placeholderRects') {
    ctx.fillStyle = '#ffffff';
    ctx.fillRect(x, y, width, height);
    ctx.fillStyle = '#ef4444';
    ctx.fillRect(x + width / 4, y + height - 6, width / 2, 6);
    return;
  }

  const bob = Math.sin(time * 4) * 3;
  const drawY = y + bob;

  ctx.save();
  // Glow aura
  ctx.fillStyle = 'rgba(255, 255, 255, 0.2)';
  ctx.beginPath();
  ctx.arc(x + width / 2, drawY + height / 2, width * 0.7, 0, Math.PI * 2);
  ctx.fill();

  // White feather skirt
  ctx.fillStyle = '#f8fafc';
  ctx.beginPath();
  ctx.moveTo(x + width / 2, drawY + height - 8);
  ctx.lineTo(x + 2, drawY + 2);
  ctx.lineTo(x + width - 2, drawY + 2);
  ctx.closePath();
  ctx.fill();

  // Feather rib lines
  ctx.strokeStyle = '#cbd5e1';
  ctx.lineWidth = 1;
  ctx.beginPath();
  ctx.moveTo(x + 5, drawY + 3);
  ctx.lineTo(x + width / 2, drawY + height - 8);
  ctx.moveTo(x + width - 5, drawY + 3);
  ctx.lineTo(x + width / 2, drawY + height - 8);
  ctx.stroke();

  // Red ribbon binding
  ctx.fillStyle = '#ef4444';
  ctx.fillRect(x + 5, drawY + height - 9, width - 10, 2);

  // Cork tip (rounded dome)
  ctx.fillStyle = '#fbbf24'; // Golden cork
  ctx.beginPath();
  ctx.arc(x + width / 2, drawY + height - 5, 5, 0, Math.PI);
  ctx.fill();

  // Glint
  ctx.fillStyle = '#ffffff';
  ctx.fillRect(x + width / 2 - 2, drawY + height - 7, 2, 2);

  ctx.restore();
}

/**
 * Draw Anime Manga Book Collectible
 */
export function drawPixelMangaBook(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  width: number,
  height: number,
  time: number,
  mode: 'pixelArt' | 'customImage' | 'placeholderRects'
) {
  if (mode === 'placeholderRects') {
    ctx.fillStyle = '#f59e0b';
    ctx.fillRect(x, y, width, height);
    ctx.fillStyle = '#ffffff';
    ctx.font = '8px monospace';
    ctx.fillText('BOOK', x + 1, y + height / 2 + 3);
    return;
  }

  const bob = Math.cos(time * 3.5) * 3;
  const drawY = y + bob;

  ctx.save();
  // Golden sparkle aura
  ctx.fillStyle = 'rgba(245, 158, 11, 0.25)';
  ctx.fillRect(x - 2, drawY - 2, width + 4, height + 4);

  // Book spine & shadow
  ctx.fillStyle = '#9a3412';
  ctx.fillRect(x, drawY + 2, 4, height - 2);

  // Manga cover (Vibrant Jump Style: Orange & Red)
  ctx.fillStyle = '#ea580c';
  ctx.fillRect(x + 3, drawY, width - 3, height);

  // Manga Top Banner (Jump Logo / Shonen title)
  ctx.fillStyle = '#fde047';
  ctx.fillRect(x + 5, drawY + 2, width - 7, 5);

  // Anime Art on Cover (Mini Goku/Luffy emblem)
  ctx.fillStyle = '#38bdf8';
  ctx.fillRect(x + 6, drawY + 9, width - 9, height - 15);
  // Dragon Ball / Straw Hat symbol
  ctx.fillStyle = '#ef4444';
  ctx.fillRect(x + width / 2 - 2, drawY + 12, 5, 5);
  ctx.fillStyle = '#fde047';
  ctx.fillRect(x + width / 2 - 1, drawY + 13, 3, 3);

  // Pages rim
  ctx.fillStyle = '#f8fafc';
  ctx.fillRect(x + width - 3, drawY + 1, 2, height - 2);

  // Sparkle stars
  const sparkle = (Math.sin(time * 8) + 1) / 2;
  ctx.fillStyle = `rgba(255, 255, 255, ${sparkle})`;
  ctx.fillRect(x + width + 1, drawY - 2, 2, 2);
  ctx.fillRect(x - 3, drawY + height - 4, 2, 2);

  ctx.restore();
}

/**
 * Draw Question Block [?]
 */
export function drawQuestionBlock(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  width: number,
  height: number,
  isHit: boolean = false
) {
  ctx.save();
  if (isHit) {
    // Brown exhausted block
    ctx.fillStyle = '#78350f';
    ctx.fillRect(x, y, width, height);
    ctx.fillStyle = '#451a03';
    ctx.fillRect(x + 2, y + 2, width - 4, height - 4);
    // 4 corner bolts
    ctx.fillStyle = '#92400e';
    ctx.fillRect(x + 4, y + 4, 3, 3);
    ctx.fillRect(x + width - 7, y + 4, 3, 3);
    ctx.fillRect(x + 4, y + height - 7, 3, 3);
    ctx.fillRect(x + width - 7, y + height - 7, 3, 3);
  } else {
    // Golden Question Block
    ctx.fillStyle = '#d97706';
    ctx.fillRect(x, y, width, height);

    // Light border
    ctx.fillStyle = '#fde047';
    ctx.fillRect(x + 2, y + 2, width - 4, 2);
    ctx.fillRect(x + 2, y + 2, 2, height - 4);

    // Dark border
    ctx.fillStyle = '#92400e';
    ctx.fillRect(x + 2, y + height - 4, width - 4, 2);
    ctx.fillRect(x + width - 4, y + 2, 2, height - 4);

    // Inner gold
    ctx.fillStyle = '#fbbf24';
    ctx.fillRect(x + 4, y + 4, width - 8, height - 8);

    // Pixel "?" Mark
    ctx.fillStyle = '#78350f';
    const cx = x + width / 2;
    const cy = y + height / 2;
    ctx.fillRect(cx - 4, cy - 8, 8, 3);
    ctx.fillRect(cx + 1, cy - 5, 3, 4);
    ctx.fillRect(cx - 2, cy - 2, 4, 3);
    ctx.fillRect(cx - 2, cy + 3, 4, 3);

    // Corner rivets
    ctx.fillStyle = '#451a03';
    ctx.fillRect(x + 2, y + 2, 2, 2);
    ctx.fillRect(x + width - 4, y + 2, 2, 2);
    ctx.fillRect(x + 2, y + height - 4, 2, 2);
    ctx.fillRect(x + width - 4, y + height - 4, 2, 2);
  }
  ctx.restore();
}

/**
 * Draw Brick Platform Block
 */
export function drawBrickBlock(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  width: number,
  height: number
) {
  ctx.fillStyle = '#b45309';
  ctx.fillRect(x, y, width, height);

  // Mortar lines
  ctx.fillStyle = '#451a03';
  ctx.fillRect(x, y, width, 2);
  ctx.fillRect(x, y + height / 2, width, 2);
  ctx.fillRect(x, y + height - 2, width, 2);

  // Staggered vertical lines
  ctx.fillRect(x + width / 4, y, 2, height / 2);
  ctx.fillRect(x + 3 * width / 4, y, 2, height / 2);
  ctx.fillRect(x + width / 2, y + height / 2, 2, height / 2);

  // Brick highlights
  ctx.fillStyle = '#d97706';
  ctx.fillRect(x + 2, y + 2, width / 4 - 4, 2);
  ctx.fillRect(x + width / 4 + 2, y + 2, width / 2 - 4, 2);
  ctx.fillRect(x + 2, y + height / 2 + 2, width / 2 - 4, 2);
  ctx.fillRect(x + width / 2 + 2, y + height / 2 + 2, width / 2 - 4, 2);
}

/**
 * Draw Ground Tile
 */
export function drawGroundTile(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  width: number,
  height: number
) {
  // Underground dirt
  ctx.fillStyle = '#92400e';
  ctx.fillRect(x, y, width, height);

  // Dirt texture spots
  ctx.fillStyle = '#78350f';
  ctx.fillRect(x + 4, y + 14, 6, 6);
  ctx.fillRect(x + 20, y + 24, 6, 6);
  ctx.fillRect(x + 10, y + 36, 6, 6);

  ctx.fillStyle = '#b45309';
  ctx.fillRect(x + 12, y + 16, 4, 4);
  ctx.fillRect(x + 24, y + 32, 5, 5);

  // Grass top (thick green rim)
  ctx.fillStyle = '#15803d';
  ctx.fillRect(x, y, width, 8);
  ctx.fillStyle = '#22c55e';
  ctx.fillRect(x, y, width, 4);

  // Grass fringe hang-downs
  ctx.fillStyle = '#15803d';
  ctx.fillRect(x + 2, y + 8, 4, 3);
  ctx.fillRect(x + 12, y + 8, 5, 4);
  ctx.fillRect(x + 24, y + 8, 4, 3);
}

/**
 * Draw Flagpole and Castle
 */
export function drawGoalSection(
  ctx: CanvasRenderingContext2D,
  poleX: number,
  groundY: number,
  flagProgress: number // 0 = at top, 1 = at bottom
) {
  const poleHeight = 220;
  const poleTopY = groundY - poleHeight;

  ctx.save();
  // 1. Goal Castle
  const castleX = poleX + 140;
  const castleW = 180;
  const castleH = 150;
  const castleY = groundY - castleH;

  // Castle brick walls
  ctx.fillStyle = '#64748b';
  ctx.fillRect(castleX, castleY, castleW, castleH);

  // Castle battlements (turrets)
  for (let b = 0; b < castleW; b += 24) {
    ctx.fillStyle = '#475569';
    ctx.fillRect(castleX + b, castleY - 18, 16, 18);
    ctx.fillStyle = '#94a3b8';
    ctx.fillRect(castleX + b + 2, castleY - 18, 12, 4);
  }

  // Castle main entrance archway
  ctx.fillStyle = '#0f172a';
  ctx.beginPath();
  ctx.arc(castleX + castleW / 2, groundY - 45, 24, Math.PI, 0);
  ctx.fillRect(castleX + castleW / 2 - 24, groundY - 45, 48, 45);
  ctx.fill();

  // Birthday banner on Castle
  ctx.fillStyle = '#ec4899';
  ctx.fillRect(castleX + 16, castleY + 20, castleW - 32, 24);
  ctx.fillStyle = '#ffffff';
  ctx.font = 'bold 9px "Press Start 2P", monospace';
  ctx.textAlign = 'center';
  ctx.fillText("P'FAH", castleX + castleW / 2, castleY + 36);

  // Castle flags
  ctx.fillStyle = '#f59e0b';
  ctx.fillRect(castleX + 6, castleY - 32, 3, 14);
  ctx.fillRect(castleX + castleW - 9, castleY - 32, 3, 14);
  ctx.fillStyle = '#ef4444';
  ctx.beginPath();
  ctx.moveTo(castleX + 9, castleY - 32);
  ctx.lineTo(castleX + 26, castleY - 26);
  ctx.lineTo(castleX + 9, castleY - 20);
  ctx.fill();
  ctx.beginPath();
  ctx.moveTo(castleX + castleW - 9, castleY - 32);
  ctx.lineTo(castleX + castleW - 26, castleY - 26);
  ctx.lineTo(castleX + castleW - 9, castleY - 20);
  ctx.fill();

  // 2. Flagpole base
  ctx.fillStyle = '#047857';
  ctx.fillRect(poleX - 12, groundY - 20, 28, 20);
  ctx.fillStyle = '#10b981';
  ctx.fillRect(poleX - 8, groundY - 20, 20, 4);

  // Pole rod
  ctx.fillStyle = '#94a3b8';
  ctx.fillRect(poleX, poleTopY, 4, poleHeight);
  ctx.fillStyle = '#f1f5f9';
  ctx.fillRect(poleX, poleTopY, 2, poleHeight);

  // Gold sphere topper
  ctx.fillStyle = '#f59e0b';
  ctx.beginPath();
  ctx.arc(poleX + 2, poleTopY, 8, 0, Math.PI * 2);
  ctx.fill();
  ctx.fillStyle = '#fef08a';
  ctx.beginPath();
  ctx.arc(poleX + 1, poleTopY - 2, 3, 0, Math.PI * 2);
  ctx.fill();

  // Flag sliding down
  const currentFlagY = poleTopY + 10 + flagProgress * (poleHeight - 50);
  ctx.fillStyle = '#ec4899'; // Vibrant pink/magenta celebration flag
  ctx.fillRect(poleX - 38, currentFlagY, 38, 28);
  // Gold star & birthday cake on flag
  ctx.fillStyle = '#fde047';
  ctx.beginPath();
  ctx.arc(poleX - 19, currentFlagY + 14, 7, 0, Math.PI * 2);
  ctx.fill();
  ctx.fillStyle = '#ef4444';
  ctx.fillRect(poleX - 22, currentFlagY + 11, 6, 6);

  ctx.restore();
}

/**
 * Draw Anime Clapping Characters for Ending Screen (Image 4 inspired)
 * Goku, Naruto, Luffy, Deku, Sailor Moon, Zoro
 */
/**
 * Draw Anime Clapping Characters for Ending Screen (Full Stage Roster)
 * 14 iconic anime heroes standing across the entire stage flanking P'Fah!
 * Left: Goku, Vegeta, Naruto, Sasuke, Luffy, Sanji, Chopper
 * Right: Deku, Bakugo, Moon, Zoro, Tanjiro, Nezuko, Gojo
 */
export function drawAnimeCheerSquad(
  ctx: CanvasRenderingContext2D,
  canvasWidth: number,
  stageY: number,
  clappingAnim: number
) {
  const squad = [
    // Left Wing Characters (0 to 6)
    { name: 'GOKU', hair: '#facc15', outfit: '#ea580c', trim: '#2563eb', extra: 'goku' },
    { name: 'VEGETA', hair: '#0f172a', outfit: '#1d4ed8', trim: '#f8fafc', extra: 'vegeta' },
    { name: 'NARUTO', hair: '#facc15', outfit: '#ea580c', trim: '#0f172a', extra: 'naruto' },
    { name: 'SASUKE', hair: '#1e1b4b', outfit: '#1e293b', trim: '#7c3aed', extra: 'sasuke' },
    { name: 'LUFFY', hair: '#1e293b', hat: '#f59e0b', outfit: '#dc2626', trim: '#2563eb', extra: 'luffy' },
    { name: 'SANJI', hair: '#facc15', outfit: '#0f172a', trim: '#3b82f6', extra: 'sanji' },
    { name: 'CHOPPER', hair: '#ec4899', outfit: '#b45309', trim: '#38bdf8', extra: 'chopper' },

    // Right Wing Characters (7 to 13)
    { name: 'DEKU', hair: '#15803d', outfit: '#047857', trim: '#dc2626', extra: 'deku' },
    { name: 'BAKUGO', hair: '#fef08a', outfit: '#1e293b', trim: '#ea580c', extra: 'bakugo' },
    { name: 'MOON', hair: '#facc15', outfit: '#2563eb', trim: '#dc2626', extra: 'moon' },
    { name: 'ZORO', hair: '#16a34a', outfit: '#14532d', trim: '#b91c1c', extra: 'zoro' },
    { name: 'TANJIRO', hair: '#881337', outfit: '#059669', trim: '#0f172a', extra: 'tanjiro' },
    { name: 'NEZUKO', hair: '#18181b', outfit: '#f472b6', trim: '#22c55e', extra: 'nezuko' },
    { name: 'GOJO', hair: '#f8fafc', outfit: '#1e1b4b', trim: '#0f172a', extra: 'gojo' },
  ];

  const clapOffset = Math.sin(clappingAnim * 12) * 2.5;
  const scale = 0.82; // Compact to fit perfectly on the stage without clutter

  // Left side: 7 characters from x = 68 to x = 388 (step 52px)
  // Right side: 7 characters from x = 540 to x = 860 (step 52px)
  squad.forEach((char, idx) => {
    let cx = 0;
    if (idx < 7) {
      // Left wing
      cx = 68 + idx * 53;
    } else {
      // Right wing
      cx = 538 + (idx - 7) * 53;
    }
    const cy = stageY;

    ctx.save();
    // Character Shadow on the stage
    ctx.fillStyle = 'rgba(0, 0, 0, 0.35)';
    ctx.beginPath();
    ctx.ellipse(cx + 14 * scale, cy + 62 * scale, 15 * scale, 4 * scale, 0, 0, Math.PI * 2);
    ctx.fill();

    // Body Outfit
    ctx.fillStyle = char.outfit;
    ctx.fillRect(cx + 6 * scale, cy + 24 * scale, 16 * scale, 24 * scale);

    // Outfit Trim / Belt
    ctx.fillStyle = char.trim;
    ctx.fillRect(cx + 6 * scale, cy + 34 * scale, 16 * scale, 4 * scale);

    // Special attire trims
    if (char.extra === 'vegeta') {
      // Saiyan white chest armor
      ctx.fillStyle = '#f8fafc';
      ctx.fillRect(cx + 8 * scale, cy + 24 * scale, 12 * scale, 14 * scale);
      ctx.fillStyle = '#f59e0b';
      ctx.fillRect(cx + 10 * scale, cy + 30 * scale, 8 * scale, 3 * scale);
    } else if (char.extra === 'tanjiro') {
      // Checkered haori pattern
      ctx.fillStyle = '#0f172a';
      ctx.fillRect(cx + 6 * scale, cy + 24 * scale, 4 * scale, 6 * scale);
      ctx.fillRect(cx + 14 * scale, cy + 24 * scale, 4 * scale, 6 * scale);
      ctx.fillRect(cx + 10 * scale, cy + 30 * scale, 4 * scale, 6 * scale);
    } else if (char.extra === 'nezuko') {
      // Kimono sash (Obi)
      ctx.fillStyle = '#dc2626';
      ctx.fillRect(cx + 6 * scale, cy + 32 * scale, 16 * scale, 5 * scale);
      ctx.fillStyle = '#22c55e';
      ctx.fillRect(cx + 8 * scale, cy + 33 * scale, 12 * scale, 3 * scale);
    }

    // Legs
    ctx.fillStyle = char.trim === '#f8fafc' ? char.outfit : char.trim;
    ctx.fillRect(cx + 7 * scale, cy + 48 * scale, 5 * scale, 12 * scale);
    ctx.fillRect(cx + 16 * scale, cy + 48 * scale, 5 * scale, 12 * scale);
    // Shoes
    ctx.fillStyle = '#0f172a';
    ctx.fillRect(cx + 5 * scale, cy + 58 * scale, 7 * scale, 4 * scale);
    ctx.fillRect(cx + 16 * scale, cy + 58 * scale, 7 * scale, 4 * scale);

    // Head / Face Skin
    ctx.fillStyle = '#fed7aa';
    ctx.fillRect(cx + 8 * scale, cy + 10 * scale, 12 * scale, 14 * scale);

    // Eyes & Smile
    if (char.extra === 'gojo') {
      // Black blindfold
      ctx.fillStyle = '#0f172a';
      ctx.fillRect(cx + 7 * scale, cy + 13 * scale, 14 * scale, 5 * scale);
    } else if (char.extra === 'nezuko') {
      // Pink eyes & bamboo muzzle
      ctx.fillStyle = '#f472b6';
      ctx.fillRect(cx + 9 * scale, cy + 13 * scale, 3 * scale, 3 * scale);
      ctx.fillRect(cx + 16 * scale, cy + 13 * scale, 3 * scale, 3 * scale);
      // Bamboo bit
      ctx.fillStyle = '#16a34a';
      ctx.fillRect(cx + 9 * scale, cy + 18 * scale, 10 * scale, 4 * scale);
      ctx.fillStyle = '#bbf7d0';
      ctx.fillRect(cx + 10 * scale, cy + 19 * scale, 8 * scale, 2 * scale);
    } else {
      ctx.fillStyle = '#0f172a';
      ctx.fillRect(cx + 10 * scale, cy + 14 * scale, 2 * scale, 2 * scale);
      ctx.fillRect(cx + 16 * scale, cy + 14 * scale, 2 * scale, 2 * scale);
      ctx.fillStyle = '#dc2626';
      ctx.fillRect(cx + 12 * scale, cy + 19 * scale, 4 * scale, 2 * scale);
    }

    // Hair Base
    ctx.fillStyle = char.hair;
    ctx.fillRect(cx + 6 * scale, cy + 5 * scale, 16 * scale, 8 * scale);

    // Character-Specific Hair & Accessories
    if (char.extra === 'goku') {
      // Super Saiyan Spikes
      ctx.fillRect(cx + 4 * scale, cy + 1 * scale, 6 * scale, 6 * scale);
      ctx.fillRect(cx + 11 * scale, cy - 3 * scale, 6 * scale, 7 * scale);
      ctx.fillRect(cx + 18 * scale, cy + 1 * scale, 6 * scale, 6 * scale);
    } else if (char.extra === 'vegeta') {
      // Tall upward flame hair
      ctx.fillRect(cx + 7 * scale, cy - 6 * scale, 14 * scale, 12 * scale);
      ctx.fillRect(cx + 9 * scale, cy - 10 * scale, 10 * scale, 6 * scale);
    } else if (char.extra === 'naruto') {
      // Spikes + Ninja Headband
      ctx.fillRect(cx + 5 * scale, cy + 1 * scale, 5 * scale, 5 * scale);
      ctx.fillRect(cx + 12 * scale, cy - 2 * scale, 5 * scale, 5 * scale);
      ctx.fillRect(cx + 18 * scale, cy + 1 * scale, 5 * scale, 5 * scale);
      ctx.fillStyle = '#334155';
      ctx.fillRect(cx + 6 * scale, cy + 9 * scale, 16 * scale, 4 * scale);
      ctx.fillStyle = '#e2e8f0';
      ctx.fillRect(cx + 11 * scale, cy + 10 * scale, 6 * scale, 2 * scale); // Leaf plate
    } else if (char.extra === 'sasuke') {
      // Dark spiky bangs
      ctx.fillStyle = '#1e1b4b';
      ctx.fillRect(cx + 5 * scale, cy + 1 * scale, 5 * scale, 6 * scale);
      ctx.fillRect(cx + 18 * scale, cy + 1 * scale, 5 * scale, 6 * scale);
      ctx.fillRect(cx + 6 * scale, cy + 9 * scale, 3 * scale, 8 * scale);
      ctx.fillRect(cx + 19 * scale, cy + 9 * scale, 3 * scale, 8 * scale);
    } else if (char.extra === 'luffy') {
      // Straw Hat
      ctx.fillStyle = '#f59e0b';
      ctx.fillRect(cx + 2 * scale, cy + 3 * scale, 24 * scale, 4 * scale);
      ctx.fillRect(cx + 8 * scale, cy - 2 * scale, 12 * scale, 6 * scale);
      ctx.fillStyle = '#dc2626';
      ctx.fillRect(cx + 8 * scale, cy + 3 * scale, 12 * scale, 2 * scale);
    } else if (char.extra === 'sanji') {
      // Blonde side-parted hair covering one eye
      ctx.fillStyle = '#facc15';
      ctx.fillRect(cx + 6 * scale, cy + 5 * scale, 16 * scale, 8 * scale);
      ctx.fillRect(cx + 7 * scale, cy + 11 * scale, 6 * scale, 6 * scale);
    } else if (char.extra === 'chopper') {
      // Pink Top Hat with Antlers & Blue Nose
      ctx.fillStyle = '#ec4899';
      ctx.fillRect(cx + 4 * scale, cy - 2 * scale, 20 * scale, 9 * scale);
      ctx.fillStyle = '#f8fafc';
      ctx.fillRect(cx + 12 * scale, cy, 4 * scale, 5 * scale); // White cross
      ctx.fillRect(cx + 10 * scale, cy + 1 * scale, 8 * scale, 3 * scale);
      // Antlers
      ctx.fillStyle = '#78350f';
      ctx.fillRect(cx + 1 * scale, cy - 6 * scale, 3 * scale, 6 * scale);
      ctx.fillRect(cx + 24 * scale, cy - 6 * scale, 3 * scale, 6 * scale);
      // Blue nose
      ctx.fillStyle = '#38bdf8';
      ctx.fillRect(cx + 13 * scale, cy + 16 * scale, 3 * scale, 3 * scale);
    } else if (char.extra === 'deku') {
      // Green messy curls
      ctx.fillStyle = '#15803d';
      ctx.fillRect(cx + 4 * scale, cy + 1 * scale, 6 * scale, 6 * scale);
      ctx.fillRect(cx + 11 * scale, cy - 2 * scale, 6 * scale, 6 * scale);
      ctx.fillRect(cx + 18 * scale, cy + 1 * scale, 6 * scale, 6 * scale);
    } else if (char.extra === 'bakugo') {
      // Ash blonde explosion spikes
      ctx.fillStyle = '#fef08a';
      ctx.fillRect(cx + 3 * scale, cy - 2 * scale, 6 * scale, 7 * scale);
      ctx.fillRect(cx + 10 * scale, cy - 5 * scale, 7 * scale, 8 * scale);
      ctx.fillRect(cx + 18 * scale, cy - 2 * scale, 6 * scale, 7 * scale);
    } else if (char.extra === 'moon') {
      // Twin odango tails
      ctx.fillStyle = '#facc15';
      ctx.fillRect(cx + 1 * scale, cy + 9 * scale, 5 * scale, 28 * scale);
      ctx.fillRect(cx + 22 * scale, cy + 9 * scale, 5 * scale, 28 * scale);
      ctx.fillRect(cx + 2 * scale, cy + 2 * scale, 6 * scale, 6 * scale); // Buns
      ctx.fillRect(cx + 20 * scale, cy + 2 * scale, 6 * scale, 6 * scale);
      ctx.fillStyle = '#dc2626';
      ctx.fillRect(cx + 4 * scale, cy + 5 * scale, 2 * scale, 2 * scale);
      ctx.fillRect(cx + 22 * scale, cy + 5 * scale, 2 * scale, 2 * scale);
    } else if (char.extra === 'zoro') {
      // Green hair + 3 katanas on side
      ctx.fillStyle = '#16a34a';
      ctx.fillRect(cx + 7 * scale, cy + 3 * scale, 14 * scale, 6 * scale);
      // Sword sheaths
      ctx.fillStyle = '#f8fafc';
      ctx.fillRect(cx + 21 * scale, cy + 32 * scale, 2 * scale, 18 * scale);
      ctx.fillStyle = '#991b1b';
      ctx.fillRect(cx + 23 * scale, cy + 30 * scale, 2 * scale, 18 * scale);
    } else if (char.extra === 'tanjiro') {
      // Hanafuda earrings
      ctx.fillStyle = '#f8fafc';
      ctx.fillRect(cx + 6 * scale, cy + 15 * scale, 2 * scale, 6 * scale);
      ctx.fillRect(cx + 20 * scale, cy + 15 * scale, 2 * scale, 6 * scale);
      ctx.fillStyle = '#dc2626';
      ctx.fillRect(cx + 6 * scale, cy + 17 * scale, 2 * scale, 2 * scale);
      ctx.fillRect(cx + 20 * scale, cy + 17 * scale, 2 * scale, 2 * scale);
    } else if (char.extra === 'gojo') {
      // Spiky white hair
      ctx.fillStyle = '#f8fafc';
      ctx.fillRect(cx + 5 * scale, cy + 1 * scale, 6 * scale, 6 * scale);
      ctx.fillRect(cx + 11 * scale, cy - 3 * scale, 6 * scale, 7 * scale);
      ctx.fillRect(cx + 17 * scale, cy + 1 * scale, 6 * scale, 6 * scale);
    }

    // Clapping Hands (animated together in rhythm!)
    ctx.fillStyle = '#fed7aa';
    ctx.fillRect(cx + (9 - clapOffset) * scale, cy + 28 * scale, 5 * scale, 6 * scale);
    ctx.fillRect(cx + (14 + clapOffset) * scale, cy + 28 * scale, 5 * scale, 6 * scale);

    // Character Name Tag
    ctx.fillStyle = '#1e293b';
    ctx.fillRect(cx + 2 * scale, cy + 66 * scale, 24 * scale, 9 * scale);
    ctx.fillStyle = '#f8fafc';
    ctx.font = `${Math.floor(5.5 * scale)}px "Press Start 2P", monospace`;
    ctx.textAlign = 'center';
    ctx.fillText(char.name, cx + 14 * scale, cy + 73 * scale);

    ctx.restore();
  });
}

