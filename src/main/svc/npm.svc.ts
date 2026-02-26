import type {
  AuditResult,
  OutdatedEntry,
  RegistryPackage,
  TreeNode,
} from "../../shared/types";

/**
 * npm outdated 情報を取得
 * TODO: 未実装
 */
export async function getOutdated(_dir: string): Promise<OutdatedEntry[]> {
  return [];
}

/**
 * npm audit 結果を取得
 * TODO: 未実装
 */
export async function getAudit(_dir: string): Promise<AuditResult> {
  return {
    advisories: [],
    metadata: {
      vulnerabilities: { critical: 0, high: 0, moderate: 0, low: 0, info: 0 },
      totalDependencies: 0,
    },
  };
}

/**
 * 依存ツリーを取得
 * TODO: 未実装
 */
export async function getDependencyTree(_dir: string): Promise<TreeNode[]> {
  return [];
}

/**
 * npm レジストリを検索
 * TODO: 未実装
 */
export async function searchRegistry(_q: string): Promise<RegistryPackage[]> {
  return [];
}
