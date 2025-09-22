import * as React from "react"
import { Check } from "lucide-react"

interface CheckboxProps extends React.InputHTMLAttributes<HTMLInputElement> {
  id?: string;
  checked?: boolean;
  onCheckedChange?: (checked: boolean) => void;
}

const Checkbox = React.forwardRef<HTMLInputElement, CheckboxProps>(
  ({ className, checked, onCheckedChange, onChange, ...props }, ref) => {
    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      if (onCheckedChange) {
        onCheckedChange(e.target.checked);
      }
      if (onChange) {
        onChange(e);
      }
    };

    return (
      <div className="relative inline-flex items-center">
        <input
          type="checkbox"
          ref={ref}
          className="sr-only"
          checked={checked}
          onChange={handleChange}
          {...props}
        />
        <div
          className={`
            w-4 h-4 rounded border-2 border-gray-300 bg-white
            flex items-center justify-center cursor-pointer
            transition-all duration-200
            ${checked
              ? 'bg-blue-600 border-blue-600'
              : 'hover:border-gray-400'
            }
            ${className || ''}
          `}
          onClick={() => onCheckedChange && onCheckedChange(!checked)}
        >
          {checked && (
            <Check className="w-3 h-3 text-white" />
          )}
        </div>
      </div>
    );
  }
);

Checkbox.displayName = "Checkbox";

export { Checkbox }