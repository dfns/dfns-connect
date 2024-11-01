export const isLightColor = (hex: string): boolean => {
  if (hex.length === 4) {
    hex = '#' + hex[1] + hex[1] + hex[2] + hex[2] + hex[3] + hex[3]
  }

  const r = parseInt(hex.slice(1, 3), 16)
  const g = parseInt(hex.slice(3, 5), 16)
  const b = parseInt(hex.slice(5, 7), 16)

  const normalize = (value: number) => value / 255

  const R = normalize(r)
  const G = normalize(g)
  const B = normalize(b)

  const luminanceComponent = (value: number) => {
    return value <= 0.03928 ? value / 12.92 : Math.pow((value + 0.055) / 1.055, 2.4)
  }

  const Lr = luminanceComponent(R)
  const Lg = luminanceComponent(G)
  const Lb = luminanceComponent(B)

  const luminance = 0.2126 * Lr + 0.7152 * Lg + 0.0722 * Lb

  return luminance > 0.179
}
