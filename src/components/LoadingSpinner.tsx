const LoadingSpinner = ({ message = "Loading…" }: { message?: string }) => (
  <div className="flex flex-col items-center justify-center min-h-64 gap-3">
    <div className="w-10 h-10 border-4 border-indigo-500 border-dashed rounded-full animate-spin" />
    <p className="text-sm text-gray-500">{message}</p>
  </div>
)

export default LoadingSpinner
