/**
 * パッケージ一覧ページ
 * store からアクティブタブのデータを取得し、3 セクションに分配する
 */

import SearchBar from "@/components/SearchBar";
import PackageSection from "@/components/PackageSection";
import { useAppStore } from "@/store";

function PackageListPage(): React.JSX.Element {
  const tab = useAppStore((s) => s.tabs[s.activeTabIndex]);
  const searchQuery = useAppStore((s) => s.searchQuery);

  if (!tab?.data) {
    return (
      <div className="flex items-center justify-center h-full text-sm text-muted-foreground">
        読み込み中...
      </div>
    );
  }

  const { data, latestVersions, audit } = tab;
  const advisories = audit?.advisories ?? null;

  const sections: { title: string; packages: Record<string, string> }[] = [
    { title: "dependencies", packages: data.dependencies },
    { title: "devDependencies", packages: data.devDependencies },
    { title: "peerDependencies", packages: data.peerDependencies },
  ];

  return (
    <div className="flex flex-col gap-2">
      <SearchBar />
      {sections.map(({ title, packages }) => (
        <PackageSection
          key={title}
          title={title}
          packages={packages}
          installedVersions={data.installedVersions}
          latestVersions={latestVersions}
          advisories={advisories}
          searchQuery={searchQuery}
        />
      ))}
    </div>
  );
}

export default PackageListPage;
