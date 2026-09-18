import type { ElementType, ReactNode } from "react";
import { cn } from "@/lib/utils";

interface ContainerProps {
  children: ReactNode;
  className?: string;
  /** Render as a different element (e.g. "section", "main"). Defaults to "div". */
  as?: ElementType;
  /** Optional id, useful when rendering as a section anchor (e.g. "#support"). */
  id?: string;
}

/**
 * The one centered layout container every section in the app should use.
 * width: 100%, max-width: 1280px, centered, with padding that grows from
 * 16px on mobile to 40px on large desktop — nothing may sit flush against
 * the viewport edge outside of this component's padding.
 */
export default function Container({ children, className, as: Tag = "div", id }: ContainerProps) {
  return (
    <Tag id={id} className={cn("mx-auto w-full max-w-[1280px] px-4 sm:px-6 lg:px-8 2xl:px-10", className)}>
      {children}
    </Tag>
  );
}
