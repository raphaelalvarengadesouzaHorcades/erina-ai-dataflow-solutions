import { create } from "zustand";
import { persist } from "zustand/middleware";

/* ------------------------------------------------------------------ */
/* Store de UI (preferências de interface)                             */
/* Persistido em localStorage — chave 'erina-ui'.                      */
/* ------------------------------------------------------------------ */

export interface UiState {
  /* --- estado --- */
  /** Menu lateral em modo rail (só ícones) quando true. */
  sidebarColapsada: boolean;
  /** Drawer mobile aberto quando true. */
  sidebarMobileAberto: boolean;
  /** true depois da reidratação do localStorage (evita flash/SSR mismatch). */
  hidratado: boolean;

  /* --- ações --- */
  toggleSidebar: () => void;
  toggleSidebarMobile: () => void;
  fecharSidebarMobile: () => void;
  setColapsada: (v: boolean) => void;
  setHidratado: (v: boolean) => void;
}

export const useUiStore = create<UiState>()(
  persist(
    (set) => ({
      /* --- estado inicial --- */
      sidebarColapsada: false,
      sidebarMobileAberto: false,
      hidratado: false,

      /* --- ações --- */
      toggleSidebar: () =>
        set((s) => ({ sidebarColapsada: !s.sidebarColapsada })),
      toggleSidebarMobile: () =>
        set((s) => ({ sidebarMobileAberto: !s.sidebarMobileAberto })),
      fecharSidebarMobile: () => set({ sidebarMobileAberto: false }),
      setColapsada: (v) => set({ sidebarColapsada: v }),
      setHidratado: (v) => set({ hidratado: v }),
    }),
    {
      name: "erina-ui",
      // Só a preferência de colapso é persistida.
      partialize: (s) => ({ sidebarColapsada: s.sidebarColapsada }),
      onRehydrateStorage: () => (state) => {
        state?.setHidratado(true);
      },
    }
  )
);
