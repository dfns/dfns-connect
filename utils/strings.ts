type SpecialMaskCharacterDetails = {
  getPattern: () => RegExp
}

const SPECIAL_MASK_CHARACTERS: Record<string, SpecialMaskCharacterDetails> = {
  "9": { getPattern: () => new RegExp(/^\d$/) },
}

export const applyMask = (value: string, mask: string) => {
  let formattedValue = ""

  for (let i = 0; i < mask.length; i++) {
    const maskChar = mask[i]
    const valueChar = value[i]
    const specialChar = SPECIAL_MASK_CHARACTERS[maskChar] as
      | SpecialMaskCharacterDetails
      | undefined

    if (
      !valueChar ||
      (!specialChar?.getPattern().test(valueChar) && valueChar !== maskChar)
    ) {
      !specialChar && (formattedValue += maskChar)
      return formattedValue
    }

    formattedValue += valueChar
  }

  return formattedValue
}

export const cutStringCenter = (value: string, maxChars = 6): string => {
  if (value.length <= maxChars) {
    return value
  }

  const maxCharsLeft = Math.round(maxChars / 2)
  const maxCharsRight = maxChars - maxCharsLeft

  return `${value.slice(0, maxCharsLeft)}...${value.slice(
    value.length - maxCharsRight,
    value.length
  )}`
}

export const inputLabelWithError = (label?: string, error?: string) =>
  `${label}${error ? ` - ${error}` : ""}`

export const isString = (value: unknown): value is string =>
  typeof value === "string"

export const extractCommonWordsFromId = (id: string): string => {
  const split = id.split("-")
  const filtered = split.slice(1, split.length - 1)
  return filtered.map(capitalizeFirstLetter).join(" ")
}

export const capitalizeFirstLetter = (word: string): string => {
  return word.charAt(0).toUpperCase() + word.slice(1)
}

export const stringStartsWith = (
  candidate: string,
  prefix: string
): boolean => {
  return candidate.toLowerCase().startsWith(prefix.toLowerCase())
}

export const stringIncludes = (candidate: string, prefix: string): boolean => {
  return candidate.toLowerCase().includes(prefix.toLowerCase())
}
