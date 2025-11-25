export type StatusIndicatorProps = {
  status?: "active" | "inactive" | "warning" | "error";
  size?: "sm" | "md" | "lg";
  pulse?: boolean;
  className?: string;
};
