import { writable } from "svelte/store";
import type { Toast, ToastInput } from "$lib/components/Toast/Toast.types";
import { ToastType } from "$lib/components/Toast/Toast.types";

const MAX_TOASTS_VISIBLE = 5;

interface ToastStore {
  active: Toast[];
  queue: Toast[];
}

const defaultToast: Omit<Toast, 'id' | 'message'> = {
  type: ToastType.Info,
  duration: 5000,
  expireInQueue: false,
};

const createToastStore = () => {
  const { subscribe, update } = writable<ToastStore>({ active: [], queue: [] });

  const timers: Record<string, ReturnType<typeof setTimeout>> = {};

  const setTimer = (toast: Toast, fromQueue = false) => {
    if (timers[toast.id]) clearTimeout(timers[toast.id]);
    if (toast.duration && (!fromQueue || toast.expireInQueue)) {
      timers[toast.id] = setTimeout(() => remove(toast.id), toast.duration);
    }
  };

  const add = (toastInput: ToastInput & { message: string }) => {
    const toast: Toast = {
      id: `toast_${crypto.randomUUID()}`,
      ...defaultToast,
      ...toastInput,
    };

    update(({ active, queue }) => {
      if (active.length < MAX_TOASTS_VISIBLE) {
        setTimer(toast);
        return { active: [...active, toast], queue };
      }
      return { active, queue: [...queue, toast] };
    });
  };

  const remove = (id: string) => {
    if (timers[id]) {
      clearTimeout(timers[id]);
      delete timers[id];
    }

    update(({ active, queue }) => {
      const newActive = active.filter(toast => toast.id !== id);
      if (queue.length > 0) {
        const [nextToast, ...newQueue] = queue;
        setTimer(nextToast, true);
        return { active: [...newActive, nextToast], queue: newQueue };
      }
      return { active: newActive, queue };
    });
  };

  return { subscribe, add, remove };
};

export const toastStore = createToastStore();
