export function isArrayOfStrings(value: any): boolean {
  return Array.isArray(value) && value.every(item => typeof item === 'string');
}

export function isString(value: any): boolean {
  return typeof value === 'string';
}

export function safeJsonParse(rawValue: string) {
  let value;
  try {
    value = JSON.parse(rawValue);
  } catch (e) {
    value = rawValue;
  }
  return value;
}
