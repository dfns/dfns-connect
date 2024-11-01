import { Alert, Button, Stack } from '@mui/material'
import ReactToPrint from 'react-to-print'

import { RecoveryCodeDialog } from '../RecoveryCodeDialog'

type RecoveryCodeProps = {
  recoveryKey: {
    username: string
    orgId: string
    recoveryCode: string
  }
  onDone: () => void
}

export const RecoveryCode: React.FC<RecoveryCodeProps> = ({ recoveryKey, onDone }) => {
  let componentRef: RecoveryCodeDialog | null = null
  return (
    <div style={{ width: '545px' }}>
      <Alert severity="warning" sx={{ width: '545px' }}>
        Please print this recovery kit and store it in a safe location! If you lose access to your account, a recovery
        kit is the only way to regain access.
      </Alert>
      <br />
      <Stack direction="row" alignItems="center" justifyContent="end" gap={1} marginBottom="20px">
        <>
          <Button variant="outlined" color="error" onClick={onDone} sx={{ width: 100 }}>
            Done
          </Button>
          <ReactToPrint
            trigger={() => (
              <Button variant="contained" sx={{ width: 100 }}>
                Print
              </Button>
            )}
            content={() => componentRef}
          />
        </>
      </Stack>
      <RecoveryCodeDialog
        ref={(el: RecoveryCodeDialog) => (componentRef = el)}
        recoveryKey={recoveryKey.recoveryCode}
        username={recoveryKey.username}
        orgId={recoveryKey.orgId}
      />
    </div>
  )
}
