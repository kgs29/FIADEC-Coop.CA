import { ChevronDown, LucideIcon } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface SidebarMenuItemProps {
  icon: LucideIcon;
  label: string;
  href?: string;
  isActive?: boolean;
  hasChevron?: boolean;
  isOpen?: boolean;
  onClick?: () => void;
  isButton?: boolean;
  className?: string;
  isCollapsed?: boolean;
}

export function SidebarMenuItem({
  icon: Icon,
  label,
  href,
  isActive = false,
  hasChevron = false,
  isOpen = false,
  onClick,
  isButton = false,
  className,
  isCollapsed = false,
}: Readonly<SidebarMenuItemProps>) {
  const baseClasses = cn(
    "flex items-center rounded-lg transition-colors w-full text-left group",
    isCollapsed ? "justify-center p-2" : "gap-3 px-3 py-2 justify-start",
    isActive
      ? "bg-primary/10 text-primary font-medium border border-primary/20"
      : "text-foreground hover:bg-muted hover:text-foreground",
    className
  );

  const content = (
    <>
      <Icon
        size={20}
        className={cn(
          "shrink-0",
          isActive ? "text-primary" : "text-muted-foreground group-hover:text-foreground"
        )}
      />
      {!isCollapsed && (
        <>
          <span className="text-sm flex-1">{label}</span>
          {hasChevron && (
            <ChevronDown
              size={16}
              className={cn(
                "text-muted-foreground transition-transform duration-200",
                isOpen && "rotate-180",
                isActive && "text-primary"
              )}
            />
          )}
        </>
      )}
    </>
  );

  if (isButton) {
    return (
      <Button
        variant="ghost"
        className={cn(baseClasses, "h-auto font-normal", isCollapsed ? "p-2" : "p-2 justify-start")}
        onClick={onClick}
      >
        {content}
      </Button>
    );
  }

  if (href) {
    return <Link href={href} className={baseClasses}>{content}</Link>;
  }

  return <div className={baseClasses}>{content}</div>;
}
