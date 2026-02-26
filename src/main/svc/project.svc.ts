import type { ProjectData } from "../../shared/types";

/** プロジェクトの package.json + lockfile を読み込む */
export async function loadProject(dir: string): Promise<ProjectData> {
  throw new Error("Not implemented");
}

/** package.json を書き戻す */
export async function savePackageJson(
  dir: string,
  data: ProjectData,
): Promise<void> {
  throw new Error("Not implemented");
}
