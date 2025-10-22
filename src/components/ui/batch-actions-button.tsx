import React, { useState } from 'react';
import { CheckSquare, Square, ChevronDown, Trash2, ToggleRight, ToggleLeft, Download, Mail } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Badge } from '@/components/ui/badge';

export interface BatchAction {
  label: string;
  icon?: React.ReactNode;
  onClick: (selectedIds: string[]) => void | Promise<void>;
  variant?: 'default' | 'destructive' | 'warning';
  requiresConfirmation?: boolean;
  confirmMessage?: string;
}

interface BatchActionsButtonProps {
  selectedIds: string[];
  totalItems: number;
  onSelectAll: () => void;
  onClearSelection: () => void;
  actions?: BatchAction[];
  disabled?: boolean;
}

const BatchActionsButton: React.FC<BatchActionsButtonProps> = ({
  selectedIds,
  totalItems,
  onSelectAll,
  onClearSelection,
  actions = [],
  disabled = false,
}) => {
  const [isProcessing, setIsProcessing] = useState(false);
  const selectedCount = selectedIds.length;
  const allSelected = selectedCount === totalItems && totalItems > 0;

  const handleAction = async (action: BatchAction) => {
    if (selectedCount === 0) return;

    // Show confirmation if required
    if (action.requiresConfirmation) {
      const message =
        action.confirmMessage ||
        `Are you sure you want to perform this action on ${selectedCount} item(s)?`;
      if (!window.confirm(message)) {
        return;
      }
    }

    try {
      setIsProcessing(true);
      await action.onClick(selectedIds);
    } catch (error) {
      console.error('Batch action failed:', error);
    } finally {
      setIsProcessing(false);
    }
  };

  const getVariantClass = (variant?: string) => {
    switch (variant) {
      case 'destructive':
        return 'text-destructive hover:text-destructive';
      case 'warning':
        return 'text-orange-600 hover:text-orange-700';
      default:
        return '';
    }
  };

  return (
    <div className="flex items-center gap-2">
      {/* Select All/Clear Button */}
      <Button
        variant="outline"
        size="sm"
        onClick={allSelected ? onClearSelection : onSelectAll}
        disabled={disabled || totalItems === 0 || isProcessing}
        className="gap-2"
      >
        {allSelected ? (
          <>
            <CheckSquare className="h-4 w-4" />
            Clear Selection
          </>
        ) : (
          <>
            <Square className="h-4 w-4" />
            Select All
          </>
        )}
      </Button>

      {/* Selected Count Badge */}
      {selectedCount > 0 && (
        <Badge variant="secondary" className="gap-1">
          {selectedCount} selected
        </Badge>
      )}

      {/* Batch Actions Dropdown */}
      {selectedCount > 0 && actions.length > 0 && (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              variant="default"
              size="sm"
              disabled={disabled || isProcessing}
              className="gap-2"
            >
              {isProcessing ? 'Processing...' : 'Batch Actions'}
              <ChevronDown className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-48">
            {actions.map((action, index) => (
              <React.Fragment key={index}>
                {index > 0 && index % 3 === 0 && <DropdownMenuSeparator />}
                <DropdownMenuItem
                  onClick={() => handleAction(action)}
                  className={`gap-2 cursor-pointer ${getVariantClass(action.variant)}`}
                >
                  {action.icon}
                  {action.label}
                </DropdownMenuItem>
              </React.Fragment>
            ))}
          </DropdownMenuContent>
        </DropdownMenu>
      )}
    </div>
  );
};

export default BatchActionsButton;
export { BatchActionsButton };
