// ============================================================================
// MAARGAM — High-Craft 2.2-Second Choreographed Splash Animation & Experience
// Self-contained React + Tailwind CSS Production Component
// 5-Stage Choreography:
//   1. Launch (0ms – 450ms): Sunset sky, backwater silhouette, glowing S-curve path, progress bar, 15ms haptic
//   2. Features Appear (450ms – 1150ms): 7 floating glassmorphic feature orbs pop along golden trail, [12, 40, 12] haptic
//   3. Elements Converge (1150ms – 1600ms): Vortex implosion towards center, radial streaks, [25, 30, 45] haptic
//   4. Radiant Logo Reveal (1600ms – 2050ms): Golden shockwave halo, Maargam Heart-Pin Ribbon logo, [50, 60, 95] heartbeat haptic
//   5. Seamless Zoom Transition (2050ms+): 60fps scale-out dissolve revealing interactive Maargam home interface
// ============================================================================

import React, { useState, useEffect, useCallback } from 'react';
import {
  Search,
  SlidersHorizontal,
  Heart,
  X,
  RotateCcw,
  Star,
  Home,
  Compass,
  Map as MapIcon,
  MessageCircle,
  User,
  CheckCircle2,
  Briefcase,
  MapPin,
  Volume2,
  Play,
} from 'lucide-react';

// ==========================================
// 1. SAFE HAPTIC FEEDBACK ENGINE
// ==========================================
export const triggerHaptic = (pattern: number | number[]) => {
  try {
    if (typeof window !== 'undefined' && typeof navigator !== 'undefined' && 'vibrate' in navigator) {
      navigator.vibrate(pattern);
    }
  } catch {
    // Fallback silently if vibration is blocked or unsupported
  }
};

// ==========================================
// 2. CUSTOM HIGH-CRAFT 100% VECTOR SVGS
// ==========================================

/** Maargam Official Brand Logo SVG (Gradient Pin + Heart + Crossed Ribbon Base) */
export const MaargamLogoSVG: React.FC<{ className?: string }> = ({ className = 'w-24 h-24' }) => (
  <svg viewBox="0 0 120 130" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
    <defs>
      <linearGradient id="maargamPinGrad" x1="15" y1="10" x2="105" y2="115" gradientUnits="userSpaceOnUse">
        <stop offset="0%" stopColor="#FF2E93" />
        <stop offset="50%" stopColor="#B537F2" />
        <stop offset="100%" stopColor="#4F46E5" />
      </linearGradient>
      <linearGradient id="ribbonLeft" x1="25" y1="85" x2="60" y2="118" gradientUnits="userSpaceOnUse">
        <stop offset="0%" stopColor="#E11D48" />
        <stop offset="100%" stopColor="#9333EA" />
      </linearGradient>
      <linearGradient id="ribbonRight" x1="95" y1="85" x2="60" y2="118" gradientUnits="userSpaceOnUse">
        <stop offset="0%" stopColor="#6366F1" />
        <stop offset="100%" stopColor="#3B82F6" />
      </linearGradient>
      <filter id="logoGlow" x="-20%" y="-20%" width="140%" height="140%">
        <feDropShadow dx="0" dy="8" stdDeviation="8" floodColor="#B537F2" floodOpacity="0.35" />
      </filter>
    </defs>

    <g filter="url(#logoGlow)">
      {/* Bottom Left & Right Ribbon Tails */}
      <path d="M32 82 L24 114 L46 105 L60 95 Z" fill="url(#ribbonLeft)" />
      <path d="M88 82 L96 114 L74 105 L60 95 Z" fill="url(#ribbonRight)" />

      {/* Main Pin Body */}
      <path
        d="M60 10C35.147 10 15 30.147 15 55C15 79.5 46.5 103.5 56.4 110.6C58.56 112.15 61.44 112.15 63.6 110.6C73.5 103.5 105 79.5 105 55C105 30.147 84.853 10 60 10Z"
        fill="url(#maargamPinGrad)"
      />

      {/* Specular Inner Rim */}
      <path
        d="M60 12C36.25 12 17 31.25 17 55C17 78 47 101 57 108.5C58.8 109.8 61.2 109.8 63 108.5C73 101 103 78 103 55C103 31.25 83.75 12 60 12Z"
        stroke="white"
        strokeOpacity="0.35"
        strokeWidth="2"
      />

      {/* Inner White Circle */}
      <circle cx="60" cy="53" r="25" fill="white" />

      {/* Center Gradient Heart */}
      <path
        d="M60 66.5C60 66.5 45.5 57.2 45.5 47.3C45.5 42.4 49.3 38.5 54 38.5C56.8 38.5 59.3 39.9 60 42.1C60.7 39.9 63.2 38.5 66 38.5C70.7 38.5 74.5 42.4 74.5 47.3C74.5 57.2 60 66.5 60 66.5Z"
        fill="url(#maargamPinGrad)"
      />
    </g>
  </svg>
);

