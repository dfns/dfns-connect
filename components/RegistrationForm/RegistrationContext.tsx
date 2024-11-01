import { yupResolver } from '@hookform/resolvers/yup'
import React, { PropsWithChildren, useContext, useState } from 'react'
import { useForm } from 'react-hook-form'

import { RegistrationFormSchema, registrationFormSchema } from './constants'

type RegistrationContext = {
  registrationForm: ReturnType<typeof useRegistrationForm>
  formStep: number
  setFormStep: React.Dispatch<React.SetStateAction<number>>
}

const registrationContext = React.createContext<RegistrationContext>({
  registrationForm: null,
  formStep: 0,
  setFormStep: () => null,
} as unknown as RegistrationContext)

const useRegistrationForm = () =>
  useForm<RegistrationFormSchema>({
    mode: 'onChange',
    defaultValues: registrationFormSchema.getDefault(),
    resolver: yupResolver(registrationFormSchema),
  })

export const LoginContextProvider: React.FC<PropsWithChildren> = ({ children }) => {
  const registrationForm = useRegistrationForm()
  const [formStep, setFormStep] = useState(0)
  const contextValue = { registrationForm, formStep, setFormStep }

  return <registrationContext.Provider value={contextValue}>{children}</registrationContext.Provider>
}

export const useRegistrationContext = () => useContext(registrationContext)
