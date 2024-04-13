export const getDayColor = (rate: number) => {
  if (rate === -1) return "hsl(0, 0%, 100%)" // Blanc pour les jours sans note (null)
  // Calculer la teinte en fonction de la note (0-10)
  const hue = 120 * (rate / 10) // Calcul de la teinte de 0 à 120 (rouge à vert)
  return `hsl(${hue}, 100%, 85%, 60%)` // Saturation et luminosité fixes
}

export const getDayTextColor = (rate: number) => {
  if (rate === -1) return "hsl(0, 0%, 100%)"
  const hue = 120 * (rate / 10)
  return `hsl(${hue}, 100%, 30%)`
}