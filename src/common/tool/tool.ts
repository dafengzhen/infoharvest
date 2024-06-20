export const mergeAndDistinctArrays = (
  array1: any[],
  array2: any[],
  mergeProperties: string[],
) => {
  const mergedArray = array1.concat(array2);
  return mergedArray.reduce((previousValue, currentValue) => {
    const existingItemIndex = previousValue.findIndex(
      (item) =>
        currentValue.id !== undefined &&
        currentValue.id !== null &&
        currentValue.id !== '' &&
        item.id === currentValue.id,
    );

    if (existingItemIndex !== -1) {
      const existingItem = previousValue[existingItemIndex];
      for (const prop of mergeProperties) {
        if (
          currentValue.hasOwnProperty(prop) &&
          currentValue[prop] !== undefined
        ) {
          existingItem[prop] = currentValue[prop];
        }
      }
    } else {
      previousValue.push(currentValue);
    }

    return previousValue;
  }, []);
};

export const mergeObjects = (
  obj1: object,
  obj2: object,
  properties: string[],
) => {
  const newObj = { ...obj1 };
  for (const prop of properties) {
    if (obj2.hasOwnProperty(prop) && obj2[prop] !== undefined) {
      newObj[prop] = obj2[prop];
    }
  }

  return newObj;
};

export const isHttpOrHttps = (value: string) => {
  return value.startsWith('http') || value.startsWith('https');
};

export const mapToArray = (map: Map<string, any>) => {
  return Array.from(map, (v) => v[1]);
};
