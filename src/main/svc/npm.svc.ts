import type {
  OutdatedEntry,
  AuditResult,
  TreeNode,
  RegistryPackage,
} from "../../shared/types";

/** npm outdated 情報を取得（フェーズ 2 で実装） */
export async function getOutdated(_dir: string): Promise<OutdatedEntry[]> {
  return [];
}

/** npm audit 結果を取得（フェーズ 2 で実装） */
export async function getAudit(_dir: string): Promise<AuditResult> {
  return {
    advisories: [],
    metadata: {
      vulnerabilities: { critical: 0, high: 0, moderate: 0, low: 0, info: 0 },
      totalDependencies: 0,
    },
  };
}

/** 依存ツリーを取得（フェーズ 3 で実装） */
export async function getDependencyTree(_dir: string): Promise<TreeNode[]> {
  return [];
}

/** npm レジストリを検索（フェーズ 2 で実装） */
export async function searchRegistry(_query: string): Promise<RegistryPackage[]> {
  return [];
}
