export const cartStatuses = {
  open: 'OPEN',
  ordered: 'ORDERED',
} as const;

export type CartStatus = (typeof cartStatuses)[keyof typeof cartStatuses];
