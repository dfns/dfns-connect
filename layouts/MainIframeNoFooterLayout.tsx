import { Box } from '@mui/material'
import CssBaseline from '@mui/material/CssBaseline'
import { createTheme } from '@mui/material/styles'
import { ThemeOptions, ThemeProvider } from '@mui/material/styles'
import React, { PropsWithChildren, useEffect, useState } from 'react'

import { useSignerStore } from '@/store/iframe'
import getDfnsConnectTheme from '@/utils/theme/dfnsConnect/theme'

export const MainIframeNoFooterLayout: React.FC<PropsWithChildren> = ({ children }) => {
  const { getAppEntry, currentIdentifier } = useSignerStore()
  const entries = getAppEntry(currentIdentifier)
  const [whiteLabelTheme, setWhiteLabelTheme] = useState<ThemeOptions>()
  useEffect(() => {
    if (!entries || whiteLabelTheme) return
    const theme = createTheme(getDfnsConnectTheme(entries?.theme && entries?.theme))
    setWhiteLabelTheme(theme)
  }, [entries, whiteLabelTheme])
  if (!whiteLabelTheme) return null
  return (
    <ThemeProvider theme={whiteLabelTheme || {}}>
      <CssBaseline />
      <Box
        sx={{
          wordWrap: 'break-word',
          minHeight: '100vh',
          backgroundColor: entries?.theme?.global?.backgroundColor || '#FFF',
        }}
      >
        {children}
      </Box>
    </ThemeProvider>
  )
}
