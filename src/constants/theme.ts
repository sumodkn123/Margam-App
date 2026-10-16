// MARGAM - Design System & Theme Tokens
// Theme: Warm Editorial Light Canvas & Kerala Rose Gold (Journey + Technology + Human Connection)
// Follows the Margam Product Blueprint: Clean white & warm alabaster canvas, refined rose accents,
// restrained purple/blue details, high-contrast readable typography, and tactile glassmorphic depth.

export const COLORS = {
  // Backgrounds & Canvas
  background: '#FAF9F6',        // Warm Alabaster Canvas
  canvas: '#FAF9F6',            // Warm Alabaster Baseline
  surface: '#FFFFFF',           // Crisp Pure White Card Surface
  surfaceLight: '#F8FAFC',      // Soft Slate Inset Container
  surfaceHover: '#F1F5F9',      // Active / Pressed State
  
  // Brand Pathway Accents & Matrimonial Rose
  primary: '#E11D48',           // Margam Kerala Sunset Rose Primary
  primaryLight: '#FB7185',      // Light Rose Highlight
  primaryDark: '#BE123C',       // Deep Rose / Crimson
  primaryMuted: 'rgba(225, 29, 72, 0.08)',
  primarySubtle: '#FFF1F2',     // Rose 50 Soft Tint
  heartRed: '#E11D48',          // Love Heart Rose
  loveCrimson: '#9F1239',       // Deep Love Crimson

  // Secondary Accents & Radiant Tones
  indigo: '#4F46E5',            // Radiant Indigo Focus
  indigoLight: '#EEF2FF',       // Indigo 50 Soft Tint
  amber: '#D97706',             // Warm Terracotta Gold
  amberLight: '#FEF3C7',        // Amber 50 Soft Tint

  // Cartography & Routing
  routeCyan: '#0EA5E9',         // Route Polyline (Sky 500)
  routeAmber: '#F59E0B',        // Active Detour / Match Corridor
  routeGlow: 'rgba(14, 165, 233, 0.20)',

  // Privacy Level Coding
  privacyPrivate: '#64748B',    // 🔒 Private (Muted Slate)
  privacyRequest: '#0EA5E9',    // 👤 Request Only (Sky)
  privacyAccepted: '#10B981',   // 🤝 Accepted Only (Emerald)
  privacyPublic: '#0F172A',     // 🌐 Public (High Contrast Slate)

  // System Feedback
  success: '#10B981',
  successMuted: 'rgba(16, 185, 129, 0.12)',
  warning: '#F59E0B',
  warningMuted: 'rgba(245, 158, 11, 0.12)',
  error: '#E11D48',
  errorMuted: 'rgba(225, 29, 72, 0.12)',

  // Typography (Dark High-Contrast for Light Backgrounds)
  textPrimary: '#0F172A',       // Slate 900 (High-Contrast Header & Body)
  textSecondary: '#334155',     // Slate 700 (Readable Content)
  textMuted: '#64748B',         // Slate 500 (Subtitles & Meta)
  textSubtle: '#94A3B8',        // Slate 400 (Captions & Placeholders)
  textInverse: '#FFFFFF',       // Pure White (On Primary Buttons)

  // Borders & Dividers
  border: '#E2E8F0',            // Slate 200 Crisp 1px Border
  borderSubtle: '#F1F5F9',      // Slate 100 Soft Section Divider
  borderActive: 'rgba(225, 29, 72, 0.35)', // Active Rose Focus Ring
  borderHighlight: 'rgba(79, 70, 229, 0.35)', // Indigo Focus
  
  // Overlays & Glassmorphism
  glassBackdrop: 'rgba(255, 255, 255, 0.88)',
  mapOverlay: 'rgba(255, 255, 255, 0.94)',
  modalScrim: 'rgba(15, 23, 42, 0.50)',
};

export const SPACING = {
  xs: 4,
  sm: 8,
  md: 12,
  lg: 16,
  xl: 20,
  xxl: 24,
  xxxl: 32,
};

export const RADIUS = {
  sm: 8,
  md: 12,
  lg: 18,
  xl: 24,
  full: 9999,
};

export const SHADOWS = {
  subtle: {
    shadowColor: '#0F172A',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 3,
    elevation: 2,
  },
  card: {
    shadowColor: '#0F172A',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 4,
  },
  floating: {
    shadowColor: '#0F172A',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.12,
    shadowRadius: 20,
    elevation: 8,
  },
};

export const TYPOGRAPHY = {
  brandTitle: {
    fontSize: 24,
    fontWeight: '800' as const,
    letterSpacing: -0.5,
    color: COLORS.textPrimary,
  },
  tagline: {
    fontSize: 12,
    fontWeight: '600' as const,
    letterSpacing: 1.2,
    color: COLORS.primary,
    textTransform: 'uppercase' as const,
  },
  heading1: {
    fontSize: 22,
    fontWeight: '700' as const,
    color: COLORS.textPrimary,
    letterSpacing: -0.4,
  },
  heading2: {
    fontSize: 18,
    fontWeight: '700' as const,
    color: COLORS.textPrimary,
    letterSpacing: -0.2,
  },
  heading3: {
    fontSize: 15,
    fontWeight: '600' as const,
    color: COLORS.textPrimary,
  },
  body: {
    fontSize: 14,
    color: COLORS.textSecondary,
    lineHeight: 20,
  },
  bodyBold: {
    fontSize: 14,
    fontWeight: '600' as const,
    color: COLORS.textPrimary,
  },
  caption: {
    fontSize: 12,
    color: COLORS.textMuted,
    lineHeight: 16,
  },
  chipText: {
    fontSize: 12,
    fontWeight: '600' as const,
  },
};

export const THEME = {
  colors: COLORS,
  spacing: SPACING,
  radius: RADIUS,
  shadows: SHADOWS,
  typography: TYPOGRAPHY,
};
