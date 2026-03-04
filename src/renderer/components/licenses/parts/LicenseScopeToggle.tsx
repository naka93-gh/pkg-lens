/**
 * 直接依存 / すべての依存 を切り替えるトグル
 */

import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import { cn } from "@/lib/utils";
import type { LicenseScope } from "@/components/licenses/LicensePage";

interface LicenseScopeToggleProps {
  scope: LicenseScope;
  onChange: (scope: LicenseScope) => void;
}

const options: { value: LicenseScope; label: string }[] = [
  { value: "direct", label: "直接依存" },
  { value: "all", label: "すべて" },
];

function LicenseScopeToggle({ scope, onChange }: LicenseScopeToggleProps): React.JSX.Element {
  return (
    <ToggleGroup
      type="single"
      value={scope}
      onValueChange={(v) => {
        if (v) onChange(v as LicenseScope);
      }}
      variant="outline"
      size="sm"
    >
      {options.map(({ value, label }) => (
        <ToggleGroupItem
          key={value}
          value={value}
          className={cn("text-xs h-7 px-2.5", scope === value && "text-primary")}
        >
          {label}
        </ToggleGroupItem>
      ))}
    </ToggleGroup>
  );
}

export default LicenseScopeToggle;
