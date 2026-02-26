import { readFile, writeFile } from "node:fs/promises";
import { join } from "node:path";
import { app } from "electron";
import type { RegistryPackageMeta } from "../../shared/types";

/** キャッシュ 1 エントリ */
export interface CacheEntry {
  data: RegistryPackageMeta;
  cachedAt: number;
}

/** キャッシュストア全体 */
export type CacheStore = Record<string, CacheEntry>;

const CACHE_FILE = "registry-cache.json";
const TTL_MS = 43_200_000; // 12 時間

function cachePath(): string {
  return join(app.getPath("userData"), CACHE_FILE);
}

/**
 * ディスクからキャッシュを読み込む
 * ファイルが無い・壊れている場合は空オブジェクトを返す
 */
export async function loadRegistryCache(): Promise<CacheStore> {
  try {
    const raw = await readFile(cachePath(), "utf-8");
    return JSON.parse(raw) as CacheStore;
  } catch {
    return {};
  }
}

/**
 * キャッシュをディスクに書き出す
 */
export async function saveRegistryCache(cache: CacheStore): Promise<void> {
  await writeFile(cachePath(), JSON.stringify(cache), "utf-8");
}

/**
 * エントリが TTL を超過しているか判定
 */
export function isExpired(entry: CacheEntry): boolean {
  return Date.now() - entry.cachedAt > TTL_MS;
}