/** 1. Find Matches SVG (Photo Cards + Heart Badge) */
export const FindMatchesSVG: React.FC = () => (
  <svg viewBox="0 0 80 80" className="w-12 h-12" fill="none">
    <rect x="14" y="14" width="38" height="48" rx="8" transform="rotate(-10 14 14)" fill="#FDE68A" stroke="white" strokeWidth="2.5" />
    <rect x="24" y="12" width="40" height="50" rx="8" fill="url(#cardGrad)" stroke="white" strokeWidth="3" />
    <circle cx="44" cy="31" r="8" fill="#FFFBEB" />
    <path d="M31 52C31 45.5 36.5 41 44 41C51.5 41 57 45.5 57 52" fill="#FFFBEB" />
    <circle cx="58" cy="54" r="12" fill="white" />
    <path d="M58 60.5C58 60.5 50.5 55.5 50.5 50.2C50.5 47.6 52.5 45.5 55 45.5C56.5 45.5 57.8 46.3 58 47.5C58.2 46.3 59.5 45.5 61 45.5C63.5 45.5 65.5 47.6 65.5 50.2C65.5 55.5 58 60.5 58 60.5Z" fill="#F43F5E" />
    <defs>
      <linearGradient id="cardGrad" x1="24" y1="12" x2="64" y2="62" gradientUnits="userSpaceOnUse">
        <stop stopColor="#FB7185" />
        <stop offset="1" stopColor="#E11D48" />
      </linearGradient>
    </defs>
  </svg>
);

/** 2. Travel Together SVG (3D Globe + Airplane) */
export const TravelGlobeSVG: React.FC = () => (
  <svg viewBox="0 0 80 80" className="w-12 h-12" fill="none">
    <circle cx="40" cy="42" r="24" fill="url(#globeGrad)" />
    <path d="M24 32C28 29 35 32 38 28C41 24 48 25 52 29C56 33 55 42 49 45C43 48 39 43 34 46C29 49 23 42 24 32Z" fill="#34D399" fillOpacity="0.85" />
    <path d="M16 44C24 54 48 56 64 36" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeDasharray="3 3" />
    <path d="M62 24L47 31L53 35L56 41L62 24Z" fill="white" />
    <defs>
      <linearGradient id="globeGrad" x1="16" y1="18" x2="64" y2="66" gradientUnits="userSpaceOnUse">
        <stop stopColor="#38BDF8" />
        <stop offset="1" stopColor="#2563EB" />
      </linearGradient>
    </defs>
  </svg>
);

/** 3. Shared Interests SVG (Steaming Artisanal Coffee Cup) */
export const CoffeeCupSVG: React.FC = () => (
  <svg viewBox="0 0 80 80" className="w-12 h-12" fill="none">
    <ellipse cx="40" cy="58" rx="24" ry="7" fill="#FDE68A" />
    <path d="M56 36H61C64.866 36 68 39.134 68 43C68 46.866 64.866 50 61 50H55" stroke="#D97706" strokeWidth="4" strokeLinecap="round" />
    <path d="M22 32H58V44C58 53.941 49.941 62 40 62C30.059 62 22 53.941 22 44V32Z" fill="url(#cupGrad)" />
    <ellipse cx="40" cy="32" rx="18" ry="5" fill="#78350F" stroke="#FDE68A" strokeWidth="2" />
    <path d="M33 22C33 18 36 16 36 12" stroke="#FFFBEB" strokeWidth="2.5" strokeLinecap="round" />
    <path d="M41 24C41 20 44 18 44 14" stroke="#FFFBEB" strokeWidth="2.5" strokeLinecap="round" />
    <path d="M48 22C48 18 51 16 51 12" stroke="#FFFBEB" strokeWidth="2.5" strokeLinecap="round" />
    <defs>
      <linearGradient id="cupGrad" x1="22" y1="32" x2="58" y2="62" gradientUnits="userSpaceOnUse">
        <stop stopColor="#F59E0B" />
        <stop offset="1" stopColor="#B45309" />
      </linearGradient>
    </defs>
  </svg>
);

/** 4. Grow Together SVG (3D Rose Dumbbells) */
export const DumbbellSVG: React.FC = () => (
  <svg viewBox="0 0 80 80" className="w-12 h-12" fill="none">
    <g transform="rotate(-22 40 40)">
      <rect x="24" y="36" width="32" height="8" rx="4" fill="#FDA4AF" />
      <rect x="14" y="24" width="10" height="32" rx="5" fill="url(#gymGrad)" />
      <rect x="8" y="29" width="6" height="22" rx="3" fill="#E11D48" />
      <rect x="56" y="24" width="10" height="32" rx="5" fill="url(#gymGrad)" />
      <rect x="66" y="29" width="6" height="22" rx="3" fill="#E11D48" />
    </g>
    <defs>
      <linearGradient id="gymGrad" x1="14" y1="24" x2="66" y2="56" gradientUnits="userSpaceOnUse">
        <stop stopColor="#FB7185" />
        <stop offset="1" stopColor="#BE123C" />
      </linearGradient>
    </defs>
  </svg>
);

