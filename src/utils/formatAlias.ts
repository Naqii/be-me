export function formatInputAlias(input: string): string {
  if (!input) return '';

  return input.trim().replace(/\s+/g, '-');
}
