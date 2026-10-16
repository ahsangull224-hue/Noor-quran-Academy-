import React, { useEffect, useRef } from 'react';

interface AdsterraNativeBannerProps {
  className?: string;
}

export const AdsterraNativeBanner: React.FC<AdsterraNativeBannerProps> = ({ className = '' }) => {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const scriptSrc = 'https://bicea.org/21/440643a9d8af677da1a8ffdbdf013920';
    
    // Check if the script is already loaded
    let script = document.querySelector(`script[src="${scriptSrc}"]`) as HTMLScriptElement | null;
    if (!script) {
      script = document.createElement('script');
      script.src = scriptSrc;
      script.async = true;
      script.setAttribute('data-cfasync', 'false');
      document.body.appendChild(script);
    }
  }, []);

  return (
    <div className={`mx-auto max-w-[1200px] px-6 py-6 ${className}`}>
      <div className="rounded-xl border border-[#E6E4DD] bg-white p-4 md:p-6 shadow-xs">
        <div className="flex items-center justify-between pb-3 border-b border-[#E6E4DD] mb-4 text-xs">
          <span className="font-mono text-[#5A625C] uppercase tracking-wider text-[11px]">
            Partner Recommendations & Announcements
          </span>
          <a
            href="https://arwf.org/4/e70892450ac9e884f6031c9eb0d15fcf"
            target="_blank"
            rel="noopener noreferrer"
            className="text-[#0B5D46] hover:underline font-medium inline-flex items-center gap-1"
          >
            Islamic Study Resources ↗
          </a>
        </div>
        {/* Adsterra Native Banner Container */}
        <div
          id="container-440643a9d8af677da1a8ffdbdf013920"
          ref={containerRef}
          className="min-h-[100px] w-full flex items-center justify-center overflow-hidden"
        ></div>
      </div>
    </div>
  );
};
