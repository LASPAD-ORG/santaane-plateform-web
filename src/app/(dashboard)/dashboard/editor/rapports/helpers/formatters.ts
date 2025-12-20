export function formatPercentage(value: number): string {
  return `${value.toFixed(1)}%`;
}

export function formatDuration(days: number): string {
  if (days === 1) return '1 jour';
  if (days < 30) return `${days} jours`;
  const months = Math.floor(days / 30);
  return `${months} mois`;
}

export function calculateGrowth(current: number, previous: number): number {
  if (previous === 0) return 0;
  return ((current - previous) / previous) * 100;
}
