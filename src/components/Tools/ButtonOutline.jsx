import { ArrowRight } from 'lucide-react';

export default function ButtonOutline({ children, className = '', ...props }) {
  return (
    <button
      className={`btn-arrow-outline btn btn-light w-100 round-8 bg-gray-300 border-half border-gray-900 ${className}`}
      {...props}
    >
      {children}
      <ArrowRight size={24} className="arrow-icon" />
    </button>
  );
}
