'use client'
import { Button } from '@mui/material'
import { useContext } from 'react'

import { IframeContext } from '@/providers/IframeProvider'
import { IframeActiveState, MessageParentActions, MessageParentActionsResponses } from '@/utils/types/dfnsConnect'

export const LoginButton = ({ showScreen = IframeActiveState.default }: { showScreen: IframeActiveState }) => {
  const { sendMessageToParent } = useContext(IframeContext)
  return (
    <Button
      variant="contained"
      fullWidth
      onClick={() => {
        sendMessageToParent({
          parentAction: MessageParentActions.login,
          parentActionResponse: MessageParentActionsResponses.loginSuccess,
          showScreen,
        })
      }}
    >
      Login
    </Button>
  )
}

export default LoginButton
