export function PlanCreateButton({ handleCreate, children }) {
  return (
    <button 
      type="button" 
      onClick={handleCreate}
      className="
        relative inline-flex items-center justify-center
        px-8 py-4 text-lg font-bold text-white
        bg-gradient-to-r from-blue-600 to-indigo-600
        hover:from-blue-700 hover:to-indigo-700
        rounded-xl shadow-lg hover:shadow-xl
        transform hover:-translate-y-1 active:translate-y-0
        transition-all duration-200 ease-in-out
        focus:outline-none focus:ring-4 focus:ring-blue-500/30
        min-w-[200px]
      "
    >
      <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
      </svg>
      {children}
    </button>
  );
}