export default function capitalize(text: string): string {
  if (!text || typeof text !== 'string') return '';

  return text
    .split(' ')
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');
}
