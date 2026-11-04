export default function Loading() {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-gray-950/85 backdrop-blur-sm">
      <div className="h-16 w-16 animate-spin rounded-full border-4 border-gray-700 border-b-blue-400"></div>
    </div>
  );
}
