export const uid = (prefix = "") =>
  prefix + Math.random().toString(36).substring(2, 9);
