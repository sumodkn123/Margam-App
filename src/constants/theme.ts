// MARGAM - Design System & Theme Tokens
// Theme: Obsidian Cartography & Terracotta Gold (Journey + Technology + Human Connection)

export const COLORS = {
  // Backgrounds
  background: '#0B0F14',        // Deep Obsidian Black
  surface: '#121820',           // Dark Slate Surface
  surfaceLight: '#1A232E',      // Card Container
  surfaceHover: '#232D3B',      // Active/Hover State
  
  // Brand Pathway Accents
  primary: '#E58B58',           // Margam Terracotta Gold
  primaryLight: '#F3A778',      // Pathway Highlight
  primaryDark: '#C86E3C',       // Deep Terracotta
  primaryMuted: 'rgba(229, 139, 88, 0.15)',

  // Cartography & Routing
  routeCyan: '#38BDF8',         // Route Polyline
  routeAmber: '#F59E0B',        // Active Detour / Match Corridor
  routeGlow: 'rgba(56, 189, 248, 0.25)',

  // Privacy Level Coding
  privacyPrivate: '#94A3B8',    // 🔒 Private (Muted Slate)
  privacyRequest: '#38BDF8',    // 👤 Request Only (Cyan)
  privacyAccepted: '#34D399',   // 🤝 Accepted Only (Emerald)
  privacyPublic: '#F8FAFC',     // 🌐 Public (White)

  // System Feedback
  success: '#10B981',
  successMuted: 'rgba(16, 185, 129, 0.15)',
  warning: '#F59E0B',
  error: '#EF4444',
  errorMuted: 'rgba(239, 68, 68, 0.15)',

  // Typography
  textPrimary: '#F8FAFC',
  textSecondary: '#94A3B8',
  textMuted: '#64748B',
  textInverse: '#0B0F14',

  // Borders & Dividers
  borderSubtle: 'rgba(255, 255, 255, 0.08)',
  borderActive: 'rgba(229, 139, 88, 0.4)',
  borderHighlight: 'rgba(56, 189, 248, 0.4)',
  
  // Overlays
  glassBackdrop: 'rgba(11, 15, 20, 0.88)',
  mapOverlay: 'rgba(11, 15, 20, 0.65)',
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
  sm: 6,
  md: 10,
  lg: 16,
  xl: 22,
  full: 9999,
};

export const TYPOGRAPHY = {
  brandTitle: {
    fontSize: 24,
    fontWeight: '800' as const,
    letterSpacing: 2,
    color: COLORS.textPrimary,
  },
  tagline: {
    fontSize: 12,
    fontWeight: '600' as const,
    letterSpacing: 1.5,
    color: COLORS.primary,
    textTransform: 'uppercase' as const,
  },
  heading1: {
    fontSize: 22,
    fontWeight: '700' as const,
    color: COLORS.textPrimary,
    letterSpacing: -0.3,
  },
  heading2: {
    fontSize: 18,
    fontWeight: '700' as const,
    color: COLORS.textPrimary,
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
