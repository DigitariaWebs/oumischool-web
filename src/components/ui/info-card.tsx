import * as React from "react";

import { cn } from "@/lib/utils";

import { Card, CardContent } from "./card";

interface InfoCardProps {
  icon: React.ComponentType<{ className?: string }>;
  title: string;
  value: string | number;
  subtext?: string;
  color: string; // e.g., 'blue', 'green', etc.
  className?: string;
}

const InfoCard = React.forwardRef<HTMLDivElement, InfoCardProps>(
  ({ icon: Icon, title, value, subtext, color, className }, ref) => {
    const bgColor = `bg-${color}-100`;
    const textColor = `text-${color}-600`;
    return (
      <Card ref={ref} className={cn("", className)}>
        <CardContent className="p-6">
          <div className="flex items-center gap-4">
            <div className={`p-3 ${bgColor} rounded-full`}>
              <Icon className={`h-6 w-6 ${textColor}`} />
            </div>
            <div>
              <p className={`text-sm font-medium ${textColor}`}>{title}</p>
              <p className={`text-2xl font-bold ${textColor}`}>{value}</p>
              {subtext && (
                <p className="text-xs text-muted-foreground">{subtext}</p>
              )}
            </div>
          </div>
        </CardContent>
      </Card>
    );
  },
);

InfoCard.displayName = "InfoCard";

interface InfoCardContainerProps {
  children: React.ReactNode;
  className?: string;
}

const InfoCardContainer: React.FC<InfoCardContainerProps> = ({
  children,
  className,
}) => {
  return (
    <div
      className={cn(
        "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4",
        className,
      )}
    >
      {children}
    </div>
  );
};

export { InfoCard, InfoCardContainer };
