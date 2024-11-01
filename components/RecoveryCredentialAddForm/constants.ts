import { CredentialKind } from 'utils/api/clients/dfnsApi/types'
import * as yup from 'yup'

/*
    email: string;
    kind: UserKind.Employee | UserKind.Staff | UserKind.User;
    credentialKind: CredentialKind;
    publicKey: string;
    scopes?: string[] | undefined;
    permissions?: string[] | undefined;
*/

export const credentialFormSchema = yup.object({
  name: yup.string().required().label('name').default(''),
  kind: yup
    .mixed<CredentialKind>()
    .oneOf([CredentialKind.Fido2, CredentialKind.Password, CredentialKind.Totp])
    .required()
    .default(CredentialKind.Fido2)
    .label('Type of Credential'),
})

export type CredentialFormSchema = yup.InferType<
  typeof credentialFormSchema
>
