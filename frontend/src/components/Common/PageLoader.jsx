// Loading indicator shown while a lazily loaded page is downloaded
const PageLoader = ({ fullScreen = false }) => {
  return (
    <div
      role="status"
      aria-live="polite"
      className={`flex items-center justify-center ${fullScreen ? "min-h-screen" : "min-h-[50vh]"}`}
    >
      <div className="flex items-end gap-1.5" aria-hidden="true">
        {[0, 150, 300].map((delay) => (
          <span
            key={delay}
            className="h-3 w-3 animate-bounce rounded-full bg-rabbit-red"
            style={{ animationDelay: `${delay}ms` }}
          />
        ))}
      </div>
      <span className="sr-only">Loading…</span>
    </div>
  );
};

export default PageLoader;
