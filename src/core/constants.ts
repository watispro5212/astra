/**
 * ASTRA GLOBAL CONSTANTS
 */

export const THEME = {
    PRIMARY: 0x00FFD1,   // Astra Cyan
    SECONDARY: 0xB5179E, // Astra Magenta
    ACCENT: 0xF72585,    // Astra Pink
    SUCCESS: 0x06D6A0,   // Astra Green
    WARNING: 0xFF9F1C,   // Astra Orange
    DANGER: 0xFF0054,    // Astra Red
    INFO: 0x4361EE       // Astra Blue
};
export const VERSION  = 'v9.0.0';
export const CODENAME = 'Nova';
export const PROTOCOL = 'Nova';

/** Consistent embed footer for any category */
export function footerText(category: string): string {
    return `Astra ${VERSION} ${CODENAME} • ${category}`;
}
