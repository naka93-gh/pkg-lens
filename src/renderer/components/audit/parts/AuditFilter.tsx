/**
 * 深刻度フィルタ
 * ToggleGroup（multiple）で深刻度をトグルする
 */

import { severityConfig } from "@/components/audit/parts/AuditSummaryBar";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import { cn } from "@/lib/utils";
import type { Severity } from "@/types";

interface AuditFilterProps {
  selected: Severity[];
  onChange: (selected: Severity[]) => void;
}

function AuditFilter({ selected, onChange }: AuditFilterProps): React.JSX.Element {
  return (
    <ToggleGroup
      type="multiple"
      value={selected}
      onValueChange={(v) => onChange(v as Severity[])}
      variant="outline"
      size="sm"
      spacing={4}
    >
      {severityConfig.map(({ key, label, colorClass }) => (
        <ToggleGroupItem
          key={key}
          value={key}
          className={cn("text-xs h-7 px-2.5", selected.includes(key) && colorClass)}
        >
          {label}
        </ToggleGroupItem>
      ))}
    </ToggleGroup>
  );
}

export default AuditFilter;
