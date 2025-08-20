import React, { useState } from 'react';
import clsx from 'clsx';

interface SelectProps {
  id: string;
  className?: string;
  name: string;
  value: any;
  // options: { label: string; value: any }[];
  subActive: boolean
  options: any[];
  onChange: ({ name, value }: { name: string; value: any }) => void;
}

export default function Select({ id, name, value, onChange, className, options }: SelectProps) {
  const [isOpen, setIsOpen] = useState(false);

  const handleToggle = () => {
    setIsOpen(!isOpen);
  };

  const handleOptionClick = (optionValue: any) => {
    onChange({ name, value: optionValue });
    setIsOpen(false);
  };

  return (
    <div className={clsx('relative inline-block text-left min-w-[200px] h-[57px]', className)}>
  <div
    className="select-value cursor-pointer w-full h-full px-4 py-3 bg-gray-50 hover:bg-gray-50 dark:bg-neutral-900 dark:hover:bg-neutral-900 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all text-gray-900 dark:text-white flex items-center justify-between"
    onClick={handleToggle}
  >
    <span className="truncate">{value}</span>
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="20"
      height="20"
      viewBox="0 0 24 24"
      fill="none"
      className={`transition-transform duration-200 text-gray-500 dark:text-gray-400 ${isOpen ? 'rotate-180' : ''}`}
    >
      <path
        d="M6 9l6 6 6-6"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  </div>
  
  {isOpen && (
    <div className="select-options absolute right-0 mt-2 w-full min-w-[250px] bg-white dark:bg-neutral-800 shadow-xl border border-gray-200 dark:border-neutral-700 rounded-2xl overflow-hidden z-50 animate-in slide-in-from-top-2 duration-200">
      <div className="max-h-64 overflow-y-auto scrollbar-thin scrollbar-thumb-gray-300 dark:scrollbar-thumb-neutral-600 scrollbar-track-transparent">
        {options.map((option, index) => (
          <div
            key={option}
            className={`select-option w-full px-4 py-3 hover:bg-blue-50 dark:hover:bg-blue-900/20 cursor-pointer transition-colors group ${
              index !== options.length - 1 ? 'border-b border-gray-50 dark:border-neutral-700' : ''
            }`}
            onClick={() => handleOptionClick(option)}
          >
            <span className="text-gray-900 dark:text-white font-medium group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
              {option}
            </span>
          </div>
        ))}
      </div>
    </div>
  )}
</div>
  );
}
