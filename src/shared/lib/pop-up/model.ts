import { FC } from 'react';
import { create, StoreApi, UseBoundStore } from 'zustand';

export type PopUp = {
  title: string;
  Component: FC;
};

type State = {
  trace: Array<PopUp>;
  current: PopUp | null;
};

type Actions = {
  openPopUp: (data: PopUp) => void;
  closePopUp: () => void;
  prevPopUp: () => void;
};

type PopUpState = State & Actions;

export const usePopUpStore: UseBoundStore<StoreApi<PopUpState>> = create(
  (set) => ({
    trace: [],
    current: null,

    openPopUp: (data) =>
      set((state) => {
        const { trace } = state;
        trace.push(data);

        return {
          trace,
          current: data,
        };
      }),

    closePopUp: () =>
      set({
        trace: [],
        current: null,
      }),

    prevPopUp: () =>
      set((state) => {
        if (state.trace.length <= 1) {
          return {
            trace: [],
            current: null,
          };
        }

        const { trace } = state;
        trace.pop();

        return {
          trace,
          current: trace[trace.length - 1],
        };
      }),
  }),
);