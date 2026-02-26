import { create } from "zustand";
import type {
  ProjectData,
  OutdatedEntry,
  AuditResult,
  TreeNode,
} from "./types";

/** プロジェクトタブ1つ分の状態 */
export interface ProjectTab {
  dir: string;
  data: ProjectData | null;
  outdated: OutdatedEntry[];
  audit: AuditResult | null;
  tree: TreeNode | null;
  dirty: boolean;
  loading: boolean;
}

export interface AppState {
  tabs: ProjectTab[];
  activeTabIndex: number;
  registryUrl: string;
  theme: "light" | "dark";
}

export interface AppActions {
  addTab: (tab: ProjectTab) => void;
  removeTab: (index: number) => void;
  setActiveTab: (index: number) => void;
  updateTab: (index: number, patch: Partial<ProjectTab>) => void;
  setRegistryUrl: (url: string) => void;
  setTheme: (theme: "light" | "dark") => void;
}

export const useAppStore = create<AppState & AppActions>()((set) => ({
  tabs: [],
  activeTabIndex: -1,
  registryUrl: "https://registry.npmjs.org",
  theme: "light",

  addTab: (tab) =>
    set((s) => ({
      tabs: [...s.tabs, tab],
      activeTabIndex: s.tabs.length,
    })),

  removeTab: (index) =>
    set((s) => {
      const tabs = s.tabs.filter((_, i) => i !== index);
      let activeTabIndex = s.activeTabIndex;
      if (activeTabIndex >= tabs.length) {
        activeTabIndex = tabs.length - 1;
      }
      return { tabs, activeTabIndex };
    }),

  setActiveTab: (index) => set({ activeTabIndex: index }),

  updateTab: (index, patch) =>
    set((s) => ({
      tabs: s.tabs.map((t, i) => (i === index ? { ...t, ...patch } : t)),
    })),

  setRegistryUrl: (registryUrl) => set({ registryUrl }),

  setTheme: (theme) => set({ theme }),
}));
