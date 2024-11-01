'use client'
import { IconButton, TextField, Typography } from '@mui/material'
import Image from 'next/image'
import { useCopyToClipboard } from 'utils/hooks/useCopyToClipboard'

import { useWhiteLabelTheme } from '@/utils/hooks/iframe/useWhiteLabelTheme'
interface CopyPasteInputProps {
  label?: string
  defaultValue?: string
  'data-testid': string
}
export const CopyPasteInput = ({ label = '', defaultValue = '', 'data-testid': dataTestID }: CopyPasteInputProps) => {
  const whiteLabelTheme = useWhiteLabelTheme()
  const copy = useCopyToClipboard()
  return (
    <>
      <Typography variant="caption" sx={{ opacity: 0.8 }}>
        {label}
      </Typography>
      <TextField
        data-testid={`${dataTestID}-input`}
        fullWidth
        inputProps={{ readOnly: true }}
        type="text"
        defaultValue={defaultValue}
        variant="outlined"
        sx={{
          marginBottom: '8px',
          backgroundColor: '#000000',
          borderColor: '#33394D',
          '& .MuiInputBase-input': {
            overflow: 'hidden',
            textOverflow: 'ellipsis',
            whiteSpace: 'nowrap',
          },
        }}
        InputProps={{
          endAdornment: (
            <IconButton
              sx={{
                backgroundColor: whiteLabelTheme?.global?.backgroundColor || '#F8F8FA',
                marginLeft: '4px',
                padding: 0,
              }}
              data-testid={`${dataTestID}-btn`}
              onClick={() => {
                copy(defaultValue)
              }}
            >
              <Image src="/img/assets/dfns-connect/copy-paste-icon.svg" alt="copy" width={24} height={24} />
            </IconButton>
          ),
        }}
      />
    </>
  )
}

export default CopyPasteInput
