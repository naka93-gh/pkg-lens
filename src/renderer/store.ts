/**
 * アプリ全体の状態管理（Zustand）
 * 複数プロジェクトのタブ管理・アクティブビュー・設定を保持する
 */

import { create } from "zustand";
import type {
  ProjectData,
  RegistryPackageMeta,
  AuditResult,
  TreeNode,
} from "./types";

/**
 * プロジェクトタブ1つ分の状態
 */
export interface ProjectTab {
  dir: string;
  data: ProjectData | null;
  latestVersions: Record<string, RegistryPackageMeta> | null;
  audit: AuditResult | null;
  tree: TreeNode | null;
  dirty: boolean;
  loading: boolean;
}

/**
 * サブナビで切り替えるビューの種別
 */
export type ViewType = "packages" | "audit" | "tree" | "settings";

/**
 * アプリの状態
 */
export interface AppState {
  tabs: ProjectTab[];
  activeTabIndex: number;
  activeView: ViewType;
  searchQuery: string;
  registryUrl: string;
  theme: "light" | "dark";
}

/**
 * 状態を変更するアクション
 */
export interface AppActions {
  addTab: (tab: ProjectTab) => void;
  removeTab: (index: number) => void;
  setActiveTab: (index: number) => void;
  updateTab: (index: number, patch: Partial<ProjectTab>) => void;
  setActiveView: (view: ViewType) => void;
  setRegistryUrl: (url: string) => void;
  setSearchQuery: (query: string) => void;
  setTheme: (theme: "light" | "dark") => void;
}

export const useAppStore = create<AppState & AppActions>()((set) => ({
  tabs: [],
  // -1 = タブなし。0 以上でアクティブタブを示す
  activeTabIndex: -1,
  activeView: "packages",
  searchQuery: "",
  registryUrl: "https://registry.npmjs.org",
  theme: "dark",

  // 追加したタブを即アクティブにする（s.tabs.length が追加後のインデックス）
  addTab: (tab) =>
    set((s) => ({
      tabs: [...s.tabs, tab],
      activeTabIndex: s.tabs.length,
    })),

  // 削除後にアクティブインデックスが範囲外になる場合は末尾に補正
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

  setActiveView: (activeView) => set({ activeView }),

  setSearchQuery: (searchQuery) => set({ searchQuery }),

  setRegistryUrl: (registryUrl) => set({ registryUrl }),

  setTheme: (theme) => set({ theme }),
}));
