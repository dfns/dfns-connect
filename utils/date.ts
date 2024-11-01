import moment from 'moment'
import * as yup from 'yup'

import { T } from './translations'

export const getDateValidator = (
  {
    format = 'DD/MM/YYYY',
    forbidFuture = false,
    forbidPast = false,
    forbidOld = true,
  }: {
    format?: string
    forbidFuture?: boolean
    forbidPast?: boolean
    forbidOld?: boolean
  } = {
    format: 'DD/MM/YYYY',
    forbidFuture: false,
    forbidPast: false,
    forbidOld: true,
  }
) =>
  yup
    .string()
    .test({
      test: (value) => moment.utc(value, format, true).isValid(),
      message: T.input_warning_date_invalid.en,
      name: 'date-validity',
    })
    .test({
      test: (value) =>
        !forbidFuture || moment.utc(value, format, true).isBefore(new Date()),
      message: T.input_warning_date_future.en,
      name: 'date-not-future',
    })
    .test({
      test: (value) =>
        !forbidPast || moment.utc(value, format, true).isAfter(new Date()),
      message: T.input_warning_date_past.en,
      name: 'date-not-past',
    })
    .test({
      test: (value) =>
        !forbidOld ||
        moment.utc(value, format, true).isAfter(new Date('1900-01-01')),
      message: T.input_warning_date_old.en,
      name: 'date-not-too-old',
    })
