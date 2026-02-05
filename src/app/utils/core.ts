export const parseNumericParam = (
  value: string | null,
  defaultValue: number,
): number => {
  if (!value) return defaultValue;
  const parsed = Number(value);
  return isNaN(parsed) ? defaultValue : parsed;
};
