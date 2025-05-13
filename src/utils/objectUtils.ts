export const clearObject = (obj: Record<string, unknown> = {}) => {
  return Object.keys(obj).reduce(
    (acc, key) => {
      const value = obj[key];
      if (
        value === null ||
        value === undefined ||
        value === '' ||
        Number.isNaN(value)
      ) {
        return acc;
      }
      acc[key] = value;
      return acc;
    },
    {} as Record<string, unknown>,
  );
};

export const isSomeNull = (obj: Record<string, unknown> = {}): boolean => {
  return Object.values(obj).some((value) => !value);
};

export const isEveryNull = (obj: Record<string, unknown> = {}): boolean => {
  return Object.values(obj).every((value) => !value);
};

export const isEmpty = (obj: Record<string, unknown> = {}) => {
  return Object.keys(obj).length === 0;
};

export const deepCompareObj = (
  obj1: Record<string, unknown>,
  obj2: Record<string, unknown>,
): boolean => {
  if (obj1 === undefined || obj2 === undefined) return false;
  if (obj1 === null || obj2 === null) return false;

  return JSON.stringify(obj1) === JSON.stringify(obj2);
};

export const omit = (obj: Record<string, unknown>, keys: string[]) => {
  return Object.fromEntries(
    Object.entries(obj).filter(([key]) => !keys.includes(key)),
  );
};

export const deepCopy = (obj: Record<string, unknown>) => {
  return JSON.parse(JSON.stringify(obj));
};
