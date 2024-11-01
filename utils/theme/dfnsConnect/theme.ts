import { ThemeOptions } from '@mui/material/styles'

import { whiteLabelTheme } from '@/store/iframe'

import { getPalette } from './palette'

const getDfnsConnectTheme = (whiteLabel: whiteLabelTheme | undefined): ThemeOptions => {
  const palette = getPalette(whiteLabel)
  return {
    ...palette,
    background: whiteLabel?.global?.backgroundColor ? whiteLabel?.global?.backgroundColor : '#FFFFFF',
    components: {
      MuiBox: {
        styleOverrides: {
          root: {
            backgroundColor: whiteLabel?.global?.backgroundColor ? whiteLabel?.global?.backgroundColor : '#FF00FF',
          },
        },
      },
      MuiCircularProgress: {
        styleOverrides: {
          root: {
            color: whiteLabel?.global?.highlightColor ? whiteLabel?.global?.highlightColor : '#FF00FF',
          },
        },
      },
      MuiOutlinedInput: {
        styleOverrides: {
          root: {
            border: whiteLabel?.global?.borderColor ? `1px solid ${whiteLabel?.global?.borderColor}` : '',
            borderRadius: '8px',
            marginBottom: '4px',
            color: whiteLabel?.global?.textColor ? whiteLabel?.global?.textColor : '#FFFFFF',
            fontSize: '14px',
            backgroundColor: '#000',
          },
        },
      },
      MuiInputLabel: {
        styleOverrides: {
          root: {
            color: palette.info.main,
            '&:hover': {
              color: palette.secondary.main,
            },
            '&.Mui-focused': {
              color: palette.primary.main,
            },
          },
        },
      },
      MuiButton: {
        styleOverrides: {
          sizeSmall: { fontSize: '14px', padding: '4px 16px' },
          sizeMedium: { fontSize: '16px', padding: '6px 24px' },
          sizeLarge: { fontSize: '18px', padding: '12px 24px' },
          outlined: {
            opacity: 0.8,
            borderRadius: whiteLabel?.primaryButton?.borderRadiusPx
              ? `${whiteLabel?.primaryButton?.borderRadiusPx}px`
              : '12px',
            '&.MuiButton-outlinedPrimary': {
              backgroundColor: 'transparent',
              '&:hover': {
                backgroundColor: whiteLabel?.primaryButton?.backgroundColor || '#000',
                opacity: 0.8,
              },
              '&.Mui-disabled': {
                backgroundColor: '#b0bec5',
                color: '#ffffff',
                opacity: 0.8,
              },
            },
            '&.MuiButton-outlinedSecondary': {
              backgroundColor: 'transparent',
              border: `1px solid ${whiteLabel?.secondaryButton?.outlineColor}`,
              color: whiteLabel?.primaryButton?.textColor || '#FFF',
              '&:hover': {
                backgroundColor: whiteLabel?.secondaryButton?.backgroundColor || '#DDD',
                opacity: 0.7,
              },
              '&.Mui-disabled': {
                backgroundColor: '#b0bec5',
                color: '#ffffff',
              },
            },
          },
          contained: {
            '&.MuiButton-containedPrimary': {
              backgroundColor: whiteLabel?.primaryButton?.backgroundColor || '#000',
              '&:hover': {
                backgroundColor: whiteLabel?.primaryButton?.backgroundColor || '#000',
              },
              '&.Mui-disabled': {
                backgroundColor: '#000',
                color: '#ffffff',
                opacity: 0.8,
              },
            },
            '&.MuiButton-containedSecondary': {
              backgroundColor: whiteLabel?.secondaryButton?.backgroundColor || '#CCC',
              border: `1px solid ${whiteLabel?.secondaryButton?.outlineColor}`,
              color: whiteLabel?.secondaryButton?.textColor || '#000',
              '&:hover': {
                backgroundColor: whiteLabel?.secondaryButton?.backgroundColor || '#DDD',
              },
              '&.Mui-disabled': {
                backgroundColor: '#b0bec5',
                color: '#ffffff',
              },
            },
            backgroundColor: palette.primary.main,
            fontFamily: 'Inter,-apple-system, sans-serif',
            borderRadius: whiteLabel?.primaryButton?.borderRadiusPx
              ? `${whiteLabel?.primaryButton?.borderRadiusPx}px`
              : '12px',
            fontWeight: 500,
            boxShadow: 'none',
            fontStyle: 'normal',
            textTransform: 'none',
            '&:hover': {
              boxShadow: 'none',
            },
          },
        },
      },
      MuiFormControlLabel: {
        styleOverrides: {
          label: {
            marginBottom: 0,
            color: palette.secondary.main,
          },
        },
      },
      MuiCard: {
        styleOverrides: {
          root: {
            width: 'auto',
            marginBottom: 0,
            boxShadow: 'none',
          },
        },
      },
      MuiCheckbox: {
        styleOverrides: {
          root: {
            backgroundColor: 'white',
            color: '#6C717D',
            height: '18px',
            width: '18px',
            margin: '12px',
            borderRadius: '5px',
          },
        },
      },
      MuiPaper: {
        styleOverrides: {
          root: {
            width: '526px',
            padding: '32px',
            gap: '32px',
            borderRadius: '8px',
            boxShadow: '0px 10px 30px -10px rgba(113, 61, 255, 0.10), 0px 0px 2px -10px rgba(113, 61, 255, 0.20)',
            marginBottom: '48px',
            border: '1px solid #E2D9EB',
            backgroundColor: 'white',
          },
        },
      },
    },
    spacing: 2,
    typography: {
      fontFamily: 'Inter,-apple-system, sans-serif',
      fontWeightLight: 500,
      fontWeightRegular: 500,
      fontWeightMedium: 500,
      fontWeightBold: 800,
      h1: {
        marginBottom: '16px',
        fontFamily: 'Inter, -apple-system, sans-serif',
        fontWeight: 700,
        fontSize: '24px',
        lineHeight: '32px',
        color: palette.secondary.main,
      },
      h2: {
        fontWeight: 500,
        fontSize: '20px',
      },
      h3: { fontWeight: 600, fontSize: '1.5rem', lineHeight: '0.83rem' },
      h4: {
        fontWeight: 500,
        fontSize: '14px',
        lineHeight: '2rem',
        color: palette.primary.main,
      },
      h5: {
        fontWeight: 500,
        fontSize: '24px',
        lineHeight: '32px',
        marginBottom: '16px',
      },
      h6: { fontWeight: 600, fontSize: '1rem', lineHeight: '0.83rem' },
      button: { textTransform: 'capitalize', fontWeight: 800 },
      body1: {
        fontSize: '14px',
        color: whiteLabel?.global?.textColor ? whiteLabel?.global?.textColor : '#170E25',
        fontWeight: 400,
      },
      body2: {
        fontSize: '16px',
        color: whiteLabel?.global?.textColor ? whiteLabel?.global?.textColor : '#170E25',
        fontWeight: 500,
        lineHeight: '20px',
        margin: 0,
        padding: 0,
      },
      subtitle1: { fontSize: '18px', fontWeight: 500, color: palette.info.main, marginBottom: '48px' },
      subtitle2: { fontSize: '18px', fontWeight: 500, color: palette.info.main },
      caption: { fontWeight: 500, color: palette.info.main, fontSize: '12px' },
    },
  } as ThemeOptions
}

export default getDfnsConnectTheme
