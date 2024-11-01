import Decimal from 'decimal.js';

export const removeTrailingDecimalsZero = (str: string) => {
  if (/^\d*\.\d*$/.test(str)) {
    // if looks like a decimal number
    return str
      .replace(/0+$/g, '') // remove trailing 0
      .replace(/\.$/, ''); // if all decimals were 0, remove trailing dot
  }
  return str
}


export const formatArbitraryDecimal = (amount: Decimal, decimal: number): string => {
  const convertedAmount = amount.mul(Decimal.pow(10, -decimal))
  return removeTrailingDecimalsZero(convertedAmount.toFixed(decimal))
}
