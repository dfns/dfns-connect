import { useCallback } from 'react'
import toast from 'react-hot-toast'

export const useCopyToClipboard = (successMessage?: string) => {
  const copyToClipboard = useCallback(
    (text: string) => {
      navigator.clipboard.writeText(text)
      toast.success(successMessage || 'Copied !')
    },
    [successMessage]
  )

  return copyToClipboard
}
