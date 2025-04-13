import { cn } from "@/lib/utils";

export const BentoGrid = ({
  className,
  children,
  expanded = false,
}: {
  className?: string;
  children?: React.ReactNode;
  expanded?: boolean;
}) => {
  return (
    <div
      className={cn(
        "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8"
      )}
    >
      {children}
    </div>
  );
};
