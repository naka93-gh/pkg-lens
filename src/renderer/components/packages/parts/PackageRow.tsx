/**
 * パッケージ 1 行分の表示
 * 5 列: パッケージ名 / 指定 ver / インストール済み ver / 最新 ver / audit
 */

import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";
import { getOutdatedLevel, outdatedColorClass } from "@/lib/version";
import { useAppStore } from "@/store";
import type { DepType } from "@/types";
import { ShieldAlert } from "lucide-react";

interface PackageRowProps {
  name: string;
  depType: DepType;
}

function PackageRow({ name, depType }: PackageRowProps): React.JSX.Element {
  // --- データ取得 ---
  const tab = useAppStore((s) => s.tabs[s.activeTabIndex]);
  const specifiedVersion = tab?.data?.[depType][name] ?? "";
  const installedVersion = tab?.data?.installedVersions[name];
  const latest = tab?.latestVersions?.[name]?.version;
  const latestLoaded = tab?.latestVersions !== null;
  const advisories = tab?.audit?.advisories?.filter((a) => a.moduleName === name) ?? [];
  const auditLoaded = tab?.audit !== null;

  // --- データ加工 ---
  const level = latest && installedVersion ? getOutdatedLevel(installedVersion, latest) : null;

  // --- 描画 ---
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
