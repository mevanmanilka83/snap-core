import { cn } from "@/lib/utils";

export const Lights: React.FC<{ className?: React.ReactNode }> = ({
  className,
}) => (
  <div className={cn("w-full h-full overflow-hidden", className)}>
    <div
      className="absolute inset-0"
      style={{
        background:
          "radial-gradient(ellipse at 50% 40%, rgba(59, 130, 246, 0.03), transparent 50%)",
      }}
    />
    <div
      className="absolute inset-0"
      style={{
        background:
          "radial-gradient(circle at 90% 90%, rgba(6, 182, 212, 0.03), transparent 45%)",
      }}
    />
    <div
      className="absolute inset-0"
      style={{
        background:
          "linear-gradient(125deg, rgba(59, 130, 246, 0.02) 0%, rgba(6, 182, 212, 0.02) 50%, rgba(149, 149, 255, 0.01) 100%)",
      }}
    />
  </div>
);
