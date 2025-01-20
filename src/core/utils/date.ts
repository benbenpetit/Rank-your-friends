export const getReadableDateFromTimestamp = (isoDate?: string): string => {
  if (!isoDate) return 'Date non disponible'
  const date = new Date(isoDate)
  return new Intl.DateTimeFormat('fr-FR', {
    day: '2-digit',
    month: 'long',
    year: 'numeric'
  }).format(date)
}
