export const LoadingSkeleton = ({ imageSize }: { imageSize: number }) => (
  <div className="grid grid-cols-2 gap-6 w-full">
    {[...Array(4)].map((_, i) => (
      <div key={i} className="bg-white rounded-lg shadow-md overflow-hidden animate-pulse h-full">
        <div className="flex p-4 h-full">
          <div className="bg-gray-200 rounded-lg" style={{ width: imageSize, height: imageSize }}></div>
          <div className="ml-4 flex-1 space-y-3">
            <div className="h-4 bg-gray-200 rounded w-3/4"></div>
            <div className="h-4 bg-gray-200 rounded w-1/2"></div>
            <div className="h-4 bg-gray-200 rounded w-5/6"></div>
          </div>
        </div>
      </div>
    ))}
  </div>
);
