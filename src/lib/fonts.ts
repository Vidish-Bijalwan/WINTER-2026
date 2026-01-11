// Typography system for TopoShape Insights
// Professional font stack with Inter Variable

export const fonts = {
    // Primary UI font - Inter Variable
    primary: "'Inter Variable', 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif",

    // Monospace for code and data
    mono: "'JetBrains Mono', 'Fira Code', 'Consolas', 'Monaco', monospace",

    // System fallback
    system: "-apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', 'Helvetica Neue', sans-serif",
};

export const fontWeights = {
    normal: 400,
    medium: 500,
    semibold: 600,
    bold: 700,
} as const;

export const fontSizes = {
    xs: '0.75rem',     // 12px
    sm: '0.875rem',    // 14px
    base: '1rem',      // 16px
    lg: '1.125rem',    // 18px
    xl: '1.25rem',     // 20px
    '2xl': '1.5rem',   // 24px
    '3xl': '1.875rem', // 30px
    '4xl': '2.25rem',  // 36px
    '5xl': '3rem',     // 48px
    '6xl': '3.75rem',  // 60px
} as const;

export const lineHeights = {
    none: 1,
    tight: 1.25,
    snug: 1.375,
    normal: 1.5,
    relaxed: 1.625,
    loose: 2,
} as const;

export const letterSpacing = {
    tighter: '-0.05em',
    tight: '-0.025em',
    normal: '0',
    wide: '0.025em',
    wider: '0.05em',
    widest: '0.1em',
} as const;

// Preset typography styles
export const textStyles = {
    // Display headings
    displayLarge: {
        fontFamily: fonts.primary,
        fontSize: fontSizes['6xl'],
        fontWeight: fontWeights.bold,
        lineHeight: lineHeights.tight,
        letterSpacing: letterSpacing.tighter,
    },
    displayMedium: {
        fontFamily: fonts.primary,
        fontSize: fontSizes['5xl'],
        fontWeight: fontWeights.bold,
        lineHeight: lineHeights.tight,
        letterSpacing: letterSpacing.tight,
    },

    // Headings
    h1: {
        fontFamily: fonts.primary,
        fontSize: fontSizes['4xl'],
        fontWeight: fontWeights.bold,
        lineHeight: lineHeights.tight,
    },
    h2: {
        fontFamily: fonts.primary,
        fontSize: fontSizes['3xl'],
        fontWeight: fontWeights.semibold,
        lineHeight: lineHeights.snug,
    },
    h3: {
        fontFamily: fonts.primary,
        fontSize: fontSizes['2xl'],
        fontWeight: fontWeights.semibold,
        lineHeight: lineHeights.snug,
    },
    h4: {
        fontFamily: fonts.primary,
        fontSize: fontSizes.xl,
        fontWeight: fontWeights.semibold,
        lineHeight: lineHeights.normal,
    },

    // Body text
    bodyLarge: {
        fontFamily: fonts.primary,
        fontSize: fontSizes.lg,
        fontWeight: fontWeights.normal,
        lineHeight: lineHeights.relaxed,
    },
    body: {
        fontFamily: fonts.primary,
        fontSize: fontSizes.base,
        fontWeight: fontWeights.normal,
        lineHeight: lineHeights.normal,
    },
    bodySmall: {
        fontFamily: fonts.primary,
        fontSize: fontSizes.sm,
        fontWeight: fontWeights.normal,
        lineHeight: lineHeights.normal,
    },

    // Labels and captions
    label: {
        fontFamily: fonts.primary,
        fontSize: fontSizes.sm,
        fontWeight: fontWeights.medium,
        lineHeight: lineHeights.normal,
        letterSpacing: letterSpacing.wide,
    },
    caption: {
        fontFamily: fonts.primary,
        fontSize: fontSizes.xs,
        fontWeight: fontWeights.normal,
        lineHeight: lineHeights.normal,
    },

    // Monospace for data
    code: {
        fontFamily: fonts.mono,
        fontSize: fontSizes.sm,
        fontWeight: fontWeights.normal,
        lineHeight: lineHeights.normal,
    },

    // Metrics and numbers
    metric: {
        fontFamily: fonts.mono,
        fontSize: fontSizes['3xl'],
        fontWeight: fontWeights.bold,
        lineHeight: lineHeights.none,
        letterSpacing: letterSpacing.tight,
    },
} as const;

// Helper function to apply text styles
export function applyTextStyle(styleName: keyof typeof textStyles): string {
    const style = textStyles[styleName];
    return Object.entries(style)
        .map(([key, value]) => {
            const cssKey = key.replace(/([A-Z])/g, '-$1').toLowerCase();
            return `${cssKey}: ${value}`;
        })
        .join('; ');
}