/** 5. Explore Nearby SVG (Folded Map + Location Pin) */
export const ExploreMapSVG: React.FC = () => (
  <svg viewBox="0 0 80 80" className="w-12 h-12" fill="none">
    <path d="M14 26L28 20L50 28L66 21V56L50 63L28 55L14 61V26Z" fill="#6EE7B7" stroke="white" strokeWidth="2" strokeLinejoin="round" />
    <path d="M28 20V55M50 28V63" stroke="#10B981" strokeWidth="2" />
    <path d="M50 12C43.9 12 39 16.9 39 23C39 30.5 50 40 50 40C50 40 61 30.5 61 23C61 16.9 56.1 12 50 12Z" fill="#F43F5E" stroke="white" strokeWidth="2" />
    <circle cx="50" cy="23" r="4" fill="white" />
  </svg>
);

/** 6. Build a Future SVG (Sprouting Plant) */
export const SproutFutureSVG: React.FC = () => (
  <svg viewBox="0 0 80 80" className="w-12 h-12" fill="none">
    <ellipse cx="40" cy="60" rx="18" ry="6" fill="#92400E" />
    <path d="M40 60V34" stroke="#10B981" strokeWidth="4.5" strokeLinecap="round" />
    <path d="M40 42C40 31 52 24 60 28C60 38 50 45 40 42Z" fill="#34D399" />
    <path d="M40 46C40 35 28 28 20 32C20 42 30 49 40 46Z" fill="#059669" />
  </svg>
);

/** 7. Marriage Goals SVG (Interlocked Golden Rings + Sparkle) */
export const MarriageRingsSVG: React.FC = () => (
  <svg viewBox="0 0 100 75" className="w-16 h-12" fill="none">
    <circle cx="38" cy="40" r="18" stroke="url(#goldRing1)" strokeWidth="6" />
    <circle cx="62" cy="40" r="18" stroke="url(#goldRing2)" strokeWidth="6" />
    <path d="M50 14L53 20L59 21L54 25L56 31L50 28L44 31L46 25L41 21L47 20L50 14Z" fill="#FEF08A" />
    <defs>
      <linearGradient id="goldRing1" x1="20" y1="22" x2="56" y2="58" gradientUnits="userSpaceOnUse">
        <stop stopColor="#FEF08A" />
        <stop offset="0.5" stopColor="#F59E0B" />
        <stop offset="1" stopColor="#B45309" />
      </linearGradient>
      <linearGradient id="goldRing2" x1="44" y1="22" x2="80" y2="58" gradientUnits="userSpaceOnUse">
        <stop stopColor="#FDE047" />
        <stop offset="0.5" stopColor="#D97706" />
        <stop offset="1" stopColor="#78350F" />
      </linearGradient>
    </defs>
  </svg>
);

// ==========================================
// 3. FEATURE BUBBLE DATA (Matches All 5 Frames)
// ==========================================
export interface FeatureNode {
  id: string;
  label: string;
  x: string;
  y: string;
  rotate: string;
  delay: string;
  svg: React.ReactNode;
}

export const FEATURE_NODES: FeatureNode[] = [
  {
    id: 'matches',
    label: 'Find Matches',
    x: 'left-[10%]',
    y: 'top-[10%]',
    rotate: '-rotate-3',
    delay: '0ms',
    svg: <FindMatchesSVG />,
  },
  {
    id: 'travel',
    label: 'Travel Together',
    x: 'right-[8%]',
    y: 'top-[16%]',
    rotate: 'rotate-6',
    delay: '60ms',
    svg: <TravelGlobeSVG />,
  },
  {
    id: 'interests',
    label: 'Shared Interests',
    x: 'left-[8%]',
    y: 'top-[31%]',
    rotate: '-rotate-2',
    delay: '120ms',
    svg: <CoffeeCupSVG />,
  },
  {
    id: 'grow',
    label: 'Grow Together',
    x: 'right-[9%]',
    y: 'top-[36%]',
    rotate: 'rotate-3',
    delay: '180ms',
    svg: <DumbbellSVG />,
  },
  {
    id: 'explore',
    label: 'Explore Nearby',
    x: 'left-[10%]',
    y: 'top-[50%]',
    rotate: '-rotate-3',
    delay: '240ms',
    svg: <ExploreMapSVG />,
  },
  {
    id: 'future',
    label: 'Build a Future',
    x: 'right-[10%]',
    y: 'top-[53%]',
    rotate: 'rotate-2',
    delay: '300ms',
    svg: <SproutFutureSVG />,
  },
  {
    id: 'marriage',
    label: 'Marriage Goals',
    x: 'left-1/2 -translate-x-1/2',
    y: 'top-[67%]',
    rotate: 'rotate-0',
    delay: '360ms',
    svg: <MarriageRingsSVG />,
  },
];

