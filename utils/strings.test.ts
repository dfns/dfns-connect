import { applyMask } from './strings'

const DATE_MASK = '99/99/9999'

describe('applyMask', () => {
  test.each([
    ['', '', ''],
    ['12/10/2020', DATE_MASK, '12/10/2020'],
    ['12/10', DATE_MASK, '12/10/'],
    ['12/1', DATE_MASK, '12/1'],
    ['12', DATE_MASK, '12/'],
    ['1AAAA', DATE_MASK, '1'],
    ['a', DATE_MASK, ''],
    ['12/10/20208', DATE_MASK, '12/10/2020'],
  ])('applyMask(%i, %i)', (value, pattern, expected) => {
    const result = applyMask(value, pattern)
    expect(result).toEqual(expected)
  })
})
