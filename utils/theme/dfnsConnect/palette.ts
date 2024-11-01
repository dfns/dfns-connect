import { Palette } from '@mui/material'

import { whiteLabelTheme } from '@/store/iframe'

export const getPalette = (whiteLabel: whiteLabelTheme | undefined): Palette => {
  return {
    primary: {
      main: whiteLabel?.global?.highlightColor ? whiteLabel?.global?.highlightColor : '#170E25',
    },
    secondary: {
      main: whiteLabel?.global?.textColor ? whiteLabel?.global?.textColor : '#170E25`',
    },
    info: {
      main: whiteLabel?.global?.textColor ? whiteLabel?.global?.textColor : '#6C717D',
    },
  } as Palette
}
