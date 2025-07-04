const LazyTableLoading = () => {
  return (
    <>
      {/* <div className="grid grid-cols-1 gap-[15px] ">
        <div className="bg-white rounded-2xl shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-300">
          <div className="p-5 flex flex-col gap-[15px]">
            <div className="grid grid-cols-2 gap-[15px]">
              <div className="flex flex-col gap-[10px]">
                <div className="h-[20px] w-[150px] rounded shimmer"></div>
                <div className="h-[38px]  rounded shimmer"></div>
              </div>
              <div className="flex flex-col gap-[10px]">
                <div className="h-[20px] w-[150px] rounded shimmer"></div>
                <div className="h-[38px]  rounded shimmer"></div>
              </div>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-2xl shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-300">
          <div className="p-5 flex flex-col gap-[15px]">
            <div className="h-[20px] w-full rounded shimmer"></div>
            <div className="h-[150px] w-full rounded shimmer"></div>
          </div>
        </div>
      </div> */}

      <div className="grid grid-cols-1 gap-[15px] ">
        <div className="bg-white rounded-2xl shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-300">
          {appendLoadingElement('h-[15px] w-[150px] rounded')}
          {appendLoadingElement('h-[250px] rounded')}
        </div>
      </div>
    </>
  );
};

export function appendLoadingElement(className: string) {
  return (
    <svg
      className={className}
      viewBox="0 0 300 80"
      xmlns="http://www.w3.org/2000/svg"
      preserveAspectRatio="none"
    >
      <defs>
        <linearGradient id="shimmer" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0%" stopColor="#e0e0e0" />
          <stop offset="50%" stopColor="#f8f8f8" />
          <stop offset="100%" stopColor="#e0e0e0" />
          <animate
            attributeName="x1"
            values="-1;1"
            dur="2.5s"
            repeatCount="indefinite"
          />
          <animate
            attributeName="x2"
            values="0;2"
            dur="2.5s"
            repeatCount="indefinite"
          />
        </linearGradient>
      </defs>
      <rect width="300" height="80" fill="url(#shimmer)" />
    </svg>
  );
}

export default LazyTableLoading;
