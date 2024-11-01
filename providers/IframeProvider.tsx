import { createContext, ReactNode } from 'react'

import { useWindowMesssages } from '@/utils/hooks/iframe/useWindowMessages'
type useWindowMesssages = any
export const IframeContext = createContext<useWindowMesssages | null>(null)

type IframeProviderProps = {
  children: ReactNode
}
export const IframeProvider = ({ children }: IframeProviderProps) => {
  const sharedStateAndMethods = useWindowMesssages()

  return <IframeContext.Provider value={sharedStateAndMethods}>{children}</IframeContext.Provider>
}

export default IframeContext
