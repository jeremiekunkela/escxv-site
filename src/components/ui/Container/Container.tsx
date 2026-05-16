import { cn } from "@/lib/utils";
import styles from "./Container.module.css";

type ContainerProps = {
  children: React.ReactNode;
  className?: string;
};

export function Container({ children, className }: ContainerProps) {
  return <div className={cn(styles.container, className)}>{children}</div>;
}
