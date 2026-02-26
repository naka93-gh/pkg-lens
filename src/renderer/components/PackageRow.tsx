/**
 * パッケージ 1 行分の表示
 * 5 列: パッケージ名 / 指定 ver / インストール済み ver / 最新 ver / audit
 */

import { ShieldAlert } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";
import { getOutdatedLevel, outdatedColorClass } from "@/lib/version";
import type { AuditAdvisory } from "@/types";

export interface PackageRowProps {
  name: string;
  /** package.json に記載されたバージョン指定（^1.2.3 等） */
  specifiedVersion: string;
  /** node_modules にインストールされた実バージョン */
  installedVersion: string | undefined;
  /** 最新バージョン（undefined = 未取得 or 該当なし） */
  latestVersion: string | undefined;
  /** 最新バージョン取得済みかどうか */
  latestLoaded: boolean;
  /** このパッケージに関連する audit 脆弱性 */
  advisories: AuditAdvisory[];
  /** audit 取得済みかどうか */
  auditLoaded: boolean;
}

function PackageRow({
  name,
  specifiedVersion,
  installedVersion,
  latestVersion,
  latestLoaded,
  advisories,
  auditLoaded,
}: PackageRowProps): React.JSX.Element {
  const latest = latestVersion;
  const level = latest && installedVersion ? getOutdatedLevel(installedVersion, latest) : null;

  return (
    <div className="flex items-center gap-2 px-3 py-1 text-xs hover:bg-accent/30 rounded">
      {/* パッケージ名 */}
      <span className="w-[40%] min-w-0 truncate font-mono">{name}</span>

      {/* 指定 ver */}
      <span className="w-[15%] min-w-0 truncate font-mono text-muted-foreground">
        {specifiedVersion}
      </span>

      {/* インストール済み ver */}
      <span className="w-[15%] min-w-0 truncate font-mono text-muted-foreground">
        {installedVersion ?? "─"}
      </span>

      {/* 最新 ver */}
      <span
        className={cn(
          "w-[15%] min-w-0 truncate font-mono",
          level ? outdatedColorClass(level) : "text-muted-foreground",
        )}
      >
        {latestLoaded ? (latest ?? "─") : <Skeleton className="h-3 w-16" />}
      </span>

      {/* audit バッジ */}
      <span className="w-[15%] min-w-0 flex items-center">
        {auditLoaded ? (
          advisories.length > 0 ? (
            <span className="flex items-center gap-1 text-tn-danger">
              <ShieldAlert className="size-3.5" />
              <span>{advisories.length}</span>
            </span>
          ) : null
        ) : (
          <Skeleton className="h-3 w-8" />
        )}
      </span>
    </div>
  );
}

export default PackageRow;
