import * as yup from 'yup'

import { T } from '../../utils/translations'

const M = T.input_warning_mandatory.en

export const registrationFormSchema = yup.object({
  username: yup.string().required(M).label('Username').default(''),
  orgId: yup.string().required(M).label('Org Id').default(''),
  registrationCode: yup.string().required(M).label('Registration Code').default(''),
})

export type RegistrationFormSchema = yup.InferType<
  typeof registrationFormSchema
>
