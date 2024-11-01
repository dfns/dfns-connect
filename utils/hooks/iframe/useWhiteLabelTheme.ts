import { useSignerStore } from '@/store/iframe'

export const useWhiteLabelTheme = () => {
  const { getAppEntry, currentIdentifier } = useSignerStore()
  const entries = getAppEntry(currentIdentifier)
  return entries?.theme
}
