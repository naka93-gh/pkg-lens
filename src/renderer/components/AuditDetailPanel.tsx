/**
 * 脆弱性詳細パネル
 * テーブル行の展開時に表示される。影響パッケージ・脆弱バージョン・パス・修正バージョンを表示する
 */

import type { AuditAdvisory } from "@/types";

interface AuditDetailPanelProps {
  advisory: AuditAdvisory;
  installedVersion: string | undefined;
}

function AuditDetailPanel({
  advisory,
  installedVersion,
}: AuditDetailPanelProps): React.JSX.Element {
  return (
    <div className="mx-3 mb-2 rounded-md bg-card/80 px-4 py-3 text-xs">
      <dl className="grid grid-cols-[auto_1fr] gap-x-4 gap-y-1.5">
        <dt className="text-muted-foreground">影響パッケージ</dt>
        <dd className="font-mono">{advisory.moduleName}</dd>

        <dt className="text-muted-foreground">現在のバージョン</dt>
        <dd className="font-mono">{installedVersion ?? "─"}</dd>

        <dt className="text-muted-foreground">脆弱なバージョン</dt>
        <dd className="font-mono">{advisory.vulnerableVersions || "─"}</dd>

        <dt className="text-muted-foreground">パス</dt>
        <dd className="font-mono">{advisory.path.join(" > ") || "─"}</dd>

        <dt className="text-muted-foreground">修正バージョン</dt>
        <dd className="font-mono">{advisory.patchedVersions || "修正なし"}</dd>
      </dl>
    </div>
  );
}

export default AuditDetailPanel;
