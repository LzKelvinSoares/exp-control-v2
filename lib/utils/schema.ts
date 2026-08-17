/**
 * Converts a readonly const-asserted array into the mutable tuple z.enum() requires,
 * while preserving the literal union type.
 */
export function toZodEnum<T extends string>(arr: readonly T[]): [T, ...T[]] {
  return arr as unknown as [T, ...T[]]
}
