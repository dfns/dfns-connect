'use client'
import { Box, Typography } from '@mui/material'
import { motion } from 'framer-motion'
import Image from 'next/image'

const MotionTypography = motion(Typography)
const MotionBox = motion(Box)

interface WalletFeatureBanner {
  image: string
  heading: string
  subHeading: string
  animationDelay?: number
}
export const WalletFeatureBanner = ({ image, heading, subHeading, animationDelay = 0 }: WalletFeatureBanner) => (
  <Box
    sx={{
      display: 'flex',
      flexDirection: 'row',
      alignItems: 'center',
      width: '100%',
      marginBottom: '10px',
      marginTop: '10px',
    }}
  >
    <MotionBox
      initial={{ opacity: 0, x: '-10px' }}
      animate={{ opacity: 1, x: '0px' }}
      transition={{ duration: 0.3, delay: 0.1 + animationDelay, ease: 'easeInOut' }}
      sx={{ paddingRight: '10px', marginRight: '10px' }}
    >
      <Image src={`/img/assets/dfns-connect/${image}`} alt="biometric" width={64} height={64} />
    </MotionBox>
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        maxWidth: '285px',
      }}
    >
      <MotionTypography
        initial={{ opacity: 0, y: '10px' }}
        animate={{ opacity: 1, y: '0px' }}
        transition={{ duration: 0.3, ease: 'easeInOut', delay: 0.1 + animationDelay }}
        variant="h2"
        sx={{ marginBottom: '5px' }}
      >
        {heading}
      </MotionTypography>
      <MotionTypography
        initial={{ opacity: 0, y: '10px' }}
        animate={{ opacity: 0.8, y: '0px' }}
        transition={{ duration: 0.3, ease: 'easeInOut', delay: 0.1 + animationDelay }}
        variant="body1"
      >
        {subHeading}
      </MotionTypography>
    </Box>
  </Box>
)
export default WalletFeatureBanner
