export const setStorage = (name: string, value: string): void => {
  localStorage.setItem(name, value);
};

export const setSessionStorage = (name: string, value: string): void => {
  sessionStorage.setItem(name, value);
};

export const getStorage = (name: string): string | null => {
  const data = localStorage.getItem(name);
  if (data) {
    return data;
  }
  return sessionStorage.getItem(name);
};

export const clearStorage = (itemKey?: string): void => {
  if (itemKey) {
    localStorage.removeItem(itemKey);
    sessionStorage.removeItem(itemKey);
    return;
  }
  localStorage.clear();
  localStorage.sessionStorage.clear();
};

export const removeFromStorage = (name: string): void => {
  localStorage.removeItem(name);
  sessionStorage.removeItem(name);
};
