export const debounce = <T extends unknown[]>(
  callback: (...args: T) => unknown,
  delay = 500
) => {
  let timer: NodeJS.Timeout | null = null;
  return (...args: T) => {
    if (timer) {
      clearTimeout(timer);
    }
    timer = setTimeout(() => callback(...args), delay);
  };
};
