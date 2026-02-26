/**
 * バージョン比較・outdated レベル判定のユーティリティ（React 非依存）
 */

export type OutdatedLevel = "major" | "minor" | "patch" | "upToDate";

/**
 * semver の各セグメントを比較して outdated レベルを返す
 */
export function getOutdatedLevel(current: string, latest: string): OutdatedLevel {
  // semver プレフィクス（^, ~, >= 等）を除去して数値部分だけ取得
  const parse = (v: string): number[] =>
    v.replace(/^[^\d]*/, "").split(".").map(Number);

  const c = parse(current);
  const l = parse(latest);

  if (c[0] !== l[0]) return "major";
  if (c[1] !== l[1]) return "minor";
  if (c[2] !== l[2]) return "patch";
  return "upToDate";
}

/**
 * outdated レベルに対応する Tailwind テキストカラークラスを返す
 */
export function outdatedColorClass(level: OutdatedLevel): string {
  switch (level) {
    case "major":
      return "text-tn-danger";
    case "minor":
      return "text-tn-warning";
    case "patch":
      return "text-tn-success";
    case "upToDate":
      return "text-muted-foreground";
  }
}
