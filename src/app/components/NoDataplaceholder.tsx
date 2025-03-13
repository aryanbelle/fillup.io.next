"use client";

interface NoDataPlaceholderProps {
  DATA?: string;
  title?: string;
  description?: string;
  buttonText?: string;
  buttonAction?: () => void;
}

export default function NoDataPlaceholder({
  DATA,
  title,
  description,
  buttonText = "Create New Form",
  buttonAction
}: NoDataPlaceholderProps) {
  
  // Determine the title and description based on props
  const displayTitle = title || (DATA ? `No ${DATA} Found` : "No Data Found");
  const displayDescription = description || (DATA ? 
    `Looks like there's nothing here yet. Create your first ${DATA?.toString().toLowerCase() || 'item'} to get started!` : 
    "Looks like there's nothing here yet.");
  
  return (
    <div className="flex flex-col w-full items-center justify-center py-12 px-6 bg-white border border-gray-200 rounded-xl shadow-sm">
      <div className="bg-blue-50 p-4 rounded-full mb-4">
        <svg 
          xmlns="http://www.w3.org/2000/svg" 
          className="h-12 w-12 text-blue-500" 
          fill="none" 
          viewBox="0 0 24 24" 
          stroke="currentColor"
        >
          <path 
            strokeLinecap="round" 
            strokeLinejoin="round" 
            strokeWidth={1.5} 
            d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4" 
          />
        </svg>
      </div>
      <h2 className="text-2xl font-bold mb-2 text-gray-800">
        {displayTitle}
      </h2>
      <p className="text-center text-gray-600 max-w-md mb-6">
        {displayDescription}
      </p>
      {buttonAction ? (
        <button 
          onClick={buttonAction}
          className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors duration-300 font-medium"
        >
          {buttonText}
        </button>
      ) : (
        <a 
          href="/newform" 
          className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors duration-300 font-medium"
        >
          {buttonText}
        </a>
      )}
    </div>
  );
}
