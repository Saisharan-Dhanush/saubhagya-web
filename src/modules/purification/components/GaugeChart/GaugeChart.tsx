/**
 * GaugeChart - Reusable circular gauge component for displaying metrics
 * Used for CH4%, Pressure, Temperature, Flow rate, etc.
 */

import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';

export interface GaugeChartProps {
  value: number;
  min: number;
  max: number;
  label: string;
  unit: string;
  color?: 'green' | 'blue' | 'orange' | 'purple' | 'red' | 'cyan';
  size?: 'sm' | 'md' | 'lg';
  showValue?: boolean;
  showRange?: boolean;
  critical?: {
    min?: number;
    max?: number;
  };
  className?: string;
}

const colorMap = {
  green: {
    gauge: 'border-green-500',
    text: 'text-green-600',
    bg: 'bg-green-50'
  },
  blue: {
    gauge: 'border-blue-500',
    text: 'text-blue-600',
    bg: 'bg-blue-50'
  },
  orange: {
    gauge: 'border-orange-500',
    text: 'text-orange-600',
    bg: 'bg-orange-50'
  },
  purple: {
    gauge: 'border-purple-500',
    text: 'text-purple-600',
    bg: 'bg-purple-50'
  },
  red: {
    gauge: 'border-red-500',
    text: 'text-red-600',
    bg: 'bg-red-50'
  },
  cyan: {
    gauge: 'border-cyan-500',
    text: 'text-cyan-600',
    bg: 'bg-cyan-50'
  }
};

const sizeMap = {
  sm: { container: 'w-16 h-16', value: 'text-base', unit: 'text-[8px]', label: 'text-xs' },
  md: { container: 'w-24 h-24', value: 'text-xl', unit: 'text-xs', label: 'text-sm' },
  lg: { container: 'w-32 h-32', value: 'text-2xl', unit: 'text-sm', label: 'text-base' }
};

export const GaugeChart: React.FC<GaugeChartProps> = ({
  value,
  min,
  max,
  label,
  unit,
  color = 'blue',
  size = 'md',
  showValue = true,
  showRange = false,
  critical,
  className
}) => {
  // Normalize value between 0-100% of range
  const percentage = Math.max(0, Math.min(100, ((value - min) / (max - min)) * 100));
  const normalizedValue = Math.max(min, Math.min(max, value));

  // Check if value is in critical range
  const isCritical =
    (critical?.min !== undefined && value < critical.min) ||
    (critical?.max !== undefined && value > critical.max);

  const statusColor = isCritical ? 'red' : color;
  const colors = colorMap[statusColor];
  const sizes = sizeMap[size];

  // Calculate rotation angle (180 degrees = semicircle)
  const rotation = (percentage / 100) * 180;

  return (
    <div className={cn('flex flex-col items-center', className)}>
      {/* Gauge Container */}
      <div className="relative mb-2">
        {/* Base Circle */}
        <div className={cn(
          'rounded-full border-8 border-gray-200',
          sizes.container
        )}>
          {/* Rotating Gauge Arc */}
          <div
            className={cn(
              'absolute inset-0 rounded-full border-8 border-transparent',
              colors.gauge
            )}
            style={{
              transform: `rotate(${rotation}deg)`,
              transformOrigin: 'center',
              transition: 'transform 0.5s ease-in-out',
              clipPath: 'polygon(50% 50%, 100% 0%, 100% 100%)'
            }}
          />
        </div>

        {/* Center Value Display */}
        {showValue && (
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="text-center">
              <div className={cn('font-bold', colors.text, sizes.value)}>
                {normalizedValue.toFixed(1)}
              </div>
              <div className={cn('text-gray-500', sizes.unit)}>{unit}</div>
            </div>
          </div>
        )}

        {/* Critical Warning Badge */}
        {isCritical && (
          <div className="absolute -top-2 -right-2">
            <Badge variant="destructive" className="h-5 w-5 p-0 flex items-center justify-center">
              !
            </Badge>
          </div>
        )}
      </div>

      {/* Label */}
      <div className={cn('font-medium text-gray-700 text-center', sizes.label)}>
        {label}
      </div>

      {/* Range Display */}
      {showRange && (
        <div className="text-xs text-gray-500 mt-1">
          {min} - {max} {unit}
        </div>
      )}

      {/* Critical Range Indicator */}
      {isCritical && critical && (
        <div className="text-xs text-red-600 mt-1 font-medium">
          {value < (critical.min || min) && `Below ${critical.min}`}
          {value > (critical.max || max) && `Above ${critical.max}`}
        </div>
      )}
    </div>
  );
};

export default GaugeChart;
