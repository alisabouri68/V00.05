import { colors } from '../RTHM_colorPalet_V00.04/index.ts'
export interface SemanticState {
  background: string
  text: string
  border: string
}

export interface SemanticColor {
  background: string
  text: string
  border: string
  hover: SemanticState
  active: SemanticState
  focus: {
    ring: string
  }
  selected: SemanticState
  disabled: SemanticState
  placeholder: string
  visited: string
}

export type SemanticRole =
  | 'primary'
  | 'secondary'
  | 'info'
  | 'danger'
  | 'warning'
  | 'success'
  | 'neutral'

export type ThemeName = 'popcorn' | 'nightwish'

export type ThemeColors = Record<SemanticRole, SemanticColor>

export const themeColors: Record<ThemeName, ThemeColors> = {
  popcorn: {
    primary: {
      background: colors.cyan[600],
      text: colors.cyan[600],
      border: colors.cyan[600],
      hover: {
        background: colors.cyan[500],
        text: colors.base.white,
        border: colors.cyan[400]
      },
      active: {
        background: colors.cyan[300],
        text: colors.base.white,
        border: colors.cyan[200]
      },
      focus: {
        ring: colors.cyan[200]
      },
      selected: {
        background: colors.cyan[200],
        text: colors.cyan[900],
        border: colors.cyan[300]
      },
      disabled: {
        background: colors.gray[200],
        text: colors.gray[400],
        border: colors.gray[300]
      },
      placeholder: colors.gray[400],
      visited: colors.cyan[300]
    },

    secondary: {
      background: colors.violet[400], // #A78BFA
      text: colors.gray[800],
      border: colors.violet[600], // #7C3AED
      hover: {
        background: colors.violet[500], // #8B5CF6
        text: colors.base.white,
        border: colors.violet[400]
      },
      active: {
        background: colors.violet[300], // #C4B5FD
        text: colors.gray[800],
        border: colors.violet[200] // #DDD6FE
      },
      focus: {
        ring: colors.violet[200]
      },
      selected: {
        background: colors.violet[200],
        text: colors.violet[900], // #4C1D95
        border: colors.violet[300]
      },
      disabled: {
        background: colors.gray[200],
        text: colors.gray[400],
        border: colors.gray[300]
      },
      placeholder: colors.gray[400],
      visited: colors.violet[300]
    },

    info: {
      background: colors.light_blue[400],
      text: colors.slate[900],
      border: colors.light_blue[600],

      hover: {
        background: colors.light_blue[600],
        text: colors.base.white,
        border: colors.light_blue[500]
      },

      active: {
        background: colors.light_blue[300],
        text: colors.slate[900],
        border: colors.light_blue[200]
      },

      focus: {
        ring: colors.light_blue[200]
      },

      selected: {
        background: colors.light_blue[200],
        text: colors.light_blue[900],
        border: colors.light_blue[300]
      },

      disabled: {
        background: colors.gray[200],
        text: colors.gray[400],
        border: colors.gray[300]
      },

      placeholder: colors.gray[400],
      visited: colors.violet[500]
    },

    danger: {
      background: colors.red[400],
      text: colors.gray[800],
      border: colors.red[600],
      hover: {
        background: colors.red[500],
        text: colors.base.white,
        border: colors.red[400]
      },
      active: {
        background: colors.red[300],
        text: colors.gray[800],
        border: colors.red[200]
      },
      focus: {
        ring: colors.red[200]
      },
      selected: {
        background: colors.red[200],
        text: colors.red[900],
        border: colors.red[300]
      },
      disabled: {
        background: colors.gray[200],
        text: colors.gray[400],
        border: colors.gray[300]
      },
      placeholder: colors.gray[400],
      visited: colors.red[300]
    },

    warning: {
      background: colors.amber[400],
      text: colors.gray[800],
      border: colors.amber[600],
      hover: {
        background: colors.amber[500],
        text: colors.base.white,
        border: colors.amber[400]
      },
      active: {
        background: colors.amber[300],
        text: colors.gray[800],
        border: colors.amber[200]
      },
      focus: {
        ring: colors.amber[200]
      },
      selected: {
        background: colors.amber[200],
        text: colors.amber[900],
        border: colors.amber[300]
      },
      disabled: {
        background: colors.gray[200],
        text: colors.gray[400],
        border: colors.gray[300]
      },
      placeholder: colors.gray[400],
      visited: colors.amber[300]
    },

    success: {
      background: colors.emerald[500],
      text: colors.base.white,
      border: colors.emerald[600],

      hover: {
        background: colors.emerald[600],
        text: colors.base.white,
        border: colors.emerald[700]
      },

      active: {
        background: colors.emerald[700],
        text: colors.base.white,
        border: colors.emerald[800]
      },

      focus: {
        ring: colors.emerald[300]
      },

      selected: {
        background: colors.emerald[100],
        text: colors.emerald[900],
        border: colors.emerald[300]
      },

      disabled: {
        background: colors.gray[100],
        text: colors.gray[400],
        border: colors.gray[200]
      },

      placeholder: colors.gray[400],
      visited: colors.emerald[700]
    },

    neutral: {
      background: colors.base.white,
      text: colors.gray[800],
      border: colors.gray[300],
      hover: {
        background: colors.gray[200],
        text: colors.gray[800],
        border: colors.gray[400]
      },
      active: {
        background: colors.gray[300],
        text: colors.gray[800],
        border: colors.gray[500]
      },
      focus: {
        ring: colors.gray[400]
      },
      selected: {
        background: colors.gray[400],
        text: colors.base.white,
        border: colors.gray[500]
      },
      disabled: {
        background: colors.gray[200],
        text: colors.gray[400],
        border: colors.gray[300]
      },
      placeholder: colors.gray[400],
      visited: colors.gray[500]
    }
  },

  nightwish: {
    primary: {
      background: colors.orange[500],
      text: colors.orange[50],
      border: colors.orange[500],

      hover: {
        background: colors.orange[700],
        text: colors.orange[50],
        border: colors.orange[600]
      },

      active: {
        background: colors.orange[600],
        text: colors.base.white,
        border: colors.orange[500]
      },

      focus: {
        ring: colors.orange[400]
      },

      selected: {
        background: colors.orange[500],
        text: colors.orange[900],
        border: colors.orange[400]
      },

      disabled: {
        background: colors.gray[800],
        text: colors.gray[500],
        border: colors.gray[700]
      },

      placeholder: colors.gray[500],

      visited: colors.orange[300]
    },

    secondary: {
      background: colors.purple[900], // #581C87
      text: colors.purple[100], // #F3E8FF
      border: colors.purple[600], // #9333EA
      hover: {
        background: colors.purple[800], // #6B21A8
        text: colors.purple[100],
        border: colors.purple[500] // #A855F7
      },
      active: {
        background: colors.purple[500],
        text: colors.base.white,
        border: colors.purple[300] // #D8B4FE
      },
      focus: {
        ring: colors.purple[300]
      },
      selected: {
        background: colors.purple[300],
        text: colors.purple[900],
        border: colors.purple[200] // #E9D5FF
      },
      disabled: {
        background: colors.gray[700],
        text: colors.gray[400],
        border: colors.gray[600]
      },
      placeholder: colors.gray[400],
      visited: colors.purple[200]
    },

    info: {
      background: colors.blue[900],
      text: colors.blue[100],
      border: colors.blue[700],

      hover: {
        background: colors.blue[800],
        text: colors.blue[100],
        border: colors.blue[600]
      },

      active: {
        background: colors.blue[700],
        text: colors.blue[50],
        border: colors.blue[500]
      },

      focus: {
        ring: colors.blue[400]
      },

      selected: {
        background: colors.blue[600],
        text: colors.blue[50],
        border: colors.blue[500]
      },

      disabled: {
        background: colors.gray[800],
        text: colors.gray[500],
        border: colors.gray[700]
      },

      placeholder: colors.gray[500],

      visited: colors.blue[300]
    },
    danger: {
      background: colors.red[900],
      text: colors.red[100],
      border: colors.red[600],
      hover: {
        background: colors.red[800],
        text: colors.red[100],
        border: colors.red[500]
      },
      active: {
        background: colors.red[500],
        text: colors.base.white,
        border: colors.red[300]
      },
      focus: {
        ring: colors.red[300]
      },
      selected: {
        background: colors.red[300],
        text: colors.red[900],
        border: colors.red[200]
      },
      disabled: {
        background: colors.gray[700],
        text: colors.gray[400],
        border: colors.gray[600]
      },
      placeholder: colors.gray[400],
      visited: colors.red[200]
    },

    warning: {
      background: colors.amber[900],
      text: colors.amber[100],
      border: colors.amber[600],
      hover: {
        background: colors.amber[800],
        text: colors.amber[100],
        border: colors.amber[500]
      },
      active: {
        background: colors.amber[500],
        text: colors.base.white,
        border: colors.amber[300]
      },
      focus: {
        ring: colors.amber[300]
      },
      selected: {
        background: colors.amber[300],
        text: colors.amber[900],
        border: colors.amber[200]
      },
      disabled: {
        background: colors.gray[700],
        text: colors.gray[400],
        border: colors.gray[600]
      },
      placeholder: colors.gray[400],
      visited: colors.amber[200]
    },

    success: {
  background: colors.emerald[600],
  text: colors.base.white,
  border: colors.emerald[500],

  hover: {
    background: colors.emerald[500],
    text: colors.base.white,
    border: colors.emerald[400],
  },

  active: {
    background: colors.emerald[700],
    text: colors.base.white,
    border: colors.emerald[600],
  },

  focus: {
    ring: colors.emerald[400],
  },

  selected: {
    background: colors.emerald[900],
    text: colors.emerald[100],
    border: colors.emerald[700],
  },

  disabled: {
    background: colors.gray[800],
    text: colors.gray[500],
    border: colors.gray[700],
  },

  placeholder: colors.gray[500],
  visited: colors.emerald[300],
},

    neutral: {
      background: colors.slate[800],
      text: colors.slate[100],
      border: colors.slate[600],
      hover: {
        background: colors.slate[700],
        text: colors.slate[100],
        border: colors.slate[500]
      },
      active: {
        background: colors.slate[500],
        text: colors.base.white,
        border: colors.slate[400]
      },
      focus: {
        ring: colors.slate[400]
      },
      selected: {
        background: colors.slate[400],
        text: colors.slate[800],
        border: colors.slate[300]
      },
      disabled: {
        background: colors.gray[700],
        text: colors.gray[400],
        border: colors.gray[600]
      },
      placeholder: colors.gray[400],
      visited: colors.slate[300]
    }
  }
}

export const getSemanticColor = (
  theme: ThemeName,
  role: SemanticRole
): SemanticColor => {
  return themeColors[theme][role]
}
