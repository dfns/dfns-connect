'use client'
import { LoadingButton } from '@mui/lab'
import { Box, TextField, Typography } from '@mui/material'
import { useMutation } from '@tanstack/react-query'
import { motion } from 'framer-motion'
import { useContext, useEffect, useState } from 'react'
import { Controller, useForm } from 'react-hook-form'

const MotionTypography = motion(Typography)
const MotionLoadingButton = motion(LoadingButton)

import { IframeContext } from '@/providers/IframeProvider'

export const RecoverWithCodes = ({ username }: { username: string }) => {
  const { doRecoverCredentials } = useContext(IframeContext)
  const [isRecovering, setIsRecovering] = useState(false)

  const { setValue, control, formState, handleSubmit } = useForm({
    mode: 'onChange',
    defaultValues: {
      username,
      verificationCode: '',
      recoveryCode: '',
      recoveryCredId: '',
    },
  })
  const { mutateAsync, isPending } = useMutation({
    mutationFn: async ({
      username,
      verificationCode,
      recoveryCredId,
      recoveryCode,
    }: {
      username: string
      verificationCode: string
      recoveryCredId: string
      recoveryCode: string
    }) => {
      return await doRecoverCredentials({ username, verificationCode, recoveryCredId, recoveryCode })
    },
  })
  const onSubmitRecovery = handleSubmit(async (data) => {
    try {
      setIsRecovering(true)
      await mutateAsync(data)
    } catch (error) {
      console.error('Error during mutation:', error)
    }
  })

  useEffect(() => {
    setValue('username', username)
  }, [setValue, username])

  if (isRecovering) return null
  return (
    <Box sx={{ margin: 0, paddin: 0 }}>
      <MotionTypography
        initial={{ opacity: 0, y: '-5px' }}
        animate={{ opacity: 1, y: '0' }}
        transition={{ duration: 0.5, ease: 'easeInOut' }}
        variant="h1"
      >
        Recover your wallet
      </MotionTypography>
      <MotionTypography
        initial={{ opacity: 0, y: '-5px' }}
        animate={{ opacity: 1, y: '0' }}
        transition={{ duration: 0.5, delay: 0.1, ease: 'easeInOut' }}
        sx={{ marginBottom: '20px', textAlign: 'left' }}
      >
        Please add below the verification code you have received in your email address as well as Recovery Code and
        Recovery Key Id you received when you first created your account.
      </MotionTypography>
      {!isPending && (
        <motion.form
          onSubmit={onSubmitRecovery}
          initial={{ opacity: 0, y: '5px', scale: 1.1 }}
          animate={{ opacity: 1, y: '0', scale: 1 }}
          transition={{ duration: 0.2, delay: 0.1, ease: 'easeInOut' }}
          style={{ margin: 0, padding: 0 }}
        >
          <Controller
            name="verificationCode"
            control={control}
            rules={{
              required: true,
            }}
            render={({ field, fieldState }) => (
              <TextField
                fullWidth
                label="Verification Code"
                data-testid="recovery-email-code-input"
                type="text"
                placeholder="..."
                InputLabelProps={{
                  shrink: !!fieldState.error?.message || undefined,
                }}
                {...field}
                color="primary"
                variant="outlined"
                sx={{
                  marginBottom: '16px',
                }}
              />
            )}
          />
          <Controller
            name="recoveryCode"
            control={control}
            rules={{
              required: true,
            }}
            render={({ field, fieldState }) => (
              <TextField
                fullWidth
                label="Recovery Code"
                data-testid="recovery-code-input"
                type="text"
                placeholder="..."
                InputLabelProps={{
                  shrink: !!fieldState.error?.message || undefined,
                }}
                {...field}
                color="primary"
                variant="outlined"
                sx={{
                  marginBottom: '16px',
                }}
              />
            )}
          />
          <Controller
            name="recoveryCredId"
            control={control}
            rules={{
              required: true,
            }}
            render={({ field, fieldState }) => (
              <TextField
                fullWidth
                label="Recovery Key ID"
                data-testid="recovery-key-input"
                type="text"
                placeholder="..."
                InputLabelProps={{
                  shrink: !!fieldState.error?.message || undefined,
                }}
                {...field}
                color="primary"
                variant="outlined"
                sx={{
                  marginBottom: '16px',
                }}
              />
            )}
          />
          <MotionLoadingButton
            initial={{ opacity: 0, y: '5px', scale: 1.1 }}
            animate={{ opacity: 1, y: '0', scale: 1 }}
            transition={{ duration: 0.2, delay: 0.1, ease: 'easeInOut' }}
            type="submit"
            fullWidth
            loading={formState.isSubmitting}
            disabled={!formState.isValid}
            variant="contained"
            data-testid="recover-credentials-btn"
            size="large"
          >
            Recover Account
          </MotionLoadingButton>
        </motion.form>
      )}
    </Box>
  )
}
