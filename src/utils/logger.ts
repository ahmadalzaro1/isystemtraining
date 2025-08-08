export const log = (...args: unknown[]) => {
  if (import.meta.env.MODE !== 'production') console.log(...args);
};

export const warn = (...args: unknown[]) => {
  if (import.meta.env.MODE !== 'production') console.warn(...args);
};

export const error = (...args: unknown[]) => {
  console.error(...args);
};
