/**
 * shared/types.ts の re-export
 * renderer 側では "../shared/types" ではなくここから import する
 */

export type {
  AuditAdvisory,
  AuditResult,
  DepType,
  LicenseEntry,
  OutdatedEntry,
  ProjectData,
  RegistryPackage,
  RegistryPackageMeta,
  Severity,
  TreeNode,
} from "../shared/types";
