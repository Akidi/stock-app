export function formatNumber(value: number | null, locale = 'en-US', options: Intl.NumberFormatOptions = {}): string {
  if (value == null || isNaN(value)) return '—';
  return new Intl.NumberFormat(locale, {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
    ...options
  }).format(value);
}
