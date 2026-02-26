import type {
  OutdatedEntry,
  AuditResult,
  TreeNode,
  RegistryPackage,
} from "../../shared/types";

/** npm outdated 情報を取得 */
export async function getOutdated(dir: string): Promise<OutdatedEntry[]> {
  throw new Error("Not implemented");
}

/** npm audit 結果を取得 */
export async function getAudit(dir: string): Promise<AuditResult> {
  throw new Error("Not implemented");
}

/** 依存ツリーを取得 */
export async function getDependencyTree(dir: string): Promise<TreeNode[]> {
  throw new Error("Not implemented");
}

/** npm レジストリを検索 */
export async function searchRegistry(
  query: string,
): Promise<RegistryPackage[]> {
  throw new Error("Not implemented");
}
