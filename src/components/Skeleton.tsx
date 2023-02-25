export type SkeletonProps = {
  heading?: boolean;
  lines?: number;
  width?: string;
};

const Skeleton: React.FC<SkeletonProps> = ({
  heading = false,
  lines = 1,
  width,
}) => {
  return (
    <div role="status" className={`${width || "w-full"} animate-pulse`}>
      {Array.from({ length: lines }).map((_, i) => (
        <div
          key={i}
          className={`${
            heading ? "h-6" : "h-2.5"
          } bg-gray-300 dark:bg-neutral-700 w-full ${
            i !== lines - 1 ? "mb-4" : ""
          }`}
        />
      ))}
      <span className="sr-only">Loading...</span>
    </div>
  );
};

export default Skeleton;