/**
 * CycleProgressBar - Progress indicator for purification cycles
 * Shows completion percentage, time remaining, and cycle status
 */

import React from 'react';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { Clock, CheckCircle, AlertTriangle, Play, Pause } from 'lucide-react';
import { cn } from '@/lib/utils';

export interface CycleProgressBarProps {
  cycleId: string;
  batchId: string;
  progress: number; // 0-100
  status: 'preparing' | 'running' | 'completed' | 'failed' | 'paused';
  targetCH4: number;
  currentCH4?: number;
  remainingTime?: number; // minutes
  efficiency?: number;
  className?: string;
  compact?: boolean;
  showDetails?: boolean;
}

const statusConfig = {
  preparing: {
    icon: Clock,
    color: 'bg-gray-100 text-gray-800',
    label: 'Preparing',
    progressColor: 'bg-gray-500'
  },
  running: {
    icon: Play,
    color: 'bg-blue-100 text-blue-800',
    label: 'Running',
    progressColor: 'bg-blue-500'
  },
  paused: {
    icon: Pause,
    color: 'bg-yellow-100 text-yellow-800',
    label: 'Paused',
    progressColor: 'bg-yellow-500'
  },
  completed: {
    icon: CheckCircle,
    color: 'bg-green-100 text-green-800',
    label: 'Completed',
    progressColor: 'bg-green-500'
  },
  failed: {
    icon: AlertTriangle,
    color: 'bg-red-100 text-red-800',
    label: 'Failed',
    progressColor: 'bg-red-500'
  }
};

export const CycleProgressBar: React.FC<CycleProgressBarProps> = ({
  cycleId,
  batchId,
  progress,
  status,
  targetCH4,
  currentCH4,
  remainingTime,
  efficiency,
  className,
  compact = false,
  showDetails = true
}) => {
  const config = statusConfig[status];
  const StatusIcon = config.icon;

  const formatTime = (minutes?: number): string => {
    if (!minutes) return '--:--';
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    return `${hours}:${mins.toString().padStart(2, '0')}`;
  };

  if (compact) {
    return (
      <div className={cn('space-y-2', className)}>
        <div className="flex items-center justify-between text-sm">
          <span className="font-medium">{batchId}</span>
          <Badge variant="secondary" className={config.color}>
            <StatusIcon className="w-3 h-3 mr-1" />
            {progress}%
          </Badge>
        </div>
        <Progress value={progress} className="h-2" />
        {remainingTime !== undefined && (
          <div className="text-xs text-gray-500 text-right">
            {formatTime(remainingTime)} remaining
          </div>
        )}
      </div>
    );
  }

  return (
    <Card className={className}>
      <CardContent className="p-4 space-y-3">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h4 className="font-medium text-sm">{batchId}</h4>
            <p className="text-xs text-gray-600">Cycle ID: {cycleId}</p>
          </div>
          <Badge variant="secondary" className={config.color}>
            <StatusIcon className="w-3 h-3 mr-1" />
            {config.label}
          </Badge>
        </div>

        {/* Progress Bar */}
        <div className="space-y-2">
          <div className="flex justify-between text-sm">
            <span className="text-gray-600">Progress</span>
            <span className="font-medium">{progress}% complete</span>
          </div>
          <Progress value={progress} className="h-3" />
        </div>

        {/* Details Grid */}
        {showDetails && (
          <div className="grid grid-cols-2 gap-3 text-sm">
            {/* Target CH4 */}
            <div className="space-y-1">
              <div className="text-gray-600 text-xs">Target CH₄</div>
              <div className="font-medium">{targetCH4.toFixed(1)}%</div>
            </div>

            {/* Current CH4 */}
            {currentCH4 !== undefined && (
              <div className="space-y-1">
                <div className="text-gray-600 text-xs">Current CH₄</div>
                <div className="font-medium text-green-600">
                  {currentCH4.toFixed(1)}%
                </div>
              </div>
            )}

            {/* Remaining Time */}
            {remainingTime !== undefined && (
              <div className="space-y-1">
                <div className="text-gray-600 text-xs">Time Remaining</div>
                <div className="font-medium flex items-center">
                  <Clock className="w-3 h-3 mr-1" />
                  {formatTime(remainingTime)}
                </div>
              </div>
            )}

            {/* Efficiency */}
            {efficiency !== undefined && (
              <div className="space-y-1">
                <div className="text-gray-600 text-xs">Efficiency</div>
                <div className={cn(
                  'font-medium',
                  efficiency >= 95 ? 'text-green-600' :
                  efficiency >= 85 ? 'text-blue-600' :
                  'text-yellow-600'
                )}>
                  {efficiency.toFixed(1)}%
                </div>
              </div>
            )}
          </div>
        )}

        {/* CH4 Progress Indicator */}
        {currentCH4 !== undefined && (
          <div className="border-t pt-3">
            <div className="text-xs text-gray-600 mb-1">CH₄ Rise Progress</div>
            <div className="flex items-center space-x-2">
              <Progress
                value={(currentCH4 / targetCH4) * 100}
                className="h-2 flex-1"
              />
              <span className="text-xs font-medium text-green-600">
                +{(currentCH4 - 88).toFixed(1)}%
              </span>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default CycleProgressBar;
