import { STORE_CONFIG } from './config';

/**
 * Publica los colores de config.ts como variables CSS en :root para usarlas
 * desde Tailwind, p. ej. `bg-(--shop-accent)`, `text-(--shop-text)` o
 * `border-(--shop-text)/10`. Se ejecuta al cargar el módulo (antes del primer
 * render), así que no hay parpadeo de colores.
 */
const { colors, ui } = STORE_CONFIG.theme;

const shopThemeVars: Record<string, string> = {
  '--shop-primary': colors.primary,
  '--shop-accent': colors.accent,
  '--shop-bg': colors.background,
  '--shop-text': colors.text,
  '--shop-radius': ui.borderRadius || '12px',
  '--shop-font': (ui as { fontFamily?: string }).fontFamily || "'Inter', sans-serif",
};

if (typeof document !== 'undefined') {
  const root = document.documentElement;
  Object.entries(shopThemeVars).forEach(([name, value]) => root.style.setProperty(name, value));
}

export { shopThemeVars };
