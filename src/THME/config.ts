import plugin from "tailwindcss/plugin";

// ⚠️ مسیرها را متناسب با ساختار پروژه‌ات اصلاح کن
import { colors } from "./RTHM_colorPalet_V00.04/index";
import { themeColors } from "./RTHM_colorState_V00.04";

type ThemeName = keyof typeof themeColors; // "popcorn" | "nightwish"
type SemanticRole = keyof (typeof themeColors)[ThemeName]; // "primary" | "secondary" | ...

const themeNames = Object.keys(themeColors) as ThemeName[];
const roles = Object.keys(themeColors[themeNames[0]]) as SemanticRole[];

/**
 * برای هر تم یک آبجکت از CSS variable ها می‌سازد:
 * --color-primary-bg, --color-primary-hover-bg, ...
 */
function buildThemeVars(themeName: ThemeName): Record<string, string> {
  const vars: Record<string, string> = {};

  roles.forEach((role) => {
    const sc = themeColors[themeName][role];

    vars[`--color-${role}-bg`] = sc.background;
    vars[`--color-${role}-text`] = sc.text;
    vars[`--color-${role}-border`] = sc.border;

    vars[`--color-${role}-hover-bg`] = sc.hover.background;
    vars[`--color-${role}-hover-text`] = sc.hover.text;
    vars[`--color-${role}-hover-border`] = sc.hover.border;

    vars[`--color-${role}-active-bg`] = sc.active.background;
    vars[`--color-${role}-active-text`] = sc.active.text;
    vars[`--color-${role}-active-border`] = sc.active.border;

    vars[`--color-${role}-focus-ring`] = sc.focus.ring;

    vars[`--color-${role}-selected-bg`] = sc.selected.background;
    vars[`--color-${role}-selected-text`] = sc.selected.text;
    vars[`--color-${role}-selected-border`] = sc.selected.border;

    vars[`--color-${role}-disabled-bg`] = sc.disabled.background;
    vars[`--color-${role}-disabled-text`] = sc.disabled.text;
    vars[`--color-${role}-disabled-border`] = sc.disabled.border;

    vars[`--color-${role}-placeholder`] = sc.placeholder;
    vars[`--color-${role}-visited`] = sc.visited;
  });

  return vars;
}

/**
 * برای theme.extend.colors: هر role به یک آبجکت رنگ با کلیدهای
 * DEFAULT / text / border / hover / active / selected / disabled / ring / visited / placeholder
 * تبدیل می‌شود که همگی به CSS variable اشاره دارند.
 */
function buildTailwindColorTokens() {
  const roleColors: Record<string, Record<string, string>> = {};

  roles.forEach((role) => {
    roleColors[role] = {
      DEFAULT: `var(--color-${role}-bg)`,
      text: `var(--color-${role}-text)`,
      border: `var(--color-${role}-border)`,
      "hover-bg": `var(--color-${role}-hover-bg)`,
      "hover-text": `var(--color-${role}-hover-text)`,
      "hover-border": `var(--color-${role}-hover-border)`,
      "active-bg": `var(--color-${role}-active-bg)`,
      "active-text": `var(--color-${role}-active-text)`,
      "active-border": `var(--color-${role}-active-border)`,
      ring: `var(--color-${role}-focus-ring)`,
      "selected-bg": `var(--color-${role}-selected-bg)`,
      "selected-text": `var(--color-${role}-selected-text)`,
      "selected-border": `var(--color-${role}-selected-border)`,
      "disabled-bg": `var(--color-${role}-disabled-bg)`,
      "disabled-text": `var(--color-${role}-disabled-text)`,
      "disabled-border": `var(--color-${role}-disabled-border)`,
      placeholder: `var(--color-${role}-placeholder)`,
      visited: `var(--color-${role}-visited)`,
    };
  });

  return roleColors;
}

export const rthmThemePlugin = plugin(
  function ({ addBase }) {
    const defaultTheme = themeNames[0]; // "popcorn" به‌عنوان تم پیش‌فرض روی :root

    addBase({
      ":root": buildThemeVars(defaultTheme),
      ...Object.fromEntries(
        themeNames.map((name) => [
          `[data-theme="${name}"]`,
          buildThemeVars(name),
        ])
      ),
    });
  },
  {
    theme: {
      extend: {
        colors: {
          // پالت خام (gray, red, blue, violet, ...)
          ...colors,
          // توکن‌های معنایی که به CSS variable وصل‌اند (با تغییر data-theme عوض می‌شوند)
          ...buildTailwindColorTokens(),
        },
      },
    },
  }
);

export default rthmThemePlugin;
