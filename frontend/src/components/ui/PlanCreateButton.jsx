export function PlanCreateButton({ handleCreate, isLoading = false, children }) {
  return (
    <button 
      type="button" 
      onClick={handleCreate}
      disabled={isLoading}
      className={`
        relative inline-flex items-center justify-center
        px-8 py-4 text-lg font-bold text-white
        bg-gradient-to-r from-blue-600 to-indigo-600
        hover:from-blue-700 hover:to-indigo-700
        rounded-xl shadow-lg hover:shadow-xl
        transform hover:-translate-y-1 active:translate-y-0
        transition-all duration-200 ease-in-out
        focus:outline-none focus:ring-4 focus:ring-blue-500/30
        disabled:opacity-60 disabled:cursor-not-allowed disabled:transform-none
        min-w-[200px]
      `}
    >
      {isLoading ? (
        <>
          <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
          </svg>
          作成中...
        </>
      ) : (
        <>
          <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
          </svg>
          {children}
        </>
      )}
    </button>
  );
}