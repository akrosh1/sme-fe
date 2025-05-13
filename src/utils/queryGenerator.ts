export default function queryGenerator<T>(
  query: T,
  options?: { withoutQuestionMark?: boolean },
): string {
  if (Object.keys(query as object).length === 0) return '';
  const queryStr = Object.entries(query as Record<string, unknown>)
    .filter(([_, value]) => {
      // @ts-expect-error ts(2322)
      return ![undefined, null, ''].includes(value);
    })
    .map(([key, value]) => {
      switch (key) {
        case 'pageIndex':
        case 'offset':
          // @ts-expect-error ts(2322)
          return `offset=${(value as number) * ((query?.limit as number) || 10)}`;
        case 'pageSize':
          return `limit=${value}`;
        default:
          return `${key}=${value}`;
      }
    })
    .join('&');

  if (options?.withoutQuestionMark) {
    return queryStr;
  }
  return `?${queryStr}`;
}
