import { Typography } from '@mui/material'

interface AuthStatus {
  user: string | undefined
}
export const AuthStatus = ({ user }: AuthStatus) =>
  !!user ? (
    <Typography sx={{ fontSize: '12px', margin: 0, padding: 0 }}>logged in as: {user}</Typography>
  ) : (
    <span>User is not logged in</span>
  )

export default AuthStatus
