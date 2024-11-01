import { Box, Paper } from '@mui/material'
import React from 'react'

type Props = {
  recoveryKey: string
  username: string
  orgId: string
}

type State = {
  text: string
  isLoading: boolean
}

const labelFormat = {
  display: 'block',
  m: 1,
  color: 'grey.800',
  border: '0px',
  borderRadius: 0,
  fontSize: '0.875rem',
  fontWeight: '600',
}
const valueFormat = {
  display: 'block',
  p: 1,
  m: 1,
  bgcolor: '#fff',
  color: 'grey.800',
  border: '1px solid',
  borderColor: 'grey.300',
  borderRadius: '10px!important',
  fontSize: '0.875rem',
  fontWeight: '700',
}

export class RecoveryCodeDialog extends React.Component<Props, State> {
  render() {
    const { recoveryKey, username, orgId } = this.props

    const now = new Date()

    return (
      <>
        <Paper square sx={{ p: 1, borderRadius: '10px!important', width: '545px' }}>
          <Paper
            variant="outlined"
            square
            sx={{
              bgcolor: '#A2D9CE',
              p: 1,
              borderRadius: '10px!important',
              fontSize: '2.0rem',
              fontWeight: '800',
              color: '#FFFFFF',
              textAlign: 'center',
              boxShadow: 'none',
            }}
          >
            Dfns User Recovery Kit
          </Paper>
          <Paper
            variant="outlined"
            square
            sx={{
              p: 1,
              border: '0px',
              borderRadius: '10px!important',
              fontSize: '0.875rem',
              fontWeight: '600',
              color: '#45B39D',
              textAlign: 'center',
              boxShadow: 'none',
            }}
          >
            Created on {now.toDateString()} {now.toLocaleTimeString()}.
          </Paper>
          <Paper variant="outlined" square sx={{ bgcolor: '#E8F6F3', p: 1, borderRadius: '10px!important' }}>
            <Box component="span" sx={labelFormat}>
              Recovery Code:
            </Box>
            <Box component="span" sx={valueFormat}>
              {JSON.parse(recoveryKey).recoveryCode}
            </Box>
            <Box component="span" sx={labelFormat}>
              Recovery Key ID:
            </Box>
            <Box component="span" sx={valueFormat}>
              {JSON.parse(recoveryKey).credentialId}
            </Box>
            <Box component="span" sx={labelFormat}>
              Username:
            </Box>
            <Box component="span" sx={valueFormat}>
              {username}
            </Box>
            <Box component="span" sx={labelFormat}>
              Org ID:
            </Box>
            <Box component="span" sx={valueFormat}>
              {orgId}
            </Box>
            <Box component="span" sx={labelFormat}>
              Server:
            </Box>
            <Box component="span" sx={valueFormat}>
              https://{process.env['NEXT_PUBLIC_API_URL']}
            </Box>
          </Paper>
        </Paper>
      </>
    )
  }
}

export const RecoveryCodePrintableDialog = React.forwardRef<RecoveryCodeDialog | null, Props>((props, ref) => {
  return <RecoveryCodeDialog ref={ref} recoveryKey={props.recoveryKey} username={props.username} orgId={props.orgId} />
})
