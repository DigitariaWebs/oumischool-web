"use client";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { cn } from "@/lib/utils";
import { AlertTriangle, CheckCircle2, Info } from "lucide-react";
import * as React from "react";

export interface ModalAction {
  label: string;
  onClick: () => void;
  variant?: "default" | "outline" | "destructive" | "ghost" | "secondary";
  disabled?: boolean;
  loading?: boolean;
  icon?: React.ReactNode;
}

export interface ModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  type: "form" | "details" | "confirmation" | "warning";

  title: string;
  description?: string;
  children: React.ReactNode;

  actions?: {
    primary?: ModalAction;
    secondary?: ModalAction;
    tertiary?: ModalAction;
  };

  footer?: React.ReactNode;

  icon?: React.ReactNode;
  size?: "sm" | "md" | "lg" | "xl" | "full";
  closable?: boolean;
}

const sizeClasses = {
  sm: "min-w-md",
  md: "min-w-lg",
  lg: "min-w-2xl",
  xl: "min-w-4xl min-w-[72rem]",
  full: "min-w-7xl",
};

const defaultSizes: Record<ModalProps["type"], keyof typeof sizeClasses> = {
  confirmation: "sm",
  warning: "sm",
  details: "md",
  form: "xl",
};

const defaultIcons: Record<ModalProps["type"], React.ReactNode> = {
  confirmation: <Info className="h-6 w-6 text-blue-500" />,
  warning: <AlertTriangle className="h-6 w-6 text-amber-500" />,
  details: <CheckCircle2 className="h-6 w-6 text-primary" />,
  form: null,
};

const typeStyles: Record<
  ModalProps["type"],
  { container?: string; header?: string }
> = {
  confirmation: {
    header: "border-b-blue-200 dark:border-b-blue-800",
  },
  warning: {
    header: "border-b-amber-200 dark:border-b-amber-800",
  },
  details: {},
  form: {},
};

export function Modal({
  open,
  onOpenChange,
  type,
  title,
  description,
  children,
  actions,
  footer,
  icon,
  size,
  closable,
}: ModalProps) {
  const modalSize = size || defaultSizes[type];
  const modalIcon = icon !== undefined ? icon : defaultIcons[type];
  const canClose =
    closable !== undefined ? closable : type === "form" || type === "details";

  const handleOpenChange = (newOpen: boolean) => {
    if (!newOpen && !canClose) {
      return;
    }
    onOpenChange(newOpen);
  };

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent
        className={cn(
          sizeClasses[modalSize],
          typeStyles[type].container,
          "max-h-[90vh] overflow-auto",
        )}
        onInteractOutside={(e) => {
          if (!canClose) {
            e.preventDefault();
          }
        }}
        onEscapeKeyDown={(e) => {
          if (!canClose) {
            e.preventDefault();
          }
        }}
      >
        <DialogHeader className={cn(typeStyles[type].header)}>
          <div className="flex items-start gap-3">
            {modalIcon && <div className="mt-0.5">{modalIcon}</div>}
            <div className="flex-1">
              <DialogTitle>{title}</DialogTitle>
              {description && (
                <DialogDescription className="mt-1.5">
                  {description}
                </DialogDescription>
              )}
            </div>
          </div>
        </DialogHeader>

        <div className="py-4 px-2 overflow-y-auto">{children}</div>

        {footer ? (
          <DialogFooter>{footer}</DialogFooter>
        ) : (
          actions &&
          (actions.primary || actions.secondary || actions.tertiary) && (
            <DialogFooter className="gap-2">
              <div className="flex items-center justify-between w-full gap-2">
                <div className="flex gap-2">
                  {actions.tertiary && (
                    <Button
                      variant={actions.tertiary.variant || "outline"}
                      onClick={actions.tertiary.onClick}
                      disabled={
                        actions.tertiary.disabled || actions.tertiary.loading
                      }
                      className="gap-2"
                    >
                      {actions.tertiary.icon}
                      {actions.tertiary.label}
                    </Button>
                  )}
                </div>
                <div className="flex gap-2 ml-auto">
                  {actions.secondary && (
                    <Button
                      variant={actions.secondary.variant || "outline"}
                      onClick={actions.secondary.onClick}
                      disabled={
                        actions.secondary.disabled || actions.secondary.loading
                      }
                      className="gap-2"
                    >
                      {actions.secondary.icon}
                      {actions.secondary.label}
                    </Button>
                  )}
                  {actions.primary && (
                    <Button
                      variant={actions.primary.variant || "default"}
                      onClick={actions.primary.onClick}
                      disabled={
                        actions.primary.disabled || actions.primary.loading
                      }
                      className="gap-2"
                    >
                      {actions.primary.icon}
                      {actions.primary.label}
                    </Button>
                  )}
                </div>
              </div>
            </DialogFooter>
          )
        )}
      </DialogContent>
    </Dialog>
  );
}
