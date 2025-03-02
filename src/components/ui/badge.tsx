
import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "@/lib/utils"
import { Check, AlertCircle, Info, X } from "lucide-react"

const badgeVariants = cva(
  "inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2",
  {
    variants: {
      variant: {
        default:
          "border-transparent bg-primary text-primary-foreground hover:bg-primary/80",
        secondary:
          "border-transparent bg-secondary text-secondary-foreground hover:bg-secondary/80",
        destructive:
          "border-transparent bg-destructive text-destructive-foreground hover:bg-destructive/80",
        outline: "text-foreground",
        success: 
          "border-transparent bg-green-100 text-green-800 hover:bg-green-200",
        warning: 
          "border-transparent bg-yellow-100 text-yellow-800 hover:bg-yellow-200",
        info: 
          "border-transparent bg-blue-100 text-blue-800 hover:bg-blue-200",
        danger: 
          "border-transparent bg-red-100 text-red-800 hover:bg-red-200",
        active: 
          "border-transparent bg-emerald-50 text-emerald-600 hover:bg-emerald-100",
        inactive: 
          "border-transparent bg-slate-100 text-slate-500 hover:bg-slate-200",
        pending: 
          "border-transparent bg-amber-50 text-amber-600 hover:bg-amber-100",
        completed: 
          "border-transparent bg-teal-50 text-teal-600 hover:bg-teal-100",
      },
      size: {
        default: "px-2.5 py-0.5 text-xs",
        sm: "px-2 py-0.5 text-[10px]",
        lg: "px-3 py-1 text-sm",
      },
      withIcon: {
        true: "pl-1.5",
        false: "",
      }
    },
    defaultVariants: {
      variant: "default",
      size: "default",
      withIcon: false,
    },
  }
)

export interface BadgeProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof badgeVariants> {
  icon?: boolean;
}

function Badge({ className, variant, size, withIcon, icon = false, ...props }: BadgeProps) {
  const IconComponent = React.useMemo(() => {
    if (!icon) return null;
    
    switch (variant) {
      case 'success':
      case 'active':
      case 'completed':
        return <Check className="h-3 w-3 mr-1" />;
      case 'warning':
      case 'pending':
        return <AlertCircle className="h-3 w-3 mr-1" />;
      case 'info':
        return <Info className="h-3 w-3 mr-1" />;
      case 'danger':
      case 'destructive':
      case 'inactive':
        return <X className="h-3 w-3 mr-1" />;
      default:
        return null;
    }
  }, [variant, icon]);

  const badgeWithIcon = icon ? true : withIcon;

  return (
    <div className={cn(badgeVariants({ variant, size, withIcon: badgeWithIcon }), className)} {...props}>
      {IconComponent}
      {props.children}
    </div>
  );
}

export { Badge, badgeVariants }
