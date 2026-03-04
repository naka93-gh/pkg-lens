/**
 * ライセンス種別フィルタ
 * ToggleGroup（multiple）で種別をトグルする
 */

import { useMemo } from "react";
import { buildSummary } from "@/components/licenses/parts/LicenseSummaryBar";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import { cn } from "@/lib/utils";
import type { LicenseEntry } from "@/types";

interface LicenseFilterProps {
  licenses: LicenseEntry[];
  selected: string[];
  onChange: (selected: string[]) => void;
}

function LicenseFilter({ licenses, selected, onChange }: LicenseFilterProps): React.JSX.Element {
  const summary = useMemo(() => buildSummary(licenses), [licenses]);

  return (
    <ToggleGroup
      type="multiple"
      value={selected}
      onValueChange={onChange}
      variant="outline"
      size="sm"
      spacing={4}
    >
      {summary.map(({ label }) => (
        <ToggleGroupItem
          key={label}
          value={label}
          className={cn("text-xs h-7 px-2.5", selected.includes(label) && "text-primary")}
        >
          {label}
        </ToggleGroupItem>
      ))}
    </ToggleGroup>
  );
}

export default LicenseFilter;
