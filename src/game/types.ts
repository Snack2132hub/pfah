export interface Player {
  x: number;
  y: number;
  vx: number;
  vy: number;
  width: number;
  height: number;
  isGrounded: boolean;
  facing: 'left' | 'right';
  animFrame: number;
  animTimer: number;
  isJumping: boolean;
  reachedGoal: boolean;
  slideTimer: number;
}

export interface Platform {
  x: number;
  y: number;
  width: number;
  height: number;
  type: 'ground' | 'brick' | 'question' | 'pipe';
  isHit?: boolean;
  bounceOffset?: number;
  itemInside?: 'shuttlecock' | 'manga' | null;
}

export interface Collectible {
  id: string;
  x: number;
  y: number;
  width: number;
  height: number;
  type: 'shuttlecock' | 'manga';
  title?: string;
  collected: boolean;
  floatOffset: number;
  value: number;
}

export interface FloatingText {
  id: string;
  x: number;
  y: number;
  text: string;
  color: string;
  alpha: number;
  vy: number;
}

export interface Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  size: number;
  color: string;
  alpha: number;
  life: number;
  maxLife: number;
  shape?: 'rect' | 'circle' | 'star';
  rotation?: number;
  vRot?: number;
}

export interface ConfettiParticle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  color: string;
  size: number;
  rotation: number;
  vRot: number;
  oscillationSpeed: number;
  wobble: number;
}

export interface Firework {
  x: number;
  y: number;
  targetY: number;
  vy: number;
  color: string;
  exploded: boolean;
  particles: Particle[];
}

export type RenderMode = 'pixelArt' | 'customImage' | 'placeholderRects';

export interface CustomImages {
  playerSpriteUrl: string | null;
  jumpSpriteUrl: string | null;
  endingScreenUrl: string | null;
  shuttlecockUrl: string | null;
  mangaUrl: string | null;
}
