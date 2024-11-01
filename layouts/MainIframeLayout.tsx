import { Box } from '@mui/material'
import CssBaseline from '@mui/material/CssBaseline'
import { ThemeProvider } from '@mui/material/styles'
import { createTheme } from '@mui/material/styles'
import Footer from 'components/Iframe/Footer'
import React, { PropsWithChildren } from 'react'

import { useSignerStore } from '@/store/iframe'
import getDfnsConnectTheme from '@/utils/theme/dfnsConnect/theme'

export const MainIframeLayout: React.FC<PropsWithChildren> = ({ children }) => {
  const { getAppEntry, currentIdentifier } = useSignerStore()
  const entries = getAppEntry(currentIdentifier)
  const whiteLabelTheme = createTheme(getDfnsConnectTheme(entries?.theme && entries?.theme))
  if (!whiteLabelTheme) return null
  return (
    <ThemeProvider theme={whiteLabelTheme || {}}>
      <CssBaseline />
      <Box
        sx={{
          padding: '32px',
          wordWrap: 'break-word',
          backgroundColor: entries?.theme?.global?.backgroundColor || '#FFF',
          minHeight: '100vh',
        }}
      >
        {children}
      </Box>
      <Footer whiteLabel={entries?.theme} />
    </ThemeProvider>
  )
}
