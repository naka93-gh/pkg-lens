/**
 * shared/types.ts の re-export
 * renderer 側では "../shared/types" ではなくここから import する
 */

export type {
  DepType,
  ProjectData,
  OutdatedEntry,
  Severity,
  AuditAdvisory,
  AuditResult,
  TreeNode,
  RegistryPackageMeta,
  RegistryPackage,
} from "../shared/types";
