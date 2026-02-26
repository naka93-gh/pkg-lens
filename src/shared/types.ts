/**
 * パッケージの依存先種別
 */
export type DepType = "dependencies" | "devDependencies" | "peerDependencies";

/**
 * loadProject の戻り値
 */
export interface ProjectData {
  name: string;
  version: string;
  dependencies: Record<string, string>;
  devDependencies: Record<string, string>;
  peerDependencies: Record<string, string>;
}

/**
 * outdated 1件
 */
export interface OutdatedEntry {
  name: string;
  current: string;
  wanted: string;
  latest: string;
}

/**
 * audit 脆弱性の深刻度
 */
export type Severity = "critical" | "high" | "moderate" | "low" | "info";

/**
 * audit 脆弱性 1件
 */
export interface AuditAdvisory {
  id: number;
  title: string;
  severity: Severity;
  moduleName: string;
  vulnerableVersions: string;
  patchedVersions: string;
  path: string[];
}

/**
 * audit 結果
 */
export interface AuditResult {
  advisories: AuditAdvisory[];
  metadata: {
    vulnerabilities: Record<Severity, number>;
    totalDependencies: number;
  };
}

/**
 * 依存ツリーのノード
 */
export interface TreeNode {
  name: string;
  version: string;
  children: TreeNode[];
}

/**
 * レジストリ検索結果の1件
 */
export interface RegistryPackage {
  name: string;
  version: string;
  description: string;
}
