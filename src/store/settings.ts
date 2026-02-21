import { SettingsState } from "@/types";
import { create } from "zustand";
import { immer } from "zustand/middleware/immer";

export const useSettingsStore = create<SettingsState>()(
  immer((set) => ({
    platformCut: 0.1,
    setPlatformCut: (value) =>
      set((state) => {
        state.platformCut = value;
      }),
  })),
);
