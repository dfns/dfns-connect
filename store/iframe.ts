import { create } from 'zustand'
import { devtools, persist } from 'zustand/middleware'

export type whiteLabelTheme = {
  global: {
    backgroundColor: string
    borderColor: string
    textColor: string
    highlightColor: string
  }
  primaryButton: {
    backgroundColor: string
    textColor: string
    borderRadiusPx: string
  }
  secondaryButton: {
    textColor: string
    backgroundColor: string
    outlineColor: string
  }
  indicators: {
    successColor: string
    errorColor: string
  }
  logoImgUrl: string
  logoDarkImgUrl: string
}
interface AppEntry {
  appId: string
  uniqueIdentifier: string
  orgId?: string
  userAuthToken?: string
  theme?: whiteLabelTheme
  isShowErrors?: boolean
}

interface SignerState {
  currentIdentifier: string
  appEntries: AppEntry[]
  setIdentifier: (identifier: string) => void
  addAppEntry: (entry: AppEntry) => void
  removeAppEntry: (uniqueIdentifier: string) => void
  updateAppEntry: (uniqueIdentifier: string, updatedEntry: Partial<AppEntry>) => void
  getAppEntry: (uniqueIdentifier: string) => AppEntry | undefined
  clearStore: () => void
}

export const useSignerStore = create<SignerState>()(
  devtools(
    persist(
      (set, get) => ({
        currentIdentifier: '',
        appEntries: [],
        setIdentifier: (identifier: string) => set({ currentIdentifier: identifier }),
        addAppEntry: (newEntry: AppEntry) =>
          set((state) => {
            const exists = state.appEntries.some((entry) => entry.uniqueIdentifier === newEntry.uniqueIdentifier)
            console.log('exists?', exists)
            if (!exists) {
              return { appEntries: [...state.appEntries, newEntry] }
            }
            return {}
          }),
        removeAppEntry: (uniqueIdentifier: string) =>
          set((state) => ({
            appEntries: state.appEntries.filter((entry) => entry.uniqueIdentifier !== uniqueIdentifier),
          })),
        updateAppEntry: (uniqueIdentifier: string, updatedEntry: Partial<AppEntry>) =>
          set((state) => ({
            appEntries: state.appEntries.map((entry) =>
              entry.uniqueIdentifier === uniqueIdentifier ? { ...entry, ...updatedEntry } : entry
            ),
          })),
        getAppEntry: (uniqueIdentifier: string) => {
          return get().appEntries.find((entry) => entry.uniqueIdentifier === uniqueIdentifier)
        },
        clearStore: () => {
          localStorage.removeItem('dfnsSignerEntries')
          sessionStorage.removeItem('dfnsSignerEntries')
        },
      }),
      { name: 'dfnsSignerEntries' }
    )
  )
)
