import React from 'react';
import { FileText, Plus } from 'lucide-react';

const EmptyState = ({ onActionClick, title, description, buttonText }) => {
  return (
    <div className="flex flex-col items-center justify-center py-16 text-center">
      {/* Icon Container with subtle background and rounded corners */}
      <div className="flex items-center justify-center w-14 h-14 bg-neutral-100 text-neutral-500 rounded-xl mb-4">
        <FileText className="w-6 h-6" strokeWidth={1.5} />
      </div>
      
      {/* Title */}
      <h3 className="text-lg font-semibold text-neutral-900 mb-1">
        {title}
      </h3>
      
      {/* Description */}
      <p className="text-sm text-neutral-500 max-w-sm mb-6">
        {description}
      </p>
      
      {/* Conditional Action Button */}
      {buttonText && onActionClick && (
        <button
          onClick={onActionClick}
          className="flex items-center gap-2 px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white text-sm font-medium rounded-lg transition-colors shadow-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:ring-offset-2"
        >
          <Plus className="w-4 h-4" strokeWidth={2.5} />
          <span>{buttonText}</span>
        </button>
      )}
    </div>
  );
};

export default EmptyState;