// ==========================================
// 4. MAIN COMPONENT (2.2s SPLASH + APP)
// ==========================================
export default function MaargamAppExperience() {
  // Stages:
  // 1 = Launch (0 - 450ms)
  // 2 = Features Appear (450 - 1150ms)
  // 3 = Elements Converge (1150 - 1600ms)
  // 4 = Logo Reveal & Glow (1600 - 2050ms)
  // 5 = Seamless Transition to App (2050ms+)
  const [stage, setStage] = useState<1 | 2 | 3 | 4 | 5>(1);
  const [hapticStatus, setHapticStatus] = useState<string>('Pulse: Initial Launch');
  const [activeCategory, setActiveCategory] = useState<string>('business');

  const startSplashSequence = useCallback(() => {
    setStage(1);
    setHapticStatus('📳 Vibrate(15ms) • Stage 1: Launch');
    triggerHaptic(15);

    // Stage 2: 3D Features Pop Out along the Golden Path
    const t1 = setTimeout(() => {
      setStage(2);
      setHapticStatus('📳 Vibrate([12, 40, 12]) • Stage 2: Features Appear');
      triggerHaptic([12, 40, 12]);
    }, 450);

    // Stage 3: All Elements Converge into Center Logo (Vortex Implosion)
    const t2 = setTimeout(() => {
      setStage(3);
      setHapticStatus('📳 Vibrate([25, 30, 45]) • Stage 3: Elements Converge');
      triggerHaptic([25, 30, 45]);
    }, 1150);

    // Stage 4: Radiant Halo Logo Reveal (Climax Heartbeat Vibration)
    const t3 = setTimeout(() => {
      setStage(4);
      setHapticStatus('📳 Vibrate([50, 60, 95]) • Stage 4: Logo Halo Reveal');
      triggerHaptic([50, 60, 95]);
    }, 1600);

    // Stage 5: Seamless Zoom Transition into Live Interface
    const t4 = setTimeout(() => {
      setStage(5);
      setHapticStatus('✨ Ready • Maargam Active');
      triggerHaptic(10);
    }, 2150);

    return () => {
      clearTimeout(t1);
      clearTimeout(t2);
      clearTimeout(t3);
      clearTimeout(t4);
    };
  }, []);

  useEffect(() => {
    const cleanup = startSplashSequence();
    return cleanup;
  }, [startSplashSequence]);

  return (
    <div className="min-h-screen w-full bg-slate-950 flex flex-col items-center justify-center p-0 sm:p-4 select-none font-sans overflow-hidden">
      {/* Top Preview/Control Bar with Live Haptic Pulse Indicator & Replay */}
      <div className="fixed top-3 z-50 flex items-center gap-3 px-4 py-1.5 rounded-full bg-slate-900/90 backdrop-blur-md border border-white/15 text-white text-xs shadow-xl">
        <span className="flex items-center gap-1.5 text-rose-400 font-semibold">
          <Volume2 className="w-3.5 h-3.5 animate-pulse" />
          {hapticStatus}
        </span>
        <button
          type="button"
          onClick={startSplashSequence}
          className="flex items-center gap-1 px-2.5 py-1 rounded-full bg-gradient-to-r from-rose-500 to-purple-600 font-bold text-[11px] hover:opacity-95 active:scale-95 transition cursor-pointer"
        >
          <Play className="w-3 h-3 fill-white" />
          Replay 2s Intro
        </button>
      </div>

      {/* PHONE FRAME CONTAINER (Matches Reference Dimensions & Border) */}
      <div className="relative w-full max-w-[410px] h-[100dvh] sm:h-[844px] sm:rounded-[46px] overflow-hidden shadow-2xl border-0 sm:border-[8px] sm:border-slate-900 bg-white">
        {/* =========================================================
            SPLASH OVERLAY (STAGES 1 TO 4) — Fades & Zooms Out on Stage 5
           ========================================================= */}
        <div
          className={`absolute inset-0 z-40 flex flex-col justify-between overflow-hidden transition-all duration-700 ease-out ${
            stage === 5 ? 'opacity-0 scale-125 pointer-events-none' : 'opacity-100 scale-100'
          }`}
        >
          {/* 1. SCENIC GOLDEN SUNSET & KERALA BACKWATER / GLOWING PATH BACKGROUND SVG */}
          <svg
            viewBox="0 0 400 850"
            preserveAspectRatio="xMidYMid slice"
            className="absolute inset-0 w-full h-full object-cover"
          >
            <defs>
              {/* Sunset Sky Gradient */}
              <linearGradient id="skyGrad" x1="200" y1="0" x2="200" y2="850" gradientUnits="userSpaceOnUse">
                <stop offset="0%" stopColor="#2E3B6E" />
                <stop offset="28%" stopColor="#7C5295" />
                <stop offset="52%" stopColor="#E58C8A" />
                <stop offset="68%" stopColor="#F9C784" />
                <stop offset="85%" stopColor="#4A2545" />
                <stop offset="100%" stopColor="#1B1026" />
              </linearGradient>

              {/* Sun Radial Glow */}
              <radialGradient id="sunGlow" cx="50%" cy="62%" r="45%">
                <stop offset="0%" stopColor="#FFFBEB" stopOpacity="1" />
                <stop offset="30%" stopColor="#FDE047" stopOpacity="0.65" />
                <stop offset="70%" stopColor="#FB7185" stopOpacity="0.2" />
                <stop offset="100%" stopColor="#FB7185" stopOpacity="0" />
              </radialGradient>

              {/* Glowing Winding Maargam Path */}
              <linearGradient id="pathGlow" x1="200" y1="520" x2="200" y2="850" gradientUnits="userSpaceOnUse">
                <stop offset="0%" stopColor="#FEF08A" />
                <stop offset="50%" stopColor="#FB7185" />
                <stop offset="100%" stopColor="#F43F5E" />
              </linearGradient>

              {/* Golden Winding S-Curve for Stage 2 Feature Trail */}
              <linearGradient id="skyTrail" x1="200" y1="80" x2="200" y2="640" gradientUnits="userSpaceOnUse">
                <stop offset="0%" stopColor="#FEF08A" stopOpacity="0.8" />
                <stop offset="50%" stopColor="#F472B6" stopOpacity="0.9" />
                <stop offset="100%" stopColor="#FB923C" stopOpacity="0.8" />
              </linearGradient>

              {/* Radial streak gradient for Stage 3 convergence */}
              <linearGradient id="streakGrad" x1="0" y1="0" x2="1" y2="1">
                <stop offset="0%" stopColor="#FEF08A" stopOpacity="0.9" />
                <stop offset="100%" stopColor="#F43F5E" stopOpacity="0" />
              </linearGradient>
            </defs>

            {/* Base Sky */}
            <rect width="400" height="850" fill="url(#skyGrad)" />

            {/* Soft Sunset Orb */}
            <circle cx="200" cy="525" r="190" fill="url(#sunGlow)" />
            <circle cx="200" cy="525" r="22" fill="#FFFBEB" />

            {/* Distant Misty Mountains */}
            <path d="M0 555 Q75 495 160 545 T320 525 T400 550 L400 650 L0 650 Z" fill="#6D4C7D" fillOpacity="0.55" />
            <path d="M0 570 Q110 530 190 565 T400 555 L400 660 L0 660 Z" fill="#4A3059" fillOpacity="0.7" />

            {/* Tranquil River / Backwater */}
            <rect x="0" y="575" width="400" height="275" fill="#231528" />

            {/* Glowing River / Path Reflection */}
            <path
              d="M200 575 C145 620, 265 670, 185 735 C120 790, 230 825, 210 850 L295 850 C310 810, 195 780, 245 730 C300 675, 185 620, 212 575 Z"
              fill="url(#pathGlow)"
              fillOpacity="0.45"
            />
            <path
              d="M200 575 C145 620, 265 670, 185 735 C120 790, 230 825, 210 850"
              stroke="#FEF08A"
              strokeWidth="3"
              fill="none"
            />
            <path
              d="M210 575 C165 620, 285 670, 215 735 C150 790, 260 825, 250 850"
              stroke="#FB7185"
              strokeWidth="2.5"
              fill="none"
            />

            {/* Silhouette Houseboat (Kettuvallam) */}
            <g className={`transition-opacity duration-500 ${stage === 1 ? 'opacity-95' : 'opacity-25'}`}>
              <path d="M125 600 L245 600 L230 614 L140 614 Z" fill="#1F1224" />
              <path d="M150 600 C155 584, 215 584, 220 600 Z" fill="#3B213D" />
              <circle cx="185" cy="596" r="2.5" fill="#FDE047" />
            </g>

            {/* Palm Fronds Silhouette on Left Bank */}
            <g fill="#190E1E" opacity="0.85">
              <path d="M22 640 Q32 560 46 510 L51 510 Q38 560 30 640 Z" />
              <path d="M48 512 Q80 495 102 518 Q75 512 48 515 Z" />
              <path d="M48 512 Q20 488 2 508 Q25 506 48 514 Z" />
              <path d="M48 512 Q75 520 92 542 Q68 528 48 516 Z" />
            </g>

            {/* Stage 2 Golden S-Curve Energy Ribbon in Sky */}
            <path
              d="M110 130 C295 160, 295 270, 115 310 C-20 340, 320 420, 125 490 C25 530, 290 560, 200 620"
              stroke="url(#skyTrail)"
              strokeWidth="3.5"
              strokeDasharray="8 6"
              fill="none"
              className={`transition-opacity duration-500 ${stage === 2 ? 'opacity-90' : 'opacity-0'}`}
            />

            {/* Stage 3 Vortex Inward Light Rays */}
            {stage === 3 && (
              <g opacity="0.75" className="animate-pulse">
                <line x1="200" y1="360" x2="60" y2="120" stroke="url(#streakGrad)" strokeWidth="2.5" />
                <line x1="200" y1="360" x2="340" y2="140" stroke="url(#streakGrad)" strokeWidth="2.5" />
                <line x1="200" y1="360" x2="40" y2="280" stroke="url(#streakGrad)" strokeWidth="2.5" />
                <line x1="200" y1="360" x2="360" y2="300" stroke="url(#streakGrad)" strokeWidth="2.5" />
                <line x1="200" y1="360" x2="70" y2="440" stroke="url(#streakGrad)" strokeWidth="2.5" />
                <line x1="200" y1="360" x2="330" y2="460" stroke="url(#streakGrad)" strokeWidth="2.5" />
                <line x1="200" y1="360" x2="200" y2="540" stroke="url(#streakGrad)" strokeWidth="3" />
              </g>
            )}
          </svg>

          {/* 2. STAGE 3 CONVERGENCE SPEED LINES & RADIANT SHOCKWAVE */}
          <div
            className={`absolute inset-0 flex items-center justify-center pointer-events-none transition-opacity duration-300 ${
              stage === 3 || stage === 4 ? 'opacity-100' : 'opacity-0'
            }`}
          >
            {/* Radial Burst Glow */}
            <div
              className={`rounded-full bg-gradient-to-r from-amber-200/80 via-rose-300/60 to-purple-400/50 blur-2xl transition-all duration-500 ${
                stage === 3 ? 'w-44 h-44 scale-95' : stage === 4 ? 'w-80 h-80 scale-125' : 'w-10 h-10 scale-0'
              }`}
            />
            {/* Stage 4 Halo Rings */}
            <div
              className={`absolute rounded-full border-2 border-amber-100/70 shadow-[0_0_50px_rgba(254,240,138,0.8)] transition-all duration-700 ease-out ${
                stage === 4 ? 'w-72 h-72 opacity-90 scale-100' : 'w-20 h-20 opacity-0 scale-50'
              }`}
            />
            <div
              className={`absolute rounded-full border border-white/40 transition-all duration-1000 ease-out ${
                stage === 4 ? 'w-88 h-88 opacity-60 scale-105' : 'w-20 h-20 opacity-0 scale-50'
              }`}
            />
          </div>

          {/* 3. FLOATING 3D FEATURE BUBBLES (STAGE 2 POP IN -> STAGE 3 CONVERGE INTO CENTER) */}
          <div className="absolute inset-0 pointer-events-none z-20">
            {FEATURE_NODES.map((node) => {
              let transformClasses = 'opacity-0 scale-50';
              if (stage === 2) {
                transformClasses = `opacity-100 scale-100 ${node.rotate}`;
              } else if (stage === 3) {
                // Radial Vortex acceleration & spiral inward with motion blur
                transformClasses = 'opacity-80 scale-35 blur-[1.5px] !left-1/2 !top-[42%] !-translate-x-1/2 !-translate-y-1/2';
              } else if (stage >= 4) {
                transformClasses = 'opacity-0 scale-0 !left-1/2 !top-[42%] !-translate-x-1/2 !-translate-y-1/2';
              }

              return (
                <div
                  key={node.id}
                  style={{ transitionDelay: stage === 2 ? node.delay : '0ms' }}
                  className={`absolute ${node.x} ${node.y} flex flex-col items-center transition-all duration-500 ease-[cubic-bezier(0.34,1.56,0.64,1)] ${transformClasses}`}
                >
                  {/* Glowing 3D Glass Orb */}
                  <div className="relative p-2.5 rounded-full bg-white/25 backdrop-blur-md border border-white/60 shadow-[0_10px_30px_rgba(244,63,94,0.35)]">
                    <div className="absolute inset-0 rounded-full bg-gradient-to-tr from-rose-400/20 to-amber-200/30 animate-pulse" />
                    <div className="relative z-10">{node.svg}</div>
                  </div>
                  {/* Frosted Pill Label */}
                  <span className="-mt-2 px-3 py-1 rounded-full bg-white/95 text-slate-900 font-bold text-[11px] tracking-tight shadow-md border border-rose-100 whitespace-nowrap">
                    {node.label}
                  </span>
                </div>
              );
            })}
          </div>

          {/* 4. CENTER MAARGAM LOGO & TAGLINE */}
          <div className="relative z-30 flex-1 flex flex-col items-center justify-center px-6 text-center">
            <div
              className={`flex flex-col items-center transition-all duration-500 ${
                stage === 2
                  ? 'opacity-15 scale-75 blur-[2px]'
                  : stage === 3
                  ? 'opacity-100 scale-95'
                  : 'opacity-100 scale-100'
              }`}
            >
              {/* White Soft Backlight Behind Logo */}
              <div className="relative flex items-center justify-center">
                <div
                  className={`absolute rounded-full bg-white/75 blur-2xl transition-all duration-500 ${
                    stage === 4 ? 'w-44 h-44' : 'w-32 h-32'
                  }`}
                />
                <MaargamLogoSVG
                  className={`relative z-10 transition-transform duration-500 ${
                    stage === 4 ? 'w-28 h-28 scale-110' : 'w-24 h-24'
                  }`}
                />
              </div>

              <h1 className="mt-2 text-4xl font-extrabold tracking-tight text-slate-950 drop-shadow-[0_2px_12px_rgba(255,255,255,0.9)]">
                Maargam
              </h1>
              <p className="mt-1.5 text-sm font-semibold text-slate-800 max-w-[220px] leading-snug drop-shadow-[0_1px_8px_rgba(255,255,255,0.9)]">
                Shared journeys.
                <br />
                Meaningful life partners.
              </p>
            </div>
          </div>

          {/* 5. SPLASH FOOTER (Stage 1 Progress Bar -> Stage 4 Pillars) */}
          <div className="relative z-30 pb-10 px-8 text-center">
            {stage <= 2 ? (
              <div className="flex flex-col items-center">
                <div className="w-44 h-1.5 rounded-full bg-white/25 overflow-hidden backdrop-blur-xs">
                  <div
                    className={`h-full rounded-full bg-gradient-to-r from-blue-400 via-purple-400 to-rose-400 transition-all duration-1000 ease-out ${
                      stage === 1 ? 'w-1/2' : 'w-full'
                    }`}
                  />
                </div>
                <p className="mt-2.5 text-xs font-medium text-amber-50/90 tracking-tight">
                  Building meaningful connections...
                </p>
              </div>
            ) : (
              <div className="flex flex-col items-center animate-fade-in">
                <div className="flex items-center gap-1.5 mb-2">
                  <span className="w-2 h-2 rounded-full bg-white" />
                  <span className="w-1.5 h-1.5 rounded-full bg-white/50" />
                  <span className="w-1.5 h-1.5 rounded-full bg-white/50" />
                </div>
                <p className="text-xs font-semibold tracking-wide text-white/95 drop-shadow">
                  People • Interests • Journeys • Forever
                </p>
              </div>
            )}
          </div>
        </div>

        {/* =========================================================
            STAGE 5: REDESIGNED MAARGAM HOME & DISCOVERY INTERFACE
            (Revealed seamlessly as the splash zooms out)
           ========================================================= */}
        <div
          className={`relative z-10 w-full h-full flex flex-col justify-between bg-[#FAF9F6] text-slate-900 transition-all duration-700 ${
            stage === 5 ? 'opacity-100 scale-100' : 'opacity-0 scale-95'
          }`}
        >
          {/* TOP HEADER BAR */}
          <header className="px-5 pt-5 pb-2 flex items-center justify-between bg-white/80 backdrop-blur-md border-b border-slate-100">
            <div className="flex items-center gap-2.5">
              <MaargamLogoSVG className="w-10 h-10" />
              <div>
                <h2 className="text-lg font-extrabold tracking-tight text-slate-900 leading-none">
                  Maargam
                </h2>
                <p className="text-[11px] font-medium text-slate-500 mt-0.5">
                  Shared journeys. Meaningful connections.
                </p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <button
                type="button"
                aria-label="Search"
                className="w-9 h-9 rounded-full bg-slate-100 hover:bg-slate-200/70 flex items-center justify-center text-slate-700 transition active:scale-95 cursor-pointer"
              >
                <Search className="w-4 h-4" />
              </button>
              <button
                type="button"
                aria-label="Filters"
                className="w-9 h-9 rounded-full bg-slate-100 hover:bg-slate-200/70 flex items-center justify-center text-slate-700 transition active:scale-95 cursor-pointer"
              >
                <SlidersHorizontal className="w-4 h-4" />
              </button>
            </div>
          </header>

          {/* SCROLLABLE BODY */}
          <div className="flex-1 overflow-y-auto px-5 py-3 space-y-4 no-scrollbar">
            {/* 5 TACTILE CATEGORY CARDS */}
            <div className="grid grid-cols-5 gap-2">
              {[
                { id: 'business', label: 'Business', bg: 'bg-amber-50', activeRing: 'ring-amber-400', icon: '☕' },
                { id: 'travel', label: 'Travel', bg: 'bg-blue-50', activeRing: 'ring-blue-400', icon: '✈️' },
                { id: 'lifestyle', label: 'Lifestyle', bg: 'bg-emerald-50', activeRing: 'ring-emerald-400', icon: '🌿' },
                { id: 'fitness', label: 'Fitness', bg: 'bg-rose-50', activeRing: 'ring-rose-400', icon: '🏋️' },
                { id: 'food', label: 'Food', bg: 'bg-orange-50', activeRing: 'ring-orange-400', icon: '🍴' },
              ].map((cat) => {
                const isSelected = activeCategory === cat.id;
                return (
                  <button
                    key={cat.id}
                    type="button"
                    onClick={() => {
                      setActiveCategory(cat.id);
                      triggerHaptic(10);
                    }}
                    className={`flex flex-col items-center py-2.5 px-1 rounded-2xl transition-all cursor-pointer ${
                      cat.bg
                    } ${
                      isSelected
                        ? `ring-2 ${cat.activeRing} shadow-sm scale-[1.03]`
                        : 'opacity-80 hover:opacity-100'
                    }`}
                  >
                    <span className="text-lg mb-1">{cat.icon}</span>
                    <span className="text-[11px] font-bold text-slate-700 tracking-tight">
                      {cat.label}
                    </span>
                  </button>
                );
              })}
            </div>

            {/* TODAY'S MATCHES HEADER */}
            <div className="flex items-center justify-between pt-1">
              <h3 className="text-base font-extrabold tracking-tight text-slate-900">
                Today&apos;s Matches
              </h3>
              <button type="button" className="text-xs font-bold text-blue-600 hover:text-blue-700 cursor-pointer">
                See All &gt;
              </button>
            </div>

            {/* FEATURED PROFILE CARD (Ananya, 27 - Kochi area) */}
            <div className="bg-white rounded-[28px] overflow-hidden shadow-xl shadow-slate-900/6 border border-slate-100">
              {/* Profile Photo Area */}
              <div className="relative h-64 w-full overflow-hidden">
                <img
                  src="https://images.unsplash.com/photo-1614283233556-f35b0c801ef1?auto=format&fit=crop&w=900&q=85"
                  alt="Ananya"
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-black/10" />

                {/* Top Left Compatibility Pill */}
                <div className="absolute top-3.5 left-3.5 flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white/95 backdrop-blur-md shadow-md">
                  <div className="w-5 h-5 rounded-full bg-rose-500 flex items-center justify-center">
                    <Heart className="w-3 h-3 text-white fill-white" />
                  </div>
                  <div className="leading-none">
                    <span className="text-xs font-extrabold text-slate-900">92% </span>
                    <span className="text-[10px] font-semibold text-slate-600 block">
                      Compatible
                    </span>
                  </div>
                </div>

                {/* Bottom Right Photo Counter */}
                <div className="absolute bottom-3 right-3 px-2.5 py-1 rounded-full bg-black/60 backdrop-blur-xs text-white text-[11px] font-bold">
                  1/6
                </div>
              </div>

              {/* Profile Details */}
              <div className="p-4">
                <div className="flex items-center gap-1.5">
                  <h4 className="text-xl font-extrabold text-slate-900">Ananya, 27</h4>
                  <CheckCircle2 className="w-5 h-5 text-blue-500 fill-blue-500/15" />
                </div>

                <div className="flex flex-wrap items-center gap-3 text-xs font-medium text-slate-500 mt-1">
                  <span className="flex items-center gap-1">
                    <Briefcase className="w-3.5 h-3.5 text-slate-400" />
                    Marketing Professional
                  </span>
                  <span className="flex items-center gap-1">
                    <MapPin className="w-3.5 h-3.5 text-slate-400" />
                    Kochi area
                  </span>
                </div>

                <p className="text-xs text-slate-600 mt-2.5 leading-relaxed">
                  Dreaming of a cozy café, travel and meaningful conversations.
                </p>

                {/* Shared Interest Pills */}
                <div className="flex flex-wrap items-center gap-1.5 mt-3">
                  <span className="px-2.5 py-1 rounded-full bg-amber-50 text-amber-800 font-bold text-[11px] border border-amber-200/60">
                    ☕ Café Business
                  </span>
                  <span className="px-2.5 py-1 rounded-full bg-blue-50 text-blue-700 font-bold text-[11px] border border-blue-200/60">
                    ✈️ Travel
                  </span>
                  <span className="px-2.5 py-1 rounded-full bg-purple-50 text-purple-700 font-bold text-[11px] border border-purple-200/60">
                    📷 Photography
                  </span>
                </div>

                {/* Floating Action Buttons (Undo, Pass, Like, SuperStar) */}
                <div className="flex items-center justify-center gap-4 mt-4 pt-2 border-t border-slate-100">
                  <button
                    type="button"
                    onClick={() => triggerHaptic(10)}
                    aria-label="Undo"
                    className="w-11 h-11 rounded-full bg-slate-100 hover:bg-slate-200 flex items-center justify-center text-slate-500 transition active:scale-90 cursor-pointer"
                  >
                    <RotateCcw className="w-4 h-4" />
                  </button>
                  <button
                    type="button"
                    onClick={() => triggerHaptic(15)}
                    aria-label="Pass"
                    className="w-12 h-12 rounded-full bg-rose-50 hover:bg-rose-100 flex items-center justify-center text-rose-500 transition active:scale-90 cursor-pointer"
                  >
                    <X className="w-5 h-5 stroke-[2.5]" />
                  </button>
                  <button
                    type="button"
                    onClick={() => triggerHaptic([30, 50, 60])}
                    aria-label="Show Interest"
                    className="w-14 h-14 rounded-full bg-gradient-to-tr from-rose-500 to-pink-500 shadow-lg shadow-rose-500/35 flex items-center justify-center text-white transition hover:scale-105 active:scale-95 cursor-pointer"
                  >
                    <Heart className="w-6 h-6 fill-white" />
                  </button>
                  <button
                    type="button"
                    onClick={() => triggerHaptic(20)}
                    aria-label="Super Like"
                    className="w-11 h-11 rounded-full bg-amber-50 hover:bg-amber-100 flex items-center justify-center text-amber-500 transition active:scale-90 cursor-pointer"
                  >
                    <Star className="w-5 h-5 fill-amber-400 text-amber-400" />
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* BOTTOM NAVIGATION BAR */}
          <nav className="px-6 py-2.5 bg-white border-t border-slate-100 flex items-center justify-between text-[11px] font-semibold text-slate-400">
            <button type="button" className="flex flex-col items-center gap-1 text-blue-600 cursor-pointer">
              <Home className="w-5 h-5" />
              <span>Home</span>
            </button>
            <button type="button" className="flex flex-col items-center gap-1 hover:text-slate-700 cursor-pointer">
              <Compass className="w-5 h-5" />
              <span>Margams</span>
            </button>
            <button type="button" className="flex flex-col items-center gap-1 hover:text-slate-700 cursor-pointer">
              <MapIcon className="w-5 h-5" />
              <span>Map</span>
            </button>
            <button type="button" className="relative flex flex-col items-center gap-1 hover:text-slate-700 cursor-pointer">
              <span className="absolute top-0 right-1.5 w-2 h-2 rounded-full bg-rose-500" />
              <MessageCircle className="w-5 h-5" />
              <span>Chat</span>
            </button>
            <button type="button" className="flex flex-col items-center gap-1 hover:text-slate-700 cursor-pointer">
              <User className="w-5 h-5" />
              <span>Profile</span>
            </button>
          </nav>
        </div>
      </div>
    </div>
  );
}
