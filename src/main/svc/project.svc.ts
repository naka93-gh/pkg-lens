import { readFile, writeFile } from "node:fs/promises";
import { join } from "node:path";
import type { ProjectData } from "../../shared/types";

/** package.json を読み込み ProjectData を返す */
export async function loadProject(dir: string): Promise<ProjectData> {
  const raw = await readFile(join(dir, "package.json"), "utf-8");
  const pkg = JSON.parse(raw);

  return {
    name: pkg.name ?? "",
    version: pkg.version ?? "0.0.0",
    dependencies: pkg.dependencies ?? {},
    devDependencies: pkg.devDependencies ?? {},
    peerDependencies: pkg.peerDependencies ?? {},
  };
}

/** ProjectData を package.json に書き戻す（2スペースインデント + 末尾改行） */
export async function savePackageJson(
  dir: string,
  data: ProjectData,
): Promise<void> {
  const filePath = join(dir, "package.json");
  const raw = await readFile(filePath, "utf-8");
  const pkg = JSON.parse(raw);

  pkg.name = data.name;
  pkg.version = data.version;
  pkg.dependencies = data.dependencies;
  pkg.devDependencies = data.devDependencies;
  pkg.peerDependencies = data.peerDependencies;

  await writeFile(filePath, JSON.stringify(pkg, null, 2) + "\n", "utf-8");
}
