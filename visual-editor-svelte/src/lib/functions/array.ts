export function moveItem<T extends Array<unknown>>(
  items: T,
  from: number,
  to: number
): T {
  const clone = [...items]
  const [item] = clone.splice(from, 1)
  clone.splice(to, 0, item!)
  return clone as T
}

export function insertItem<T extends Array<any>>(
  items: T,
  index: number,
  value: any
) {
  const clone = [...items]
  clone.splice(index, 0, value)
  return clone
}
