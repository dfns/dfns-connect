'use client'
import { LoadingButton } from '@mui/lab'
import { Box, Button, TextField, Typography } from '@mui/material'
import { useMutation } from '@tanstack/react-query'
import { motion } from 'framer-motion'
import { useContext, useEffect } from 'react'
import { Controller, useForm } from 'react-hook-form'
import toast from 'react-hot-toast'

import Loader from '@/components/Iframe/Loader'
import { IframeContext } from '@/providers/IframeProvider'

const MotionTypography = motion(Typography)
const MotionLoadingButton = motion(LoadingButton)

interface ReceiveEmailVerificationProps {
  onSetUsername: (username: string) => void
  onSuccess: () => void
}
export const ReceiveEmailVerification = ({ onSetUsername, onSuccess }: ReceiveEmailVerificationProps) => {
  const { sendVerificationCodeToEmail } = useContext(IframeContext)
  const { control, formState, handleSubmit, watch, trigger } = useForm({
    mode: 'onChange',
    defaultValues: {
      username: '',
    },
  })
  const { mutateAsync, isPending } = useMutation({
    mutationFn: async ({ username }: { username: string }) => {
      try {
        await sendVerificationCodeToEmail({ username })
        return true
      } catch (e) {
        throw e
      }
    },
  })
  const onSubmitEmailVerificationCode = handleSubmit(async (data) => {
    try {
      await mutateAsync(data)
      toast.success('Email sent successfully')
      if (onSuccess) onSuccess()
    } catch (e) {
      toast.error((e as Error).message)
    }
  })
  const username = watch('username')
  useEffect(() => {
    if (onSetUsername) onSetUsername(username)
  }, [username, onSetUsername])

  return (
    <Box>
      <MotionTypography
        initial={{ opacity: 0, y: '-5px' }}
        animate={{ opacity: 1, y: '0' }}
        transition={{ duration: 0.5, ease: 'easeInOut' }}
        variant="h1"
      >
        Recover your account
      </MotionTypography>
      <MotionTypography
        initial={{ opacity: 0, y: '-5px' }}
        animate={{ opacity: 1, y: '0' }}
        transition={{ duration: 0.5, delay: 0.1, ease: 'easeInOut' }}
        sx={{ marginBottom: '32px', textAlign: 'left' }}
      >
        Add the email used to create your account below to receive a verification code in your inbox
      </MotionTypography>

      {!isPending ? (
        <>
          <motion.form
            onSubmit={onSubmitEmailVerificationCode}
            initial={{ opacity: 0, y: '5px', scale: 1.1 }}
            animate={{ opacity: 1, y: '0', scale: 1 }}
            transition={{ duration: 0.2, delay: 0.1, ease: 'easeInOut' }}
          >
            <Controller
              name="username"
              control={control}
              rules={{
                required: true,
                pattern: {
                  value: /\S+@\S+\.\S+/,
                  message: 'Entered value does not match email format',
                },
              }}
              render={({ field, fieldState }) => (
                <TextField
                  data-testid="recovery-email-input"
                  fullWidth
                  label="Email"
                  type="text"
                  placeholder="jdoe@acme.co"
                  InputLabelProps={{
                    shrink: !!fieldState.error?.message || undefined,
                  }}
                  error={!!fieldState.error}
                  {...field}
                  color="primary"
                  variant="outlined"
                  sx={{
                    marginBottom: '16px',
                  }}
                />
              )}
            />
            {!!formState.errors.username && <Box sx={{ color: 'red', marginBottom: '10px' }}>Email is required</Box>}
            <MotionLoadingButton
              initial={{ opacity: 0, y: '5px', scale: 1.1 }}
              animate={{ opacity: 1, y: '0', scale: 1 }}
              transition={{ duration: 0.2, delay: 0.1, ease: 'easeInOut' }}
              type="submit"
              fullWidth
              loading={formState.isSubmitting || isPending}
              disabled={!formState.isValid || isPending}
              variant="contained"
              size="large"
              data-testid="recovery-email-btn"
            >
              Send Email
            </MotionLoadingButton>
          </motion.form>
          <Button
            variant="text"
            size="small"
            sx={{ margin: '20px 0', color: '#21B5F5' }}
            onClick={() => {
              trigger()
              if (onSuccess && !formState.errors.username && !!username) onSuccess()
            }}
          >
            I already have a verification code
          </Button>
        </>
      ) : (
        <>
          <Loader />
        </>
      )}
    </Box>
  )
}
