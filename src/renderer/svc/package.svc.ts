/**
 * パッケージ操作（バージョン変更・追加・削除・移動・保存）
 */

import * as api from "../lib/api";
import { extractPrefix, getOutdatedLevel } from "../lib/version";
import { useAppStore } from "../store";
import type { DepType } from "../types";

/**
 * アクティブタブとそのインデックスを取得する
 * タブがない場合は null を返す
 */
function getActiveTab() {
  const { tabs, activeTabIndex } = useAppStore.getState();
  if (activeTabIndex < 0 || activeTabIndex >= tabs.length) return null;
  return { tab: tabs[activeTabIndex], index: activeTabIndex };
}

/**
 * パッケージのバージョンを変更
 */
export function changeVersion(name: string, depType: DepType, version: string): void {
  const active = getActiveTab();
  if (!active?.tab.data) return;

  // store のオブジェクトを直接変更しないようスプレッドでコピーする
  const data = { ...active.tab.data };
  data[depType] = { ...data[depType], [name]: version };

  useAppStore.getState().updateTab(active.index, { data, dirty: true });
}

/**
 * パッケージを追加
 */
export function addPackage(name: string, version: string, depType: DepType): void {
  const active = getActiveTab();
  if (!active?.tab.data) return;

  const data = { ...active.tab.data };
  data[depType] = { ...data[depType], [name]: version };

  useAppStore.getState().updateTab(active.index, { data, dirty: true });
}

/**
 * パッケージを削除
 */
export function removePackage(name: string, depType: DepType): void {
  const active = getActiveTab();
  if (!active?.tab.data) return;

  const data = { ...active.tab.data };
  const deps = { ...data[depType] };
  delete deps[name];
  data[depType] = deps;

  useAppStore.getState().updateTab(active.index, { data, dirty: true });
}

/**
 * パッケージを別の依存カテゴリに移動（D&D用）
 */
export function movePackage(name: string, from: DepType, to: DepType): void {
  const active = getActiveTab();
  if (!active?.tab.data) return;

  const data = { ...active.tab.data };
  const fromDeps = { ...data[from] };
  const version = fromDeps[name];
  if (!version) return;

  delete fromDeps[name];
  data[from] = fromDeps;
  data[to] = { ...data[to], [name]: version };

  useAppStore.getState().updateTab(active.index, { data, dirty: true });
}

/**
 * 変更を保存
 * dirty フラグが立っていなければスキップする
 */
export async function save(): Promise<void> {
  const active = getActiveTab();
  if (!active?.tab.data || !active.tab.dirty) return;

  await api.savePackageJson(active.tab.dir, active.tab.data);
  // 保存完了後に dirty を下ろす
  useAppStore.getState().updateTab(active.index, { dirty: false });
}

/**
 * depType 内の outdated パッケージを一括で最新バージョンに更新する
 * 既存のプレフィクス（^, ~ 等）は保持する。更新件数を返す
 */
export function batchUpdate(depType: DepType): number {
  const active = getActiveTab();
  if (!active?.tab.data) return 0;

  const { latestVersions } = active.tab;
  if (!latestVersions) return 0;

  const deps = active.tab.data[depType];
  const installedVersions = active.tab.data.installedVersions;
  let count = 0;
  const updated: Record<string, string> = { ...deps };

  for (const [name, specifiedVersion] of Object.entries(deps)) {
    const latest = latestVersions[name]?.version;
    if (!latest) continue;

    const installed = installedVersions[name] ?? specifiedVersion;
    if (getOutdatedLevel(installed, latest) === "upToDate") continue;

    const prefix = extractPrefix(specifiedVersion);
    updated[name] = `${prefix}${latest}`;
    count++;
  }

  if (count > 0) {
    const data = { ...active.tab.data, [depType]: updated };
    useAppStore.getState().updateTab(active.index, { data, dirty: true });
  }

  return count;
}

/**
 * レジストリ検索
 */
export function searchPackages(query: string) {
  return api.searchRegistry(query);
}
