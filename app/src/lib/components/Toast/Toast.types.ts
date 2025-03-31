export enum ToastPosition {
  N = "N", NE = "NE", E = "E", SE = "SE",
  S = "S", SW = "SW", W = "W", NW = "NW",
}

export enum ToastType {
  Info = "info",
  Success = "success",
  Warning = "warning",
  Error = "error",
}

export interface Toast {
  id: string;
  message: string;
  type: ToastType;
  duration: number;
  expireInQueue: boolean;
}

export type ToastInput = Partial<Omit<Toast, 'id'>>;
