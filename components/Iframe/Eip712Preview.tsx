'use client'

import { Box, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Typography } from '@mui/material'

import { useWhiteLabelTheme } from '@/utils/hooks/iframe/useWhiteLabelTheme'
interface IDomain {
  name: string
  version: string
  chainId: number
  verifyingContract?: string
  salt?: string
}
interface TypeEntry {
  name: string
  type: string
}
interface Types {
  [key: string]: TypeEntry[]
}
interface Message {
  [key: string]: string | Message
}
interface EIP712Data {
  domain: IDomain
  types: Types
  message: Message
  kind: string
}

export interface EIP712Payload {
  payload: EIP712Data
}

export const Eip712Preview = ({ payload }: EIP712Payload) => {
  const { message, domain } = payload || {}
  return (
    <>
      <DynamicNestedTable data={message} header="Message" />
      <Box sx={{ padding: '20px' }} />
      <DynamicNestedTable data={domain} header="Domain" />
    </>
  )
}
// eslint-disable-next-line @typescript-eslint/no-explicit-any
const DynamicNestedTable = ({ data, header }: { data: any; header: string }) => {
  const whiteLabelTheme = useWhiteLabelTheme()
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const renderRows = (msg: Record<string, any>) => {
    return Object.keys(msg).map((key: string) => (
      <TableRow key={key}>
        <TableCell
          component="th"
          scope="row"
          sx={{ textAlign: 'left', verticalAlign: 'top', padding: '0 5px 0 0', border: 'none' }}
        >
          <Typography
            textTransform="capitalize"
            variant="h4"
            sx={{
              fontSize: '14px',
              textAlign: 'left',
              verticalAlign: 'top',
              color: '#BDBDBD',
              padding: '0 5px 0 0',
              margin: 0,
              fontWeight: 600,
            }}
          >
            {key}
          </Typography>
        </TableCell>
        <TableCell
          sx={{
            fontSize: '14px',
            textAlign: 'left',
            verticalAlign: 'top',
            border: 'none',
            wordBreak: 'break-all',
            padding: '0',
            margin: 0,
          }}
        >
          {typeof msg[key] === 'object' ? (
            renderObject(msg[key], key)
          ) : (
            <Typography
              sx={{
                fontSize: '14px',
                textAlign: 'right',
                verticalAlign: 'top',
                padding: '8px 5px 0px 0px',
                margin: 0,
                textTransform: 'none',
              }}
            >
              {JSON.stringify(msg[key], null, '\t')}
            </Typography>
          )}
        </TableCell>
      </TableRow>
    ))
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const renderObject = (obj: Record<string, any>, parentKey: string) => {
    return (
      <Table size="small">
        <TableBody>
          {Object.keys(obj).map((key) => (
            <TableRow key={`${parentKey}-${key}`} sx={{ border: 'none' }}>
              <TableCell
                sx={{
                  fontSize: '14px',
                  textAlign: 'left',
                  verticalAlign: 'top',
                  border: 'none',
                  wordBreak: 'keep-all',
                  padding: '0 5px 0 0',
                  margin: 0,
                }}
              >
                <Typography
                  textTransform="capitalize"
                  color={whiteLabelTheme?.global?.textColor || '#000'}
                  variant="h4"
                  sx={{ fontSize: '14px', fontWeight: 600, padding: '0 5px 0 0', verticalAlign: 'top' }}
                >
                  {key}
                </Typography>
              </TableCell>
              <TableCell
                sx={{
                  padding: '5px 5px 0 0',
                  border: 'none',
                  fontSize: '14px',
                  textAlign: 'right',
                  verticalAlign: 'top',
                  wordBreak: 'break-all',
                  color: '#FFF',
                }}
              >
                {JSON.stringify(obj[key], null, '\t')}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    )
  }

  return (
    <TableContainer>
      <Table
        sx={{
          backgroundColor: whiteLabelTheme?.global?.backgroundColor || '#F8F8FA',
          color: whiteLabelTheme?.global?.textColor || '#000',
        }}
      >
        <TableHead>
          <TableRow>
            <TableCell colSpan={2} sx={{ padding: '0', border: 'none' }}>
              <Typography
                variant="h5"
                color={'#FFF'}
                gutterBottom
                component="div"
                sx={{ fontWeight: 800, fontSize: '14px' }}
              >
                {header}
              </Typography>
            </TableCell>
          </TableRow>
        </TableHead>
        <TableBody>{renderRows(data)}</TableBody>
      </Table>
    </TableContainer>
  )
}
