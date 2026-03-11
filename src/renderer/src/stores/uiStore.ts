import { create } from 'zustand'

export type ViewMode = 'kanban' | 'json'

interface UiState {
  viewMode: ViewMode
  selectedCard: string | null
  panelOpen: boolean
  searchQuery: string
  wizardOpen: boolean

  setViewMode: (mode: ViewMode) => void
  selectCard: (cardId: string | null) => void
  openPanel: (cardId: string) => void
  closePanel: () => void
  setSearchQuery: (query: string) => void
  showWizard: () => void
  hideWizard: () => void
}

export const useUiStore = create<UiState>((set) => ({
  viewMode: 'kanban',
  selectedCard: null,
  panelOpen: false,
  searchQuery: '',
  wizardOpen: false,

  setViewMode: (mode) => set({ viewMode: mode }),
  selectCard: (cardId) => set({ selectedCard: cardId }),
  openPanel: (cardId) => set({ selectedCard: cardId, panelOpen: true }),
  closePanel: () => set({ panelOpen: false, selectedCard: null }),
  setSearchQuery: (query) => set({ searchQuery: query }),
  showWizard: () => set({ wizardOpen: true }),
  hideWizard: () => set({ wizardOpen: false })
}))
