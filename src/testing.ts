export function assert(condition: boolean, message = "Assertion Failed"): void {
  if (!condition) throw new Error(message);
}

export function assertEqual<T>(value1: T, value2: T): void {
  return assert(value1 === value2, `Expected ${value1}, but got ${value2}`);
}
