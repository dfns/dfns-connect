import { Box, CircularProgress } from '@mui/material'

export const Loader = () => (
  <Box display="flex" marginTop="40px" justifyContent="center" alignItems="center" maxHeight="100vh">
    <CircularProgress />
  </Box>
)

export default Loader
