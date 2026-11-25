// components/organizations/organizationUi.ts
export const brand = {
  green: '#00843d',
  greenDark: '#006b31',
  greenTint: '#eaf5ee',
  border: '#e2e6e3',
  surface: '#f6f8f7',
  text: '#1c2421',
  muted: '#66716b',
  danger: '#c62850',
};

export const initials = (name: string): string =>
  name
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((word) => word[0].toUpperCase())
    .join('');
