import { Box, Button, Typography } from '@mui/material'

import { UserInteractionTypes } from '@/utils/types/dfnsConnect'

type TransactionSignRequestProps = {
  // @ts-expect-error - not correctly implemented yet
  eventPayload
  isUserInteractioRequired: boolean
  userInteractionType: UserInteractionTypes
  userAuthToken: string
  // @ts-expect-error - not correctly implemented yet
  signWalletTransaction: (userAuthToken: string, walletId: string, kind: string, transaction) => void
  rejectWalletTransaction: () => void
}
export const TransactionSignRequest = ({
  eventPayload,
  isUserInteractioRequired,
  userInteractionType,
  userAuthToken,
  signWalletTransaction,
  rejectWalletTransaction,
}: TransactionSignRequestProps) => {
  const { walletId, kind, transaction } = eventPayload
  if (!walletId || !kind || !transaction) return <span>Malformed request</span>
  return (
    <Box>
      {!!eventPayload && isUserInteractioRequired && userInteractionType === UserInteractionTypes.sign && (
        <div>
          <Typography sx={{ fontSize: '16px', margin: 0, padding: 0 }}>You are being asked to sign: </Typography>
          <Box
            sx={{
              backgroundColor: '#EEE',
              margin: '1rem 1rem',
              padding: '0rem 1rem',
              overflowY: 'scroll',
              width: '90%',
              textAlign: 'left',
              fontSize: '10px',
            }}
          >
            <pre>{JSON.stringify(transaction, null, 4)}</pre>
          </Box>

          <Button onClick={() => signWalletTransaction(userAuthToken, walletId, kind, transaction)}>Sign</Button>
          <Button onClick={rejectWalletTransaction}>Reject</Button>
        </div>
      )}
    </Box>
  )
}

export default TransactionSignRequest
