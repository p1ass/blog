export const groupBy = <K extends PropertyKey, V>(
  array: readonly V[],
  getKey: (cur: V, idx: number, src: readonly V[]) => K,
) =>
  array.reduce(
    (obj, cur, idx, src) => {
      const key = getKey(cur, idx, src)
      if (obj[key]) {
        obj[key]?.push(cur)
        return obj
      }
      obj[key] = []
      obj[key]?.push(cur)
      return obj
    },
    {} as Record<K, V[]>,
  )
