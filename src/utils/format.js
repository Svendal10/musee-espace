export function formatDate(dateString) {
  if (!dateString) return 'Date inconnue';
  try {
    return new Date(dateString).toLocaleDateString('fr-FR', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  } catch {
    return dateString;
  }
}

export function extractYear(dateString) {
  if (!dateString) return null;
  const y = new Date(dateString).getFullYear();
  return isNaN(y) ? null : y;
}