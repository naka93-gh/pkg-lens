/**
 * パッケージ詳細パネル
 * パッケージ行の展開時に表示される。registry メタ情報を一覧表示する
 */

import { ExternalLink } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import { useAppStore } from "@/store";

interface PackageDetailPanelProps {
  name: string;
}

/**
 * リポジトリ URL をクリーンアップする
 * git+https://... や .git 末尾を除去して表示用 URL にする
 */
function cleanRepoUrl(raw: string): string {
  return raw.replace(/^git\+/, "").replace(/\.git$/, "");
}

/**
 * バイト数を人間が読みやすい形式にフォーマットする
 */
function formatBytes(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`;
  const kb = bytes / 1024;
  if (kb < 1024) return `${kb.toFixed(1)} KB`;
  const mb = kb / 1024;
  return `${mb.toFixed(1)} MB`;
}

function PackageDetailPanel({ name }: PackageDetailPanelProps): React.JSX.Element {
  const meta = useAppStore((s) => s.tabs[s.activeTabIndex]?.latestVersions?.[name]);
  const latestLoaded = useAppStore((s) => s.tabs[s.activeTabIndex]?.latestVersions !== null);

  if (!latestLoaded) {
    return (
      <div className="mx-3 mb-2 rounded-md bg-card/80 px-4 py-3">
        <div className="space-y-2">
          <Skeleton className="h-3 w-48" />
          <Skeleton className="h-3 w-32" />
          <Skeleton className="h-3 w-40" />
        </div>
      </div>
    );
  }

  if (!meta) {
    return (
      <div className="mx-3 mb-2 rounded-md bg-card/80 px-4 py-3 text-xs text-muted-foreground">
        情報なし
      </div>
    );
  }

  const repoUrl = meta.repository?.url ? cleanRepoUrl(meta.repository.url) : null;

  return (
    <div className="mx-3 mb-2 rounded-md bg-card/80 px-4 py-3 text-xs">
      <dl className="grid grid-cols-[auto_1fr] gap-x-4 gap-y-1.5">
        {meta.description && (
          <>
            <dt className="text-muted-foreground">説明</dt>
            <dd>{meta.description}</dd>
          </>
        )}

        {meta.license && (
          <>
            <dt className="text-muted-foreground">ライセンス</dt>
            <dd className="font-mono">{meta.license}</dd>
          </>
        )}

        {meta.homepage && (
          <>
            <dt className="text-muted-foreground">ホームページ</dt>
            <dd>
              <a
                href={meta.homepage}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-1 text-blue-400 hover:underline"
              >
                {meta.homepage}
                <ExternalLink className="size-3" />
              </a>
            </dd>
          </>
        )}

        {repoUrl && (
          <>
            <dt className="text-muted-foreground">リポジトリ</dt>
            <dd>
              <a
                href={repoUrl}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-1 text-blue-400 hover:underline"
              >
                {repoUrl}
                <ExternalLink className="size-3" />
              </a>
            </dd>
          </>
        )}

        {meta.maintainers && meta.maintainers.length > 0 && (
          <>
            <dt className="text-muted-foreground">メンテナー</dt>
            <dd>{meta.maintainers.map((m) => m.name).join(", ")}</dd>
          </>
        )}

        {meta.dist?.unpackedSize != null && (
          <>
            <dt className="text-muted-foreground">サイズ</dt>
            <dd className="font-mono">
              {formatBytes(meta.dist.unpackedSize)}
              {meta.dist.fileCount != null && (
                <span className="ml-2 text-muted-foreground">
                  ({meta.dist.fileCount} files)
                </span>
              )}
            </dd>
          </>
        )}
      </dl>

      {meta.keywords && meta.keywords.length > 0 && (
        <div className="mt-2 flex flex-wrap gap-1">
          {meta.keywords.map((kw) => (
            <span
              key={kw}
              className="rounded bg-accent px-1.5 py-0.5 text-[10px] text-muted-foreground"
            >
              {kw}
            </span>
          ))}
        </div>
      )}
    </div>
  );
}

export default PackageDetailPanel;
