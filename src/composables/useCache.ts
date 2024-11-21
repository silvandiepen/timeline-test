import { ref } from 'vue';

const cache = ref(new Map<string, any>());

const setCache = (storeId: string, value: any) => {
  cache.value.set(storeId, value);
};

const getCachedValue = <T>(storeId: string, alt: T): T => {
  if (cache.value.has(storeId)) {
    return cache.value.get(storeId) as T;
  } else {
    setCache(storeId, alt);
    return alt;
  }
};

export const useCache = () => {
  return {
    setCache,
    getCachedValue
  };
};
