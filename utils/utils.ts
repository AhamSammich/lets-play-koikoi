export async function sleep(ms = 1000) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

export function mapReplacer(key: any, value: any) {
  if (value instanceof Map) {
    return {
      dataType: 'Map',
      value: [...value]
    };
  } else {
    return value;
  }
}

export function mapReviver(key: any, value: any) {
  if(typeof value === 'object' && value !== null) {
    if (value.dataType === 'Map') {
      return new Map(value.value);
    }
  }
  return value;
}
