import React from 'react';
import { Badge } from './badge';
import { Card, CardContent } from './card';
import { LucideIcon } from 'lucide-react';

interface EmptyStateProps {
  icon: LucideIcon;
  title: string;
  message: string;
  missingEndpoints?: string[];
}

export const EmptyState: React.FC<EmptyStateProps> = ({
  icon: Icon,
  title,
  message,
  missingEndpoints
}) => {
  return (
    <Card className="border-2 border-dashed">
      <CardContent className="flex flex-col items-center justify-center py-16 px-6">
        <div className="rounded-full bg-muted p-6 mb-6">
          <Icon className="h-12 w-12 text-muted-foreground" />
        </div>

        <div className="text-center space-y-3 mb-6">
          <h3 className="text-xl font-semibold text-foreground">{title}</h3>
          <p className="text-muted-foreground max-w-md">{message}</p>
        </div>

        <Badge variant="secondary" className="mb-6">
          Coming Soon
        </Badge>

        {missingEndpoints && missingEndpoints.length > 0 && (
          <div className="w-full max-w-2xl">
            <div className="bg-muted/50 rounded-lg p-6">
              <h4 className="text-sm font-semibold mb-4 text-foreground">
                Required Backend Endpoints:
              </h4>
              <ul className="space-y-2">
                {missingEndpoints.map((endpoint, index) => (
                  <li
                    key={index}
                    className="flex items-start gap-3 text-sm font-mono"
                  >
                    <span className="text-muted-foreground mt-0.5">•</span>
                    <span className="text-foreground">{endpoint}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};
