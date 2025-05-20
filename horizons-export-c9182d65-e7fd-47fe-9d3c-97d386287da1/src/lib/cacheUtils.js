
    export const CACHE_EXPIRY_MS = 24 * 60 * 60 * 1000; // 24 hours

    export const getFromLocalStorage = (key) => {
      const itemStr = localStorage.getItem(key);
      if (!itemStr) {
        return null;
      }
      try {
        const item = JSON.parse(itemStr);
        const now = new Date();
        if (now.getTime() > item.expiry) {
          localStorage.removeItem(key);
          return null;
        }
        return item.value;
      } catch (error) {
        console.warn(`Error parsing localStorage item ${key}:`, error);
        localStorage.removeItem(key);
        return null;
      }
    };

    export const setToLocalStorage = (key, value) => {
      const now = new Date();
      const item = {
        value: value,
        expiry: now.getTime() + CACHE_EXPIRY_MS,
      };
      try {
        localStorage.setItem(key, JSON.stringify(item));
      } catch (error) {
        console.warn(`Error setting localStorage item ${key}:`, error);
      }
    };
