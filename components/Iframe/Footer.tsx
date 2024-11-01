import { Box, Button, Typography } from '@mui/material'
import { AnimatePresence, motion } from 'framer-motion'
import Image from 'next/image'

import { whiteLabelTheme } from '@/store/iframe'
import { isLightColor } from '@/utils/theme/dfnsConnect/utils'

const MotionButton = motion(Button)

export const Footer = ({ whiteLabel }: { whiteLabel: whiteLabelTheme | undefined }) => {
  const bgColor = whiteLabel?.global?.backgroundColor ? whiteLabel?.global?.backgroundColor : '#FFF'
  const borderColor = whiteLabel?.global?.borderColor ? whiteLabel?.global?.borderColor : '#E2D9EB'
  const isLight = isLightColor(bgColor)
  const clientLogoUrl = isLight ? whiteLabel?.logoImgUrl || '' : whiteLabel?.logoDarkImgUrl || ''
  const dnfnsLogoUrl = isLight ? 'dfns-logo.svg' : 'dfns-logo-dark.svg'
  return (
    <Box
      style={{
        height: '32px',
        backgroundColor: bgColor,
        margin: 0,
        bottom: 0,
        padding: '24px 28px',
        position: 'fixed',
        display: 'flex',
        width: '100%',
        flexDirection: 'row',
        alignItems: 'center',
        alignContent: 'center',
        justifyContent: clientLogoUrl ? 'space-between' : 'end',
      }}
    >
      {clientLogoUrl && <Image src={clientLogoUrl} alt="logo" width={110} height={10} />}
      <AnimatePresence>
        <MotionButton
          initial={{ opacity: 0, y: '3px' }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, ease: 'easeInOut' }}
          href="https://dfns.co"
          sx={{
            border: `1px solid ${borderColor}`,
            backgroundColor: bgColor,
            borderRadius: '8px',
            padding: '2px 12px',
            justifyContent: 'center',
            alignItems: 'center',
            display: 'flex',
          }}
        >
          <Typography
            sx={{
              margin: 0,
              padding: 0,
              color: whiteLabel?.global?.textColor ? whiteLabel?.global?.textColor : '#170E25',
              display: 'inline',
              fontSize: '12px',
              marginRight: '8px',
              textTransform: 'none',
            }}
          >
            Secured by
          </Typography>
          <Image src={`/img/assets/dfns-connect/${dnfnsLogoUrl}`} alt="dfns logo" width={48} height={16} />
        </MotionButton>
      </AnimatePresence>
    </Box>
  )
}

export default Footer
